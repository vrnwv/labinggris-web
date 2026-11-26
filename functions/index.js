const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { HttpsError, onCall } = require("firebase-functions/v2/https");

initializeApp();

const auth = getAuth();
const db = getFirestore();

async function requireAdmin(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Silakan login terlebih dahulu.");
  }
  const admin = await db.collection("admins").doc(request.auth.uid).get();
  if (!admin.exists) {
    throw new HttpsError("permission-denied", "Aksi ini hanya untuk admin.");
  }
}

function validateStudent(value) {
  if (!value || typeof value !== "object") {
    throw new HttpsError("invalid-argument", "Data mahasiswa tidak valid.");
  }
  const fullName = typeof value.fullName === "string" ? value.fullName.trim() : "";
  const prodi = typeof value.prodi === "string" ? value.prodi.trim() : "";
  const nim = typeof value.nim === "string" ? value.nim.trim() : "";
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  if (!fullName || !prodi || !nim || !email || nim.length > 128 || nim.includes("/")) {
    throw new HttpsError("invalid-argument", "Nama, program studi, NIM, dan email wajib valid.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpsError("invalid-argument", "Format email tidak valid.");
  }
  return { fullName, prodi, nim, email };
}

exports.adminCreateStudent = onCall(async (request) => {
  await requireAdmin(request);
  const student = validateStudent(request.data && request.data.student);
  const password = request.data && request.data.password;
  if (typeof password !== "string" || password.length < 6) {
    throw new HttpsError("invalid-argument", "Password minimal 6 karakter.");
  }

  const user = await auth.createUser({
    email: student.email,
    password,
    displayName: student.fullName,
  });
  try {
    const userRef = db.collection("users").doc(user.uid);
    const nimRef = db.collection("nims").doc(student.nim);
    await db.runTransaction(async (transaction) => {
      const nim = await transaction.get(nimRef);
      if (nim.exists) {
        throw new HttpsError("already-exists", "NIM sudah terdaftar.");
      }
      transaction.create(nimRef, { uid: user.uid });
      transaction.create(userRef, { ...student, read: [], at: new Date().toISOString() });
    });
  } catch (error) {
    try {
      await auth.deleteUser(user.uid);
    } catch (cleanupError) {
      throw new HttpsError(
        "internal",
        `Profil gagal disimpan dan akun sementara tidak bisa dibersihkan (UID: ${user.uid}).`,
      );
    }
    throw error;
  }
  return { uid: user.uid };
});

exports.adminUpdateStudent = onCall(async (request) => {
  await requireAdmin(request);
  const uid = request.data && request.data.uid;
  if (typeof uid !== "string" || !uid) {
    throw new HttpsError("invalid-argument", "ID mahasiswa tidak valid.");
  }
  const student = validateStudent(request.data.student);
  const userRef = db.collection("users").doc(uid);
  const profile = await userRef.get();
  if (!profile.exists || (await db.collection("admins").doc(uid).get()).exists) {
    throw new HttpsError("not-found", "Mahasiswa tidak ditemukan.");
  }
  const existingAuth = await auth.getUser(uid);
  await auth.updateUser(uid, { email: student.email, displayName: student.fullName });

  try {
    await db.runTransaction(async (transaction) => {
      const current = await transaction.get(userRef);
      if (!current.exists) {
        throw new HttpsError("not-found", "Mahasiswa tidak ditemukan.");
      }
      const oldNim = current.data().nim;
      const nimRef = db.collection("nims").doc(student.nim);
      const nim = await transaction.get(nimRef);
      const oldNimRef = oldNim && oldNim !== student.nim
        ? db.collection("nims").doc(oldNim)
        : null;
      const oldNimDoc = oldNimRef ? await transaction.get(oldNimRef) : null;
      if (nim.exists && nim.data().uid !== uid) {
        throw new HttpsError("already-exists", "NIM sudah terdaftar.");
      }
      transaction.set(nimRef, { uid });
      if (oldNimRef && oldNimDoc.exists && oldNimDoc.data().uid === uid) {
        transaction.delete(oldNimRef);
      }
      transaction.update(userRef, student);
    });
  } catch (error) {
    try {
      await auth.updateUser(uid, {
        email: existingAuth.email,
        displayName: existingAuth.displayName || "",
      });
    } catch (rollbackError) {
      throw new HttpsError(
        "internal",
        "Profil gagal diperbarui dan email akun tidak berhasil dikembalikan. Periksa akun mahasiswa di Firebase Console.",
      );
    }
    throw error;
  }
  return { uid };
});

exports.adminDeleteStudent = onCall(async (request) => {
  await requireAdmin(request);
  const uid = request.data && request.data.uid;
  if (typeof uid !== "string" || !uid) {
    throw new HttpsError("invalid-argument", "ID mahasiswa tidak valid.");
  }
  if ((await db.collection("admins").doc(uid).get()).exists) {
    throw new HttpsError("failed-precondition", "Akun admin tidak dapat dihapus dari panel mahasiswa.");
  }
  const userRef = db.collection("users").doc(uid);
  if (!(await userRef.get()).exists) {
    throw new HttpsError("not-found", "Mahasiswa tidak ditemukan.");
  }

  try {
    await auth.deleteUser(uid);
  } catch (error) {
    if (error.code !== "auth/user-not-found") {
      throw error;
    }
  }

  const attempts = await db.collection("attempts").where("userId", "==", uid).get();
  for (let start = 0; start < attempts.docs.length; start += 450) {
    const batch = db.batch();
    attempts.docs.slice(start, start + 450).forEach((attempt) => batch.delete(attempt.ref));
    await batch.commit();
  }

  await db.runTransaction(async (transaction) => {
    const profile = await transaction.get(userRef);
    if (!profile.exists) {
      return;
    }
    const nim = profile.data().nim;
    const nimRef = nim ? db.collection("nims").doc(nim) : null;
    const nimDoc = nimRef ? await transaction.get(nimRef) : null;
    transaction.delete(userRef);
    if (nimRef && nimDoc.exists && nimDoc.data().uid === uid) {
      transaction.delete(nimRef);
    }
  });
  return { uid };
});
