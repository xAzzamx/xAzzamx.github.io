ThemeEngine.register("film", function(root){
  var E = ThemeEngine, S = E.site;
  var frames = [];
  function add(no, title, fill){
    var f = E.h("article", "film-frame");
    f.appendChild(E.h("p", "film-no", no));
    f.appendChild(E.h("h2", "", title));
    var body = E.h("div", "");
    fill(body);
    f.appendChild(body);
    f.addEventListener("click", function(){ expand(title, body); });
    frames.push(f);
  }
  function shot(src){ var im = E.h("img", "shot"); im.src = src; im.alt = ""; return im; }
  if (E.page === "certs"){
    add("00", E.isAr() ? "العودة" : "Return", function(box){
      var thumbs = (window.CERT_CATALOG || []).slice(0, 3);
      if (thumbs[0]) box.appendChild(shot(thumbs[0].thumb));
      box.appendChild(E.backLink());
      box.appendChild(E.h("p", "", String(E.count())));
    });
    E.groups("field").forEach(function(g, i){
      add(String(i + 1).padStart(2, "0"), E.t(g), function(box){
        var rail = E.h("div", "film-rail");
        g.items.forEach(function(item){
          var b = E.h("button", "");
          b.type = "button";
          var img = E.h("img"); img.src = item.thumb; img.alt = E.t(item.title);
          b.appendChild(img);
          b.appendChild(E.h("span", "", E.t(item.title)));
          b.addEventListener("click", function(e){ e.stopPropagation(); E.openCert(item, g.items); });
          rail.appendChild(b);
        });
        box.appendChild(rail);
      });
    });
  } else {
    add("01", E.t(S.name), function(box){ box.appendChild(E.h("p", "", E.t(S.lead))); });
    add("02", E.t(S.msc), function(box){
      box.appendChild(E.h("p", "", E.t(S.msc.where)));
      S.msc.pills.forEach(function(p){ box.appendChild(E.h("p", "", E.t(p))); });
    });
    S.projects.forEach(function(p, i){
      add(String(i + 3).padStart(2, "0"), E.t(p.title), function(box){
        if (p.img) box.appendChild(shot(p.img));
        box.appendChild(E.h("p", "", E.t(p.body)));
      });
    });
    add("06", E.isAr() ? "الشهادات" : "Certificates", function(box){
      var thumbs = (window.CERT_CATALOG || []).slice(0, 4);
      var row = E.h("div", "film-rail");
      thumbs.forEach(function(item){ row.appendChild(shot(item.thumb)); });
      box.appendChild(row);
      box.appendChild(E.h("p", "", String(E.count())));
      var a = E.h("a", ""); a.href = "certificates.html"; a.appendChild(E.bi("Open the reel", "افتح الشريط"));
      box.appendChild(a);
    });
  }
  var film = E.h("div", "film");
  film.tabIndex = 0;
  film.appendChild(E.h("div", "film-sprocket"));
  var win = E.h("div", "film-window");
  var track = E.h("div", "film-track");
  frames.forEach(function(f){ track.appendChild(f); });
  win.appendChild(track);
  film.appendChild(win);
  film.appendChild(E.h("div", "film-sprocket"));
  film.appendChild(E.h("p", "film-help", E.isAr() ? "اسحب أو استخدم العجلة والأسهم. الاتجاه ينعكس في العربية." : "Drag, scroll, or use the arrow keys. The reel reverses in Arabic."));
  var full = E.h("div", "film-full");
  full.hidden = true;
  var x = E.h("button", "film-x", E.isAr() ? "إغلاق الإطار" : "Close frame");
  x.type = "button";
  var slot = E.h("div", "");
  var parked = null;
  full.appendChild(x); full.appendChild(slot);
  function expand(title, body){
    if (parked) parked.parent.appendChild(parked.body);
    slot.textContent = "";
    slot.appendChild(E.h("h2", "", title));
    parked = {parent: body.parentNode, body: body};
    slot.appendChild(body);
    full.hidden = false;
  }
  x.addEventListener("click", function(){
    if (parked) parked.parent.appendChild(parked.body);
    parked = null;
    full.hidden = true;
  });
  var index = 0;
  function stepPx(){ return Math.min(420, window.innerWidth * 0.86) + 16; }
  function layout(){
    var sign = document.documentElement.dir === "rtl" ? 1 : -1;
    track.style.transform = "translateX(" + (sign * index * stepPx()) + "px)";
  }
  function move(d){
    var rtl = document.documentElement.dir === "rtl";
    index = Math.max(0, Math.min(frames.length - 1, index + (rtl ? -d : d)));
    layout();
  }
  film.addEventListener("wheel", function(e){
    e.preventDefault();
    move(e.deltaY > 0 || e.deltaX > 0 ? 1 : -1);
  }, {passive:false});
  var down = false, sx = 0;
  film.addEventListener("pointerdown", function(e){ if (e.target.closest("a,button")) return; down = true; sx = e.clientX; });
  film.addEventListener("pointerup", function(e){
    if (!down) return;
    down = false;
    var dx = e.clientX - sx;
    if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
  });
  film.addEventListener("keydown", function(e){
    if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
    if (e.key === "Escape") full.hidden = true;
  });
  root.appendChild(film);
  root.appendChild(full);
  layout();
  var prev = window.__themeCleanup;
  window.__themeCleanup = function(){ window.removeEventListener("resize", layout); if (prev) prev(); };
  window.addEventListener("resize", layout);
});
