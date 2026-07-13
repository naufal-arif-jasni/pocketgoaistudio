// topup.js - Topup flow with multi-card selection and credit card linking
let amt = 0;
let pm = 'fpx'; // Default to FPX
let currentGw = 'fpx';
let selectedBank = '';
let selectedEwallet = '';
let currentPin = '';

Store.init().then(() => {
  requireParentAuth();
  renderTopupPage();
  selectAmount(50, document.querySelector('.amount-btn'));
});

function renderTopupPage() {
  const u = Store.user;
  const cards = u.cards || [];

  if (cards.length === 0) {
    document.getElementById('tu-no-card-block').style.display = 'block';
    document.getElementById('tu-active-container').style.display = 'none';
    return;
  }

  document.getElementById('tu-no-card-block').style.display = 'none';
  document.getElementById('tu-active-container').style.display = 'block';

  // Load select options
  const selector = document.getElementById('tu-card-selector');
  selector.innerHTML = cards.map(c => `
    <option value="${c.card_serial}">
      ${c.student_name} (${c.class}) — Balance: RM ${parseFloat(c.balance).toFixed(2)}
    </option>
  `).join('');

  // Render payment methods dynamically based on Visa card state
  const dynamicVisa = document.getElementById('dynamic-visa-method');
  if (u.visa_card) {
    dynamicVisa.innerHTML = `
      <div class="pay-method" id="pm-saved" onclick="selectMethod('saved', 'pm-saved')">
        <div class="pm-icon">💳</div>
        <div class="pm-info">
          <h4>Linked Visa Card (${u.visa_card.card_number})</h4>
          <p>Instant authorized 1-click top up using security PIN</p>
        </div>
        <div class="pm-check">✓</div>
      </div>
    `;
  } else {
    dynamicVisa.innerHTML = `
      <div class="pay-method" id="pm-link-visa" onclick="openVisaLinkModal()">
        <div class="pm-icon">💳</div>
        <div class="pm-info">
          <h4>Link Visa/MasterCard</h4>
          <p>Securely link credit or debit card for quick top ups</p>
        </div>
        <div class="pm-add">➕</div>
      </div>
    `;
    // If the currently selected method was 'saved', default back to 'fpx'
    if (pm === 'saved') {
      pm = 'fpx';
      document.getElementById('pm-fpx').classList.add('active');
    }
  }
}

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

function openVisaLinkModal() {
  showModal('modal-link-visa');
}

function formatCardNumber(input) {
  let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  let formatted = '';
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += ' ';
    }
    formatted += value[i];
  }
  input.value = formatted;
}

function formatExpiry(input) {
  let value = input.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
  if (value.length >= 2) {
    input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
  } else {
    input.value = value;
  }
}

async function saveVisaCard() {
  const name = document.getElementById('visa-holder-name').value.trim();
  const cardNum = document.getElementById('visa-card-number').value.replace(/\s/g, '');
  const expiry = document.getElementById('visa-expiry').value.trim();
  const cvv = document.getElementById('visa-cvv').value.trim();

  if (!name || !cardNum || !expiry || !cvv) {
    toast('Please fill in all credit card details.');
    return;
  }

  if (cardNum.length < 13 || cardNum.length > 19 || isNaN(Number(cardNum))) {
    toast('Invalid credit card number format.');
    return;
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    toast('Expiry date must be in MM/YY format.');
    return;
  }

  if (cvv.length !== 3 || isNaN(Number(cvv))) {
    toast('CVV must be exactly 3 digits.');
    return;
  }

  toast('Securing encrypted connection...');
  try {
    const res = await fetch('api.php?action=link-visa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: Store.user.email,
        cardholder_name: name,
        card_number: cardNum,
        expiry_date: expiry,
        cvv: cvv
      })
    });

    if (res.ok) {
      toast('Card linked and verified successfully!');
      await Store.fetchUserData(Store.user.email);
      Store.save();
      closeModal('modal-link-visa');
      renderTopupPage();
    } else {
      const err = await res.json();
      toast(err.error || 'Failed to link card.');
    }
  } catch (e) {
    console.error(e);
    toast('Error processing request.');
  }
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

  const u = Store.user;
  const cards = u.cards || [];
  if (cards.length === 0) {
    toast('⚠️ Please register a student card first.');
    return;
  }

  if (pm === 'fpx') {
    if (currentGw === 'fpx') {
      if (!selectedBank) { toast('Please select your preferred bank.'); return; }
      showModal('modal-fpx-auth');
    } else if (currentGw === 'ewallet') {
      if (!selectedEwallet) { toast('Please select an e-wallet.'); return; }
      showModal('modal-fpx-auth'); // reused secure gateway modal
    } else {
      showModal('modal-fpx-auth');
    }
  } else {
    // Linked Card flow
    document.getElementById('m-sum-amount').textContent = 'RM ' + amt.toFixed(2);
    document.getElementById('m-sum-method').textContent = `Linked Visa (${u.visa_card.card_number})`;
    currentPin = '';
    updatePinDisplay();
    showModal('modal-pin');
  }
}

async function fpxAuthorise(success) {
  closeModal('modal-fpx-auth');
  if (success) {
    let sourceStr = '';
    if (currentGw === 'fpx') sourceStr = 'FPX Online Banking (' + selectedBank + ')';
    else if (currentGw === 'ewallet') sourceStr = 'E-Wallet (' + selectedEwallet + ')';
    else sourceStr = 'Credit/Debit Card';
    await processTopUp(sourceStr);
  } else {
    toast('Transaction cancelled by user.');
  }
}

async function finaliseTopUp() {
  closeModal('modal-pin');
  if (currentPin === '123456') {
    await processTopUp(`Saved Card (${Store.user.visa_card.card_number})`);
  } else {
    toast('Incorrect security PIN!');
  }
}

async function processTopUp(methodStr) {
  toast('Processing top up...');
  const cardSerial = document.getElementById('tu-card-selector').value;
  try {
    const res = await fetch('api.php?action=topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: Store.user.email, 
        amount: amt, 
        method: methodStr,
        card_serial: cardSerial
      })
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
      const err = await res.json();
      toast(err.error || 'Top Up failed on server.');
    }
  } catch (e) {
    console.error(e);
    toast('Network error during top up.');
  }
}
