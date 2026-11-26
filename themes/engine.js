(function(){
  "use strict";
  var views = {};
  var current = null;
  var E = window.ThemeEngine = {};
  E.reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  E.page = document.body.classList.contains("page-certs") ? "certs" : "home";
  E.site = window.SITE;
  function isAr(){ return document.documentElement.lang === "ar"; }
  E.isAr = isAr;
  E.t = function(o){ return !o ? "" : (isAr() ? o.ar : o.en); };
  E.h = function(tag, cls, text){
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  E.add = function(parent, node){ if (node) parent.appendChild(node); return node; };
  E.bi = function(en, ar, tag){
    var n = document.createElement(tag || "span");
    var a = E.h("span", "l-en", en); a.lang = "en";
    var b = E.h("span", "l-ar", ar); b.lang = "ar";
    n.appendChild(a); n.appendChild(b);
    return n;
  };
  E.groups = function(mode){
    var cat = window.CERT_CATALOG || [];
    if (!window.CertFields) return [];
    return window.CertFields.group(cat, mode || "field");
  };
  E.count = function(){ return (window.CERT_CATALOG || []).length; };
  E.certsHref = function(hash){
    var base = E.page === "certs" ? "certificates.html" : "certificates.html";
    return hash ? base + hash : base;
  };

  var sheet = document.createElement("style");
  sheet.setAttribute("data-theme-root", "");
  sheet.textContent = ".xv{position:fixed;inset:0;z-index:480;background:rgba(8,8,12,.9);display:flex;align-items:center;justify-content:center;padding:16px}.xv-layout{display:flex;flex-direction:row;align-items:stretch;gap:16px;width:min(1100px,96vw);max-width:96vw;max-height:90vh;min-width:0}.xv-layout img{flex:1 1 0;min-width:0;width:0;max-width:100%;height:auto;max-height:90vh;object-fit:contain;background:#fff}.xv-info{flex:0 0 300px;width:300px;max-width:34vw;overflow:auto;padding:16px 16px 20px;border-radius:14px;text-align:start;background:var(--surface,#fffaf2);color:var(--text,#2f2a25);border:1px solid var(--border,transparent)}.xv-info h3{margin:0 0 8px;font-size:1.15rem;color:var(--text,#2f2a25)}.xv-info .desc{margin:0 0 12px;line-height:1.5;color:var(--text-muted,#4a433b)}.xv-info dt{font-size:.75rem;font-weight:700;color:var(--text-muted,#6f655a)}.xv-info dd{margin:0 0 8px;font-weight:650;color:var(--text,#2f2a25)}.xv-x{position:absolute;top:14px;inset-inline-end:14px;background:var(--surface,#fffaf2);color:var(--text,#2f2a25);border:1px solid var(--border,transparent);border-radius:12px;width:42px;height:42px;cursor:pointer;font-size:1.2rem}.xv a.file{font-weight:700;color:var(--accent,#a5502f)}@media(max-width:800px){.xv-layout{flex-direction:column;overflow:auto;max-height:92vh}.xv-layout img{width:100%;max-height:46vh}.xv-info{flex:none;width:100%;max-width:none}}";
  document.head.appendChild(sheet);

  var viewer, vList, vI;
  function paintViewer(){
    var item = vList[vI];
    var img = viewer.querySelector("img");
    var info = viewer.querySelector(".xv-info");
    img.src = item.full;
    img.alt = E.t(item.title);
    info.textContent = "";
    info.appendChild(E.h("h3", "", E.t(item.title)));
    info.appendChild(E.h("p", "desc", E.t(item.about)));
    function row(en, ar, val){
      if (!val) return;
      var d = document.createElement("div");
      d.appendChild(E.bi(en, ar, "dt"));
      d.appendChild(E.h("dd", "", val));
      info.appendChild(d);
    }
    row("Issuer", "الجهة", E.t(item.issuer));
    row("Field", "المجال", window.CertFields.label("field", item.field, isAr()));
    if (item.date) row("Date", "التاريخ", E.t(item.date));
    if (item.score) row("Score", "الدرجة", E.t(item.score));
    if (item.file){
      var a = E.h("a", "file");
      a.href = item.file; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.appendChild(E.bi("Original file", "الملف الأصلي"));
      info.appendChild(a);
    }
  }
  E.openCert = function(item, list){
    if (E.page !== "certs") { location.href = "certificates.html#field-" + (item.field || "ai"); return; }
    vList = list && list.length ? list : [item];
    vI = Math.max(0, vList.indexOf(item));
    if (!viewer){
      viewer = E.h("div", "xv");
      viewer.setAttribute("data-theme-root", "");
      var x = E.h("button", "xv-x", "×");
      x.type = "button";
      x.addEventListener("click", E.closeCert);
      var lay = E.h("div", "xv-layout");
      lay.appendChild(E.h("img"));
      lay.appendChild(E.h("aside", "xv-info"));
      viewer.appendChild(x);
      viewer.appendChild(lay);
      viewer.addEventListener("click", function(e){ if (e.target === viewer) E.closeCert(); });
      document.body.appendChild(viewer);
    }
    viewer.hidden = false;
    document.body.style.overflow = "hidden";
    paintViewer();
  };
  E.closeCert = function(){
    if (viewer) viewer.hidden = true;
    document.body.style.overflow = "";
  };
  E.rails = function(parent, opts){
    opts = opts || {};
    var groups = E.groups(opts.mode || "field");
    groups.forEach(function(g){
      var sec = E.h("section", opts.rowClass || "rail-row");
      var h = E.h("h3", opts.titleClass || "");
      h.appendChild(E.bi(g.en, g.ar));
      var n = E.h("span", "rail-n", String(g.items.length));
      h.appendChild(document.createTextNode(" "));
      h.appendChild(n);
      var rail = E.h("div", opts.railClass || "rail");
      g.items.forEach(function(item){
        var b = E.h("button", opts.cardClass || "rail-card");
        b.type = "button";
        var img = E.h("img");
        img.src = item.thumb; img.alt = E.t(item.title); img.loading = "lazy";
        var cap = E.h("span", "", E.t(item.title));
        b.appendChild(img); b.appendChild(cap);
        b.addEventListener("click", function(){ E.openCert(item, g.items); });
        rail.appendChild(b);
      });
      sec.appendChild(h); sec.appendChild(rail);
      parent.appendChild(sec);
    });
    return groups;
  };
  E.form = function(){
    var f = E.h("form");
    f.action = "https://formsubmit.co/azzam.mohammed.alzahrani@gmail.com";
    f.method = "POST";
    function hid(n, v){ var i = E.h("input"); i.type = "hidden"; i.name = n; i.value = v; f.appendChild(i); }
    hid("_subject", "New message from your portfolio website");
    hid("_captcha", "true");
    hid("_template", "table");
    var name = E.h("input"); name.name = "name"; name.required = true; name.placeholder = isAr() ? "اسمك" : "Your name";
    var email = E.h("input"); email.name = "email"; email.type = "email"; email.required = true; email.placeholder = "you@example.com";
    var msg = E.h("textarea"); msg.name = "message"; msg.required = true; msg.placeholder = isAr() ? "كيف يمكنني مساعدتك؟" : "How can I help?";
    var go = E.h("button", "", ""); go.type = "submit"; go.appendChild(E.bi("Send message", "إرسال الرسالة"));
    f.appendChild(name); f.appendChild(email); f.appendChild(msg); f.appendChild(go);
    return f;
  };

  function mount(name){
    if (document.documentElement.getAttribute("data-style") !== name) return;
    if (!views[name]) return;
    current = name;
    var prev = document.getElementById("exp-root");
    if (prev) prev.remove();
    var el = E.h("div", "exp exp-" + name);
    el.id = "exp-root";
    el.setAttribute("data-theme-root", "");
    var header = document.querySelector("header.nav");
    if (header && header.parentNode) header.parentNode.insertBefore(el, header.nextSibling);
    else document.body.appendChild(el);
    views[name](el);
    window.__themeCleanup = function(){
      var n = document.getElementById("exp-root");
      if (n) n.remove();
      E.closeCert();
      if (viewer) viewer.remove();
      viewer = null;
    };
  }
  E.register = function(name, fn){
    views[name] = fn;
    if (document.documentElement.getAttribute("data-style") === name) mount(name);
  };
  if (window.Portfolio && window.Portfolio.onLang){
    window.Portfolio.onLang(function(){
      var n = document.documentElement.getAttribute("data-style");
      if (n && views[n]) mount(n);
      else if (viewer && !viewer.hidden) paintViewer();
    });
  }
  if (!window.__expBrand){
    window.__expBrand = true;
    var brand = document.querySelector(".brand");
    if (brand) brand.addEventListener("click", function(e){
      if (!document.documentElement.getAttribute("data-style")) return;
      var top = document.getElementById("exp-root");
      if (!top) return;
      e.preventDefault();
      top.scrollIntoView();
    });
  }
})();
