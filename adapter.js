/* Pont entre l'application et Firebase (Firestore) : même interface que le tableau partagé de Claude */
(function(){
  if(window.claude)return; // déjà fourni (tests)
  var cfg=(window.APP_CONFIG||{}).firebase||{};
  var dbP=null;
  function initDb(){
    if(dbP)return dbP;
    dbP=new Promise(function(res){
      try{
        if(!cfg.projectId||/REMPLIR/.test(cfg.apiKey||"")){console.warn("Configuration Firebase manquante");res(null);return}
        firebase.initializeApp(cfg);
        var fs=firebase.firestore();
        try{fs.settings({ignoreUndefinedProperties:true,merge:true})}catch(e){}
        fs.enablePersistence({synchronizeTabs:true}).catch(function(){}).then(function(){res(enveloppe(fs))});
      }catch(e){console.error(e);res(null)}
    });
    return dbP;
  }
  /* Firestore refuse les tableaux de tableaux (équipes, mains de cartes…) : on les emballe à l'écriture et on les déballe à la lecture */
  function brut(v){return v&&typeof v==="object"&&(v.constructor===Object||Object.getPrototypeOf(v)===null)}
  function enc(v){if(Array.isArray(v)){var n=v.some(function(x){return Array.isArray(x)});var m=v.map(enc);return n?{__na:m.map(function(x){return {v:x}})}:m}
    if(brut(v)){var o={};for(var k in v)o[k]=enc(v[k]);return o}return v}
  function dec(v){if(Array.isArray(v))return v.map(dec);
    if(brut(v)){if(Array.isArray(v.__na)&&Object.keys(v).length===1)return v.__na.map(function(x){return dec(x&&x.v)});var o={};for(var k in v)o[k]=dec(v[k]);return o}return v}
  function snapDoc(s){return {id:s.id,exists:s.exists,metadata:s.metadata,ref:s.ref,data:function(){var d=s.data();return d===undefined?undefined:dec(d)},get:function(f){return dec(s.get(f))}}}
  function snapQ(q){var docs=q.docs.map(snapDoc);return {docs:docs,size:q.size,empty:q.empty,metadata:q.metadata,forEach:function(f){docs.forEach(f)}}}
  function docRef(fs,ref){return{
    id:ref.id,path:ref.path,
    set:function(d,o){return o?ref.set(enc(d),o):ref.set(enc(d))},
    update:function(d){return ref.update(enc(d))},
    delete:function(){return ref.delete()},
    get:function(){return ref.get().then(snapDoc)},
    onSnapshot:function(next,err){return ref.onSnapshot(function(s){next(snapDoc(s))},err||function(){})},
    acquire:function(o){var now=Date.now();
      return fs.runTransaction(function(tx){return tx.get(ref).then(function(s){
        var l=s.exists&&s.data()._lease;
        if(l&&l.exp>now&&l.h!==o.holder)return {acquired:false};
        var d=Object.assign({},enc(o.data||{}),{_lease:{h:o.holder,exp:now+(o.ttlMs||30000)}});
        tx.set(ref,d,{merge:true});return {acquired:true,holder:o.holder,expiresAt:now+(o.ttlMs||30000)}})})
      .catch(function(){return {acquired:false}})}
  }}
  function query(fs,q){return{
    where:function(f,op,v){return query(fs,q.where(f,op,v))},
    onSnapshot:function(next,err){return q.onSnapshot(function(s){next(snapQ(s))},err||function(){})},
    get:function(){return q.get().then(snapQ)}
  }}
  function enveloppe(fs){return{
    collection:function(p){var c=fs.collection(p);var o=query(fs,c);o.doc=function(id){return docRef(fs,c.doc(id))};return o},
    doc:function(p){return docRef(fs,fs.doc(p))}
  }}
  var telechargements={save:function(o){return new Promise(function(res){
    var b=o.data instanceof Blob?o.data:new Blob([o.data],{type:"text/csv;charset=utf-8"});
    var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=o.filename||"fichier";document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();res()},500)})}};
  window.claude={use:function(n){
    if(n==="db")return initDb();
    if(n==="downloads")return Promise.resolve(telechargements);
    return Promise.resolve(null)}};
})();
