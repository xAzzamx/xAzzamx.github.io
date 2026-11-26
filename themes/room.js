ThemeEngine.register("room", function(root){
  var E = ThemeEngine, S = E.site;
  var wrap = E.h("div", "room");
  var stage = E.h("div", "room-view");
  var pivot = E.h("div", "room-pivot");
  var yaw = -32, drag = false, lx = 0;
  function setYaw(v){ yaw = v; pivot.style.setProperty("--yaw", yaw + "deg"); }
  setYaw(yaw);
  pivot.appendChild(E.h("div", "room-floor"));
  pivot.appendChild(E.h("div", "room-wall back"));
  pivot.appendChild(E.h("div", "room-wall left"));
  var detail = E.h("div", "room-detail");
  function show(id){
    detail.textContent = "";
    pivot.className = "room-pivot is-" + id;
    if (id === "projects"){
      detail.appendChild(E.h("h2", "", E.isAr() ? "المشاريع" : "Projects"));
      S.projects.forEach(function(p){
        detail.appendChild(E.h("h3", "", E.t(p.title)));
        detail.appendChild(E.h("p", "", E.t(p.body)));
      });
    } else if (id === "certs"){
      detail.appendChild(E.h("h2", "", E.isAr() ? "الشهادات" : "Certificates"));
      detail.appendChild(E.h("p", "", (E.isAr() ? "العدد " : "Count ") + E.count()));
      if (E.page === "certs"){ detail.appendChild(E.backLink()); E.rails(detail); }
      else {
        var a = E.h("a", ""); a.href = "certificates.html"; a.appendChild(E.bi("Open the shelf", "افتح الرف"));
        detail.appendChild(a);
      }
    } else if (id === "edu"){
      detail.appendChild(E.h("h2", "", E.t(S.edu.title)));
      detail.appendChild(E.h("p", "", E.t(S.edu.where)));
      detail.appendChild(E.h("h3", "", E.t(S.msc)));
      detail.appendChild(E.h("p", "", E.t(S.msc.where)));
      S.msc.pills.forEach(function(p){ detail.appendChild(E.h("p", "", E.t(p))); });
    } else if (id === "lamp"){
      var btn = document.getElementById("mode-btn");
      if (btn) btn.click();
      detail.appendChild(E.h("p", "", E.isAr() ? "المصباح يبدّل الإضاءة." : "The lamp switches the light."));
    } else {
      detail.appendChild(E.h("h2", "", E.t(S.name)));
      detail.appendChild(E.h("p", "", E.t(S.lead)));
      detail.appendChild(E.h("p", "", S.links.email));
    }
  }
  function obj(cls, id, en, ar){
    var b = E.h("button", "room-obj " + cls);
    b.type = "button";
    b.setAttribute("aria-label", E.isAr() ? ar : en);
    b.appendChild(E.h("span", "", E.isAr() ? ar : en));
    b.addEventListener("click", function(e){ e.stopPropagation(); show(id); });
    return b;
  }
  pivot.appendChild(obj("room-desk", "projects", "Desk, projects", "المكتب، المشاريع"));
  pivot.appendChild(obj("room-board", "certs", "Board, certificates", "اللوحة، الشهادات"));
  pivot.appendChild(obj("room-frame", "edu", "Diploma, education", "الإطار، التعليم"));
  pivot.appendChild(obj("room-lamp", "lamp", "Lamp, light", "المصباح"));
  stage.appendChild(pivot);
  stage.addEventListener("pointerdown", function(e){
    if (e.target.closest(".room-obj")) return;
    drag = true; lx = e.clientX; stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", function(e){
    if (!drag) return;
    setYaw(yaw + (e.clientX - lx) * 0.4);
    lx = e.clientX;
  });
  stage.addEventListener("pointerup", function(){ drag = false; });
  var css3d = window.CSS && CSS.supports && CSS.supports("transform", "rotateX(10deg)");
  if (!css3d) stage.hidden = true;
  var col = E.h("div", "");
  col.appendChild(E.h("p", "room-hint", E.isAr() ? "اسحب لتدوير الغرفة، أو استخدم النص." : "Drag to orbit the room, or use the text links."));
  var nav = E.h("nav", "room-nav");
  [["projects", "Projects", "المشاريع"], ["certs", "Certificates", "الشهادات"], ["edu", "Education", "التعليم"], ["about", "About", "نبذة"], ["lamp", "Lamp", "المصباح"]].forEach(function(item){
    var b = E.h("button", "");
    b.type = "button";
    b.appendChild(E.bi(item[1], item[2]));
    b.addEventListener("click", function(){ show(item[0]); });
    nav.appendChild(b);
  });
  col.appendChild(nav);
  col.appendChild(detail);
  wrap.appendChild(stage);
  wrap.appendChild(col);
  root.appendChild(wrap);
  show(E.page === "certs" ? "certs" : "about");
});
