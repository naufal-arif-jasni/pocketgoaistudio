<?php
require_once 'db_conn.php';
require_once 'auth.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Top Up – PocketGo</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/topup-style.css">
</head>
<body>

<div class="page page-active" id="page-topup">
  <div class="topbar-parent">
    <div style="display:flex;align-items:center;">
      <button class="back-btn" onclick="location.href='dashboard.php'">←</button>
      <div class="topbar-logo">Pocket<span>Go</span></div>
    </div>
    <div style="font-weight:700;font-size:1rem;">Top Up Wallet</div>
  </div>

  <div class="scroll-area pb">
    <div class="white-card">
      <div style="font-size:.8rem;color:#666;font-weight:600;">TOPPING UP WALLET FOR</div>
      <h3 style="font-size:1.25rem;font-weight:800;color:#C8102E;margin-top:2px;" id="tu-child">—</h3>
    </div>

    <div class="white-card">
      <h4 style="font-size:.9rem;font-weight:700;margin-bottom:12px;">1. Select Amount (RM)</h4>
      <div class="amount-grid">
        <button class="amount-btn active" onclick="selectAmount(10, this)">10</button>
        <button class="amount-btn" onclick="selectAmount(20, this)">20</button>
        <button class="amount-btn" onclick="selectAmount(50, this)">50</button>
        <button class="amount-btn" onclick="selectAmount(100, this)">100</button>
        <button class="amount-btn" onclick="selectAmount(200, this)">200</button>
        <button class="amount-btn" onclick="selectAmount(500, this)">500</button>
      </div>
      <div style="margin-top:14px;">
        <label>Or enter custom amount (RM)</label>
        <input type="number" id="tu-custom-amount" placeholder="0.00" oninput="selectCustomAmount(this.value)">
      </div>
    </div>

    <div class="white-card">
      <h4 style="font-size:.9rem;font-weight:700;margin-bottom:14px;">2. Payment Method</h4>
      
      <!-- FPX / External Gateways -->
      <div class="pay-method active" id="pm-fpx" onclick="selectMethod('fpx', 'pm-fpx')">
        <div class="pm-icon">🏦</div>
        <div class="pm-info">
          <h4>FPX / Cards / E-Wallets</h4>
          <p>Pay instantly using your preferred online payment gateways</p>
        </div>
        <div class="pm-check">✓</div>
      </div>

      <!-- Linked Saved Card -->
      <div class="pay-method" id="pm-saved" onclick="selectMethod('saved', 'pm-saved')">
        <div class="pm-icon">💳</div>
        <div class="pm-info">
          <h4>Linked Visa Card (•••• 4321)</h4>
          <p>Instant authorized 1-click top up using security PIN</p>
        </div>
        <div class="pm-check">✓</div>
      </div>
    </div>

    <button class="btn btn-primary btn-full" style="margin-top:10px;" onclick="doTopUp()">Proceed to Payment</button>
  </div>

  <!-- Parent Bottom Navigation -->
  <div class="bottom-nav-parent">
    <div class="nav-item" data-page="dashboard" onclick="location.href='dashboard.php'"><div class="ni-icon">🏠</div><div class="ni-label">Home</div></div>
    <div class="nav-item active" data-page="topup" onclick="location.href='topup.php'"><div class="ni-icon">➕</div><div class="ni-label">Top Up</div></div>
    <div class="nav-item" data-page="history" onclick="location.href='history.php'"><div class="ni-icon">📊</div><div class="ni-label">History</div></div>
    <div class="nav-item" data-page="card" onclick="location.href='card.php'"><div class="ni-icon">💳</div><div class="ni-label">My Card</div></div>
    <div class="nav-item" data-page="reports" onclick="location.href='reports.php'"><div class="ni-icon">📞</div><div class="ni-label">Reports</div></div>
  </div>
</div>

