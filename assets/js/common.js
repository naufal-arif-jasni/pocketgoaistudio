/* ============================================================
   common.js
   Shared UI helpers used across every page: toast, modal
   show/hide, logout, and simple auth guards.
   Requires store.js to be loaded first.
   ============================================================ */

// ── TOAST ──
function toast(msg) {
  const el = document.getElementById('toast-el');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

// ── MODAL ──
function showModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

// ── AUTH GUARDS ──
// Call at the top of every parent-only page.
function requireParentAuth() {
  if (!Store.loggedIn) {
    window.location.href = 'login.php';
  }
}

// Call at the top of every admin-only page.
function requireAdminAuth() {
  if (!Store.isAdmin) {
    window.location.href = 'login.php';
  }
}

// ── LOGOUT ──
function doLogout() {
  Store.reset();
}

// ── BOTTOM NAV ACTIVE-STATE HELPER ──
// Marks a bottom-nav item active based on the current file name,
// so we don't have to hand-edit "active" classes per page.
function markActiveNav(navSelector, page) {
  document.querySelectorAll(navSelector + ' .nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
}
