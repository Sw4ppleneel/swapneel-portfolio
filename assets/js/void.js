// Hidden: type "domain" (or the Konami code) for an original pixel "infinite void".
(function(){
  const cvs = document.getElementById('void'), line = document.getElementById('void-line');
  if(!cvs) return;
  const { BAYER, reduced } = window.PX;
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let buf = '', kpos = 0, running = false;

  document.addEventListener('keydown', e => {
    const t = e.target;
    if(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    kpos = (e.key === KONAMI[kpos]) ? kpos + 1 : (e.key === KONAMI[0] ? 1 : 0);
    buf = (buf + (e.key.length === 1 ? e.key.toLowerCase() : '')).slice(-6);
    if(buf === 'domain' || kpos === KONAMI.length){ kpos = 0; buf = ''; expand(); }
  });

  function expand(){
    if(running) return; running = true;
    window.toast && window.toast('Domain Expansion…');
    const S = 4, W = Math.ceil(innerWidth / S), H = Math.ceil(innerHeight / S);
    cvs.width = W; cvs.height = H; cvs.hidden = false;
    const ctx = cvs.getContext('2d'), img = ctx.createImageData(W, H), d = img.data;
    const pal = [[0,0,0],[10,8,40],[40,20,110],[80,40,170],[111,211,255],[235,250,255]];
    const cx = W / 2, cy = H / 2, t0 = performance.now();
    const stars = Array.from({ length: 160 }, () => ({ a: Math.random() * 6.28, r: Math.random() * Math.max(W, H), v: .6 + Math.random() * 1.8 }));

    function frame(now){
      const t = (now - t0) / 1000;
      const grow = Math.min(1, t / .8);
      for(let y = 0; y < H; y++) for(let x = 0; x < W; x++){
        const dx = x - cx, dy = y - cy, r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
        let v = Math.sin(r * .35 - t * 6 + a * 3) * .5 + .5;
        v *= Math.min(1, r / 30);                                   // black centre
        v *= grow * Math.max(0, 1 - r / (Math.max(W, H) * .75 * grow + 1));
        const f = v * (pal.length - 1), i = Math.floor(f);
        const col = pal[Math.min(pal.length - 1, (f - i) > BAYER[(y & 3) * 4 + (x & 3)] ? i + 1 : i)];
        const k = (y * W + x) * 4; d[k] = col[0]; d[k + 1] = col[1]; d[k + 2] = col[2]; d[k + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      ctx.fillStyle = '#FFFFFF';
      for(const s of stars){
        s.r -= s.v * (1 + t * 2); if(s.r < 2) s.r = Math.max(W, H) * .8;
        ctx.fillRect(Math.round(cx + Math.cos(s.a + t * .3) * s.r), Math.round(cy + Math.sin(s.a + t * .3) * s.r), 1, 1);
      }
      if(t > 1.2 && line.hidden){ line.hidden = false; line.textContent = 'throughout the night, I alone keep prod up.'; }
      if(t < 4.2 && !reduced) requestAnimationFrame(frame);
      else setTimeout(done, reduced ? 2500 : 0);
    }
    requestAnimationFrame(frame);
  }
  function done(){ cvs.hidden = true; line.hidden = true; running = false; }
  cvs.addEventListener('click', done);
})();