<!-- MODAL: EXTERNAL GATEWAY MULTI-TAB PORTAL -->
<div class="modal-overlay" id="modal-fpx-auth" onclick="closeModal('modal-fpx-auth')">
  <div class="modal-sheet" onclick="event.stopPropagation()" style="max-height:85vh;overflow-y:auto;">
    <div class="modal-handle"></div>
    <div class="modal-title">💸 FPX Gateway Secure Checkout</div>
    
    <div class="gateway-badge">
      <span class="gw-pill" style="background:#e6f4ea;color:#137333;">🔒 Secure HTTPS 256-Bit</span>
      <span class="gw-pill" style="background:#feefe3;color:#b06000;">SMK Setia Alam Cashless Portal</span>
    </div>

    <!-- Gateway Selector Tabs -->
    <div style="display:flex;gap:8px;margin-bottom:18px;overflow-x:auto;padding-bottom:4px;">
      <button class="gw-tab active" onclick="gwTab('fpx', this)">👨‍💼 Online Banking</button>
      <button class="gw-tab" onclick="gwTab('ewallet', this)">📱 E-Wallets</button>
      <button class="gw-tab" onclick="gwTab('card', this)">💳 Credit Card</button>
    </div>

    <!-- TAB Content: Online Banking -->
    <div class="gw-section" id="gw-fpx">
      <div class="fpx-info">Select your retail online banking account to proceed:</div>
      <div class="bank-grid">
        <button class="bank-btn" onclick="selectBank('Maybank2u', this)"><span class="bank-logo" style="background:#ffcc00;color:#000;">M</span>Maybank2u</button>
        <button class="bank-btn" onclick="selectBank('CIMB Clicks', this)"><span class="bank-logo" style="background:#c00000;">C</span>CIMB Clicks</button>
        <button class="bank-btn" onclick="selectBank('Public Bank', this)"><span class="bank-logo" style="background:#0033aa;">P</span>Public Bank</button>
        <button class="bank-btn" onclick="selectBank('RHB Now', this)"><span class="bank-logo" style="background:#0099ff;">R</span>RHB Now</button>
        <button class="bank-btn" onclick="selectBank('Bank Islam', this)"><span class="bank-logo" style="background:#005500;">B</span>Bank Islam</button>
        <button class="bank-btn" onclick="selectBank('AmBank', this)"><span class="bank-logo" style="background:#ee3300;">A</span>AmBank</button>
      </div>
      <button class="btn btn-primary btn-full" onclick="fpxAuthorise(true)">Authorise FPX Payment</button>
    </div>

    <!-- TAB Content: E-wallets -->
    <div class="gw-section hidden" id="gw-ewallet">
      <div class="ew-method" id="ew-tng" onclick="selectEwallet('Touch n Go', 'ew-tng')">
        <div class="ew-logo" style="background:#0051ba;color:#fff;font-size:.7rem;font-weight:700;">TnG</div>
        <div class="ew-info">
          <div class="ew-name">Touch 'n Go eWallet</div>
          <div class="ew-sub">Pay instantly via TNG app</div>
        </div>
        <div class="ew-check">✓</div>
      </div>
      <div class="ew-method" id="ew-grab" onclick="selectEwallet('GrabPay', 'ew-grab')">
        <div class="ew-logo" style="background:#00b14f;color:#fff;font-size:.7rem;font-weight:700;">Grab</div>
        <div class="ew-info">
          <div class="ew-name">GrabPay</div>
          <div class="ew-sub">Earn GrabRewards points instantly</div>
        </div>
        <div class="ew-check">✓</div>
      </div>
      <div class="ew-method" id="ew-boost" onclick="selectEwallet('Boost', 'ew-boost')">
        <div class="ew-logo" style="background:#ff0033;color:#fff;font-size:.7rem;font-weight:700;">B</div>
        <div class="ew-info">
          <div class="ew-name">Boost Wallet</div>
          <div class="ew-sub">Pay securely with red Boost App</div>
        </div>
        <div class="ew-check">✓</div>
      </div>
      <button class="btn btn-primary btn-full" onclick="fpxAuthorise(true)">Pay with Selected E-Wallet</button>
    </div>

    <!-- TAB Content: Credit Card -->
    <div class="gw-section hidden" id="gw-card">
      <div class="card-preview">
        <div class="cp-num">•••• •••• •••• ••••</div>
        <div class="cp-row">
          <div><div class="cp-label">CARD HOLDER</div><div style="font-weight:600;font-size:.85rem;">YOUR NAME</div></div>
          <div><div class="cp-label">EXPIRES</div><div style="font-weight:600;font-size:.85rem;">MM/YY</div></div>
        </div>
      </div>
      <div class="form-group"><label>Cardholder Name</label><input type="text" placeholder="Ahmad Abdullah"></div>
      <div class="form-group"><label>Card Number</label><input type="text" placeholder="4111 2222 3333 4444"></div>
      <div class="form-row">
        <div class="form-group"><label>Expiry Date</label><input type="text" placeholder="MM/YY"></div>
        <div class="form-group"><label>CVV / CVC</label><input type="password" placeholder="•••"></div>
      </div>
      <button class="btn btn-primary btn-full" onclick="fpxAuthorise(true)">Submit Secure Payment</button>
    </div>
  </div>
