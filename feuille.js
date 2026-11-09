/* =========================================================
   Copie des notes dans un Google Sheet + signalements des étudiants
   - Chaque note écrite (toutes les pages, tous les ateliers) part aussi dans le
     tableur « TP digestif - NOTES » (via un formulaire Google : aucun compte, aucun quota Firebase).
   - Les notes par étudiant calculées par l'appli y sont envoyées dès qu'elles changent.
   - Bouton « Signaler un problème » : part dans un autre tableur, « TP digestif - SIGNALEMENTS ».
   Tout est mis en file d'attente sur l'appareil et renvoyé tant que l'envoi n'a pas réussi.
   ========================================================= */
(function(){
  var F={
    notes:{url:"https://docs.google.com/forms/d/e/1FAIpQLSfnoLFD1LYRjEo4nTfOocQBGPvpBZiztdXVhPIyfRHrkls5vw/formResponse",champ:"entry.158013956"},
    signal:{url:"https://docs.google.com/forms/d/e/1FAIpQLScrLgC4t0Mr-REsXJbPZj_S2FxNA94gQzU4joJVaCs5GqHXCQ/formResponse",champ:"entry.1278713466"}
  };
  window.FEUILLES={notes:"https://docs.google.com/spreadsheets/d/1RGpuaJMYUw5qekvyhBfvjYOs8HZd2E3AFGBDLb90kd4/edit",
                   signal:"https://docs.google.com/spreadsheets/d/1h3agXa4QsIUs7TOSyJPCJpvD7sBt705IuMp__JxMUmc/edit"};
  var CLE="fileFeuille", NOTES=["resultats","a1eval","notes_a3","notes_a5","a4","a6","notes_manuelles","secours"];
  var mem=null;
  function lire(){if(mem)return mem;try{mem=JSON.parse(localStorage.getItem(CLE)||"[]")}catch(e){mem=[]}return mem}
  function garder(){try{localStorage.setItem(CLE,JSON.stringify(mem.slice(-1500)))}catch(e){}}
  function propre(v){return String(v==null?"":v).replace(/\s*\|\s*/g," / ").replace(/[\r\n]+/g," ").slice(0,4000)}
  function appareil(){try{return JSON.parse(localStorage.getItem("deviceId")||'""')||""}catch(e){return ""}}
  /* type = première colonne ; champs = la suite ; une ligne = « TYPE | champ | champ … » */
  window.envoyerFeuille=function(type,champs,quelle){
    var l=lire();l.push({f:quelle||"notes",d:[type].concat(champs||[]).map(propre).join(" | ")+" | "+new Date().toISOString()+" | "+appareil(),n:0});garder();vider()};
  var enCours=false;
  function vider(){if(enCours||!navigator.onLine&&navigator.onLine!==undefined)return;var l=lire();if(!l.length)return;enCours=true;
    var x=l[0],cfg=F[x.f]||F.notes,b=new URLSearchParams();b.append(cfg.champ,x.d);
    fetch(cfg.url,{method:"POST",mode:"no-cors",body:b}).then(function(){l.shift();garder();enCours=false;if(l.length)setTimeout(vider,250)})
      .catch(function(){x.n++;garder();enCours=false;setTimeout(vider,Math.min(60000,3000*x.n))})}
  setInterval(vider,8000);window.addEventListener("online",vider);setTimeout(vider,1500);
  window.feuilleEnAttente=function(){return lire().length};

  /* copie de chaque écriture de note faite par n'importe quelle page */
  function enrober(db){if(!db||db.__feuille)return db;
    var col=db.collection.bind(db);
    db.collection=function(p){var c=col(p);if(NOTES.indexOf(p)<0)return c;var d=c.doc.bind(c);
      c.doc=function(id){var r=d(id),set=r.set&&r.set.bind(r),upd=r.update&&r.update.bind(r);
        var copie=function(v,mode){try{var j=JSON.stringify(v);if(j.length>3500)j=j.slice(0,3500)+"…";window.envoyerFeuille("BRUT",[p,id,mode,j])}catch(e){}};
        if(set)r.set=function(v,o){copie(v,"set");return o?set(v,o):set(v)};
        if(upd)r.update=function(v){copie(v,"update");return upd(v)};
        return r};return c};
    db.__feuille=true;return db}
  function brancher(){var c=window.claude;if(!c||!c.use||c.__feuille)return;var use=c.use.bind(c);
    c.use=function(n){var p=use(n);return n==="db"?Promise.resolve(p).then(enrober):p};c.__feuille=true}
  brancher();var t=setInterval(function(){brancher();if(window.claude&&window.claude.__feuille)clearInterval(t)},200);

  /* petit journal des erreurs et événements, joint aux signalements */
  var J=window.__journal=window.__journal||[];
  window.journaliser=function(m){J.push(new Date().toTimeString().slice(0,8)+" "+String(m).slice(0,300));if(J.length>60)J.shift()};
  window.addEventListener("error",function(e){window.journaliser("ERR "+(e.message||"")+" @"+(e.filename||"").split("/").pop()+":"+(e.lineno||""))});
  window.addEventListener("unhandledrejection",function(e){window.journaliser("REJ "+(e.reason&&e.reason.message||e.reason||""))});
  var ce=console.error;console.error=function(){try{window.journaliser("console "+[].slice.call(arguments).map(String).join(" "))}catch(e){}return ce.apply(console,arguments)};
  /* ----- bouton « Signaler un problème » ----- */
  function ctx(){var c={};try{c=(window.__contexteSignal&&window.__contexteSignal())||{}}catch(e){}
    if(!c.atelier){var pa=location.pathname;if(/atelier3\//.test(pa))c.atelier="a3";else if(/atelier5\//.test(pa))c.atelier="a5";
      try{var q=new URLSearchParams(location.search),du=q.get("duo");if(du){c.equipe=c.equipe||du;var mg=du.match(/^(.*?-G\d+)/);if(mg)c.groupe=c.groupe||mg[1]}}catch(e){}}
    if(!c.page)c.page=location.pathname.split("/").slice(-2).join("/")+location.search.slice(0,300);
    if(!c.eid){try{var m=JSON.parse(localStorage.getItem("moiEtu")||"null");if(m){c.sid=m.sid;c.eid=m.eid}}catch(e){}}
    return c}
  function bouton(){if(document.getElementById("signalBtn"))return;
    var b=document.createElement("button");b.id="signalBtn";b.type="button";b.textContent="⚠️ Signaler";b.title="Signaler un problème aux encadrants";b.setAttribute("aria-label","Signaler un problème aux encadrants");
    b.style.cssText="position:fixed;left:8px;bottom:60px;z-index:60;font:600 12px system-ui,sans-serif;padding:7px 10px;opacity:.92;border-radius:999px;border:2px solid #b3541e;background:#fff7ef;color:#7a3410;box-shadow:0 2px 8px rgba(0,0,0,.15);cursor:pointer";
    b.onclick=ouvrir;document.body.appendChild(b)}
  function ouvrir(){var c=ctx();var o=document.createElement("div");o.id="signalFen";
    o.style.cssText="position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.45);display:grid;place-items:center;padding:16px";
    o.innerHTML='<div style="background:#fff;color:#222;border-radius:16px;max-width:520px;width:100%;padding:18px;font:15px system-ui,sans-serif;display:grid;gap:10px">'+
      '<b style="font-size:18px">Signaler un problème</b>'+
      '<p style="margin:0;color:#555">Décrivez ce qui ne va pas : une réponse juste comptée fausse (ou l\'inverse), un écran bloqué, une question mal posée… Les encadrants reçoivent votre message avec l\'état de votre atelier, pour corriger la note si besoin.</p>'+
      (c.atelier?'<p style="margin:0"><b>Atelier :</b> '+String(c.atelierNom||c.atelier)+(c.groupe?' · <b>Groupe :</b> '+String(c.groupe):"")+'</p>':"")+
      '<textarea id="signalTxt" rows="5" style="font:inherit;padding:10px;border-radius:10px;border:2px solid #ccc" placeholder="Ex. : question sur l\'anse spirale, nous avons pointé le bon endroit mais c\'est compté faux"></textarea>'+
      '<div style="display:flex;gap:10px;justify-content:flex-end"><button id="signalNon" type="button" style="font:inherit;padding:10px 14px;border-radius:10px;border:2px solid #ccc;background:#fff">Annuler</button>'+
      '<button id="signalOui" type="button" style="font:inherit;font-weight:700;padding:10px 14px;border-radius:10px;border:0;background:#b3541e;color:#fff">Envoyer</button></div></div>';
    document.body.appendChild(o);document.getElementById("signalTxt").focus();
    document.getElementById("signalNon").onclick=function(){o.remove()};
    document.getElementById("signalOui").onclick=function(){var t=(document.getElementById("signalTxt").value||"").trim();if(!t){document.getElementById("signalTxt").focus();return}
      var c2=ctx(),etat="";try{etat=JSON.stringify({etat:c2.etat||{},journal:J.slice(-25)})}catch(e){}
      window.envoyerFeuille("SIGNAL",[c2.sid||"",c2.groupe||"",c2.equipe||"",c2.atelier||"",c2.eid||"",c2.nom||"",t,c2.page||"",etat.slice(0,3800)],"signal");
      o.remove();var m=document.createElement("div");m.textContent="Merci : votre signalement a été envoyé aux encadrants.";
      m.style.cssText="position:fixed;left:50%;bottom:60px;transform:translateX(-50%);z-index:90;background:#2f6b3a;color:#fff;padding:10px 16px;border-radius:12px;font:600 14px system-ui,sans-serif";
      document.body.appendChild(m);setTimeout(function(){m.remove()},3500)}}
  /* visible dans les ateliers (la page principale décide avec __signalVisible), toujours sur les pages des ateliers 3 et 5 */
  var cadre=false;try{cadre=window.top!==window}catch(e){cadre=true}
  if(!cadre)setInterval(function(){if(!document.body)return;var vis=(window.__signalVisible?!!window.__signalVisible():true)&&!document.querySelector(".modale,#signalFen");
    var b=document.getElementById("signalBtn");if(vis&&!b)bouton();else if(!vis&&b)b.remove()},700);
})();
