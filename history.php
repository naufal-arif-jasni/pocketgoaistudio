<?php
require_once 'db_conn.php';
require_once 'auth.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image" href="images/logo.png">
  <title>Transaction History – PocketGo</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/history-style.css">
</head>
<body>

<div class="page page-active" id="page-history">
  <div class="topbar-parent">
    <div style="display:flex;align-items:center;">
      <button class="back-btn" onclick="location.href='dashboard.php'">←</button>
      <div class="topbar-logo">Pocket<span>Go</span></div>
    </div>
    <div style="font-weight:700;font-size:1rem;">Card History</div>
  </div>

  <div class="scroll-area pb">
    <!-- Category Filter Tabs -->
    <div class="filter-tabs">
      <button class="filter-tab active" onclick="filterTxns('all', this)">📄 All</button>
      <button class="filter-tab" onclick="filterTxns('topup', this)">⬆️ Top Ups</button>
      <button class="filter-tab" onclick="filterTxns('canteen', this)">🍱 Canteen</button>
      <button class="filter-tab" onclick="filterTxns('shop', this)">📚 Bookshop</button>
    </div>

    <!-- History items container -->
    <div id="hist-container">
      <div style="text-align:center;padding:20px;color:#888;font-size:.9rem;">Loading logs...</div>
    </div>
  </div>

  <!-- Parent Bottom Navigation -->
  <div class="bottom-nav-parent">
    <div class="nav-item" data-page="dashboard" onclick="location.href='dashboard.php'"><div class="ni-icon">🏠</div><div class="ni-label">Home</div></div>
    <div class="nav-item" data-page="topup" onclick="location.href='topup.php'"><div class="ni-icon">➕</div><div class="ni-label">Top Up</div></div>
    <div class="nav-item active" data-page="history" onclick="location.href='history.php'"><div class="ni-icon">📊</div><div class="ni-label">History</div></div>
    <div class="nav-item" data-page="card" onclick="location.href='card.php'"><div class="ni-icon">💳</div><div class="ni-label">My Card</div></div>
    <div class="nav-item" data-page="reports" onclick="location.href='reports.php'"><div class="ni-icon">📞</div><div class="ni-label">Reports</div></div>
  </div>
</div>

<div class="toast" id="toast-el"></div>

<script src="assets/js/store.js"></script>
<script src="assets/js/common.js"></script>
<script src="assets/js/history.js"></script>
</body>
</html>
