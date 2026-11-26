ThemeEngine.register("win95", function(root){
  var E = ThemeEngine, S = E.site;
  var ICONS = {
    about:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="3" width="18" height="26" fill="#fff" stroke="#000"/><rect x="10" y="7" width="12" height="2" fill="#000080"/><rect x="10" y="11" width="12" height="2" fill="#000"/><rect x="10" y="15" width="9" height="2" fill="#000"/><rect x="10" y="19" width="12" height="2" fill="#000"/></svg>',
    edu:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="8" width="24" height="16" rx="2" fill="#fff8dc" stroke="#000"/><path d="M16 8v16M4 12h24" stroke="#000080" fill="none"/><circle cx="16" cy="16" r="3" fill="#c0a000" stroke="#000"/></svg>',
    projects:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="5" width="24" height="16" fill="#000080" stroke="#000"/><rect x="6" y="7" width="20" height="12" fill="#1084d0"/><rect x="12" y="21" width="8" height="3" fill="#c0c0c0" stroke="#000"/><rect x="8" y="24" width="16" height="3" fill="#808080" stroke="#000"/></svg>',
    certs:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="6" y="4" width="20" height="16" fill="#fff" stroke="#000"/><path d="M12 20l4 8 4-8" fill="#c0a000" stroke="#000"/><circle cx="16" cy="12" r="4" fill="#000080"/></svg>',
    contact:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="8" width="26" height="16" fill="#fff" stroke="#000"/><path d="M3 8l13 10L29 8" fill="none" stroke="#000080" stroke-width="2"/></svg>'
  };
  var apps = [
    ["about", {en:"About", ar:"نبذة"}, "about"],
    ["edu", {en:"Education", ar:"التعليم"}, "edu"],
    ["projects", {en:"Projects", ar:"المشاريع"}, "projects"],
    ["certs", {en:"Certificates", ar:"الشهادات"}, "certs"],
    ["contact", {en:"Contact", ar:"تواصل"}, "contact"]
  ];
  var shell = E.h("div", "w95");
  var desk = E.h("div", "w95-desk");
  var icons = E.h("div", "w95-icons");
  var task = E.h("div", "w95-task");
  var menu = E.h("div", "w95-menu");
  menu.hidden = true;
  var brand = E.h("div", "w95-brand", "Windows");
  var nav = E.h("nav", "");
  menu.appendChild(brand); menu.appendChild(nav);
  var z = 4, wins = {}, n = 0;
  function glyph(kind){ var s = E.h("span", "w95-glyph"); s.innerHTML = ICONS[kind]; return s; }
  function thumbs(parent){
    var row = E.h("div", "w95-thumbs");
    (window.CERT_CATALOG || []).slice(0, 8).forEach(function(item){
      var img = E.h("img"); img.src = item.thumb; img.alt = E.t(item.title); row.appendChild(img);
    });
    parent.appendChild(row);
  }
  function bodyFor(id){
    var box = E.h("div", "");
    if (id === "about"){
      box.appendChild(E.h("h2", "", E.t(S.name)));
      box.appendChild(E.h("p", "", E.t(S.lead)));
      S.about.forEach(function(p){ box.appendChild(E.h("p", "", E.t(p))); });
    } else if (id === "edu"){
      box.appendChild(E.h("h2", "", E.t(S.edu.title)));
      box.appendChild(E.h("p", "", E.t(S.edu.when) + "  " + E.t(S.edu.where)));
      box.appendChild(E.h("h3", "", E.t(S.msc)));
      box.appendChild(E.h("p", "", E.t(S.msc.where)));
      S.msc.pills.forEach(function(p){ box.appendChild(E.h("p", "", E.t(p))); });
    } else if (id === "projects"){
      S.projects.forEach(function(p){ box.appendChild(E.h("h3", "", E.t(p.title))); box.appendChild(E.h("p", "", E.t(p.body))); });
    } else if (id === "certs"){
      box.appendChild(E.h("p", "", (E.isAr() ? "عدد الشهادات " : "Certificates ") + E.count()));
      thumbs(box);
      if (E.page === "certs"){ box.appendChild(E.backLink()); E.rails(box); }
      else { var a = E.h("a", ""); a.href = "certificates.html"; a.appendChild(E.bi("Open certificates", "افتح الشهادات")); box.appendChild(a); }
    } else {
      box.appendChild(E.h("p", "", S.links.email));
      box.appendChild(E.form());
    }
    return box;
  }
  function open(id){
    menu.hidden = true;
    var start = task.querySelector(".w95-start");
    if (start) start.classList.remove("on");
    if (wins[id]){ wins[id].hidden = false; wins[id].classList.remove("w95-min"); wins[id].style.zIndex = ++z; return; }
    var meta = apps.filter(function(a){ return a[0] === id; })[0];
    var win = E.h("section", "w95-win");
    win.style.left = (128 + (n % 4) * 28) + "px";
    win.style.top = (18 + (n % 4) * 26) + "px";
    win.style.zIndex = ++z; n++;
    var title = E.h("header", "w95-title");
    title.appendChild(E.bi(meta[1].en, meta[1].ar));
    var btns = E.h("span", "");
    var min = E.h("button", "", "_"); min.type = "button";
    var x = E.h("button", "", "X"); x.type = "button";
    min.addEventListener("click", function(){ win.classList.add("w95-min"); });
    x.addEventListener("click", function(){ win.hidden = true; });
    btns.appendChild(min); btns.appendChild(x); title.appendChild(btns);
    var dragging = false, sx, sy, sl, st;
    title.addEventListener("pointerdown", function(e){
      if (e.target.closest("button") || window.innerWidth < 800) return;
      dragging = true; sx = e.clientX; sy = e.clientY; sl = win.offsetLeft; st = win.offsetTop;
      win.style.zIndex = ++z; title.setPointerCapture(e.pointerId);
    });
    title.addEventListener("pointermove", function(e){ if (!dragging) return; win.style.left = (sl + e.clientX - sx) + "px"; win.style.top = (st + e.clientY - sy) + "px"; });
    title.addEventListener("pointerup", function(){ dragging = false; });
    var body = E.h("div", "w95-body"); body.appendChild(bodyFor(id));
    win.appendChild(title); win.appendChild(body); desk.appendChild(win); wins[id] = win;
    var tab = E.h("button", "w95-tab"); tab.type = "button"; tab.appendChild(E.bi(meta[1].en, meta[1].ar));
    tab.addEventListener("click", function(){ open(id); });
    task.insertBefore(tab, task.querySelector(".w95-clock"));
  }
  function proxy(id, en, ar){
    var b = E.h("button", ""); b.type = "button"; b.appendChild(E.bi(en, ar));
    b.addEventListener("click", function(){ var real = document.getElementById(id); if (real) real.click(); menu.hidden = true; });
    return b;
  }
  apps.forEach(function(a){
    var b = E.h("button", "w95-icon"); b.type = "button";
    b.appendChild(glyph(a[2])); b.appendChild(E.bi(a[1].en, a[1].ar));
    b.addEventListener("click", function(){ open(a[0]); });
    icons.appendChild(b);
    var m = E.h("button", ""); m.type = "button"; m.appendChild(E.bi(a[1].en, a[1].ar));
    m.addEventListener("click", function(){ open(a[0]); });
    nav.appendChild(m);
  });
  nav.appendChild(proxy("style-btn", "Styles", "التصاميم"));
  nav.appendChild(proxy("lang-btn", "Language", "اللغة"));
  nav.appendChild(proxy("mode-btn", "Light or dark", "فاتح أو داكن"));
  var start = E.h("button", "w95-start"); start.type = "button"; start.appendChild(E.bi("Start", "ابدأ"));
  start.addEventListener("click", function(){ menu.hidden = !menu.hidden; start.classList.toggle("on", !menu.hidden); });
  var clock = E.h("span", "w95-clock", "");
  function tick(){ try { clock.textContent = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}); } catch (e) {} }
  tick();
  var timer = setInterval(tick, 30000);
  var prev = window.__themeCleanup;
  window.__themeCleanup = function(){ clearInterval(timer); if (prev) prev(); };
  function tray(id, en, ar){
    var b = E.h("button", "w95-tray"); b.type = "button"; b.appendChild(E.bi(en, ar));
    b.addEventListener("click", function(){ var real = document.getElementById(id); if (real) real.click(); });
    return b;
  }
  desk.appendChild(icons); desk.appendChild(menu);
  task.appendChild(start);
  task.appendChild(clock);
  task.insertBefore(tray("mode-btn", "Display", "العرض"), clock);
  task.insertBefore(tray("lang-btn", "Lang", "لغة"), clock);
  task.insertBefore(tray("style-btn", "Styles", "تصاميم"), clock);
  shell.appendChild(desk); shell.appendChild(task);
  if (!E.reduce){
    var boot = E.h("div", "w95-boot");
    var flag = E.h("div", "w95-flag");
    for (var i = 0; i < 4; i++) flag.appendChild(E.h("i"));
    boot.appendChild(flag);
    boot.appendChild(E.h("b", "", E.isAr() ? "مايكروسوفت ويندوز 95" : "Microsoft Windows 95"));
    var bar = E.h("div", "w95-bar"); bar.appendChild(E.h("i")); boot.appendChild(bar);
    shell.appendChild(boot);
    setTimeout(function(){ if (boot.parentNode) boot.remove(); }, 700);
  }
  root.appendChild(shell);
  open("about");
  if (window.innerWidth >= 800 || E.page === "certs") open("certs");
});
