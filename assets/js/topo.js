// Tulips.edu production topology — knock out a component, read what really happens.
// Same states and log copy as the previous site's demo, redrawn in pixels.
(function(){
  const fig = document.getElementById('topo');
  if(!fig) return;
  const stage = document.getElementById('topo-stage');
  const svg = document.getElementById('topo-wires');
  const log = document.getElementById('topo-log');
  const statusText = document.getElementById('topo-status-text');
  const node = id => stage.querySelector('[data-id="' + id + '"]');
  const clickable = ['api', 'pg', 'r2'];
  const state = { api: true, pg: true, r2: true };

  const lines = {
    apiDown: '<span class="t-fail">[fail]</span> API unreachable. <span class="t-warn">[fallback]</span> attendance writes queue in IndexedDB — teachers keep marking offline, background sync flushes on recovery. reads degrade; nothing is lost.',
    pgDown: '<span class="t-fail">[fail]</span> Postgres down. <span class="t-fail">no fallback</span> — core ERP returns errors until restore from backup. this is the failure I plan around, not route around.',
    r2Down: '<span class="t-fail">[fail]</span> R2 unreachable. <span class="t-warn">[degraded]</span> uploads fail closed; core ERP unaffected. files never transit the app server, so the blast radius was isolated by design.',
    healthy: '<span class="t-ok">[ok]</span> all components answering. multi-tenant, event-sourced, 3 schools in production.',
    restored: '<span class="t-ok">[ok]</span> all components restored. offline queue flushed, audit events intact. zero data loss.'
  };

  const edges = [
    { id: 'e-cf', a: 'client', b: 'cf' },
    { id: 'e-api', a: 'cf', b: 'api' },
    { id: 'e-pg', a: 'api', b: 'pg' },
    { id: 'e-r2', a: 'client', b: 'r2' },
    { id: 'e-q', a: 'client', b: 'queue', cls: 'queue' }
  ];

  function wire(){
    const box = stage.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    svg.innerHTML = '';
    edges.forEach(e => {
      const A = node(e.a).getBoundingClientRect(), B = node(e.b).getBoundingClientRect();
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', Math.round(A.left + A.width / 2 - box.left));
      l.setAttribute('y1', Math.round(A.top + A.height / 2 - box.top));
      l.setAttribute('x2', Math.round(B.left + B.width / 2 - box.left));
      l.setAttribute('y2', Math.round(B.top + B.height / 2 - box.top));
      l.id = e.id; if(e.cls) l.classList.add(e.cls);
      svg.appendChild(l);
    });
    render();
  }

  function render(){
    const down = clickable.filter(k => !state[k]).length;
    fig.classList.toggle('degraded', down > 0 && state.pg);
    fig.classList.toggle('down', !state.pg);
    node('queue').classList.toggle('on', !state.api);
    const set = (id, cls, on) => { const el = svg.querySelector('#' + id); if(el) el.classList.toggle(cls, on); };
    set('e-api', 'off', !state.api);
    set('e-pg', 'off', !state.api || !state.pg);
    set('e-r2', 'off', !state.r2);
    set('e-q', 'hide', state.api);
    statusText.textContent = !state.pg ? 'DOWN — CORE ERP UNAVAILABLE'
      : !state.api ? 'DEGRADED — ATTENDANCE QUEUEING OFFLINE'
      : !state.r2 ? 'DEGRADED — UPLOADS PAUSED'
      : 'ALL SYSTEMS OPERATIONAL';
  }

  clickable.forEach(id => {
    const n = node(id);
    n.addEventListener('click', () => {
      state[id] = !state[id];
      n.classList.toggle('dead', !state[id]);
      n.setAttribute('aria-pressed', String(!state[id]));
      if(!state[id]) window.typeText(log, id === 'api' ? lines.apiDown : id === 'pg' ? lines.pgDown : lines.r2Down);
      else window.typeText(log, clickable.some(k => !state[k]) ? '<span class="t-ok">[ok]</span> ' + id + ' restored. remaining failures still active.' : lines.restored);
      render();
    });
  });

  document.getElementById('topo-reset').addEventListener('click', () => {
    clickable.forEach(k => { state[k] = true; const n = node(k); n.classList.remove('dead'); n.setAttribute('aria-pressed', 'false'); });
    window.typeText(log, lines.restored);
    render();
  });

  log.innerHTML = lines.healthy;
  let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(wire, 120); });
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(wire); else wire();
  wire();
})();
