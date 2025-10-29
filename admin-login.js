const BASE_URL = 'http://localhost:3000/';
const HOMEPAGES = {
  passenger: 'homepage.html',
  admin: 'admin.html',
  support: 'support.html',
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

// ====== Detect Role (Always Admin) ======
function detectRoleFromPage() {
  return 'admin'; // fixed role for admin login
}

// ====== Page Ready ======
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  if (!loginForm) return;

  const loginButton = loginForm.querySelector('.btn.primary');
  const role = detectRoleFromPage();

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    if (!email || !password) {
      showToast('⚠ Please enter both email and password.', 'warning');
      return;
    }

    // Show loading state
    loginButton.disabled = true;
    loginButton.innerHTML = '<span class="loader"></span> Logging in...';

    // Fetch users
    const users = await fetchUsers();

    // Match admin credentials
    const adminUser = users.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (adminUser) {
      console.log(` Login successful for ${email} (${adminUser.role})`);
      showToast(' Admin Login successful! Redirecting...', 'success');

      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', adminUser.role);
        localStorage.setItem('userEmail', email);
        window.location.href = HOMEPAGES.admin;
      }, 1500);
    } else {
      console.warn(` Invalid admin credentials for ${email}`);
      showToast(' Invalid credentials. Try again.', 'error');
      document.getElementById('admin-password').value = '';
      loginButton.disabled = false;
      loginButton.textContent = 'Log In';
    }
  });
});
