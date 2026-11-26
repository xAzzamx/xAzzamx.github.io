(function(){
  var NAME = "aurora";
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
  var orbs = [];
  var timer = 0;
  var colors = ["255,160,210", "140,180,255", "120,255,220", "255,220,150", "190,160,255"];
  function size(){
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    if (!orbs.length){
      for (var i = 0; i < 8; i++){
        orbs.push({
          x: Math.random() * c.width,
          y: Math.random() * c.height,
          r: 80 + Math.random() * 160,
          vx: (Math.random() - .5) * .35,
          vy: (Math.random() - .5) * .35,
          color: colors[i % colors.length]
        });
      }
    }
  }
  function draw(){
    if (!alive()){ clearInterval(timer); return; }
    ctx.clearRect(0, 0, c.width, c.height);
    for (var i = 0; i < orbs.length; i++){
      var o = orbs[i];
      if (!reduce){
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = c.width + o.r;
        if (o.x > c.width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = c.height + o.r;
        if (o.y > c.height + o.r) o.y = -o.r;
      }
      var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, "rgba(" + o.color + ",.35)");
      g.addColorStop(1, "rgba(" + o.color + ",0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function onResize(){ if (!alive()) return; c.width = window.innerWidth; c.height = window.innerHeight; }
  size();
  draw();
  if (!reduce) timer = setInterval(draw, 40);
  window.addEventListener("resize", onResize);
  window.__themeCleanup = function(){
    clearInterval(timer);
    window.removeEventListener("resize", onResize);
  };
})();
