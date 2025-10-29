
const BASE_URL = 'http://localhost:3000/';
const HOMEPAGES = {
  passenger: 'homepage.html',
  admin: 'admin-dashboard.html',
  support: 'support-dashboard.html',
};

// ====== Toast Notification ======
function showToast(message, type = 'info') {
  const oldToast = document.querySelector('.toast');
  if (oldToast) oldToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => toast.classList.remove('show'), 3000);
  setTimeout(() => toast.remove(), 3600);
}

// ====== Fetch Users ======
const fetchUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}users`);
    if (!response.ok) throw new Error('Database connection failed');
    return await response.json();
  } catch (error) {
    console.error(' Error fetching users:', error);
    showToast('⚠ Cannot connect to server. Check JSON Server.', 'error');
    return [];
  }
};

// ====== Detect Role Based on Page ======
function detectRoleFromPage() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('admin')) return 'admin';
  if (path.includes('support')) return 'support';
  return 'passenger'; // default
}

// ====== Page Ready ======
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('user-login-form');
  if (!loginForm) return;

  const loginButton = loginForm.querySelector('.btn.primary');
  const role = detectRoleFromPage();

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      showToast('⚠ Please enter both email and password.', 'warning');
      return;
    }

    // Show loading state
    loginButton.disabled = true;
    loginButton.innerHTML = '<span class="loader"></span> Logging in...';

    // Fetch users
    const users = await fetchUsers();

    // Support flexible role matching (passenger or user)
    const user = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        (u.role === role || (role === 'passenger' && u.role === 'user'))
    );

    if (user) {
      console.log(` Login successful for ${email} (${user.role})`);
      showToast(' Login successful! Redirecting...', 'success');

      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', email);
        window.location.href = HOMEPAGES[user.role] || HOMEPAGES.passenger;
      }, 1500);
    } else {
      console.warn(` Invalid credentials for ${email} (${role})`);
      showToast(' Invalid credentials. Try again.', 'error');
      document.getElementById('password').value = '';
      loginButton.disabled = false;
      loginButton.textContent = 'Log In';
    }
  });
});
