// support-login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('support-login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // --- SIMULATED SUPPORT LOGIN LOGIC ---
            
            console.log('Support login attempt initiated...');
            
            // Simulate successful authentication delay
            setTimeout(() => {
                alert('Support Login Successful! Redirecting to Support Panel...');
                
                // Blueprint Step 12 requires a dedicated panel (e.g., support-dashboard.html)
                window.location.href = 'support-dashboard.html'; 
            }, 1000); // 1 second delay simulation
        });
    }
});