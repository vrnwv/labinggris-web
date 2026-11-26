(()=>{const c=window.FIREBASE_CONFIG||{},live=!!c.apiKey&&!/^YOUR/.test(c.apiKey);let au,fs;
if(live){firebase.initializeApp(c);au=firebase.auth();fs=firebase.firestore()}
const J=()=>JSON.parse(localStorage.getItem('gl_db')||'{}'),W=d=>localStorage.setItem('gl_db',JSON.stringify(d)),now=()=>new Date().toISOString(),oldSeedMaterials=['m1','m2','m3','m4','m5'];
const S=window.Store={live,me:null,
async init(){if(live)return new Promise(r=>{const un=au.onAuthStateChanged(u=>{un();r(u?S.load(u):null)})});
 const d=J();if(!d.users){d.users={admin:{id:'admin',email:'admin@demo.id',pw:'admin123',fullName:'Admin Demo',admin:true}};W(d);await S.seed()}
 return S.me=J().users[localStorage.getItem('gl_me')]||null},
async load(u){const[p,a]=await Promise.all([fs.collection('users').doc(u.uid).get(),fs.collection('admins').doc(u.uid).get()]);return S.me={read:[],...p.data(),id:u.uid,email:u.email,admin:a.exists}},
async login(e,p){if(live){const c=await au.signInWithEmailAndPassword(e,p);return S.load(c.user)}
 const u=Object.values(J().users).find(x=>x.email===e&&x.pw===p);if(!u)throw Error('Email atau password salah');localStorage.setItem('gl_me',u.id);return S.me=u},
async register(p,pw){if(live){const c=await au.createUserWithEmailAndPassword(p.email,pw),ref=fs.collection('nims').doc(p.nim);
  try{await fs.runTransaction(async t=>{if((await t.get(ref)).exists)throw Error('NIM sudah terdaftar');t.set(ref,{uid:c.user.uid});t.set(fs.collection('users').doc(c.user.uid),{...p,read:[],at:now()})})}catch(x){await c.user.delete();throw x}
  return S.load(c.user)}
 const d=J();if(Object.values(d.users).some(x=>x.email===p.email||x.nim===p.nim))throw Error('Email atau NIM sudah terdaftar');
 const id='u'+Date.now();d.users[id]={...p,pw,id,read:[]};W(d);localStorage.setItem('gl_me',id);return S.me=d.users[id]},
async logout(){live?await au.signOut():localStorage.removeItem('gl_me');S.me=null},
async list(col,own){if(live){let q=fs.collection(col);if(own)q=q.where('userId','==',S.me.id);return(await q.get()).docs.map(d=>({id:d.id,...d.data()}))}
 const a=Object.values(J()[col]||{});return own?a.filter(x=>x.userId===S.me.id):a},
async createStudent(p,pw){const student={...p,email:p.email.trim().toLowerCase(),fullName:p.fullName.trim(),prodi:p.prodi.trim(),nim:p.nim.trim()};
 if(live)return firebase.functions().httpsCallable('adminCreateStudent')({student,password:pw});
 if(pw.length<6)throw Error('Password minimal 6 karakter.');const d=J(),users=Object.values(d.users||{});
 if(users.some(u=>u.email===student.email||u.nim===student.nim))throw Error('Email atau NIM sudah terdaftar.');
 let id='u'+Date.now();while(d.users[id])id+='x';d.users[id]={...student,pw,id,read:[]};W(d);return d.users[id]},
async updateStudent(id,p){const student={...p,email:p.email.trim().toLowerCase(),fullName:p.fullName.trim(),prodi:p.prodi.trim(),nim:p.nim.trim()};
 if(live)return firebase.functions().httpsCallable('adminUpdateStudent')({uid:id,student});
 const d=J(),users=Object.values(d.users||{}),current=d.users[id];if(!current||current.admin)throw Error('Mahasiswa tidak ditemukan.');
 if(users.some(u=>u.id!==id&&(u.email===student.email||u.nim===student.nim)))throw Error('Email atau NIM sudah terdaftar.');
 d.users[id]={...current,...student};W(d);return d.users[id]},
async deleteStudent(id){if(live)return firebase.functions().httpsCallable('adminDeleteStudent')({uid:id});
 const d=J(),student=d.users&&d.users[id];if(!student||student.admin)throw Error('Mahasiswa tidak ditemukan.');
 delete d.users[id];if(d.attempts)for(const key of Object.keys(d.attempts))if(d.attempts[key].userId===id)delete d.attempts[key];W(d)},
async set(col,id,o){if(live)return fs.collection(col).doc(id).set(o);const d=J();(d[col]=d[col]||{})[id]={...o,id};W(d)},
async del(col,id){if(live)return fs.collection(col).doc(id).delete();const d=J();delete(d[col]||{})[id];W(d)},
async markRead(id){const r=[...new Set([...(S.me.read||[]),id])];S.me.read=r;
 if(live)return fs.collection('users').doc(S.me.id).update({read:r});const d=J();d.users[S.me.id].read=r;W(d)},
async seed(){if(live){const batch=fs.batch();for(const k of['materials','questions'])for(const o of SEED[k]){const{id,...r}=o;batch.set(fs.collection(k).doc(id),r)}for(const id of oldSeedMaterials)if(!SEED.materials.some(m=>m.id===id))batch.delete(fs.collection('materials').doc(id));await batch.commit();return}
 const d=J();if(d.materials)for(const id of oldSeedMaterials)if(!SEED.materials.some(m=>m.id===id))delete d.materials[id];W(d);
 for(const k of['materials','questions'])for(const o of SEED[k]){const{id,...r}=o;await S.set(k,id,r)} }};
})();
