(function(){
  var NAME = "terminal";
  if (document.documentElement.getAttribute("data-style") !== NAME) return;
  var token = {};
  window.__themeToken = token;
  function alive(){ return window.__themeToken === token && document.documentElement.getAttribute("data-style") === NAME; }
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var c = document.createElement("canvas");
  c.className = "theme-fx";
  c.setAttribute("data-theme-root", "");
  c.setAttribute("aria-hidden", "true");
  document.body.prepend(c);
  var ctx = c.getContext("2d");
  var drops = [];
  var fs = 16;
  var timer = 0;
  var chars = "01ABCDEF#$%&*<>{}[]/\\";
  function size(){
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = window.innerWidth;
    var h = window.innerHeight;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cols = Math.ceil(w / fs);
    drops = [];
    for (var i = 0; i < cols; i++) drops[i] = Math.random() * (h / fs);
  }
  function draw(){
    if (!alive()){ clearInterval(timer); return; }
    var w = window.innerWidth;
    var h = window.innerHeight;
    ctx.fillStyle = "rgba(4,17,10,0.22)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#37f07a";
    ctx.font = fs + "px monospace";
    for (var i = 0; i < drops.length; i++){
      var ch = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.globalAlpha = 0.35 + Math.random() * 0.65;
      ctx.fillText(ch, i * fs, drops[i] * fs);
      if (!reduce){
        if (drops[i] * fs > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    }
    ctx.globalAlpha = 1;
  }
  function onResize(){ if (alive()) size(); }
  size();
  draw();
  if (!reduce) timer = setInterval(draw, 90);
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", function(){
    if (!alive()) return;
    if (document.hidden){ clearInterval(timer); timer = 0; }
    else if (!reduce && !timer) timer = setInterval(draw, 90);
  });
  window.__themeCleanup = function(){
    clearInterval(timer);
    window.removeEventListener("resize", onResize);
  };
})();
