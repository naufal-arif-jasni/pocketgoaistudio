// dashboard.js - Parent Dashboard Logic
Store.init().then(() => {
  requireParentAuth();
  updateDashboard();
});

function updateDashboard() {
  const user = Store.user;
  const firstName = user.name.split(' ')[0] || user.name;
  
  const parentNameEl = document.getElementById('dash-parent-name');
  if (parentNameEl) parentNameEl.textContent = firstName;
  
  const avatarEl = document.getElementById('dash-avatar');
  if (avatarEl) avatarEl.textContent = (firstName.charAt(0) || 'N').toUpperCase();
  
  const childNameEl = document.getElementById('dash-child-name');
  if (childNameEl) childNameEl.textContent = user.child || '—';
  
  const childClassEl = document.getElementById('dash-child-class');
  if (childClassEl) childClassEl.textContent = user.childClass || '—';
  
  const balanceEl = document.getElementById('dash-balance');
  if (balanceEl) balanceEl.textContent = user.balance.toFixed(2);
  
  const topupStatEl = document.getElementById('dash-topup-stat');
  if (topupStatEl) topupStatEl.textContent = 'RM ' + (user.topupTotal || 0).toFixed(2);
  
  const topupCountEl = document.getElementById('dash-topup-count');
  if (topupCountEl) topupCountEl.textContent = (user.topupCount || 0) + ' transactions';

  const now = new Date();
  const dateEl = document.getElementById('dash-date');
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  renderRecentTxns();
}

function renderRecentTxns() {
  const list = document.getElementById('dash-txn-list');
  if (!list) return;
  const items = Store.historyItems.slice(0, 4);
  list.innerHTML = items.map(t => `
    <div class="txn-item">
      <div class="txn-icon ${t.cat === 'topup' ? 'topup' : 'spend'}">${t.icon || '💸'}</div>
      <div class="txn-info"><h4>${t.title || t.description}</h4><p>${t.sub || t.date}</p></div>
      <div class="txn-amount ${t.amount >= 0 ? 'pos' : 'neg'}">${t.amount >= 0 ? '+' : '-'}RM ${Math.abs(t.amount).toFixed(2)}</div>
    </div>
  `).join('');
}
