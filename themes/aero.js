ThemeEngine.register("aero", function(root){
  var E = ThemeEngine, S = E.site;
  var sky = E.h("div", "aero-bubbles");
  for (var i = 0; i < 8; i++){
    var b = E.h("i");
    b.style.left = (8 + i * 12) + "%";
    b.style.width = b.style.height = (16 + (i % 4) * 10) + "px";
    b.style.animationDuration = (10 + i) + "s";
    b.style.animationDelay = (-i * 1.3) + "s";
    sky.appendChild(b);
  }
  root.appendChild(sky);
  root.appendChild(E.h("div", "aero-sun"));
  root.appendChild(E.h("div", "aero-water"));
  var app = E.h("div", "aero");
  var orbs = E.h("div", "aero-orbs");
  var card = E.h("article", "aero-card");
  var side = E.h("aside", "aero-side");
  var sections = ["about","edu","projects","certs","contact"];
  function paint(id){
    card.textContent = "";
    if (id === "edu"){
      card.appendChild(E.h("h2", "", E.t(S.msc)));
      card.appendChild(E.h("p", "", E.t(S.msc.where)));
      S.msc.pills.forEach(function(p){ card.appendChild(E.h("p", "", E.t(p))); });
      card.appendChild(E.h("p", "", E.t(S.edu.title) + "  " + E.t(S.edu.where)));
    } else if (id === "projects"){
      S.projects.forEach(function(p){
        card.appendChild(E.h("h3", "", E.t(p.title)));
        card.appendChild(E.h("p", "", E.t(p.body)));
      });
    } else if (id === "certs"){
      card.appendChild(E.h("h2", "", E.isAr() ? "الشهادات" : "Certificates"));
      card.appendChild(E.h("p", "", String(E.count())));
      if (E.page === "certs"){ card.appendChild(E.backLink()); E.rails(card); }
      else {
        var a = E.h("a", ""); a.href = "certificates.html"; a.appendChild(E.bi("Open certificates", "افتح الشهادات"));
        card.appendChild(a);
      }
    } else if (id === "contact"){
      card.appendChild(E.h("p", "", S.links.email));
      card.appendChild(E.form());
    } else {
      card.appendChild(E.h("h1", "", E.t(S.name)));
      card.appendChild(E.h("p", "", E.t(S.lead)));
      S.about.forEach(function(p){ card.appendChild(E.h("p", "", E.t(p))); });
    }
  }
  [["about","About","نبذة"],["edu","Study","الدراسة"],["projects","Work","الأعمال"],["certs","Certs","شهادات"],["contact","Hello","مرحبا"]].forEach(function(item, i){
    var o = E.h("button", "aero-orb");
    o.type = "button";
    o.appendChild(E.bi(item[1], item[2]));
    o.addEventListener("click", function(){ paint(sections[i]); });
    orbs.appendChild(o);
  });
  var clock = E.h("div", "aero-gadget");
  var time = E.h("strong", "", "");
  clock.appendChild(E.h("p", "", E.isAr() ? "الساعة" : "Clock"));
  clock.appendChild(time);
  function tick(){ time.textContent = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}); }
  tick();
  var timer = setInterval(tick, 30000);
  var prev = window.__themeCleanup;
  window.__themeCleanup = function(){ clearInterval(timer); if (prev) prev(); };
  var meters = E.h("div", "aero-gadget");
  meters.appendChild(E.h("p", "", E.isAr() ? "المهارات" : "Skills"));
  S.skills.slice(0, 4).forEach(function(g, i){
    meters.appendChild(E.h("span", "", E.t(g)));
    var m = E.h("div", "aero-meter");
    var bar = E.h("b");
    bar.style.width = (55 + i * 10) + "%";
    m.appendChild(bar);
    meters.appendChild(m);
  });
  side.appendChild(clock);
  side.appendChild(meters);
  app.appendChild(orbs);
  app.appendChild(card);
  app.appendChild(side);
  root.appendChild(app);
  paint(E.page === "certs" ? "certs" : "about");
});
