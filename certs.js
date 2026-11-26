(function(){
  "use strict";
  var root = document.documentElement;
  var data = window.CERT_CATALOG || [];
  var rowsEl = document.getElementById("cert-rows");
  if (!rowsEl || !data.length || !window.CertFields) return;
  var search = document.getElementById("cert-search");
  var emptyEl = document.getElementById("cert-empty");
  var countEl = document.getElementById("cert-count");
  var lb = document.getElementById("cert-lb");
  var lbImg = lb.querySelector("img");
  var info = document.getElementById("cert-info");
  var mode = "field";
  var query = "";
  var flat = [];
  var lbI = 0;
  var lastFocus = null;

  function isAr(){ return root.lang === "ar"; }
  function t(obj){ return obj ? (isAr() ? obj.ar : obj.en) : ""; }
  function countPhrase(n){
    if (isAr()){
      if (n === 0) return "لا توجد شهادات";
      if (n === 1) return "شهادة واحدة";
      if (n === 2) return "شهادتان";
      if (n >= 3 && n <= 10) return n + " شهادات";
      return n + " شهادة";
    }
    if (n === 1) return "1 certificate";
    return n + " certificates";
  }
  function hay(item){
    return (item.title.en + " " + item.title.ar + " " + item.issuer.en + " " + item.issuer.ar + " " + (item.about ? item.about.en + " " + item.about.ar : "")).toLowerCase();
  }
  function visible(){
    var q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(function(item){ return hay(item).indexOf(q) !== -1; });
  }
  function bi(en, ar){
    var s = document.createElement("span");
    s.innerHTML = '<span class="l-en" lang="en"></span><span class="l-ar" lang="ar"></span>';
    s.querySelector(".l-en").textContent = en;
    s.querySelector(".l-ar").textContent = ar;
    return s;
  }
  function render(){
    var pool = visible();
    flat = [];
    rowsEl.textContent = "";
    if (countEl) countEl.textContent = countPhrase(pool.length);
    if (emptyEl) emptyEl.hidden = pool.length !== 0;
    var groups = window.CertFields.group(pool, mode);
    groups.forEach(function(g){
      var sec = document.createElement("section");
      sec.className = "cert-row";
      sec.id = "row-" + mode + "-" + g.id;
      var h = document.createElement("h2");
      h.appendChild(bi(g.en, g.ar));
      var n = document.createElement("span");
      n.className = "n";
      n.textContent = String(g.items.length);
      h.appendChild(n);
      var rail = document.createElement("div");
      rail.className = "rail";
      rail.setAttribute("tabindex", "0");
      g.items.forEach(function(item){
        var i = flat.length;
        flat.push(item);
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cert-card";
        var img = document.createElement("img");
        img.src = item.thumb;
        img.alt = t(item.title);
        img.loading = "lazy";
        img.decoding = "async";
        var meta = document.createElement("span");
        meta.className = "meta";
        var title = document.createElement("strong");
        title.appendChild(bi(item.title.en, item.title.ar));
        var iss = document.createElement("span");
        iss.className = "iss";
        iss.appendChild(bi(item.issuer.en, item.issuer.ar));
        meta.appendChild(title);
        meta.appendChild(iss);
        btn.appendChild(img);
        btn.appendChild(meta);
        btn.addEventListener("click", function(){ openLb(i); });
        rail.appendChild(btn);
      });
      sec.appendChild(h);
      sec.appendChild(rail);
      rowsEl.appendChild(sec);
    });
    if (lb.classList.contains("open")){
      if (!flat.length) closeLb();
      else { if (lbI >= flat.length) lbI = 0; showLb(); }
    }
  }
  function setMode(next){
    mode = next;
    document.getElementById("group-field").setAttribute("aria-pressed", next === "field" ? "true" : "false");
    document.getElementById("group-issuer").setAttribute("aria-pressed", next === "issuer" ? "true" : "false");
    render();
  }
  function fillInfo(item){
    info.textContent = "";
    var h = document.createElement("h3");
    h.textContent = t(item.title);
    var desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = t(item.about);
    var dl = document.createElement("dl");
    function row(en, ar, value){
      if (!value) return;
      var wrap = document.createElement("div");
      var dt = document.createElement("dt");
      dt.appendChild(bi(en, ar));
      var dd = document.createElement("dd");
      dd.textContent = value;
      wrap.appendChild(dt);
      wrap.appendChild(dd);
      dl.appendChild(wrap);
    }
    row("Issuer", "الجهة", t(item.issuer));
    row("Field", "المجال", window.CertFields.label("field", item.field, isAr()));
    if (item.date) row("Date", "التاريخ", t(item.date));
    if (item.score) row("Score", "الدرجة", t(item.score));
    info.appendChild(h);
    info.appendChild(desc);
    info.appendChild(dl);
    if (item.file){
      var a = document.createElement("a");
      a.className = "file";
      a.href = item.file;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.appendChild(bi("Original file", "الملف الأصلي"));
      info.appendChild(a);
    }
  }
  function showLb(){
    var item = flat[lbI];
    if (!item) return;
    lbImg.src = item.full;
    lbImg.alt = t(item.title);
    fillInfo(item);
    var many = flat.length > 1;
    lb.querySelector(".lp").hidden = !many;
    lb.querySelector(".ln").hidden = !many;
  }
  function openLb(i){
    lbI = i;
    lastFocus = document.activeElement;
    showLb();
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".x").focus();
  }
  function closeLb(){
    if (!lb.classList.contains("open")) return;
    lb.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function step(d){
    if (flat.length < 2) return;
    lbI = (lbI + d + flat.length) % flat.length;
    showLb();
  }
  document.getElementById("group-field").addEventListener("click", function(){ setMode("field"); });
  document.getElementById("group-issuer").addEventListener("click", function(){ setMode("issuer"); });
  if (search) search.addEventListener("input", function(){ query = search.value; render(); });
  lb.querySelector(".x").addEventListener("click", closeLb);
  lb.querySelector(".lp").addEventListener("click", function(){ step(-1); });
  lb.querySelector(".ln").addEventListener("click", function(){ step(1); });
  lb.addEventListener("click", function(e){ if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function(e){
    if (!lb.classList.contains("open")) return;
    var rtl = root.dir === "rtl";
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight"){ e.preventDefault(); step(rtl ? -1 : 1); }
    if (e.key === "ArrowLeft"){ e.preventDefault(); step(rtl ? 1 : -1); }
  });
  if (window.Portfolio && window.Portfolio.onLang){
    window.Portfolio.onLang(function(){ render(); if (lb.classList.contains("open")) showLb(); });
  }
  var hash = (location.hash || "").replace("#", "");
  if (hash.indexOf("issuer-") === 0) setMode("issuer");
  else render();
  if (hash){
    var target = document.getElementById("row-" + (hash.indexOf("issuer-") === 0 ? "issuer" : "field") + "-" + hash.replace(/^field-|^issuer-/, ""));
    if (target) target.scrollIntoView();
  }
})();
