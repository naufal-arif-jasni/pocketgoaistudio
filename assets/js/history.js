// history.js - Transaction History Filtering
let activeTab = 'all';

Store.init().then(() => {
  requireParentAuth();
  filterTxns('all', document.querySelector('.filter-tab'));
});

function filterTxns(cat, btn) {
  activeTab = cat;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById('hist-container');
  if (!container) return;

  let filtered = Store.historyItems;
  if (activeTab !== 'all') {
    filtered = Store.historyItems.filter(t => t.cat === activeTab);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:#888;">
        <span style="font-size:3rem;display:block;margin-bottom:12px;">🔍</span>
        No transactions found in this category.
      </div>
    `;
    return;
  }

  // Group by date label (Today, Yesterday, Date)
  const grouped = {};
  filtered.forEach(t => {
    const label = getDateLabel(t.date);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(t);
  });

  let html = '';
  for (const label in grouped) {
    html += `<div class="date-label">${label}</div><div class="txn-list">`;
    html += grouped[label].map(t => `
      <div class="txn-item">
        <div class="txn-icon ${t.cat === 'topup' ? 'topup' : 'spend'}">${t.icon || '💸'}</div>
        <div class="txn-info">
          <h4>${t.title || t.description}</h4>
          <p>${t.sub || t.date.split(' ')[1] || t.date}</p>
        </div>
        <div class="txn-amount ${t.amount >= 0 ? 'pos' : 'neg'}">${t.amount >= 0 ? '+' : '-'}RM ${Math.abs(t.amount).toFixed(2)}</div>
      </div>
    `).join('');
    html += `</div>`;
  }
  container.innerHTML = html;
}

function getDateLabel(dateStr) {
  // Check if starts with today's date
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  
  const comp = dateStr.slice(0, 10);
  if (comp === today) return 'Today';
  if (comp === yesterday) return 'Yesterday';
  
  // Format date nicely
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr.split(' ')[0];
  return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}
