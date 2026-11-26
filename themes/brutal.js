ThemeEngine.register("brutal", function(root){
  var E = ThemeEngine, S = E.site;
  var grid = E.h("div", "bru");
  if (E.page === "certs"){
    grid.appendChild(E.h("h1", "bru-title", E.isAr() ? "ملصقات الشهادات" : "CERTIFICATE POSTERS"));
    var back = E.h("a", "bru-btn"); back.href = "index.html"; back.appendChild(E.bi("Back", "رجوع"));
    grid.appendChild(back);
    E.rails(grid, {rowClass:"bru-row", railClass:"bru-rail", cardClass:"bru-card"});
    root.appendChild(grid);
    return;
  }
  var hero = E.h("section", "bru-hero");
  hero.appendChild(E.h("p", "", E.t(S.status)));
  hero.appendChild(E.h("h1", "", E.t(S.name)));
  hero.appendChild(E.h("p", "", E.t(S.role)));
  grid.appendChild(hero);
  var side = E.h("aside", "bru-side");
  side.appendChild(E.h("p", "bru-num", "STEP"));
  side.appendChild(E.h("p", "bru-giant", S.step.n));
  grid.appendChild(side);
  var msc = E.h("section", "bru-msc");
  msc.appendChild(E.h("h2", "", E.t(S.msc)));
  msc.appendChild(E.h("p", "", E.t(S.msc.where)));
  S.msc.pills.forEach(function(p){ msc.appendChild(E.h("p", "", E.t(p))); });
  grid.appendChild(msc);
  var about = E.h("section", "bru-about");
  about.appendChild(E.h("h2", "", E.t(S.aboutTitle)));
  S.about.forEach(function(p){ about.appendChild(E.h("p", "", E.t(p))); });
  grid.appendChild(about);
  S.projects.forEach(function(p, i){
    var sec = E.h("article", "bru-proj");
    sec.appendChild(E.h("p", "bru-num", "0" + (i + 1)));
    sec.appendChild(E.h("h2", "", E.t(p.title)));
    sec.appendChild(E.h("p", "", E.t(p.body)));
    if (p.img){ var im = E.h("img"); im.src = p.img; im.alt = ""; sec.appendChild(im); }
    grid.appendChild(sec);
  });
  var cert = E.h("a", "bru-cert");
  cert.href = "certificates.html";
  cert.appendChild(E.h("span", "bru-num", String(E.count())));
  cert.appendChild(E.bi("Certificate rows, one field per strip", "صفوف الشهادات، مجال في كل شريط"));
  grid.appendChild(cert);
  var job = E.h("section", "bru-job");
  job.appendChild(E.h("h2", "", E.t(S.job.title)));
  job.appendChild(E.h("p", "", E.t(S.job.where)));
  S.job.bullets.forEach(function(b){ job.appendChild(E.h("p", "", E.t(b))); });
  grid.appendChild(job);
  var contact = E.h("section", "bru-contact");
  contact.appendChild(E.h("h2", "", E.isAr() ? "راسلني" : "WRITE"));
  contact.appendChild(E.h("p", "", S.links.email));
  contact.appendChild(E.form());
  grid.appendChild(contact);
  root.appendChild(grid);
});
