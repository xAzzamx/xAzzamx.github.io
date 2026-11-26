(function(){
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function isAr(){ return root.lang === "ar"; }
  var TITLES = {
    en: "Azzam Alzahrani | Computer Science Graduate, Cybersecurity and AI",
    ar: "عزام الزهراني | خريج علوم الحاسب، الأمن السيبراني والذكاء الاصطناعي"
  };
  var customTitleEn = document.body && document.body.getAttribute("data-title-en");
  var customTitleAr = document.body && document.body.getAttribute("data-title-ar");
  if (customTitleEn) TITLES.en = customTitleEn;
  if (customTitleAr) TITLES.ar = customTitleAr;
  var langListeners = [];

  // Language
  function applyLang(lang, save){
    root.lang = lang; root.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = TITLES[lang];
    document.querySelectorAll("[data-ph-ar]").forEach(function(el){
      if (!el.hasAttribute("data-ph-en")) el.setAttribute("data-ph-en", el.getAttribute("placeholder") || "");
      el.setAttribute("placeholder", lang === "ar" ? el.getAttribute("data-ph-ar") : el.getAttribute("data-ph-en"));
    });
    document.querySelectorAll("img[data-alt-ar]").forEach(function(el){
      if (!el.hasAttribute("data-alt-en")) el.setAttribute("data-alt-en", el.getAttribute("alt") || "");
      el.setAttribute("alt", lang === "ar" ? el.getAttribute("data-alt-ar") : el.getAttribute("data-alt-en"));
    });
    var lb = document.getElementById("lang-btn");
    if (lb) lb.setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية");
    var styleBtnEl = document.getElementById("style-btn");
    var styleMenuEl = document.getElementById("style-menu");
    if (styleBtnEl) styleBtnEl.setAttribute("aria-label", lang === "ar" ? "التصاميم" : "Styles");
    if (styleMenuEl) styleMenuEl.setAttribute("aria-label", lang === "ar" ? "التصاميم" : "Styles");
    var modeBtnEl = document.getElementById("mode-btn");
    if (modeBtnEl) modeBtnEl.setAttribute("aria-label", modeLabel(root.getAttribute("data-mode") === "dark" ? "dark" : "light"));
    if (save) { try { localStorage.setItem("lang", lang); } catch(e){} }
    langListeners.forEach(function(f){ f(); });
  }
  var langBtn = document.getElementById("lang-btn");
  if (langBtn) langBtn.addEventListener("click", function(){ applyLang(isAr() ? "en" : "ar", true); });

  // Mobile menu
  var btn = document.querySelector(".menu-btn"), menu = document.getElementById("menu");
  if (btn) {
    btn.addEventListener("click", function(){ var o = menu.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
    menu.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ menu.classList.remove("open"); btn.setAttribute("aria-expanded", false); }); });
  }
  document.querySelectorAll(".year").forEach(function(y){ y.textContent = new Date().getFullYear(); });

  // Style switcher. Classic is the absence of data-style, so the current design stays untouched.
  var STYLE_OK = {classic:1, terminal:1, aurora:1, brutal:1, synth:1, editorial:1, blueprint:1, bento:1, win95:1, room:1, manga:1, aero:1, clay:1, film:1};
  var THEME_JS = {terminal:1, aurora:1, brutal:1, synth:1, editorial:1, blueprint:1, bento:1, win95:1, room:1, manga:1, aero:1, clay:1, film:1};
  var ASSET = "v=20261201";
  var BOOT_BG = {
    terminal:{light:"#f0f8f1",dark:"#061308"},
    aurora:{light:"#e5eaff",dark:"#100e24"},
    brutal:{light:"#f9f5e6",dark:"#13120c"},
    synth:{light:"#fbf2fb",dark:"#17091a"},
    editorial:{light:"#f8f1e5",dark:"#18100a"},
    blueprint:{light:"#ebf3fc",dark:"#0e2440"},
    bento:{light:"#f1f6fa",dark:"#0d1218"},
    win95:{light:"#008080",dark:"#0d3333"},
    room:{light:"#f4efe6",dark:"#1a140f"},
    manga:{light:"#f7f4ea",dark:"#141414"},
    aero:{light:"#c5e8f8",dark:"#1a2744"},
    clay:{light:"#f6efe6",dark:"#2a1c18"},
    film:{light:"#efe8dc",dark:"#0e0e0e"}
  };
  function bootColor(id){
    var mode = root.getAttribute("data-mode") === "dark" ? "dark" : "light";
    if (!id || id === "classic") return mode === "dark" ? "#1c1814" : "#f5eee3";
    return (BOOT_BG[id] && BOOT_BG[id][mode]) || "#111";
  }
  function bootRule(id){
    return 'html[data-style="' + id + '"] body{background:' + bootColor(id) + '}html[data-style] main,html[data-style] footer,html[data-style] #menu,html[data-style] .menu-btn{display:none!important}';
  }
  var styleBtn = document.getElementById("style-btn");
  var styleMenu = document.getElementById("style-menu");
  var styleSwitch = document.getElementById("style-switch");
  function themeMeta(id){
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", bootColor(id));
  }
  function markStyle(id){
    if (!styleMenu) return;
    styleMenu.querySelectorAll("[data-style-id]").forEach(function(li){
      var on = li.getAttribute("data-style-id") === id;
      li.setAttribute("aria-selected", on ? "true" : "false");
      li.tabIndex = on ? 0 : -1;
    });
    if (styleBtn) styleBtn.classList.toggle("on", id !== "classic");
  }
  function clearThemeFx(){
    themeLoadGen++;
    window.__themeToken = null;
    if (typeof window.__themeCleanup === "function"){
      try { window.__themeCleanup(); } catch (err) {}
      window.__themeCleanup = null;
    }
    document.querySelectorAll("[data-theme-root]").forEach(function(n){ n.remove(); });
    document.querySelectorAll("script[data-theme]").forEach(function(n){ n.remove(); });
  }
  function ensureThemeCss(id){
    var link = document.getElementById("theme-css");
    var href = "themes/" + id + ".css?" + ASSET;
    if (!link){
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.id = "theme-css";
      document.head.appendChild(link);
    }
    if (link.getAttribute("href") !== href) link.setAttribute("href", href);
  }
  var themeLoadGen = 0;
  function loadThemeJs(id){
    if (!THEME_JS[id]) return;
    var gen = ++themeLoadGen;
    var urls = ["themes/fields.js","themes/content.js","themes/engine.js","themes/" + id + ".js"];
    if (!window.CERT_CATALOG) urls.unshift("certs/catalog.js");
    function step(i){
      if (gen !== themeLoadGen) return;
      if (i >= urls.length) return;
      var sc = document.createElement("script");
      sc.src = urls[i] + "?" + ASSET;
      sc.setAttribute("data-theme", id);
      sc.onload = function(){ step(i + 1); };
      document.body.appendChild(sc);
    }
    step(0);
  }
  function applyStyle(id, save){
    if (!STYLE_OK[id]) id = "classic";
    clearThemeFx();
    var boot = document.getElementById("theme-boot");
    if (id === "classic"){
      root.removeAttribute("data-style");
      var link = document.getElementById("theme-css");
      if (link) link.remove();
      if (boot) boot.remove();
    } else {
      root.setAttribute("data-style", id);
      ensureThemeCss(id);
      if (!boot){
        boot = document.createElement("style");
        boot.id = "theme-boot";
        document.head.appendChild(boot);
      }
      boot.textContent = bootRule(id);
      loadThemeJs(id);
    }
    themeMeta(id);
    if (save){
      try { localStorage.setItem("style", id); } catch (err) {}
      try {
        var u = new URL(location.href);
        if (id === "classic") u.searchParams.delete("style");
        else u.searchParams.set("style", id);
        history.replaceState(null, "", u.pathname + u.search + u.hash);
      } catch (err) {}
    }
    markStyle(id);
  }
  var openedAt = 0;
  function placeMenu(){
    if (!styleMenu || styleMenu.hidden || !styleBtn) return;
    var r = styleBtn.getBoundingClientRect();
    var mw = Math.min(280, window.innerWidth - 16);
    styleMenu.style.width = mw + "px";
    var mh = styleMenu.offsetHeight || 280;
    var top = r.bottom + 8;
    if (top + mh > window.innerHeight - 8 && r.top > mh + 16) top = r.top - mh - 8;
    if (top < 8) top = 8;
    var left = root.dir === "rtl" ? r.left : r.right - mw;
    if (left < 8) left = 8;
    if (left + mw > window.innerWidth - 8) left = Math.max(8, window.innerWidth - 8 - mw);
    styleMenu.style.top = Math.round(top) + "px";
    styleMenu.style.left = Math.round(left) + "px";
    styleMenu.style.right = "auto";
  }
  function optionFrom(node){
    while (node && node !== styleMenu){
      if (node.getAttribute && node.getAttribute("data-style-id")) return node;
      node = node.parentNode;
    }
    return null;
  }
  function chooseStyle(li){
    if (!li || !li.getAttribute || !li.getAttribute("data-style-id")) return;
    applyStyle(li.getAttribute("data-style-id"), true);
    closeStyleMenu();
    try { styleBtn.focus({preventScroll:true}); } catch (err) {}
  }
  function openStyleMenu(fromKeyboard){
    if (!styleMenu) return;
    if (styleMenu.parentNode !== document.body) document.body.appendChild(styleMenu);
    styleMenu.hidden = false;
    styleBtn.setAttribute("aria-expanded", "true");
    placeMenu();
    openedAt = Date.now();
    if (fromKeyboard){
      var sel = styleMenu.querySelector('[aria-selected="true"]') || styleMenu.querySelector("[data-style-id]");
      if (sel){ try { sel.focus({preventScroll:true}); } catch (err) {} }
    }
  }
  function closeStyleMenu(){
    if (!styleMenu || styleMenu.hidden) return;
    styleMenu.hidden = true;
    styleBtn.setAttribute("aria-expanded", "false");
  }
  function toggleStyleMenu(fromKeyboard){
    if (styleMenu.hidden) openStyleMenu(fromKeyboard); else closeStyleMenu();
  }
  if (styleBtn && styleMenu){
    var touchToggle = false;
    try {
      styleBtn.addEventListener("touchend", function(e){
        e.preventDefault();
        touchToggle = true;
        toggleStyleMenu(false);
      }, {passive:false});
    } catch (err) {
      styleBtn.addEventListener("touchend", function(e){
        e.preventDefault();
        touchToggle = true;
        toggleStyleMenu(false);
      });
    }
    styleBtn.addEventListener("click", function(e){
      if (touchToggle){ touchToggle = false; e.preventDefault(); return; }
      toggleStyleMenu(false);
    });
    styleBtn.addEventListener("keydown", function(e){
      if (e.key === "ArrowDown" || e.key === "ArrowUp"){ e.preventDefault(); openStyleMenu(true); }
    });
    try {
      styleMenu.addEventListener("touchend", function(e){
        var li = optionFrom(e.target);
        if (!li) return;
        e.preventDefault();
        chooseStyle(li);
      }, {passive:false});
    } catch (err) {
      styleMenu.addEventListener("touchend", function(e){
        var li = optionFrom(e.target);
        if (!li) return;
        e.preventDefault();
        chooseStyle(li);
      });
    }
    styleMenu.addEventListener("click", function(e){
      var li = optionFrom(e.target);
      if (!li) return;
      chooseStyle(li);
    });
    styleMenu.addEventListener("keydown", function(e){
      var items = [].slice.call(styleMenu.querySelectorAll("[data-style-id]"));
      var i = items.indexOf(document.activeElement);
      if (e.key === "Escape"){ e.preventDefault(); closeStyleMenu(); styleBtn.focus(); }
      if (e.key === "ArrowDown"){ e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === "ArrowUp"){ e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      if (e.key === "Home"){ e.preventDefault(); items[0].focus(); }
      if (e.key === "End"){ e.preventDefault(); items[items.length - 1].focus(); }
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        chooseStyle(document.activeElement);
      }
    });
    document.addEventListener("click", function(e){
      if (!styleMenu || styleMenu.hidden) return;
      if (Date.now() - openedAt < 450) return;
      var t = e.target;
      if ((styleBtn && styleBtn.contains(t)) || styleMenu.contains(t)) return;
      closeStyleMenu();
    });
    window.addEventListener("resize", placeMenu);
    window.addEventListener("scroll", placeMenu, true);
    var initial = root.getAttribute("data-style");
    if (!STYLE_OK[initial]) initial = "classic";
    markStyle(initial);
    themeMeta(initial);
    if (initial !== "classic") loadThemeJs(initial);
  }

  // Reveal on scroll with a gentle stagger.
  // If IntersectionObserver is missing or throws (some TV browsers), show every section.
  var els = [].slice.call(document.querySelectorAll(".reveal"));
  function showReveals(){
    var i;
    for (i = 0; i < els.length; i++) els[i].classList.add("in");
  }
  if ("IntersectionObserver" in window && !reduce) {
    try {
      var io = new IntersectionObserver(function(es){
        var k = 0;
        var list = es || [];
        var j;
        for (j = 0; j < list.length; j++) {
          var e = list[j];
          if (!e || !e.isIntersecting) continue;
          (function(el, delay){
            el.style.transitionDelay = delay + "ms";
            el.classList.add("in");
            setTimeout(function(){ el.style.transitionDelay = ""; }, 1200);
            io.unobserve(el);
          })(e.target, (k++ % 4) * 80);
        }
      }, {threshold: .08, rootMargin: "0px 0px -40px 0px"});
      var ri;
      for (ri = 0; ri < els.length; ri++) io.observe(els[ri]);
    } catch (err) {
      showReveals();
    }
  } else showReveals();

  // Lightbox (homepage). Missing on pages that ship their own viewer.
  var lb = document.getElementById("lightbox");
  var lbOpen = function(){};
  if (lb) {
    var lbImg = lb.querySelector("img"), lbCap = lb.querySelector("p"), lbSet = [], lbI = 0, lastFocus;
    function lbShow(){ var it = lbSet[lbI]; var alt = typeof it.alt === "function" ? it.alt() : (it.alt || ""); lbImg.src = it.src; lbImg.alt = alt; lbCap.textContent = alt; var m = lbSet.length > 1; lb.querySelector(".lp").hidden = !m; lb.querySelector(".ln").hidden = !m; }
    lbOpen = function(set, i){ lbSet = set; lbI = i; lastFocus = document.activeElement; lbShow(); lb.classList.add("open"); document.body.style.overflow = "hidden"; lb.querySelector(".x").focus(); };
    function lbClose(){ lb.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
    function lbStep(d){ lbI = (lbI + d + lbSet.length) % lbSet.length; lbShow(); }
    lb.querySelector(".x").onclick = lbClose; lb.querySelector(".lp").onclick = function(){ lbStep(-1); }; lb.querySelector(".ln").onclick = function(){ lbStep(1); };
    lb.addEventListener("click", function(e){ if (e.target === lb) lbClose(); });
    document.addEventListener("keydown", function(e){ if (!lb.classList.contains("open")) return; if (e.key === "Escape") lbClose(); if (e.key === "ArrowLeft") lbStep(-1); if (e.key === "ArrowRight") lbStep(1); });
  }

  // Project galleries (images listed in data-images JSON). Empty list keeps the illustrated placeholder.
  function esc(s){ var d = document.createElement("div"); d.textContent = s || ""; return d.innerHTML; }
  document.querySelectorAll(".project .media").forEach(function(media){
    var imgs = []; try { imgs = JSON.parse(media.getAttribute("data-images") || "[]"); } catch(e){}
    var main = media.querySelector(".main");
    if (!imgs.length) { media.classList.add("empty"); return; }
    media.classList.add("has-images");
    var big = document.createElement("img"); big.decoding = "async"; main.appendChild(big);
    var count = document.createElement("span"); count.className = "count"; count.dir = "ltr"; count.setAttribute("aria-hidden", "true"); main.appendChild(count);
    var zoom = document.createElement("span"); zoom.className = "zoom"; zoom.setAttribute("aria-hidden", "true"); zoom.innerHTML = "&#10530;"; main.appendChild(zoom);
    main.setAttribute("role", "button"); main.tabIndex = 0; main.setAttribute("aria-label", "Open screenshot");
    var cap = document.createElement("p"); cap.className = "shot-cap"; cap.setAttribute("aria-live", "polite"); media.appendChild(cap);
    var thumbs = document.createElement("div"); thumbs.className = "thumbs"; var cur = 0;
    var set = imgs.map(function(im){ return {src: im.src, alt: function(){ return isAr() ? (im.cap_ar || im.alt_ar || im.alt) : (im.cap || im.alt); }}; });
    function show(i){
      cur = i; var im = imgs[i];
      big.src = im.src; big.alt = isAr() ? (im.alt_ar || im.alt || "") : (im.alt || "");
      cap.innerHTML = '<span class="l-en" lang="en">' + esc(im.cap) + '</span><span class="l-ar" lang="ar">' + esc(im.cap_ar || im.cap) + '</span>';
      count.textContent = (i + 1) + " / " + imgs.length;
      thumbs.querySelectorAll("button").forEach(function(b, j){ b.setAttribute("aria-current", j === i); });
    }
    if (imgs.length > 1) {
      imgs.forEach(function(im, i){ var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Screenshot " + (i + 1)); var t = document.createElement("img"); t.src = im.src; t.alt = ""; t.loading = "lazy"; b.appendChild(t); b.onclick = function(){ show(i); }; thumbs.appendChild(b); });
      media.appendChild(thumbs);
    }
    show(0);
    langListeners.push(function(){ show(cur); });
    main.addEventListener("click", function(){ lbOpen(set, cur); });
    main.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " ") { e.preventDefault(); lbOpen(set, cur); } });
  });

  // Certificates carousel (works in LTR and RTL)
  var car = document.querySelector(".carousel");
  if (car) {
    var track = car.querySelector(".track"), slides = [].slice.call(track.children), dots = car.querySelector(".dots"), n = slides.length, i = 0, timer = null, paused = reduce, toggle = car.querySelector(".cr-ctrl button");
    var certSet = slides.map(function(s){ var im = s.querySelector("img"); return {src: im.getAttribute("src"), alt: function(){ return im.alt; }}; });
    slides.forEach(function(s, k){
      s.setAttribute("role", "group"); s.setAttribute("aria-roledescription", "slide"); s.setAttribute("aria-label", (k + 1) + " / " + n);
      var d = document.createElement("button"); d.type = "button"; d.setAttribute("aria-label", "Certificate " + (k + 1)); d.onclick = function(){ go(k); start(); }; dots.appendChild(d);
      var box = s.querySelector(".img"); box.tabIndex = 0; box.setAttribute("role", "button"); box.setAttribute("aria-label", "Enlarge");
      box.addEventListener("click", function(){ lbOpen(certSet, k); });
      box.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " ") { e.preventDefault(); lbOpen(certSet, k); } });
    });
    function go(k){
      i = (k + n) % n;
      var sign = root.dir === "rtl" ? 1 : -1;
      track.style.transform = "translateX(" + (sign * 100 * i) + "%)";
      [].forEach.call(dots.children, function(d, j){ d.setAttribute("aria-current", j === i); });
      slides.forEach(function(s, j){ s.setAttribute("aria-hidden", j !== i); s.querySelectorAll("a,[tabindex]").forEach(function(a){ a.tabIndex = j === i ? 0 : -1; }); });
    }
    function label(){ if (!toggle) return; var l = isAr() ? "ar" : "en"; toggle.textContent = toggle.getAttribute(paused ? "data-play-" + l : "data-pause-" + l); }
    function stop(){ clearInterval(timer); timer = null; }
    function start(){ stop(); if (!paused) timer = setInterval(function(){ go(i + 1); }, 4500); }
    car.querySelector(".prev").onclick = function(){ go(i - 1); start(); };
    car.querySelector(".next").onclick = function(){ go(i + 1); start(); };
    car.addEventListener("mouseenter", stop); car.addEventListener("mouseleave", start);
    car.addEventListener("focusin", stop); car.addEventListener("focusout", start);
    car.addEventListener("keydown", function(e){
      var rtl = root.dir === "rtl";
      if (e.key === "ArrowLeft") go(i + (rtl ? 1 : -1));
      if (e.key === "ArrowRight") go(i + (rtl ? -1 : 1));
    });
    if (toggle) toggle.onclick = function(){ paused = !paused; label(); paused ? stop() : start(); };
    var x0 = null, y0 = null, vp = car.querySelector(".viewport");
    vp.addEventListener("touchstart", function(e){ x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; stop(); }, {passive: true});
    vp.addEventListener("touchend", function(e){
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { var fwd = dx < 0; if (root.dir === "rtl") fwd = !fwd; go(i + (fwd ? 1 : -1)); }
      x0 = null; start();
    });
    document.addEventListener("visibilitychange", function(){ document.hidden ? stop() : start(); });
    langListeners.push(function(){ track.style.transition = "none"; go(i); track.offsetHeight; track.style.transition = ""; label(); });
    go(0); label(); start();
  }

  // Contact form (FormSubmit): return here with a thank-you note
  var form = document.getElementById("contact-form");
  if (form) {
    var next = form.querySelector('input[name="_next"]');
    if (next && /^https?:/.test(location.protocol)) next.value = location.href.split("#")[0].split("?")[0] + "?sent=1#contact";
    if (/[?&]sent=1/.test(location.search)) document.getElementById("thanks").classList.add("show");
  }

  function modeLabel(mode){
    var toDark = mode !== "dark";
    if (isAr()) return toDark ? "التبديل إلى الوضع الداكن" : "التبديل إلى الوضع الفاتح";
    return toDark ? "Switch to dark mode" : "Switch to light mode";
  }
  function applyMode(mode, save){
    if (mode !== "dark" && mode !== "light") mode = "light";
    root.setAttribute("data-mode", mode);
    var mb = document.getElementById("mode-btn");
    if (mb) mb.setAttribute("aria-label", modeLabel(mode));
    if (save) { try { localStorage.setItem("color", mode); } catch (e) {} }
    var id = root.getAttribute("data-style");
    themeMeta(id || "classic");
    var boot = document.getElementById("theme-boot");
    if (boot && id) boot.textContent = bootRule(id);
  }
  var modeBtn = document.getElementById("mode-btn");
  if (modeBtn) modeBtn.addEventListener("click", function(){
    applyMode(root.getAttribute("data-mode") === "dark" ? "light" : "dark", true);
  });
  if (window.matchMedia){
    var scheme = window.matchMedia("(prefers-color-scheme: dark)");
    var onScheme = function(){
      try { if (localStorage.getItem("color")) return; } catch (e) {}
      applyMode(scheme.matches ? "dark" : "light", false);
    };
    if (scheme.addEventListener) scheme.addEventListener("change", onScheme);
    else if (scheme.addListener) scheme.addListener(onScheme);
  }

  window.Portfolio = { onLang: function(fn){ langListeners.push(fn); } };
  applyLang(isAr() ? "ar" : "en", false);
})();
