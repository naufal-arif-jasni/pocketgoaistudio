// topup.js - Topup flow
let amt = 0;
let pm = '';
let currentGw = 'fpx';
let selectedBank = '';
let selectedEwallet = '';
let currentPin = '';

Store.init().then(() => {
  requireParentAuth();
  document.getElementById('tu-child').textContent = Store.user.child;
  selectAmount(50, document.querySelector('.amount-btn'));
});

function selectAmount(val, btn) {
  amt = val;
  const customInput = document.getElementById('tu-custom-amount');
  if (customInput) customInput.value = '';
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function selectCustomAmount(val) {
  const parsed = parseFloat(val) || 0;
  amt = parsed;
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
}

function selectMethod(method, id) {
  pm = method;
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

function gwTab(type, btn) {
  currentGw = type;
  document.querySelectorAll('.gw-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.gw-section').forEach(s => s.classList.add('hidden'));
  const targetSec = document.getElementById('gw-' + type);
  if (targetSec) targetSec.classList.remove('hidden');
}

function selectBank(bank, btn) {
  selectedBank = bank;
  document.querySelectorAll('.bank-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function selectEwallet(wallet, id) {
  selectedEwallet = wallet;
  document.querySelectorAll('.ew-method').forEach(b => b.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

function pinBtn(num) {
  if (currentPin.length < 6) {
    currentPin += num;
    updatePinDisplay();
    if (currentPin.length === 6) {
      setTimeout(finaliseTopUp, 400);
    }
  }
}

function pinClear() {
  currentPin = '';
  updatePinDisplay();
}

function updatePinDisplay() {
  const dots = document.querySelectorAll('.pin-dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('filled', idx < currentPin.length);
  });
}

function doTopUp() {
  if (amt <= 0) { toast('Please select or enter an amount.'); return; }
  if (!pm) { toast('Please select a payment method.'); return; }

  if (pm === 'fpx') {
    if (currentGw === 'fpx') {
      if (!selectedBank) { toast('Please select your preferred bank.'); return; }
      showModal('modal-fpx-auth');
    } else if (currentGw === 'ewallet') {
      if (!selectedEwallet) { toast('Please select an e-wallet.'); return; }
      showModal('modal-ewallet-auth');
    } else {
      showModal('modal-card');
    }
  } else {
    // Linked Card flow
    document.getElementById('m-sum-amount').textContent = 'RM ' + amt.toFixed(2);
    document.getElementById('m-sum-method').textContent = 'Linked Visa (•••• 4321)';
    currentPin = '';
    updatePinDisplay();
    showModal('modal-pin');
  }
}

async function fpxAuthorise(success) {
  closeModal('modal-fpx-auth');
  closeModal('modal-ewallet-auth');
  closeModal('modal-card');
  if (success) {
    await processTopUp(pm === 'fpx' ? (currentGw === 'fpx' ? 'FPX Online Banking (' + selectedBank + ')' : currentGw === 'ewallet' ? 'E-Wallet (' + selectedEwallet + ')' : 'Credit/Debit Card') : 'Linked Card');
  } else {
    toast('Transaction cancelled by user.');
  }
}

async function finaliseTopUp() {
  closeModal('modal-pin');
  if (currentPin === '123456') {
    await processTopUp('Linked Card (Visa •••• 4321)');
  } else {
    toast('Incorrect security PIN!');
  }
}

async function processTopUp(methodStr) {
  toast('Processing top up...');
  try {
    const res = await fetch('api.php?action=topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: Store.user.email, amount: amt, method: methodStr })
    });
    if (res.ok) {
      const data = await res.json();
      Store.user = data.user;
      Store.historyItems = data.transactions;
      
      const receipt = {
        amount: amt,
        method: methodStr,
        ref: 'PG-' + Math.floor(100000 + Math.random() * 900000),
        balance: data.user.balance
      };
      
      Store.lastReceipt = receipt;
      Store.save();
      location.href = 'success.php';
    } else {
      toast('Top Up failed on server.');
    }
  } catch (e) {
    console.error(e);
    toast('Network error during top up.');
  }
}
