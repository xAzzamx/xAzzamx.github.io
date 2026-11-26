ThemeEngine.register("aurora", function(root){
  var E = ThemeEngine, S = E.site;
  if (E.page === "certs"){
    root.appendChild(E.h("p", "au-kicker", E.isAr() ? "الأرشيف" : "Archive"));
    root.appendChild(E.h("h1", "", E.isAr() ? "صفوف الشهادات" : "Certificate rows"));
    var back = E.h("a", "au-link"); back.href = "index.html"; back.appendChild(E.bi("Back to the story", "العودة إلى القصة"));
    root.appendChild(back);
    E.rails(root, {rowClass:"au-row", railClass:"au-rail", cardClass:"au-card"});
    return;
  }
  var sky = E.h("div", "au-sky");
  sky.setAttribute("aria-hidden", "true");
  root.appendChild(sky);
  var hero = E.h("section", "au-hero");
  var card = E.h("div", "au-panel au-hero-card");
  card.appendChild(E.h("p", "", E.t(S.hello)));
  card.appendChild(E.h("h1", "", E.t(S.name)));
  card.appendChild(E.h("p", "au-lead", E.t(S.lead)));
  card.appendChild(E.h("p", "au-status", E.t(S.status)));
  hero.appendChild(card);
  root.appendChild(hero);
  var about = E.h("section", "au-panel au-shift");
  about.appendChild(E.h("h2", "", E.t(S.aboutTitle)));
  S.about.forEach(function(p){ about.appendChild(E.h("p", "", E.t(p))); });
  root.appendChild(about);
  var edu = E.h("section", "au-split");
  var a = E.h("article", "au-panel");
  a.appendChild(E.h("h2", "", E.t(S.edu.title)));
  a.appendChild(E.h("p", "", E.t(S.edu.when)));
  a.appendChild(E.h("p", "", E.t(S.edu.where)));
  var b = E.h("article", "au-panel au-late");
  b.appendChild(E.h("h2", "", E.t(S.msc)));
  b.appendChild(E.h("p", "", E.t(S.msc.where)));
  S.msc.pills.forEach(function(p){ b.appendChild(E.h("p", "", E.t(p))); });
  b.appendChild(E.h("p", "au-big", "STEP " + S.step.n));
  edu.appendChild(a); edu.appendChild(b);
  root.appendChild(edu);
  S.projects.forEach(function(p, i){
    var sec = E.h("section", "au-project" + (i % 2 ? " au-rev" : ""));
    if (p.img){ var im = E.h("img"); im.src = p.img; im.alt = ""; sec.appendChild(im); }
    var tx = E.h("div", "");
    tx.appendChild(E.h("h2", "", E.t(p.title)));
    tx.appendChild(E.h("p", "", E.t(p.body)));
    sec.appendChild(tx);
    root.appendChild(sec);
  });
  var gate = E.h("section", "au-panel au-gate");
  gate.appendChild(E.h("h2", "", E.isAr() ? "أرشيف الشهادات" : "Certificate archive"));
  gate.appendChild(E.h("p", "", (E.isAr() ? "شهادة مرتبة في صفوف حسب المجال: " : "Certificates in field rows: ") + E.count()));
  var go = E.h("a", "au-link"); go.href = "certificates.html"; go.appendChild(E.bi("Browse every row", "تصفح كل الصفوف"));
  gate.appendChild(go);
  root.appendChild(gate);
  var contact = E.h("section", "au-panel");
  contact.appendChild(E.h("h2", "", E.isAr() ? "تواصل" : "Contact"));
  contact.appendChild(E.h("p", "", S.links.email));
  contact.appendChild(E.form());
  root.appendChild(contact);
  if (!E.reduce){
    var onScroll = function(){
      var y = window.scrollY || 0;
      hero.style.transform = "translateY(" + Math.round(y * 0.18) + "px)";
    };
    window.addEventListener("scroll", onScroll, {passive:true});
    var prev = window.__themeCleanup;
    window.__themeCleanup = function(){ window.removeEventListener("scroll", onScroll); if (prev) prev(); };
  }
});
