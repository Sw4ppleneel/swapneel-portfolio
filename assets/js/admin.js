// Owner inbox — unchanged behaviour from the previous site: password → short-lived JWT,
// messages rendered with textContent only so stored HTML can never execute.
(function(){
  const API = function(p){ return (window.PF_API_BASE || '') + p; };
  const TOKEN_KEY = 'pf_admin_token';

  const overlay   = document.getElementById('admin-overlay');
  const trigger   = document.getElementById('owner-name');
  const closeBtn  = document.getElementById('admin-close');
  const loginForm = document.getElementById('admin-login');
  const loginView = loginForm;
  const inboxView = document.getElementById('admin-inbox');
  const passInput = document.getElementById('admin-pass');
  const loginBtn  = document.getElementById('admin-login-btn');
  const loginStat = document.getElementById('admin-login-status');
  const listEl    = document.getElementById('admin-list');
  const countEl   = document.getElementById('inbox-count');

  let token = sessionStorage.getItem(TOKEN_KEY) || null;

  function setStat(cls, msg){ loginStat.className = 'admin-status' + (cls ? ' ' + cls : ''); loginStat.textContent = msg; }
  function showLogin(){ inboxView.hidden = true; loginView.hidden = false; setTimeout(function(){ passInput.focus(); }, 30); }
  function showInbox(){ loginView.hidden = true; inboxView.hidden = false; }

  function open(){
    overlay.hidden = false;
    if(token){ showInbox(); loadMessages(); } else { setStat('', ''); passInput.value=''; showLogin(); }
  }
  function close(){ overlay.hidden = true; }

  function fmtDate(iso){
    const d = new Date(iso);
    if(isNaN(d)) return iso;
    return d.toLocaleString(undefined, { dateStyle:'medium', timeStyle:'short' });
  }

  function logout(){
    token = null;
    sessionStorage.removeItem(TOKEN_KEY);
    listEl.textContent = '';
    showLogin();
  }

  // Build each message node with textContent only — a message containing HTML
  // or <script> can never execute in the inbox view.
  function renderMessages(items){
    listEl.textContent = '';
    countEl.textContent = items.length + (items.length === 1 ? ' message' : ' messages');
    if(!items.length){
      const empty = document.createElement('div');
      empty.className = 'admin-empty';
      empty.textContent = 'no messages yet.';
      listEl.appendChild(empty);
      return;
    }
    items.forEach(function(m){
      const card = document.createElement('div');
      card.className = 'msg' + (m.is_read ? '' : ' unread');

      const top = document.createElement('div');
      top.className = 'msg-top';
      const from = document.createElement('span');
      from.className = 'msg-from';
      from.textContent = m.name;
      const date = document.createElement('span');
      date.className = 'msg-date';
      date.textContent = fmtDate(m.created_at);
      top.appendChild(from); top.appendChild(date);

      const email = document.createElement('a');
      email.className = 'msg-email';
      email.href = 'mailto:' + m.email;
      email.textContent = m.email;

      const body = document.createElement('p');
      body.className = 'msg-body';
      body.textContent = m.message;

      const actions = document.createElement('div');
      actions.className = 'msg-actions';
      if(!m.is_read){
        const readBtn = document.createElement('button');
        readBtn.type = 'button';
        readBtn.textContent = 'mark read';
        readBtn.addEventListener('click', function(){ markRead(m.id); });
        actions.appendChild(readBtn);
      }
      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'del';
      delBtn.textContent = 'delete';
      delBtn.addEventListener('click', function(){ if(confirm('Delete this message?')) del(m.id); });
      actions.appendChild(delBtn);

      card.appendChild(top);
      card.appendChild(email);
      card.appendChild(body);
      card.appendChild(actions);
      listEl.appendChild(card);
    });
  }

  function authed(path, opts){
    opts = opts || {};
    opts.headers = Object.assign({}, opts.headers, { 'Authorization': 'Bearer ' + token });
    return fetch(API(path), opts).then(function(r){
      if(r.status === 401){ logout(); throw new Error('session expired'); }
      if(!r.ok) throw new Error('request failed');
      return r;
    });
  }

  function loadMessages(){
    countEl.textContent = 'loading…';
    authed('/api/admin/messages').then(function(r){ return r.json(); })
      .then(renderMessages)
      .catch(function(e){ countEl.textContent = (e.message === 'session expired') ? 'session expired' : 'could not load'; });
  }
  function markRead(id){ authed('/api/admin/messages/' + id + '/read', { method:'POST' }).then(loadMessages).catch(function(){}); }
  function del(id){ authed('/api/admin/messages/' + id, { method:'DELETE' }).then(loadMessages).catch(function(){}); }

  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const pw = passInput.value;
    if(!pw) return;
    loginBtn.disabled = true; loginBtn.textContent = 'Checking…'; setStat('', '');
    fetch(API('/api/admin/login'), {
      method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ password: pw })
    }).then(function(r){
      if(r.status === 429){ throw new Error('too many attempts — wait a few minutes'); }
      if(r.status === 401){ throw new Error('wrong password'); }
      if(!r.ok){ throw new Error('login unavailable'); }
      return r.json();
    }).then(function(data){
      token = data.token;
      sessionStorage.setItem(TOKEN_KEY, token);
      passInput.value = '';
      showInbox(); loadMessages();
    }).catch(function(err){
      setStat('err', '[fail] ' + err.message);
    }).finally(function(){
      loginBtn.disabled = false; loginBtn.textContent = 'Unlock';
    });
  });

  trigger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  document.getElementById('inbox-refresh').addEventListener('click', loadMessages);
  document.getElementById('inbox-logout').addEventListener('click', logout);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) close(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !overlay.hidden) close(); });
})();
