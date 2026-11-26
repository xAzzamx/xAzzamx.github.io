(function(){
  var NAME = "synth";
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
  var stars = [];
  var timer = 0;
  function make(){
    stars = [];
    var n = Math.min(90, Math.floor(window.innerWidth / 14));
    for (var i = 0; i < n; i++){
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.72,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random(),
        s: 0.004 + Math.random() * 0.01
      });
    }
  }
  function size(){
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    if (!stars.length) make();
  }
  function draw(){
    if (!alive()){ clearInterval(timer); return; }
    ctx.clearRect(0, 0, c.width, c.height);
    for (var i = 0; i < stars.length; i++){
      var st = stars[i];
      if (!reduce){
        st.a += st.s;
        if (st.a > 1 || st.a < 0.15) st.s *= -1;
      }
      ctx.globalAlpha = reduce ? 0.7 : Math.max(0.15, Math.min(1, st.a));
      ctx.fillStyle = i % 5 === 0 ? "#ff2bd6" : "#fff6ff";
      ctx.beginPath();
      ctx.arc(st.x * c.width, st.y * c.height, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function onResize(){ if (!alive()) return; size(); }
  size();
  draw();
  if (!reduce) timer = setInterval(draw, 70);
  window.addEventListener("resize", onResize);
  window.__themeCleanup = function(){
    clearInterval(timer);
    window.removeEventListener("resize", onResize);
  };
})();
