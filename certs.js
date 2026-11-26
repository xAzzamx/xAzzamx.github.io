(function(){
  "use strict";
  var root = document.documentElement;
  var data = window.CERT_CATALOG || [];
  var page = document.getElementById("cert-page");
  if (!page || !data.length) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GROUPS = ["doroob", "sdaia", "nvidia", "ibm", "tuwaiq", "other"];
  var GROUP_META = {
    doroob: {en: "Doroob (HRDF)", ar: "دروب (هدف)"},
    sdaia: {en: "SDAIA", ar: "سدايا"},
    nvidia: {en: "NVIDIA", ar: "NVIDIA"},
    ibm: {en: "IBM", ar: "IBM"},
    tuwaiq: {en: "Tuwaiq", ar: "طويق"},
    other: {en: "Other", ar: "أخرى"}
  };
  var filters = document.getElementById("cert-filters");
  var search = document.getElementById("cert-search");
  var stage = document.getElementById("cf-stage");
  var countEl = document.getElementById("cf-count");
  var groupsEl = document.getElementById("cert-groups");
  var emptyEl = document.getElementById("cert-empty");
  var flowEl = document.getElementById("cert-flow");
  var totalEl = document.getElementById("cert-count");
  var lb = document.getElementById("cert-lb");
  var lbImg = lb.querySelector("img");
  var lbCap = lb.querySelector("p");
  var group = "all";
  var query = "";
  var filtered = data.slice();
  var index = 0;
  var lbI = 0;
  var lastFocus = null;
  var resizeT = 0;

  function isAr(){ return root.lang === "ar"; }
  function t(obj){ return isAr() ? obj.ar : obj.en; }
  function hay(item){
    return (item.title.en + " " + item.title.ar + " " + item.issuer.en + " " + item.issuer.ar).toLowerCase();
  }
  function searched(){
    var q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(function(item){ return hay(item).indexOf(q) !== -1; });
  }
  function countPhrase(n){
    if (isAr()){
      if (n === 0) return "لا توجد شهادات";
      if (n === 1) return "شهادة واحدة";
      if (n === 2) return "شهادتان";
      if (n >= 3 && n <= 10) return n + " شهادات";
      return n + " شهادة";
    }
    if (n === 0) return "No certificates";
    if (n === 1) return "1 certificate";
    return n + " certificates";
  }
  function labelNav(){
    var prev = document.getElementById("cf-prev");
    var next = document.getElementById("cf-next");
    if (prev) prev.setAttribute("aria-label", isAr() ? "الشهادة السابقة" : "Previous certificate");
    if (next) next.setAttribute("aria-label", isAr() ? "الشهادة التالية" : "Next certificate");
    lb.querySelector(".x").setAttribute("aria-label", isAr() ? "إغلاق" : "Close");
    lb.querySelector(".lp").setAttribute("aria-label", isAr() ? "الشهادة السابقة" : "Previous certificate");
    lb.querySelector(".ln").setAttribute("aria-label", isAr() ? "الشهادة التالية" : "Next certificate");
    if (filters) filters.setAttribute("aria-label", isAr() ? "تصفية حسب الجهة" : "Filter by issuer");
    if (search) search.setAttribute("aria-label", isAr() ? "بحث في الشهادات" : "Search certificates");
  }
  function bi(en, ar, className){
    var span = document.createElement("span");
    if (className) span.className = className;
    span.innerHTML = '<span class="l-en" lang="en"></span><span class="l-ar" lang="ar"></span>';
    span.querySelector(".l-en").textContent = en;
    span.querySelector(".l-ar").textContent = ar;
    return span;
  }
  function arm(img){
    var src = img.getAttribute("data-src");
    if (src && img.getAttribute("src") !== src) img.setAttribute("src", src);
  }
  function layout(){
    var cards = stage.querySelectorAll(".cf-card");
    var n = cards.length;
    var vw = window.innerWidth || 1200;
    var cardW = Math.min(440, vw * 0.66);
    var gap = Math.round(cardW * 0.82);
    var sign = root.dir === "rtl" ? -1 : 1;
    cards.forEach(function(card, i){
      var d = i - index;
      var ad = Math.abs(d);
      var far = ad > 3;
      card.style.visibility = far ? "hidden" : "visible";
      card.style.pointerEvents = far ? "none" : "auto";
      card.classList.toggle("is-active", d === 0);
      card.setAttribute("aria-hidden", far ? "true" : "false");
      card.tabIndex = d === 0 ? 0 : -1;
      if (far) {
        card.style.transform = "translate(-50%, -50%)";
        card.style.opacity = "0";
        card.style.zIndex = "0";
      } else {
        var x = d * gap * sign;
        var rot = reduce ? 0 : Math.max(-46, Math.min(46, d * 32 * sign));
        var z = reduce ? 0 : -ad * 90;
        var sc = d === 0 ? 1 : 0.78;
        card.style.transform = "translate(-50%, -50%) translateX(" + x + "px) translateZ(" + z + "px) rotateY(" + rot + "deg) scale(" + sc + ")";
        card.style.opacity = String(1 - ad * 0.12);
        card.style.zIndex = String(30 - ad);
        arm(card.querySelector("img"));
      }
    });
    if (countEl) countEl.textContent = n ? ((index + 1) + " / " + n) : "0 / 0";
    var prev = document.getElementById("cf-prev");
    var next = document.getElementById("cf-next");
    if (prev) prev.disabled = n < 2;
    if (next) next.disabled = n < 2;
  }
  function renderFlow(){
    stage.textContent = "";
    var frag = document.createDocumentFragment();
    filtered.forEach(function(item, i){
      var fig = document.createElement("figure");
      fig.className = "cf-card";
      fig.setAttribute("role", "button");
      fig.setAttribute("data-i", String(i));
      fig.tabIndex = 0;
      var img = document.createElement("img");
      img.alt = t(item.title);
      img.setAttribute("data-alt-en", item.title.en + ", " + item.issuer.en);
      img.setAttribute("data-alt-ar", item.title.ar + "، " + item.issuer.ar);
      img.setAttribute("data-src", item.thumb);
      img.decoding = "async";
      var cap = document.createElement("figcaption");
      var h = document.createElement("h3");
      h.appendChild(bi(item.title.en, item.title.ar));
      var p = document.createElement("p");
      p.appendChild(bi(item.issuer.en, item.issuer.ar));
      cap.appendChild(h);
      cap.appendChild(p);
      fig.appendChild(img);
      fig.appendChild(cap);
      fig.addEventListener("click", function(){
        var n = Number(fig.getAttribute("data-i"));
        if (n === index) openLb(n);
        else { index = n; layout(); }
      });
      fig.addEventListener("keydown", function(e){
        if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openLb(Number(fig.getAttribute("data-i"))); }
      });
      frag.appendChild(fig);
    });
    stage.appendChild(frag);
  }
  function renderGrid(){
    groupsEl.textContent = "";
    var buckets = {};
    filtered.forEach(function(item, i){
      (buckets[item.group] || (buckets[item.group] = [])).push({item: item, i: i});
    });
    var frag = document.createDocumentFragment();
    GROUPS.forEach(function(id){
      var list = buckets[id];
      if (!list || !list.length) return;
      var sec = document.createElement("section");
      sec.className = "cert-group";
      sec.id = "group-" + id;
      var h = document.createElement("h2");
      h.appendChild(bi(GROUP_META[id].en, GROUP_META[id].ar));
      var n = document.createElement("span");
      n.className = "n";
      n.textContent = String(list.length);
      h.appendChild(n);
      var grid = document.createElement("div");
      grid.className = "cert-grid";
      list.forEach(function(entry){
        var item = entry.item;
        var btn = document.createElement("div");
        btn.className = "cert-card";
        btn.setAttribute("role", "button");
        btn.tabIndex = 0;
        btn.setAttribute("data-i", String(entry.i));
        var img = document.createElement("img");
        img.src = item.thumb;
        img.alt = t(item.title);
        img.setAttribute("data-alt-en", item.title.en + ", " + item.issuer.en);
        img.setAttribute("data-alt-ar", item.title.ar + "، " + item.issuer.ar);
        img.loading = "lazy";
        img.decoding = "async";
        var meta = document.createElement("div");
        meta.className = "meta";
        var date = document.createElement("span");
        date.className = "pill";
        date.appendChild(bi(item.date.en, item.date.ar));
        var title = document.createElement("h3");
        title.appendChild(bi(item.title.en, item.title.ar));
        var iss = document.createElement("span");
        iss.className = "iss";
        iss.appendChild(bi(item.issuer.en, item.issuer.ar));
        meta.appendChild(date);
        meta.appendChild(title);
        meta.appendChild(iss);
        btn.appendChild(img);
        btn.appendChild(meta);
        function openCard(){
          index = Number(btn.getAttribute("data-i"));
          layout();
          openLb(index);
        }
        btn.addEventListener("click", openCard);
        btn.addEventListener("keydown", function(e){
          if (e.key === "Enter" || e.key === " "){ e.preventDefault(); openCard(); }
        });
        grid.appendChild(btn);
      });
      sec.appendChild(h);
      sec.appendChild(grid);
      frag.appendChild(sec);
    });
    groupsEl.appendChild(frag);
  }
  function updateBadges(pool){
    var counts = {all: pool.length};
    pool.forEach(function(item){ counts[item.group] = (counts[item.group] || 0) + 1; });
    filters.querySelectorAll(".fcount").forEach(function(el){
      var id = el.getAttribute("data-for");
      el.textContent = String(counts[id] || 0);
    });
  }
  function apply(){
    var pool = searched();
    updateBadges(pool);
    filtered = group === "all" ? pool : pool.filter(function(item){ return item.group === group; });
    if (index >= filtered.length) index = 0;
    renderFlow();
    renderGrid();
    if (totalEl) totalEl.textContent = countPhrase(filtered.length);
    if (emptyEl) emptyEl.hidden = filtered.length !== 0;
    if (flowEl) flowEl.hidden = filtered.length === 0;
    layout();
    if (lb.classList.contains("open")) closeLb();
  }
  function showLb(){
    var item = filtered[lbI];
    if (!item) return;
    lbImg.src = item.full;
    lbImg.alt = t(item.title);
    lbCap.textContent = "";
    var strong = document.createElement("strong");
    strong.textContent = t(item.title);
    var meta = document.createElement("span");
    meta.textContent = t(item.issuer) + "  ·  " + t(item.date);
    lbCap.appendChild(strong);
    lbCap.appendChild(meta);
    if (item.verify){
      var a = document.createElement("a");
      a.href = item.verify;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = isAr() ? "تحقق من الشهادة" : "Verify credential";
      lbCap.appendChild(a);
    }
    if (item.pdf){
      var pdf = document.createElement("a");
      pdf.href = item.pdf;
      pdf.target = "_blank";
      pdf.rel = "noopener noreferrer";
      pdf.textContent = isAr() ? "فتح PDF" : "Open PDF";
      lbCap.appendChild(pdf);
    }
    var many = filtered.length > 1;
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
  function stepLb(d){
    if (filtered.length < 2) return;
    lbI = (lbI + d + filtered.length) % filtered.length;
    index = lbI;
    showLb();
    layout();
  }
  function stepFlow(d){
    if (filtered.length < 2) return;
    index = (index + d + filtered.length) % filtered.length;
    layout();
  }

  filters.addEventListener("click", function(e){
    var node = e.target;
    var btn = null;
    while (node && node !== filters){
      if (node.getAttribute && node.getAttribute("data-group")){ btn = node; break; }
      node = node.parentNode;
    }
    if (!btn) return;
    group = btn.getAttribute("data-group");
    filters.querySelectorAll("button[data-group]").forEach(function(b){
      b.setAttribute("aria-pressed", b === btn ? "true" : "false");
    });
    index = 0;
    apply();
  });
  search.addEventListener("input", function(){
    query = search.value;
    index = 0;
    apply();
  });
  document.getElementById("cf-prev").addEventListener("click", function(){ stepFlow(-1); });
  document.getElementById("cf-next").addEventListener("click", function(){ stepFlow(1); });
  stage.addEventListener("keydown", function(e){
    if (lb.classList.contains("open")) return;
    var rtl = root.dir === "rtl";
    if (e.key === "ArrowRight"){ e.preventDefault(); stepFlow(rtl ? -1 : 1); }
    if (e.key === "ArrowLeft"){ e.preventDefault(); stepFlow(rtl ? 1 : -1); }
  });
  var x0 = null;
  stage.addEventListener("touchstart", function(e){ x0 = e.touches[0].clientX; }, {passive:true});
  stage.addEventListener("touchend", function(e){
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40){
      var fwd = dx < 0;
      if (root.dir === "rtl") fwd = !fwd;
      stepFlow(fwd ? 1 : -1);
    }
    x0 = null;
  });
  lb.querySelector(".x").addEventListener("click", closeLb);
  lb.querySelector(".lp").addEventListener("click", function(){ stepLb(-1); });
  lb.querySelector(".ln").addEventListener("click", function(){ stepLb(1); });
  lb.addEventListener("click", function(e){ if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function(e){
    if (!lb.classList.contains("open")) return;
    var rtl = root.dir === "rtl";
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight"){ e.preventDefault(); stepLb(rtl ? -1 : 1); }
    if (e.key === "ArrowLeft"){ e.preventDefault(); stepLb(rtl ? 1 : -1); }
  });
  window.addEventListener("resize", function(){
    if (resizeT) cancelAnimationFrame(resizeT);
    resizeT = requestAnimationFrame(layout);
  });
  if (window.Portfolio && window.Portfolio.onLang){
    window.Portfolio.onLang(function(){
      labelNav();
      if (totalEl) totalEl.textContent = countPhrase(filtered.length);
      layout();
      if (lb.classList.contains("open")) showLb();
    });
  }
  labelNav();
  apply();
})();
