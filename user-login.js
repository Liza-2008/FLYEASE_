// user-login.js - Updated to use Fetch API for verification

const BASE_URL = 'http://localhost:3000/';
const USER_HOMEPAGE = 'homepage.html';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('user-login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => { // ADD async HERE
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Fetch users from the JSON Server
            const users = await fetchUsers();
            
            // Simulate Authentication Check
            const user = users.find(u => u.email === email && u.password === password && u.role === 'user');
            
            if (user) {
                console.log(`Login attempt for ${email} successful.`);
                
                setTimeout(() => {
                    alert('Login Successful! Redirecting to homepage...');
                    localStorage.setItem('isLoggedIn', 'true'); 
                    window.location.href = USER_HOMEPAGE; 
                }, 1000); 

            } else {
                alert('Login Failed: Invalid credentials or not a User role.');
                passwordInput.value = ''; 
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