ThemeEngine.register("aero", function(root){
  var E = ThemeEngine, S = E.site;
  var ICO = {
    about:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3"/><path d="M5 19c1.5-3 3.8-4.5 7-4.5S17.5 16 19 19"/></svg>',
    edu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10l9-5 9 5-9 5-9-5z"/><path d="M7 12v4c2 1.5 8 1.5 10 0v-4"/></svg>',
    work:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5h8v2"/></svg>',
    certs:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="9" r="4"/><path d="m9 13 1 7 2-2 2 2 1-7"/></svg>',
    hello:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16v10H4z"/><path d="m4 7 8 6 8-6"/></svg>'
  };
  var sky = E.h("div", "aero-bubbles");
  for (var i = 0; i < 9; i++){
    var b = E.h("i");
    b.style.left = (6 + i * 11) + "%";
    b.style.width = b.style.height = (14 + (i % 4) * 12) + "px";
    b.style.animationDuration = (9 + i) + "s";
    b.style.animationDelay = (-i) + "s";
    sky.appendChild(b);
  }
  root.appendChild(sky);
  root.appendChild(E.h("div", "aero-sun"));
  root.appendChild(E.h("div", "aero-flare"));
  root.appendChild(E.h("div", "aero-grass"));
  var app = E.h("div", "aero");
  var orbs = E.h("div", "aero-orbs");
  var card = E.h("article", "aero-card");
  var side = E.h("aside", "aero-side");
  var keys = ["about","edu","projects","certs","contact"];
  function paint(id){
    card.textContent = "";
    if (id === "edu"){
      card.appendChild(E.h("h2", "", E.t(S.msc)));
      card.appendChild(E.h("p", "", E.t(S.msc.where)));
      S.msc.pills.forEach(function(p){ card.appendChild(E.h("p", "", E.t(p))); });
      card.appendChild(E.h("p", "", E.t(S.edu.title) + "  " + E.t(S.edu.where)));
    } else if (id === "projects"){
      S.projects.forEach(function(p){ card.appendChild(E.h("h3", "", E.t(p.title))); card.appendChild(E.h("p", "", E.t(p.body))); });
    } else if (id === "certs"){
      card.appendChild(E.h("h2", "", E.isAr() ? "الشهادات" : "Certificates"));
      card.appendChild(E.h("p", "", String(E.count())));
      if (E.page === "certs"){ card.appendChild(E.backLink()); E.rails(card); }
      else { var a = E.h("a", ""); a.href = "certificates.html"; a.appendChild(E.bi("Open certificates", "افتح الشهادات")); card.appendChild(a); }
    } else if (id === "contact"){
      card.appendChild(E.h("p", "", S.links.email));
      card.appendChild(E.form());
    } else {
      card.appendChild(E.h("h1", "", E.t(S.name)));
      card.appendChild(E.h("p", "", E.t(S.lead)));
      card.appendChild(E.h("p", "", E.t(S.about[0])));
    }
  }
  [["about","About","نبذة"],["edu","Study","الدراسة"],["projects","Work","الأعمال"],["certs","Certs","شهادات"],["contact","Hello","مرحبا"]].forEach(function(item, i){
    var o = E.h("button", "aero-orb"); o.type = "button";
    var icoKey = {about:"about", edu:"edu", projects:"work", certs:"certs", contact:"hello"};
    var ico = E.h("span", "aero-ico"); ico.innerHTML = ICO[icoKey[item[0]]];
    o.appendChild(ico);
    o.appendChild(E.bi(item[1], item[2]));
    o.lastChild.className = "aero-cap";
    o.addEventListener("click", function(){ paint(keys[i]); });
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
    var m = E.h("div", "aero-meter"); var bar = E.h("b"); bar.style.width = (58 + i * 9) + "%"; m.appendChild(bar); meters.appendChild(m);
  });
  side.appendChild(clock); side.appendChild(meters);
  app.appendChild(orbs); app.appendChild(card); app.appendChild(side);
  root.appendChild(app);
  paint(E.page === "certs" ? "certs" : "about");
});
