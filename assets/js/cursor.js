// Pixel cursor + a short trail of star dust. Mouse only; off for touch and reduced motion.
(function(){
  if(window.PX.reduced || !window.matchMedia('(pointer: fine)').matches) return;

  const arrow = "data:image/svg+xml," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 11 11' shape-rendering='crispEdges'>" +
    "<path fill='%23000' d='M0 0h2v1h1v1h1v1h1v1h1v1h1v1h1v1H6v1h1v2H5v-1H4V9H3v1H2v1H0z'/>" +
    "<path fill='%23ECE4D2' d='M1 1h1v1h1v1h1v1h1v1h1v1h1v1H5v1h1v1H5V8H4V7H3v2H2v1H1z'/></svg>").replace(/%2523/g, '%23');
  const hand = "data:image/svg+xml," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 11 11' shape-rendering='crispEdges'>" +
    "<path fill='%23000' d='M3 0h2v4h4v1h1v4H9v2H3V9H2V8H1V6h2z'/>" +
    "<path fill='%23FF6A1A' d='M4 1v5H3V7h1v1h1v2h3V8h1V5H5V1z'/></svg>").replace(/%2523/g, '%23');
  const st = document.createElement('style');
  st.textContent = 'html,body{cursor:url("' + arrow + '") 1 1, auto}' +
    'a,button,[role=tab],.chip span,.string,.owner-name,label{cursor:url("' + hand + '") 7 1, pointer}' +
    '.ring-stage{cursor:url("' + hand + '") 7 1, grab}';
  document.head.appendChild(st);

  const c = document.createElement('canvas');
  c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  let dpr = 1;
  const fit = () => { dpr = Math.min(2, devicePixelRatio || 1); c.width = innerWidth * dpr; c.height = innerHeight * dpr; };
  fit(); addEventListener('resize', fit);

  const dust = [], cols = ['#ECE4D2', '#FF6A1A', '#9CC3E6'];
  let lx = -1, ly = -1, active = false;
  addEventListener('pointermove', e => {
    if(e.pointerType !== 'mouse') return;
    const d = Math.hypot(e.clientX - lx, e.clientY - ly);
    if(d > 14){
      dust.push({ x: e.clientX + 6, y: e.clientY + 14, life: 1, c: cols[dust.length % 3], s: Math.random() < .3 ? 4 : 2 });
      if(dust.length > 18) dust.shift();
      lx = e.clientX; ly = e.clientY;
      if(!active){ active = true; requestAnimationFrame(tick); }
    }
  }, { passive: true });

  function tick(){
    ctx.clearRect(0, 0, c.width, c.height);
    for(let i = dust.length - 1; i >= 0; i--){
      const p = dust[i];
      p.life -= .045; p.y += .35;
      if(p.life <= 0){ dust.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.c;
      const x = Math.round(p.x) * dpr, y = Math.round(p.y) * dpr, s = p.s * dpr;
      ctx.fillRect(x, y, s, s);
    }
    ctx.globalAlpha = 1;
    if(dust.length) requestAnimationFrame(tick); else { active = false; ctx.clearRect(0, 0, c.width, c.height); }
  }
})();
