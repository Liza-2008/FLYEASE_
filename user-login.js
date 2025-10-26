// user-login.js - Final Code with Mock Password Check and Homepage Redirect

const MOCK_PASSWORD = 'password123'; // The password required for successful login

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('user-login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const passwordInput = document.getElementById('password');
            const password = passwordInput.value.trim();
            
            // --- SIMULATED LOGIN LOGIC (Blueprint Step 3) ---
            
            // 1. Primary check: Ensure the mock password is correct.
            if (password === MOCK_PASSWORD) {
                
                console.log('Login attempt successful.');
                
                // Simulate successful authentication delay
                setTimeout(() => {
                    alert('Login Successful! Redirecting to homepage...');
                    
                    // --- CRITICAL FIX: SET AUTHENTICATION FLAG AND REDIRECT TO HOMEPAGE ---
                    localStorage.setItem('isLoggedIn', 'true'); 
                    
                    // Redirect to the homepage, which will now display the logged-in navbar (Blueprint Step 4)
                    window.location.href = 'homepage.html'; 
                }, 1000); 

            } else {
                // If password fails
                alert('Login Failed: Invalid password. Please use the mock password "password123".');
                passwordInput.value = ''; // Clear the password field for security
            }
        });
    }
});