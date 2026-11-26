ThemeEngine.register("win95", function(root){
  var E = ThemeEngine, S = E.site;
  var apps = [
    ["about", {en:"About", ar:"نبذة"}, "A"],
    ["edu", {en:"Education", ar:"التعليم"}, "E"],
    ["projects", {en:"Projects", ar:"المشاريع"}, "P"],
    ["certs", {en:"Certificates", ar:"الشهادات"}, "C"],
    ["contact", {en:"Contact", ar:"تواصل"}, "@"]
  ];
  var shell = E.h("div", "w95");
  var desk = E.h("div", "w95-desk");
  var icons = E.h("div", "w95-icons");
  var task = E.h("div", "w95-task");
  var menu = E.h("div", "w95-menu");
  menu.hidden = true;
  var z = 4, wins = {}, n = 0;
  function bodyFor(id){
    var box = E.h("div", "");
    if (id === "about"){
      box.appendChild(E.h("h2", "", E.t(S.aboutTitle)));
      S.about.forEach(function(p){ box.appendChild(E.h("p", "", E.t(p))); });
    } else if (id === "edu"){
      box.appendChild(E.h("h2", "", E.t(S.edu.title)));
      box.appendChild(E.h("p", "", E.t(S.edu.when) + "  " + E.t(S.edu.where)));
      box.appendChild(E.h("h3", "", E.t(S.msc)));
      box.appendChild(E.h("p", "", E.t(S.msc.where)));
      S.msc.pills.forEach(function(p){ box.appendChild(E.h("p", "", E.t(p))); });
      box.appendChild(E.h("p", "", "STEP " + S.step.n + "  " + E.t(S.step)));
    } else if (id === "projects"){
      S.projects.forEach(function(p){
        box.appendChild(E.h("h3", "", E.t(p.title)));
        box.appendChild(E.h("p", "", E.t(p.body)));
      });
    } else if (id === "certs"){
      box.appendChild(E.h("p", "", (E.isAr() ? "عدد الشهادات " : "Certificates ") + E.count()));
      if (E.page === "certs"){
        box.appendChild(E.backLink());
        E.rails(box);
      } else {
        var a = E.h("a", ""); a.href = "certificates.html"; a.appendChild(E.bi("Open certificates", "افتح الشهادات"));
        box.appendChild(a);
      }
    } else {
      box.appendChild(E.h("p", "", S.links.email));
      box.appendChild(E.h("p", "", E.t(S.contactNote)));
      box.appendChild(E.form());
    }
    return box;
  }
  function open(id){
    menu.hidden = true;
    if (wins[id]){
      wins[id].hidden = false;
      wins[id].classList.remove("w95-min");
      wins[id].style.zIndex = ++z;
      return;
    }
    var meta = apps.filter(function(a){ return a[0] === id; })[0];
    var win = E.h("section", "w95-win");
    win.style.left = (130 + (n % 5) * 26) + "px";
    win.style.top = (36 + (n % 5) * 24) + "px";
    win.style.zIndex = ++z;
    n++;
    var title = E.h("header", "w95-title");
    title.appendChild(E.bi(meta[1].en, meta[1].ar));
    var btns = E.h("span", "");
    var min = E.h("button", "", "_"); min.type = "button";
    var x = E.h("button", "", "X"); x.type = "button";
    min.addEventListener("click", function(){ win.classList.add("w95-min"); });
    x.addEventListener("click", function(){ win.hidden = true; });
    btns.appendChild(min); btns.appendChild(x);
    title.appendChild(btns);
    var sx, sy, sl, st, dragging = false;
    title.addEventListener("pointerdown", function(e){
      if (e.target.closest("button") || window.innerWidth < 800) return;
      dragging = true; sx = e.clientX; sy = e.clientY;
      sl = win.offsetLeft; st = win.offsetTop;
      win.style.zIndex = ++z;
      title.setPointerCapture(e.pointerId);
    });
    title.addEventListener("pointermove", function(e){
      if (!dragging) return;
      win.style.left = (sl + e.clientX - sx) + "px";
      win.style.top = (st + e.clientY - sy) + "px";
    });
    title.addEventListener("pointerup", function(){ dragging = false; });
    var body = E.h("div", "w95-body");
    body.appendChild(bodyFor(id));
    win.appendChild(title); win.appendChild(body);
    desk.appendChild(win);
    wins[id] = win;
    var tab = E.h("button", "w95-tab");
    tab.type = "button";
    tab.appendChild(E.bi(meta[1].en, meta[1].ar));
    tab.addEventListener("click", function(){ open(id); });
    task.appendChild(tab);
  }
  apps.forEach(function(a){
    var b = E.h("button", "w95-icon");
    b.type = "button";
    b.appendChild(E.h("span", "w95-glyph", a[2]));
    b.appendChild(E.bi(a[1].en, a[1].ar));
    b.addEventListener("click", function(){ open(a[0]); });
    icons.appendChild(b);
    var m = E.h("button", "");
    m.type = "button";
    m.appendChild(E.bi(a[1].en, a[1].ar));
    m.addEventListener("click", function(){ open(a[0]); });
    menu.appendChild(m);
  });
  var start = E.h("button", "w95-start");
  start.type = "button";
  start.appendChild(E.bi("Start", "ابدأ"));
  start.addEventListener("click", function(){
    menu.hidden = !menu.hidden;
    start.classList.toggle("on", !menu.hidden);
  });
  var clock = E.h("span", "w95-clock", "");
  function tick(){
    try { clock.textContent = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}); }
    catch (e) { clock.textContent = ""; }
  }
  tick();
  var timer = setInterval(tick, 30000);
  var prev = window.__themeCleanup;
  window.__themeCleanup = function(){ clearInterval(timer); if (prev) prev(); };
  desk.appendChild(icons);
  desk.appendChild(menu);
  task.appendChild(start);
  task.appendChild(clock);
  shell.appendChild(desk);
  shell.appendChild(task);
  if (!E.reduce){
    var boot = E.h("div", "w95-boot");
    boot.appendChild(E.h("b", "", E.isAr() ? "بدء تشغيل ويندوز 95" : "Starting Windows 95"));
    var bar = E.h("div", "w95-bar"); bar.appendChild(E.h("i"));
    boot.appendChild(bar);
    shell.appendChild(boot);
    setTimeout(function(){ if (boot.parentNode) boot.remove(); }, 900);
  }
  root.appendChild(shell);
  open(E.page === "certs" ? "certs" : "about");
});
