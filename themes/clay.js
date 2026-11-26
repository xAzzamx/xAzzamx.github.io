ThemeEngine.register("clay", function(root){
  var E = ThemeEngine, S = E.site;
  var ICO = {
    about:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3"/><path d="M5 19c1.4-3 4-4.5 7-4.5s5.6 1.5 7 4.5"/></svg>',
    edu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10l9-5 9 5-9 5z"/><path d="M7 12v4c2 1 8 1 10 0v-4"/></svg>',
    projects:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="11" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    certs:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="9" r="4"/><path d="m9 12 1 8 2-2 2 2 1-8"/></svg>',
    contact:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16v10H4z"/><path d="m4 7 8 6 8-6"/></svg>'
  };
  var page = E.h("div", "clay");
  var shelf = E.h("div", "clay-shelf");
  var panel = E.h("div", "clay-panel");
  var blocks = [];
  var tones = ["clay-a","clay-b","clay-c","clay-d","clay-e"];
  function fill(id){
    panel.textContent = "";
    blocks.forEach(function(b){ b.classList.toggle("is-on", b.getAttribute("data-id") === id); });
    if (id === "edu"){
      panel.appendChild(E.h("h2", "", E.t(S.msc)));
      panel.appendChild(E.h("p", "", E.t(S.msc.where)));
      S.msc.pills.forEach(function(p){ panel.appendChild(E.h("p", "", E.t(p))); });
      panel.appendChild(E.h("p", "", E.t(S.edu.title) + "  " + E.t(S.edu.where)));
    } else if (id === "projects"){
      S.projects.forEach(function(p){ panel.appendChild(E.h("h3", "", E.t(p.title))); panel.appendChild(E.h("p", "", E.t(p.role))); });
    } else if (id === "certs"){
      panel.appendChild(E.h("h2", "", E.isAr() ? "مجموعة الصلصال" : "Clay collection"));
      panel.appendChild(E.h("p", "", (E.isAr() ? "القطع " : "Pieces ") + E.count()));
      if (E.page === "certs"){ panel.appendChild(E.backLink()); E.rails(panel); }
      else { var a = E.h("a", ""); a.href = "certificates.html"; a.appendChild(E.bi("Open the shelf", "افتح الرف")); panel.appendChild(a); }
    } else if (id === "contact"){
      panel.appendChild(E.h("p", "", S.links.email));
      panel.appendChild(E.form());
    } else {
      panel.appendChild(E.h("h2", "", E.t(S.name)));
      panel.appendChild(E.h("p", "", E.t(S.lead)));
      panel.appendChild(E.h("p", "", E.t(S.about[0])));
      var chips = E.h("div", "clay-chips");
      S.focus.forEach(function(f){ chips.appendChild(E.h("span", "", E.t(f))); });
      panel.appendChild(chips);
    }
  }
  [["about","About","نبذة","about"],["edu","Plan","الخطة","edu"],["projects","Projects","المشاريع","projects"],["certs","Certs","شهادات","certs"],["contact","Hello","تواصل","contact"]].forEach(function(item, i){
    var b = E.h("button", "clay-block " + tones[i]);
    b.type = "button";
    b.setAttribute("data-id", item[0]);
    var ico = E.h("span", ""); ico.innerHTML = ICO[item[3]];
    b.appendChild(ico);
    b.appendChild(E.bi(item[1], item[2]));
    b.addEventListener("click", function(){ fill(item[0]); });
    blocks.push(b);
    shelf.appendChild(b);
  });
  page.appendChild(shelf);
  page.appendChild(panel);
  root.appendChild(page);
  fill(E.page === "certs" ? "certs" : "about");
});
