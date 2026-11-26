ThemeEngine.register("room", function(root){
  var E = ThemeEngine, S = E.site;
  var wrap = E.h("div", "room");
  var stage = E.h("div", "room-view");
  var pivot = E.h("div", "room-pivot");
  var yaw = -28, drag = false, lx = 0;
  function setYaw(v){ yaw = v; pivot.style.setProperty("--yaw", yaw + "deg"); }
  setYaw(yaw);
  pivot.appendChild(E.h("div", "room-floor"));
  pivot.appendChild(E.h("div", "room-rug"));
  var back = E.h("div", "room-wall back");
  var win = E.h("div", "room-window"); win.appendChild(E.h("i"));
  back.appendChild(win);
  var left = E.h("div", "room-wall left");
  pivot.appendChild(back); pivot.appendChild(left);
  var detail = E.h("div", "room-detail");
  function show(id){
    detail.textContent = "";
    stage.classList.toggle("is-fly", id !== "about" && id !== "lamp");
    if (id === "projects"){
      detail.appendChild(E.h("h2", "", E.isAr() ? "المكتب" : "The desk"));
      S.projects.forEach(function(p){ detail.appendChild(E.h("h3", "", E.t(p.title))); detail.appendChild(E.h("p", "", E.t(p.body))); });
    } else if (id === "certs"){
      detail.appendChild(E.h("h2", "", E.isAr() ? "لوحة الشهادات" : "Certificate board"));
      detail.appendChild(E.h("p", "", (E.isAr() ? "العدد " : "Count ") + E.count()));
      if (E.page === "certs"){ detail.appendChild(E.backLink()); E.rails(detail); }
      else { var a = E.h("a", ""); a.href = "certificates.html"; a.appendChild(E.bi("Open the board", "افتح اللوحة")); detail.appendChild(a); }
    } else if (id === "edu"){
      detail.appendChild(E.h("h2", "", E.t(S.edu.title)));
      detail.appendChild(E.h("p", "", E.t(S.edu.where)));
      detail.appendChild(E.h("h3", "", E.t(S.msc)));
      detail.appendChild(E.h("p", "", E.t(S.msc.where)));
      S.msc.pills.forEach(function(p){ detail.appendChild(E.h("p", "", E.t(p))); });
    } else if (id === "lamp"){
      var btn = document.getElementById("mode-btn");
      if (btn) btn.click();
      detail.appendChild(E.h("p", "", E.isAr() ? "المصباح يبدّل ضوء الغرفة." : "The lamp switches the room light."));
    } else {
      detail.appendChild(E.h("h2", "", E.t(S.name)));
      detail.appendChild(E.h("p", "", E.t(S.lead)));
      detail.appendChild(E.h("p", "", S.links.email));
    }
  }
  function hit(cls, id, en, ar){
    var b = E.h("button", "room-hit " + cls);
    b.type = "button";
    b.setAttribute("aria-label", E.isAr() ? ar : en);
    var lab = E.h("span", "room-label", E.isAr() ? ar : en);
    b.appendChild(lab);
    b.addEventListener("click", function(e){ e.stopPropagation(); show(id); });
    return b;
  }
  var desk = hit("room-desk", "projects", "Desk, projects", "المكتب");
  var mon = E.h("div", "room-monitor");
  var screen = E.h("div", "room-screen");
  screen.appendChild(E.h("i")); screen.appendChild(E.h("i")); screen.appendChild(E.h("i"));
  mon.appendChild(screen); desk.appendChild(mon);
  pivot.appendChild(desk);
  pivot.appendChild(hit("room-chair", "about", "Chair, about", "الكرسي"));
  var shelf = hit("room-shelf", "edu", "Shelf, education", "الرف");
  for (var i = 0; i < 5; i++) shelf.appendChild(E.h("b"));
  pivot.appendChild(shelf);
  var board = hit("room-board", "certs", "Board, certificates", "اللوحة");
  (window.CERT_CATALOG || []).slice(0, 4).forEach(function(item){
    var img = E.h("img"); img.src = item.thumb; img.alt = ""; board.appendChild(img);
  });
  pivot.appendChild(board);
  pivot.appendChild(hit("room-frame", "edu", "Diploma", "الشهادة"));
  var plant = E.h("div", "room-plant");
  plant.appendChild(E.h("span", "room-leaf")); plant.appendChild(E.h("span", "room-leaf b")); plant.appendChild(E.h("span", "room-pot"));
  pivot.appendChild(plant);
  pivot.appendChild(hit("room-lamp", "lamp", "Lamp", "المصباح"));
  stage.appendChild(pivot);
  stage.addEventListener("pointerdown", function(e){
    if (e.target.closest(".room-hit")) return;
    drag = true; lx = e.clientX; stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", function(e){ if (!drag) return; setYaw(yaw + (e.clientX - lx) * 0.35); lx = e.clientX; });
  stage.addEventListener("pointerup", function(){ drag = false; });
  if (!(window.CSS && CSS.supports && CSS.supports("transform", "rotateX(10deg)"))) stage.hidden = true;
  var col = E.h("div", "room-col");
  col.appendChild(E.h("p", "room-hint", E.isAr() ? "اسحب لتدوير الغرفة، أو استخدم الروابط." : "Drag to orbit the room, or use the links."));
  var nav = E.h("nav", "room-nav");
  [["projects","Projects","المشاريع"],["certs","Certificates","الشهادات"],["edu","Education","التعليم"],["about","About","نبذة"],["lamp","Lamp","المصباح"]].forEach(function(item){
    var b = E.h("button", ""); b.type = "button"; b.appendChild(E.bi(item[1], item[2]));
    b.addEventListener("click", function(){ show(item[0]); });
    nav.appendChild(b);
  });
  col.appendChild(nav); col.appendChild(detail);
  wrap.appendChild(stage); wrap.appendChild(col);
  root.appendChild(wrap);
  show(E.page === "certs" ? "certs" : "about");
});
