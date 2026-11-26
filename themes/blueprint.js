ThemeEngine.register("blueprint", function(root){
  var E = ThemeEngine, S = E.site;
  var sheets = E.page === "certs"
    ? [["certs", {en:"Certificates", ar:"الشهادات"}]]
    : [
      ["id", {en:"Title block", ar:"بطاقة العنوان"}],
      ["edu", {en:"Education", ar:"التعليم"}],
      ["exp", {en:"Experience", ar:"الخبرة"}],
      ["prj", {en:"Projects", ar:"المشاريع"}],
      ["skl", {en:"Skills", ar:"المهارات"}],
      ["certs", {en:"Certificates", ar:"الشهادات"}],
      ["com", {en:"Contact", ar:"التواصل"}]
    ];
  var cur = sheets[0][0];
  var side = E.h("nav", "bp-side");
  var main = E.h("div", "bp-sheet");
  function nav(){
    side.textContent = "";
    side.appendChild(E.h("p", "bp-rev", "DWG  /  REV 06"));
    sheets.forEach(function(s, i){
      var b = E.h("button", cur === s[0] ? "on" : "");
      b.type = "button";
      b.appendChild(E.h("span", "", String(i + 1).padStart ? String(i + 1) : (i + 1)));
      b.appendChild(document.createTextNode(" "));
      b.appendChild(E.bi(s[1].en, s[1].ar));
      b.addEventListener("click", function(){ cur = s[0]; nav(); draw(); });
      side.appendChild(b);
    });
  }
  function draw(){
    main.textContent = "";
    main.appendChild(E.h("p", "bp-stamp", "SHEET  " + cur.toUpperCase()));
    if (cur === "id"){
      main.appendChild(E.h("h1", "", E.t(S.name)));
      main.appendChild(E.h("p", "bp-call", "A  " + E.t(S.role)));
      main.appendChild(E.h("p", "bp-call", "B  " + E.t(S.lead)));
      main.appendChild(E.h("p", "bp-call", "C  STEP " + S.step.n + "  " + E.t(S.step)));
      main.appendChild(E.h("p", "bp-call", "D  " + E.t(S.status)));
    } else if (cur === "edu"){
      main.appendChild(E.h("h1", "", E.t(S.edu.title)));
      main.appendChild(E.h("p", "bp-call", E.t(S.edu.when) + "  " + E.t(S.edu.where)));
      main.appendChild(E.h("p", "bp-call", E.t(S.msc) + "  " + E.t(S.msc.where)));
      S.msc.pills.forEach(function(p){ main.appendChild(E.h("p", "", E.t(p))); });
    } else if (cur === "exp"){
      main.appendChild(E.h("h1", "", E.t(S.job.title)));
      main.appendChild(E.h("p", "", E.t(S.job.where)));
      S.job.bullets.forEach(function(b, i){ main.appendChild(E.h("p", "bp-call", (i + 1) + "  " + E.t(b))); });
    } else if (cur === "prj"){
      S.projects.forEach(function(p, i){
        main.appendChild(E.h("h2", "", (i + 1) + "  " + E.t(p.title)));
        main.appendChild(E.h("p", "", E.t(p.body)));
      });
    } else if (cur === "skl"){
      S.skills.forEach(function(g){ main.appendChild(E.h("p", "bp-call", E.t(g) + "  " + g.items.join(" / "))); });
    } else if (cur === "certs"){
      main.appendChild(E.h("h1", "", E.isAr() ? "فهرس الشهادات" : "CERTIFICATE INDEX"));
      main.appendChild(E.h("p", "", String(E.count())));
      if (E.page !== "certs"){
        var a = E.h("a", ""); a.href = "certificates.html"; a.appendChild(E.bi("Open sheet: certificates", "افتح لوحة الشهادات"));
        main.appendChild(a);
      }
      E.rails(main, {rowClass:"bp-row", railClass:"bp-rail", cardClass:"bp-card"});
    } else if (cur === "com"){
      main.appendChild(E.h("h1", "", S.links.email));
      main.appendChild(E.h("p", "", "GitHub  xAzzamx"));
      main.appendChild(E.form());
    }
  }
  var shell = E.h("div", "bp");
  shell.appendChild(side);
  shell.appendChild(main);
  root.appendChild(shell);
  nav(); draw();
});
