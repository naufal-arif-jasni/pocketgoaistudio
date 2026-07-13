// card.js - Physical Card Management
Store.init().then(() => {
  requireParentAuth();
  renderCardPage();
});

function renderCardPage() {
  const u = Store.user;
  document.getElementById('card-child').textContent = u.child || '—';
  document.getElementById('card-id').textContent = 'ID: ' + (u.studentId || '10294-A');
  document.getElementById('card-class').textContent = u.childClass || '4 Amanah';
  
  // Daily limit card info
  const limitVal = Store.dailyLimit || 50;
  document.getElementById('card-limit-val').textContent = limitVal;
  
  // Spend statistics (calculate today's spends from transactions)
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySpends = Store.historyItems
    .filter(t => t.date.slice(0,10) === todayStr && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  document.getElementById('card-spent-val').textContent = todaySpends.toFixed(2);
  const remaining = Math.max(0, limitVal - todaySpends);
  document.getElementById('card-rem-val').textContent = remaining.toFixed(2);

  const fillPercent = Math.min(100, (todaySpends / limitVal) * 100);
  document.getElementById('card-limit-fill').style.width = fillPercent + '%';
}

function selectLimit(val, btn) {
  const custom = document.getElementById('card-custom-limit');
  if (custom) custom.value = '';
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  updateLimitState(val);
}

function selectCustomLimit(val) {
  const parsed = parseFloat(val) || 0;
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
  updateLimitState(parsed);
}

let pendingLimit = 50;
function updateLimitState(val) {
  pendingLimit = val;
}

async function saveLimit() {
  if (pendingLimit <= 0) { toast('Please specify a valid limit amount.'); return; }
  
  toast('Updating daily limit...');
  try {
    const res = await fetch('/api/user/update-limit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: Store.user.email, limit: pendingLimit })
    });
    if (res.ok) {
      Store.dailyLimit = pendingLimit;
      Store.save();
      closeModal('modal-limit');
      toast('Daily spend limit updated successfully!');
      renderCardPage();
    } else {
      toast('Update failed.');
    }
  } catch (e) {
    console.error(e);
    toast('Error updating limit.');
  }
}
