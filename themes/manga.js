ThemeEngine.register("manga", function(root){
  var E = ThemeEngine, S = E.site;
  function art(kind){
    var s = E.h("div", "mg-art");
    if (kind === "laptop") s.innerHTML = '<svg viewBox="0 0 200 80" width="100%" height="110"><rect x="30" y="8" width="140" height="52" rx="4" fill="#1b2430" stroke="#111" stroke-width="3"/><rect x="38" y="16" width="124" height="36" fill="#143226"/><path d="M18 64h164l-12 10H30z" fill="#d9d3c7" stroke="#111" stroke-width="3"/></svg>';
    else if (kind === "shield") s.innerHTML = '<svg viewBox="0 0 120 90" width="100%" height="110"><path d="M60 6l46 16v28c0 24-18 38-46 46C32 88 14 74 14 50V22z" fill="#fff" stroke="#111" stroke-width="4"/><path d="M60 22v48M36 46h48" stroke="#c1121f" stroke-width="6"/></svg>';
    else s.innerHTML = '<svg viewBox="0 0 160 90" width="100%" height="110"><rect x="18" y="14" width="124" height="62" fill="#fff8e8" stroke="#111" stroke-width="4"/><circle cx="80" cy="45" r="16" fill="none" stroke="#c1121f" stroke-width="4"/><path d="M18 14l20 16M142 14l-20 16" stroke="#111"/></svg>';
    return s;
  }
  var page = E.h("article", "mg");
  if (E.page === "certs"){
    page.appendChild(E.h("p", "mg-sfx", E.isAr() ? "١٠٢!" : "102!"));
    page.appendChild(E.h("h1", "mg-name", E.isAr() ? "فصل الشهادات" : "CERTIFICATE CHAPTER"));
    page.appendChild(E.backLink());
    page.appendChild(E.h("p", "", (E.isAr() ? "عدد الشهادات " : "Certificates ") + E.count()));
    E.rails(page);
    root.appendChild(page);
    return;
  }
  var hero = E.h("section", "mg-hero");
  var a = E.h("div", "mg-panel mg-tall");
  a.appendChild(E.h("div", "mg-speed"));
  a.appendChild(E.h("p", "mg-sfx", E.isAr() ? "يااه!" : "WHOOSH!"));
  a.appendChild(E.h("p", "mg-bubble", E.t(S.hello) + " " + E.t(S.name)));
  a.appendChild(E.h("p", "", E.t(S.role)));
  a.appendChild(art("laptop"));
  var b = E.h("div", "mg-panel");
  b.appendChild(E.h("p", "mg-sfx", E.isAr() ? "تام!" : "BAM!"));
  b.appendChild(E.h("h1", "mg-name", E.t(S.name)));
  b.appendChild(art("shield"));
  var c = E.h("div", "mg-panel");
  c.appendChild(E.h("p", "mg-bubble", E.t(S.msc) + ". " + E.t(S.msc.where)));
  c.appendChild(art("diploma"));
  hero.appendChild(a); hero.appendChild(b); hero.appendChild(c);
  page.appendChild(hero);
  var next = E.h("button", "mg-next");
  next.type = "button";
  next.appendChild(E.bi("Turn the page", "اقلب الصفحة"));
  next.addEventListener("click", function(){
    page.classList.remove("turn"); void page.offsetWidth; page.classList.add("turn");
    var strip = page.querySelector(".mg-strip");
    if (strip) strip.scrollIntoView({behavior: E.reduce ? "auto" : "smooth", block:"nearest"});
  });
  page.appendChild(next);
  var strip = E.h("div", "mg-strip");
  S.projects.forEach(function(p, i){
    var f = E.h("article", "mg-frame");
    f.appendChild(E.h("p", "mg-sfx", String(i + 1)));
    f.appendChild(E.h("h2", "", E.t(p.title)));
    f.appendChild(E.h("p", "", E.t(p.body)));
    strip.appendChild(f);
  });
  page.appendChild(strip);
  var ch = E.h("section", "mg-chapter");
  ch.appendChild(E.h("h2", "", E.isAr() ? "فصل الشهادات" : "Certificate chapter"));
  ch.appendChild(E.h("p", "", (E.isAr() ? "العدد " : "Count ") + E.count()));
  var link = E.h("a", ""); link.href = "certificates.html"; link.appendChild(E.bi("Open the chapter", "افتح الفصل"));
  ch.appendChild(link);
  page.appendChild(ch);
  root.appendChild(page);
});
