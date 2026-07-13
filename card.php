<?php
require_once 'db_conn.php';
require_once 'auth.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Card Settings – PocketGo</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/card-style.css">
</head>
<body>

<div class="page page-active" id="page-card">
  <div class="topbar-parent">
    <div style="display:flex;align-items:center;">
      <button class="back-btn" onclick="location.href='dashboard.php'">←</button>
      <div class="topbar-logo">Pocket<span>Go</span></div>
    </div>
    <div style="font-weight:700;font-size:1rem;">Card Controls</div>
  </div>

  <div class="scroll-area pb">
    <!-- Physical NFC Card Mock -->
    <div class="physical-card">
      <div class="pc-logo">Pocket<span>Go</span> Student</div>
      <div class="pc-chip"></div>
      <div class="pc-number">4012 • 4810 • 9284 • 0124</div>
      <div class="pc-row">
        <div><div class="pc-label">Student</div><div class="pc-val" id="card-child">—</div></div>
        <div><div class="pc-label">Class</div><div class="pc-val" id="card-class">—</div></div>
        <div><div class="pc-label">Status</div><div class="pc-val" style="color:#FFD700;">ACTIVE</div></div>
      </div>
      <div style="font-size:.6rem;color:rgba(255,255,255,.5);margin-top:14px;" id="card-id">ID: —</div>
    </div>

    <!-- Main Card Settings -->
    <div class="white-card" style="padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h4 style="font-size:.92rem;font-weight:700;">💳 Card NFC Operations</h4>
        <span class="tag tag-green">Secured</span>
      </div>
      <div class="card-actions">
        <button class="card-action-btn" onclick="toast('Card locking requires physical school terminal sync')">
          <div class="ca-icon">🔒</div>
          <h4>Lock Card</h4>
          <p>Temporarily disable</p>
        </button>
        <button class="card-action-btn" onclick="toast('Please report lost cards on the Reports page')">
          <div class="ca-icon">🚨</div>
          <h4>Report Lost</h4>
          <p>Card replacement</p>
        </button>
      </div>
    </div>

    <!-- Daily Spend Limit Manager -->
    <div class="white-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h4 style="font-size:.92rem;font-weight:700;">🛡️ Daily Spending Limit</h4>
        <button class="btn btn-sm btn-outline" style="padding:6px 14px;" onclick="showModal('modal-limit')">Change Limit</button>
      </div>
      
      <p style="font-size:.8rem;color:#666;margin-bottom:14px;">Controls the maximum amount your child can spend at school canteen and bookshop per day.</p>
      
      <div class="limit-bar">
        <div class="limit-fill" id="card-limit-fill" style="width: 0%;"></div>
      </div>
      
      <div style="display:flex;justify-content:space-between;font-size:.8rem;color:#1a1a1a;font-weight:600;margin-top:10px;">
        <span>Spent: RM <span id="card-spent-val">0.00</span></span>
        <span>Daily Limit: RM <span id="card-limit-val">0.00</span></span>
      </div>
      <div style="font-size:.78rem;color:#1a9e5c;font-weight:600;margin-top:4px;text-align:right;">
        Remaining: RM <span id="card-rem-val">0.00</span>
      </div>
    </div>
  </div>

  <!-- Parent Bottom Navigation -->
  <div class="bottom-nav-parent">
    <div class="nav-item" data-page="dashboard" onclick="location.href='dashboard.php'"><div class="ni-icon">🏠</div><div class="ni-label">Home</div></div>
    <div class="nav-item" data-page="topup" onclick="location.href='topup.php'"><div class="ni-icon">➕</div><div class="ni-label">Top Up</div></div>
    <div class="nav-item" data-page="history" onclick="location.href='history.php'"><div class="ni-icon">📊</div><div class="ni-label">History</div></div>
    <div class="nav-item active" data-page="card" onclick="location.href='card.php'"><div class="ni-icon">💳</div><div class="ni-label">My Card</div></div>
    <div class="nav-item" data-page="reports" onclick="location.href='reports.php'"><div class="ni-icon">📞</div><div class="ni-label">Reports</div></div>
  </div>
</div>

<!-- MODAL: SET DAILY SPENDING LIMIT -->
<div class="modal-overlay" id="modal-limit" onclick="closeModal('modal-limit')">
  <div class="modal-sheet" onclick="event.stopPropagation()">
    <div class="modal-handle"></div>
    <div class="modal-title">🛡️ Set Daily Spending Limit</div>
    <p style="font-size:.85rem;color:#666;margin-bottom:18px;">Select a standard maximum daily spending limit or specify a custom threshold.</p>
    
    <div class="amount-grid" style="margin-bottom:14px;">
      <button class="amount-btn" onclick="selectLimit(5, this)">RM 5</button>
      <button class="amount-btn" onclick="selectLimit(10, this)">RM 10</button>
      <button class="amount-btn active" onclick="selectLimit(20, this)">RM 20</button>
      <button class="amount-btn" onclick="selectLimit(30, this)">RM 30</button>
      <button class="amount-btn" onclick="selectLimit(50, this)">RM 50</button>
      <button class="amount-btn" onclick="selectLimit(100, this)">RM 100</button>
    </div>

    <div class="form-group" style="margin-bottom:20px;">
      <label>Or enter custom daily limit (RM)</label>
      <input type="number" id="card-custom-limit" placeholder="50.00" oninput="selectCustomLimit(this.value)">
    </div>

    <button class="btn btn-primary btn-full" onclick="saveLimit()">Save Limit Configuration</button>
  </div>
</div>

<div class="toast" id="toast-el"></div>

<script src="assets/js/store.js"></script>
<script src="assets/js/common.js"></script>
<script src="assets/js/card.js"></script>
</body>
</html>
