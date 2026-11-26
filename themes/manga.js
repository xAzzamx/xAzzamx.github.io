ThemeEngine.register("manga", function(root){
  var E = ThemeEngine, S = E.site;
  var page = E.h("article", "mg");
  if (E.page === "certs"){
    page.appendChild(E.h("h1", "mg-name", E.isAr() ? "الفصل: الشهادات" : "CHAPTER: CERTIFICATES"));
    page.appendChild(E.h("p", "mg-sfx", E.isAr() ? "١٠٢!" : "102!"));
    page.appendChild(E.backLink());
    page.appendChild(E.h("p", "", (E.isAr() ? "عدد الشهادات " : "Certificates ") + E.count()));
    E.rails(page);
    root.appendChild(page);
    return;
  }
  var hero = E.h("section", "mg-hero");
  var a = E.h("div", "mg-panel");
  a.appendChild(E.h("p", "mg-sfx", E.isAr() ? "يااه!" : "WHOOSH!"));
  a.appendChild(E.h("p", "mg-bubble", E.t(S.hello) + " " + E.t(S.name)));
  a.appendChild(E.h("p", "", E.t(S.role)));
  var b = E.h("div", "mg-panel");
  b.appendChild(E.h("p", "mg-sfx", E.isAr() ? "تام!" : "BAM!"));
  b.appendChild(E.h("h1", "mg-name", E.t(S.name)));
  var c = E.h("div", "mg-panel");
  c.appendChild(E.h("p", "mg-bubble", E.t(S.msc)));
  c.appendChild(E.h("p", "", E.t(S.msc.where)));
  S.msc.pills.forEach(function(p){ c.appendChild(E.h("p", "", E.t(p))); });
  hero.appendChild(a); hero.appendChild(b); hero.appendChild(c);
  page.appendChild(hero);
  var next = E.h("button", "mg-next");
  next.type = "button";
  next.appendChild(E.bi("Turn the page", "اقلب الصفحة"));
  next.addEventListener("click", function(){
    page.classList.remove("turn");
    void page.offsetWidth;
    page.classList.add("turn");
    var strip = page.querySelector(".mg-strip");
    if (strip) strip.scrollIntoView({behavior: E.reduce ? "auto" : "smooth", block:"center"});
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
