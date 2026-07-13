<?php
require_once 'db_conn.php';
require_once 'auth.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Management – PocketGo Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/admin-reports-style.css">
</head>
<body>

<div class="page page-active" id="page-admin-reports">
  <div class="topbar-admin">
    <div style="display:flex;align-items:center;">
      <button class="back-btn" onclick="location.href='admin-dashboard.php'">←</button>
      <div class="topbar-logo">Pocket<span>Go</span></div>
      <span class="admin-badge">📞 Reports</span>
    </div>
    <button class="btn btn-sm" style="background:#ff0040;color:#fff;padding:6px 14px;font-size:.7rem;" onclick="doLogout()">Logout</button>
  </div>
  <div class="scroll-area-admin">
    <div style="max-width:1200px;margin:0 auto;">
      <div style="margin-bottom:24px;">
        <h1 style="color:#00d4ff;font-size:1.8rem;font-weight:800;" class="glow-text">Report Management</h1>
        <p style="color:#6a6a8a;font-size:.9rem;">Card issues and complaints submitted by parents</p>
      </div>
      <div class="admin-table-container">
        <table class="admin-table" id="admin-report-table">
          <thead><tr><th>Reporter</th><th>Child</th><th>Type</th><th>Subject</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="admin-report-tbody"></tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="bottom-nav-admin">
    <div class="nav-item" data-page="admin-dashboard" onclick="location.href='admin-dashboard.php'"><div class="ni-icon">📊</div><div class="ni-label">Dashboard</div></div>
    <div class="nav-item" data-page="admin-users" onclick="location.href='admin-users.php'"><div class="ni-icon">👥</div><div class="ni-label">Users</div></div>
    <div class="nav-item" data-page="admin-transactions" onclick="location.href='admin-transactions.php'"><div class="ni-icon">💰</div><div class="ni-label">Transactions</div></div>
    <div class="nav-item active" data-page="admin-reports" onclick="location.href='admin-reports.php'"><div class="ni-icon">📞</div><div class="ni-label">Reports</div></div>
    <div class="nav-item" data-page="admin-settings" onclick="location.href='admin-settings.php'"><div class="ni-icon">⚙️</div><div class="ni-label">Settings</div></div>
  </div>
</div>

<!-- ADMIN CRUD MODAL -->
<div class="modal-overlay admin-form-modal" id="admin-crud-modal" onclick="closeModal('admin-crud-modal')">
  <div class="modal-sheet" onclick="event.stopPropagation()">
    <div class="modal-handle"></div>
    <div class="modal-title" id="admin-modal-title">Report Details</div>
    <div id="admin-modal-content"></div>
  </div>
</div>

<div class="toast" id="toast-el"></div>

<script src="assets/js/store.js"></script>
<script src="assets/js/common.js"></script>
<script src="assets/js/admin-reports.js"></script>
</body>
</html>
