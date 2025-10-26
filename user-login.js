// user-login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('user-login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // --- SIMULATED LOGIN LOGIC (Blueprint Step 3) ---
            
            console.log('Login attempt initiated...');
            
            // Simulate successful authentication delay
            setTimeout(() => {
                alert('Login Successful! Redirecting to dashboard...');
                
                // --- CRITICAL ADDITION: SET AUTHENTICATION FLAG ---
                localStorage.setItem('isLoggedIn', 'true'); 
                
                [cite_start]// Redirect to User Dashboard (user-dashboard.html) on success [cite: 27]
                window.location.href = 'user-dashboard.html'; 
            }, 1000); // 1 second delay simulation
        });
    }
});