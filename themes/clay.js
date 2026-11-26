ThemeEngine.register("clay", function(root){
  var E = ThemeEngine, S = E.site;
  var page = E.h("div", "clay");
  var shelf = E.h("div", "clay-shelf");
  var panel = E.h("div", "clay-panel");
  var blocks = [];
  function fill(id){
    panel.textContent = "";
    blocks.forEach(function(b){ b.classList.toggle("is-on", b.getAttribute("data-id") === id); });
    if (id === "edu"){
      panel.appendChild(E.h("h2", "", E.t(S.msc)));
      panel.appendChild(E.h("p", "", E.t(S.msc.where)));
      S.msc.pills.forEach(function(p){ panel.appendChild(E.h("p", "", E.t(p))); });
    } else if (id === "projects"){
      S.projects.forEach(function(p){
        panel.appendChild(E.h("h3", "", E.t(p.title)));
        panel.appendChild(E.h("p", "", E.t(p.role)));
      });
    } else if (id === "certs"){
      panel.appendChild(E.h("h2", "", E.isAr() ? "مجموعة الصلصال" : "Clay collection"));
      panel.appendChild(E.h("p", "", (E.isAr() ? "القطع " : "Pieces ") + E.count()));
      if (E.page === "certs"){ panel.appendChild(E.backLink()); E.rails(panel, {cardClass:"clay-card"}); }
      else {
        var a = E.h("a", ""); a.href = "certificates.html"; a.appendChild(E.bi("Open the shelf", "افتح الرف"));
        panel.appendChild(a);
      }
    } else if (id === "contact"){
      panel.appendChild(E.h("p", "", S.links.email));
      panel.appendChild(E.form());
    } else {
      panel.appendChild(E.h("h2", "", E.t(S.name)));
      panel.appendChild(E.h("p", "", E.t(S.lead)));
    }
  }
  [["about","About","نبذة"],["edu","Plan","الخطة"],["projects","Projects","المشاريع"],["certs","Certs","شهادات"],["contact","Hello","تواصل"]].forEach(function(item){
    var b = E.h("button", "clay-block");
    b.type = "button";
    b.setAttribute("data-id", item[0]);
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
