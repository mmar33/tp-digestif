/* Hors connexion : garde l'application sur le téléphone après la première visite */
const VERSION="tp-digestif-20261106-a6note";
const FICHIERS=["./", "./index.html", "./firebase-config.js", "./adapter.js", "./vendor/firebase-app-compat.js", "./vendor/firebase-firestore-compat.js", "./vendor/qrcode.js", "./manifest.webmanifest", "./icone-192.png", "./icone-512.png", "./estcheval_t.jpg", "./estcheval.jpg", "./mystere.jpg", "./demo.jpg", "./boeuf_t.jpg", "./intchien_t.jpg", "./foie.jpg", "./intchien.jpg", "./boeuf.jpg", "./mouton_t.jpg", "./cheval.jpg", "./chien.jpg", "./cheval_t.jpg", "./mouton.jpg", "./foie_t.jpg", "./chien_t.jpg", "./q/divert.jpg", "./q/dent_sup.jpg", "./q/lames.jpg", "./q/parot.jpg", "./q/caecum_chien.jpg", "./q/zygo.jpg", "./q/spiraux.jpg", "./q/mandib.jpg", "./q/margo.jpg", "./q/pilier.jpg", "./q/reticulum.jpg", "./q/cardia_eq.jpg", "./a4/a4_4.jpg", "./a4/a4_3.jpg", "./a4/a4_6.jpg", "./a4/a4_5.jpg", "./atelier3/index.html", "./atelier3/data/reperes.json", "./atelier5/index.html", "./atelier3/modeles/chat.glb", "./atelier3/modeles/chat_foie.glb", "./atelier3/modeles/chien.glb", "./atelier3/modeles/chien_foie.glb", "./atelier3/modeles/porc1.glb", "./atelier3/modeles/porc2.glb", "./atelier3/modeles/porc3.glb", "./atelier3/modeles/porc_foie.glb", "./atelier3/modeles/vache.glb"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FICHIERS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    if(r.mode==="navigate"||u.pathname.endsWith("/")||/\.(html|js|json|webmanifest)$/.test(u.pathname)){
      e.respondWith(fetch(r).then(res=>{const cl=res.clone();caches.open(VERSION).then(c=>c.put(r,cl));return res}).catch(()=>caches.match(r).then(x=>x||caches.match("./index.html"))));return}
    e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{const cl=res.clone();caches.open(VERSION).then(c=>c.put(r,cl));return res})));return}
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{const cl=res.clone();caches.open(VERSION).then(c=>c.put(r,cl));return res})))}
});
