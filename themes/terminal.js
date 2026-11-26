ThemeEngine.register("terminal", function(root){
  var E = ThemeEngine, S = E.site, reduce = E.reduce;
  var cmds = [
    ["whoami", {en:"whoami", ar:"من أنا"}],
    ["about", {en:"about", ar:"نبذة"}],
    ["education", {en:"education", ar:"تعليم"}],
    ["experience", {en:"experience", ar:"خبرة"}],
    ["projects", {en:"projects", ar:"مشاريع"}],
    ["skills", {en:"skills", ar:"مهارات"}],
    ["certificates", {en:"certificates", ar:"شهادات"}],
    ["contact", {en:"contact", ar:"تواصل"}]
  ];
  var cmd = E.page === "certs" ? "certificates" : "whoami";
  var bar = E.h("nav", "term-cmds");
  var screen = E.h("div", "term-screen");
  var prompt = E.h("p", "term-prompt");
  var out = E.h("div", "term-out");
  function setPrompt(){
    prompt.textContent = "";
    prompt.appendChild(document.createTextNode("azzam@portfolio:~$ "));
    var typed = E.h("span", "term-typed", cmd);
    prompt.appendChild(typed);
    if (!reduce){
      typed.textContent = "";
      var i = 0;
      var timer = setInterval(function(){
        i++; typed.textContent = cmd.slice(0, i);
        if (i >= cmd.length) clearInterval(timer);
      }, 28);
    }
  }
  function line(text){ return E.h("p", "term-line", text); }
  function show(){
    out.textContent = "";
    setPrompt();
    if (cmd === "whoami"){
      out.appendChild(line(E.t(S.name)));
      out.appendChild(line(E.t(S.role)));
      out.appendChild(line(E.t(S.lead)));
      out.appendChild(line(E.t(S.status) + "  |  STEP " + S.step.n));
      out.appendChild(line((E.isAr() ? "الشهادات " : "certificates ") + E.count()));
    } else if (cmd === "about"){
      out.appendChild(E.h("h2", "", E.t(S.aboutTitle)));
      S.about.forEach(function(p){ out.appendChild(line(E.t(p))); });
    } else if (cmd === "education"){
      out.appendChild(line(E.t(S.edu.when) + "  " + E.t(S.edu.title)));
      out.appendChild(line(E.t(S.edu.where)));
      out.appendChild(line(E.t(S.edu.note)));
      out.appendChild(line(E.t(S.msc) + "  " + E.t(S.msc.where)));
      S.msc.pills.forEach(function(p){ out.appendChild(line("  " + E.t(p))); });
    } else if (cmd === "experience"){
      out.appendChild(line(E.t(S.job.when) + "  " + E.t(S.job.title)));
      out.appendChild(line(E.t(S.job.where)));
      S.job.bullets.forEach(function(b){ out.appendChild(line("• " + E.t(b))); });
      out.appendChild(line("SUSTAIN 2026  " + E.t(S.research)));
    } else if (cmd === "projects"){
      S.projects.forEach(function(p){
        var art = E.h("article", "term-proj");
        if (p.img){ var im = E.h("img"); im.src = p.img; im.alt = ""; art.appendChild(im); }
        art.appendChild(E.h("h2", "", E.t(p.title)));
        art.appendChild(line(E.t(p.body)));
        art.appendChild(line(E.t(p.role)));
        out.appendChild(art);
      });
    } else if (cmd === "skills"){
      S.skills.forEach(function(g){
        out.appendChild(E.h("h2", "", E.t(g)));
        out.appendChild(line(g.items.join("   ")));
      });
    } else if (cmd === "certificates"){
      if (E.page === "certs") out.appendChild(E.backLink("term-go"));
      out.appendChild(line((E.isAr() ? "عدد الشهادات " : "certificates ") + E.count()));
      var link = E.h("a", "term-go");
      link.href = "certificates.html";
      link.appendChild(E.bi("Open the full archive", "افتح الأرشيف كاملًا"));
      if (E.page !== "certs") out.appendChild(link);
      E.rails(out, {rowClass:"term-row", railClass:"term-rail", cardClass:"term-card"});
    } else if (cmd === "contact"){
      out.appendChild(line(S.links.email));
      out.appendChild(line("github.com/xAzzamx"));
      out.appendChild(line(E.t(S.contactNote)));
      out.appendChild(E.form());
    }
  }
  cmds.forEach(function(c){
    var b = E.h("button", "term-cmd");
    b.type = "button";
    b.appendChild(E.bi(c[1].en, c[1].ar));
    b.addEventListener("click", function(){ cmd = c[0]; show(); });
    bar.appendChild(b);
  });
  root.appendChild(bar);
  screen.appendChild(prompt);
  screen.appendChild(out);
  root.appendChild(screen);
  show();
});
