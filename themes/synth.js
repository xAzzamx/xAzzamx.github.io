ThemeEngine.register("synth", function(root){
  var E = ThemeEngine, S = E.site;
  var levels = [
    ["01", {en:"Identity", ar:"الهوية"}, "who"],
    ["02", {en:"Briefing", ar:"المهمة"}, "about"],
    ["03", {en:"Training", ar:"التدريب"}, "train"],
    ["04", {en:"Missions", ar:"المهمات"}, "projects"],
    ["05", {en:"Loadout", ar:"المهارات"}, "skills"],
    ["06", {en:"Archives", ar:"الأرشيف"}, "certs"],
    ["07", {en:"Comms", ar:"الاتصال"}, "contact"]
  ];
  var stage = E.page === "certs" ? "certs" : null;
  var board = E.h("div", "syn-board");
  var view = E.h("div", "syn-view");
  function menu(){
    view.textContent = "";
    view.appendChild(E.h("p", "syn-kicker", E.isAr() ? "اختر المرحلة" : "SELECT LEVEL"));
    view.appendChild(E.h("h1", "", E.t(S.name)));
    view.appendChild(E.h("p", "", (E.isAr() ? "الشهادات " : "Certificates ") + E.count()));
    var grid = E.h("div", "syn-levels");
    levels.forEach(function(L){
      var b = E.h("button", "syn-level");
      b.type = "button";
      b.appendChild(E.h("span", "syn-no", L[0]));
      b.appendChild(E.bi(L[1].en, L[1].ar));
      b.addEventListener("click", function(){ stage = L[2]; paint(); });
      grid.appendChild(b);
    });
    view.appendChild(grid);
  }
  function back(){
    var b = E.h("button", "syn-back");
    b.type = "button";
    b.appendChild(E.bi("Level select", "اختيار المرحلة"));
    b.addEventListener("click", function(){ stage = null; paint(); });
    return b;
  }
  function paint(){
    if (E.page === "certs") stage = "certs";
    view.textContent = "";
    if (!stage){ menu(); return; }
    if (E.page !== "certs") view.appendChild(back());
    if (stage === "who"){
      view.appendChild(E.h("h1", "", E.t(S.name)));
      view.appendChild(E.h("p", "", E.t(S.role)));
      view.appendChild(E.h("p", "", E.t(S.lead)));
      view.appendChild(E.h("p", "syn-kicker", E.t(S.status)));
    } else if (stage === "about"){
      view.appendChild(E.h("h1", "", E.t(S.aboutTitle)));
      S.about.forEach(function(p){ view.appendChild(E.h("p", "", E.t(p))); });
    } else if (stage === "train"){
      view.appendChild(E.h("h1", "", E.t(S.edu.title)));
      view.appendChild(E.h("p", "", E.t(S.edu.where)));
      view.appendChild(E.h("h2", "", E.t(S.job.title)));
      S.job.bullets.forEach(function(b){ view.appendChild(E.h("p", "", E.t(b))); });
      view.appendChild(E.h("p", "syn-kicker", "STEP " + S.step.n + "  |  " + E.t(S.msc)));
    } else if (stage === "projects"){
      S.projects.forEach(function(p){
        var c = E.h("article", "syn-mission");
        c.appendChild(E.h("h2", "", E.t(p.title)));
        c.appendChild(E.h("p", "", E.t(p.body)));
        view.appendChild(c);
      });
    } else if (stage === "skills"){
      S.skills.forEach(function(g){ view.appendChild(E.h("p", "", E.t(g) + ": " + g.items.join(", "))); });
    } else if (stage === "certs"){
      if (E.page === "certs") view.appendChild(E.backLink("syn-go"));
      view.appendChild(E.h("h1", "", E.isAr() ? "مراحل الأرشيف" : "ARCHIVE STAGES"));
      view.appendChild(E.h("p", "", String(E.count())));
      if (E.page !== "certs"){
        var a = E.h("a", "syn-go"); a.href = "certificates.html"; a.appendChild(E.bi("Enter the archive", "ادخل الأرشيف"));
        view.appendChild(a);
      }
      E.rails(view, {rowClass:"syn-row", railClass:"syn-rail", cardClass:"syn-card"});
    } else if (stage === "contact"){
      view.appendChild(E.h("h1", "", E.isAr() ? "قناة الاتصال" : "COMMS"));
      view.appendChild(E.h("p", "", S.links.email));
      view.appendChild(E.form());
    }
  }
  root.appendChild(board);
  board.appendChild(view);
  paint();
});