</div>

<!-- MODAL: SECURITY PIN ENTRY (SAVED CARD) -->
<div class="modal-overlay" id="modal-pin" onclick="closeModal('modal-pin')">
  <div class="modal-sheet" onclick="event.stopPropagation()">
    <div class="modal-handle"></div>
    <div class="modal-title" style="text-align:center;">🔒 Enter Security PIN</div>
    <p style="text-align:center;font-size:.85rem;color:#666;margin-bottom:18px;">Please enter your 6-digit transaction PIN to authorise this payment.</p>

    <div class="payment-summary">
      <div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:4px;"><span style="color:#666;">Payment to</span><strong>SMK Setia Alam</strong></div>
      <div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:4px;"><span style="color:#666;">Amount</span><strong style="color:#C8102E;" id="m-sum-amount">RM 0.00</strong></div>
      <div style="display:flex;justify-content:space-between;font-size:.82rem;"><span style="color:#666;">Funding Source</span><span id="m-sum-method" style="font-size:.78rem;">—</span></div>
    </div>

    <!-- PIN display bubbles -->
    <div class="pin-display">
      <div class="pin-dot"></div>
      <div class="pin-dot"></div>
      <div class="pin-dot"></div>
      <div class="pin-dot"></div>
      <div class="pin-dot"></div>
      <div class="pin-dot"></div>
    </div>

    <!-- Custom Stylised Pin-Pad -->
    <div class="pin-pad">
      <button class="pin-btn" onclick="pinBtn('1')">1</button>
      <button class="pin-btn" onclick="pinBtn('2')">2</button>
      <button class="pin-btn" onclick="pinBtn('3')">3</button>
      <button class="pin-btn" onclick="pinBtn('4')">4</button>
      <button class="pin-btn" onclick="pinBtn('5')">5</button>
      <button class="pin-btn" onclick="pinBtn('6')">6</button>
      <button class="pin-btn" onclick="pinBtn('7')">7</button>
      <button class="pin-btn" onclick="pinBtn('8')">8</button>
      <button class="pin-btn" onclick="pinBtn('9')">9</button>
      <button class="pin-btn" style="font-size:.8rem;" onclick="pinClear()">Clear</button>
      <button class="pin-btn" onclick="pinBtn('0')">0</button>
      <button class="pin-btn" style="font-size:.8rem;color:#ccc;" disabled>#</button>
    </div>
    
    <div style="text-align:center;font-size:.78rem;color:#999;margin-top:14px;">Demo PIN: <strong>123456</strong></div>
  </div>
</div>

<div class="toast" id="toast-el"></div>

<script src="assets/js/store.js"></script>
<script src="assets/js/common.js"></script>
<script src="assets/js/topup.js"></script>
</body>
</html>
