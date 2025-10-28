// admin-login.js - Updated to use Fetch API for verification

const BASE_URL = 'http://localhost:3000/';
const ADMIN_DASHBOARD = 'admin.html';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => { // ADD async HERE
            e.preventDefault();
            
            const emailInput = document.getElementById('admin-email');
            const passwordInput = document.getElementById('admin-password');
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            const users = await fetchUsers();
            
            // Simulate Authentication Check
            const adminUser = users.find(u => u.email === email && u.password === password && u.role === 'admin');
            
            if (adminUser) {
                console.log('Admin login attempt successful.');
                setTimeout(() => {
                    alert('Admin Login Successful! Redirecting to Admin Dashboard...');
                    localStorage.setItem('isLoggedIn', 'true'); 
                    window.location.href = ADMIN_DASHBOARD; 
                }, 1000); 

            } else {
                alert('Login Failed: Invalid credentials or role.');
            }
        });
    }
});

// New Fetch Utility for this file
const fetchUsers = async () => {
    try {
        const response = await fetch(`${BASE_URL}users`);
        return response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Cannot connect to database. Ensure JSON server is running.');
        return [];
    }
};