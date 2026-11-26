ThemeEngine.register("bento", function(root){
  var E = ThemeEngine, S = E.site;
  var app = E.h("div", "bn");
  var rail = E.h("nav", "bn-rail");
  ["#bn-kpis", "#bn-work", "#bn-certs", "#bn-skills", "#bn-contact"].forEach(function(href, i){
    var labels = [
      {en:"Overview", ar:"نظرة"},
      {en:"Projects", ar:"المشاريع"},
      {en:"Certificates", ar:"الشهادات"},
      {en:"Skills", ar:"المهارات"},
      {en:"Inbox", ar:"الرسائل"}
    ];
    var a = E.h("a", "");
    a.href = E.page === "certs" ? "index.html" + href : href;
    a.appendChild(E.bi(labels[i].en, labels[i].ar));
    rail.appendChild(a);
  });
  var main = E.h("div", "bn-main");
  if (E.page === "certs"){
    main.appendChild(E.h("h1", "", E.isAr() ? "لوحة الشهادات" : "Certificate dashboard"));
    main.appendChild(E.h("p", "", String(E.count())));
    E.rails(main, {rowClass:"bn-row", railClass:"bn-railx", cardClass:"bn-card"});
    app.appendChild(rail); app.appendChild(main); root.appendChild(app);
    return;
  }
  var kpis = E.h("section", "bn-kpis");
  kpis.id = "bn-kpis";
  [[S.step.n, E.t(S.step)], ["2027", E.t(S.msc)], [String(S.projects.length), E.isAr() ? "مشاريع" : "Projects"], [String(E.count()), E.isAr() ? "شهادة" : "Certificates"]].forEach(function(k){
    var c = E.h("article", "bn-kpi");
    c.appendChild(E.h("b", "", k[0]));
    c.appendChild(E.h("span", "", k[1]));
    kpis.appendChild(c);
  });
  main.appendChild(kpis);
  var hero = E.h("section", "bn-hero");
  hero.appendChild(E.h("p", "", E.t(S.status)));
  hero.appendChild(E.h("h1", "", E.t(S.name)));
  hero.appendChild(E.h("p", "", E.t(S.lead)));
  main.appendChild(hero);
  var work = E.h("section", "bn-table");
  work.id = "bn-work";
  work.appendChild(E.h("h2", "", E.isAr() ? "المشاريع" : "Projects"));
  S.projects.forEach(function(p){
    var row = E.h("article", "bn-prow");
    row.appendChild(E.h("h3", "", E.t(p.title)));
    row.appendChild(E.h("p", "", E.t(p.role)));
    work.appendChild(row);
  });
  main.appendChild(work);
  var certs = E.h("section", "");
  certs.id = "bn-certs";
  certs.appendChild(E.h("h2", "", E.isAr() ? "الشهادات حسب المجال" : "Certificates by field"));
  var a = E.h("a", "bn-go"); a.href = "certificates.html"; a.appendChild(E.bi("Open dashboard rows", "افتح صفوف اللوحة"));
  certs.appendChild(a);
  E.groups("field").forEach(function(g){
    var chip = E.h("a", "bn-chip");
    chip.href = "certificates.html#field-" + g.id;
    chip.appendChild(E.bi(g.en + " " + g.items.length, g.ar + " " + g.items.length));
    certs.appendChild(chip);
  });
  main.appendChild(certs);
  var skills = E.h("section", "bn-skills");
  skills.id = "bn-skills";
  S.skills.forEach(function(g){
    var box = E.h("div", "");
    box.appendChild(E.h("h3", "", E.t(g)));
    box.appendChild(E.h("p", "", g.items.join(" · ")));
    skills.appendChild(box);
  });
  main.appendChild(skills);
  app.appendChild(rail);
  app.appendChild(main);
  var inbox = E.h("aside", "bn-inbox");
  inbox.id = "bn-contact";
  inbox.appendChild(E.h("h2", "", E.isAr() ? "الوارد" : "Inbox"));
  inbox.appendChild(E.h("p", "", S.links.email));
  inbox.appendChild(E.h("p", "", "GitHub xAzzamx"));
  inbox.appendChild(E.form());
  app.appendChild(inbox);
  root.appendChild(app);
});
