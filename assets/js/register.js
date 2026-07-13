// register.js - Register Logic
Store.init().then(() => {
  if (Store.loggedIn) {
    location.href = 'dashboard.php';
  }
});

async function doRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const ic = document.getElementById('reg-ic').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const pass = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;

  if (!name || !email || !pass) { toast('Please fill in required fields.'); return; }
  if (pass !== pass2) { toast('Passwords do not match!'); return; }
  if (pass.length < 8) { toast('Password must be at least 8 characters!'); return; }

  toast('Creating account...');
  try {
    const response = await fetch('api.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, ic, email, phone, password: pass
      })
    });

    if (response.ok) {
      const data = await response.json();
      Store.loggedIn = true;
      Store.isAdmin = false;
      Store.user = data.user;
      Store.save();
      toast('Account created! Welcome, ' + name.split(' ')[0] + '!');
      setTimeout(() => location.href = 'dashboard.php', 1200);
    } else {
      const err = await response.json();
      toast(err.error || 'Registration failed!');
    }
  } catch (e) {
    console.error(e);
    toast('Registration failed. Server error.');
  }
}
