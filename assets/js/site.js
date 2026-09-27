// Page-level behaviour: boot line, nav state, scroll reveals, small sprites, shared helpers.
(function(){
  const { draw, walker, paintIcons, reduced } = window.PX;

  // ─── shared: type text into an element, dialog-box style ───
  const typing = new WeakMap();
  window.typeText = function(el, html, speed){
    // html may contain <span class="t-…"> tags; we type the visible text and keep the tags
    clearInterval(typing.get(el));
    if(reduced){ el.innerHTML = html; return; }
    const tokens = html.split(/(<[^>]+>)/).filter(Boolean);
    let out = '', ti = 0, ci = 0;
    const visibleLen = html.replace(/<[^>]+>/g, '').length;
    const per = Math.max(1, Math.round(visibleLen / 90));      // long lines type faster, short ones feel deliberate
    el.innerHTML = '';
    const id = setInterval(() => {
      for(let n = 0; n < per; n++){
        if(ti >= tokens.length){ clearInterval(id); return; }
        const tok = tokens[ti];
        if(tok[0] === '<'){ out += tok; ti++; ci = 0; n--; }
        else { out += tok[ci++]; if(ci >= tok.length){ ti++; ci = 0; } }
      }
      el.innerHTML = out + closeOpen(out);
    }, speed || 14);
    typing.set(el, id);
  };
  function closeOpen(s){ const o = (s.match(/<span[^>]*>/g) || []).length, c = (s.match(/<\/span>/g) || []).length; return '</span>'.repeat(Math.max(0, o - c)); }

  // ─── shared: toast ───
  const toastEl = document.getElementById('toast');
  let toastT;
  window.toast = function(msg){
    toastEl.hidden = false;
    window.typeText(toastEl.querySelector('p'), msg, 18);
    clearTimeout(toastT);
    toastT = setTimeout(() => { toastEl.hidden = true; }, 2600);
  };

  // ─── boot (≤1.2s, once per session) ───
  const boot = document.getElementById('boot');
  let seen = false;
  try { seen = sessionStorage.getItem('pf_booted') === '1'; sessionStorage.setItem('pf_booted', '1'); } catch(e) {}
  if(seen || reduced){ boot.remove(); }
  else {
    const line = document.getElementById('boot-line'), txt = '> wandering…';
    let i = 0;
    const id = setInterval(() => { line.textContent = txt.slice(0, ++i); if(i >= txt.length) clearInterval(id); }, 55);
    setTimeout(() => boot.classList.add('gone'), 1050);
    setTimeout(() => boot.remove(), 1700);
    boot.addEventListener('click', () => boot.classList.add('gone'));
  }

  // ─── nav: background after the hero, active section ───
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > innerHeight * .6);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const links = [...document.querySelectorAll('.nav-links a')];
  if('IntersectionObserver' in window){
    const secObs = new IntersectionObserver(es => {
      es.forEach(e => {
        if(!e.isIntersecting) return;
        links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['work', 'research', 'off-clock', 'pictures'].forEach(id => { const s = document.getElementById(id); if(s) secObs.observe(s); });

    // ─── reveals ───
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // picture headline lights up word by word as it scrolls in
    const words = [...document.querySelectorAll('.pics-title .w')];
    const wio = new IntersectionObserver(es => {
      if(!es[0].isIntersecting) return;
      words.forEach((w, i) => setTimeout(() => w.classList.add('lit'), reduced ? 0 : i * 140));
      wio.disconnect();
    }, { rootMargin: '0px 0px -20% 0px' });
    if(words.length) wio.observe(words[0].parentElement);
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  // ─── sprites ───
  paintIcons();

  const dex = document.getElementById('dex-sprite');
  if(dex){
    const c = dex.getContext('2d');
    let f = 0;
    const paint = () => {
      c.clearRect(0, 0, 32, 40);
      c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(10, 36, 13, 2);
      draw(c, walker(0, f % 6 === 5 ? 'look' : 'stand'), 10, 14);
      f++;
    };
    paint();
    if(!reduced) setInterval(paint, 700);
  }

  const fw = document.getElementById('foot-walker');
  if(fw){
    const c = fw.getContext('2d');
    let f = 0;
    const paint = () => { c.clearRect(0, 0, 24, 24); draw(c, walker(f++ % 4), 6, 1); };
    paint();
    if(!reduced) setInterval(paint, 140);
  }
})();
