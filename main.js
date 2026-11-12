(function(){
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function isAr(){ return root.lang === "ar"; }
  var TITLES = {
    en: "Azzam Alzahrani | Computer Science Graduate, Cybersecurity and AI",
    ar: "عزام الزهراني | خريج علوم الحاسب، الأمن السيبراني والذكاء الاصطناعي"
  };
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

  // Reveal on scroll with a gentle stagger
  var els = [].slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function(es){
      var k = 0;
      es.forEach(function(e){ if (e.isIntersecting){ var el = e.target; el.style.transitionDelay = (k++ % 4) * 80 + "ms"; el.classList.add("in"); setTimeout(function(){ el.style.transitionDelay = ""; }, 1200); io.unobserve(el); } });
    }, {threshold: .08, rootMargin: "0px 0px -40px 0px"});
    els.forEach(function(el){ io.observe(el); });
  } else els.forEach(function(el){ el.classList.add("in"); });

  // Lightbox
  var lb = document.getElementById("lightbox"), lbImg = lb.querySelector("img"), lbCap = lb.querySelector("p"), lbSet = [], lbI = 0, lastFocus;
  function lbShow(){ var it = lbSet[lbI]; var alt = typeof it.alt === "function" ? it.alt() : (it.alt || ""); lbImg.src = it.src; lbImg.alt = alt; lbCap.textContent = alt; var m = lbSet.length > 1; lb.querySelector(".lp").hidden = !m; lb.querySelector(".ln").hidden = !m; }
  function lbOpen(set, i){ lbSet = set; lbI = i; lastFocus = document.activeElement; lbShow(); lb.classList.add("open"); document.body.style.overflow = "hidden"; lb.querySelector(".x").focus(); }
  function lbClose(){ lb.classList.remove("open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  function lbStep(d){ lbI = (lbI + d + lbSet.length) % lbSet.length; lbShow(); }
  lb.querySelector(".x").onclick = lbClose; lb.querySelector(".lp").onclick = function(){ lbStep(-1); }; lb.querySelector(".ln").onclick = function(){ lbStep(1); };
  lb.addEventListener("click", function(e){ if (e.target === lb) lbClose(); });
  document.addEventListener("keydown", function(e){ if (!lb.classList.contains("open")) return; if (e.key === "Escape") lbClose(); if (e.key === "ArrowLeft") lbStep(-1); if (e.key === "ArrowRight") lbStep(1); });

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

  applyLang(isAr() ? "ar" : "en", false);
})();
