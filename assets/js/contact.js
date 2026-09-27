// Get in touch: a panel that opens from anywhere, three short steps, mostly clicking.
// Delivery is unchanged from the previous site: the message is stored via POST /api/messages
// (DB + Telegram ping) and EmailJS sends the visitor the same auto-reply.
(function(){
  const panel = document.getElementById('contact-panel');
  const veil = document.getElementById('contact-veil');
  const form = document.getElementById('contact-form');
  const steps = [...form.querySelectorAll('.cp-step')];
  const stepMarks = [...form.querySelectorAll('.cp-steps li')];
  const status = document.getElementById('form-status');
  const sendBtn = document.getElementById('send-btn');
  let step = 0, lastFocus = null;

  const EMAILJS_KEY = 'UrY-gYCg_PKD4enNm';
  const SERVICE = 'service_u9mhyyf';
  const TEMPLATE = 'template_6st5lmv';   // To Email = swapneel.bit@gmail.com; Auto-Reply tab replies to the visitor
  try { window.emailjs && emailjs.init(EMAILJS_KEY); } catch(e) {}

  function go(i){
    step = i;
    steps.forEach((s, j) => { s.hidden = j !== i; });
    stepMarks.forEach((m, j) => m.classList.toggle('on', j <= i));
    const first = steps[i].querySelector('input:not(.hp), textarea');
    if(first) setTimeout(() => first.focus(), 60);
  }

  function open(){
    lastFocus = document.activeElement;
    panel.hidden = false; veil.hidden = false;
    void panel.offsetWidth;            // commit the closed position so the slide-in transitions
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    go(step);
  }
  function close(){
    panel.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { panel.hidden = true; veil.hidden = true; }, 320);
    if(lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('[data-open-contact]').forEach(b => b.addEventListener('click', open));
  document.getElementById('cp-close').addEventListener('click', close);
  veil.addEventListener('click', close);
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !panel.hidden) close(); });

  function validStep1(){
    let ok = true;
    [form.from_name, form.reply_to].forEach(inp => {
      const good = inp.value.trim() && inp.checkValidity();
      inp.classList.toggle('bad', !good);
      if(!good && ok){ inp.focus(); ok = false; }
    });
    return ok;
  }
  form.addEventListener('click', e => {
    if(e.target.closest('[data-next]')){ if(step === 0 && !validStep1()) return; go(Math.min(steps.length - 1, step + 1)); }
    if(e.target.closest('[data-back]')) go(Math.max(0, step - 1));
  });
  form.addEventListener('keydown', e => {
    if(e.key === 'Enter' && e.target.tagName === 'INPUT' && step < steps.length - 1){ e.preventDefault(); if(step === 0 && !validStep1()) return; go(step + 1); }
  });

  function say(cls, msg){
    status.hidden = false;
    status.className = 'dialog cp-status' + (cls ? ' ' + cls : '');
    window.typeText(status.querySelector('p'), msg, 16);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if(!validStep1()){ go(0); return; }
    const name = form.from_name.value.trim(), email = form.reply_to.value.trim();
    const topics = [...form.querySelectorAll('input[name="topic"]:checked')].map(i => i.value);
    const note = form.note.value.trim();
    const message = [
      topics.length ? 'About: ' + topics.join(', ') : '',
      note
    ].filter(Boolean).join('\n\n') || '(no note — just said hi)';

    sendBtn.disabled = true; sendBtn.textContent = 'sending…';

    const store = fetch((window.PF_API_BASE || '') + '/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message, company: form.company.value })
    }).then(r => { if(!r.ok) throw new Error('store failed'); });

    const reply = (window.emailjs && !form.company.value)
      ? emailjs.send(SERVICE, TEMPLATE, { from_name: name, reply_to: email, message })
      : Promise.reject(new Error('emailjs unavailable'));

    Promise.allSettled([store, reply]).then(res => {
      if(res.some(r => r.status === 'fulfilled')){
        say('ok', 'Your message was sent! SWAPNEEL will reply soon.');
        form.reset(); setTimeout(() => go(0), 400);
      } else {
        say('err', "Couldn't send — email me directly at swapneel.bit@gmail.com");
      }
      sendBtn.disabled = false; sendBtn.textContent = 'send ▸';
    });
  });

  // copy email
  const copyBtn = document.getElementById('copy-email');
  if(copyBtn) copyBtn.addEventListener('click', () => {
    const addr = copyBtn.dataset.email;
    const done = () => window.toast('Email copied to clipboard!');
    if(navigator.clipboard && window.isSecureContext){ navigator.clipboard.writeText(addr).then(done, () => { location.href = 'mailto:' + addr; }); }
    else location.href = 'mailto:' + addr;
  });
})();
