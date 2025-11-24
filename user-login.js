document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("userLoginForm");
    const errorMsg = document.getElementById("login-error");

    async function getUsers() {
        const res = await fetch("http://localhost:3000/users");
        return res.json();
    }

    async function createUser(newUser) {
        return fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();

        // Load all users
        const users = await getUsers();

        // Check if user exists
        const existing = users.find(u => u.email.toLowerCase() === email);

        // ✔ USER EXISTS → Check password
        if (existing) {
            if (existing.password === password) {
                // Login success
                sessionStorage.setItem("currentUserId", existing.id);
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = "homepage.html";
            } else {
                errorMsg.textContent = "❌ Incorrect password.";
            }
            return;
        }

        // ✔ USER DOES NOT EXIST → Create new user account
       // ✔ USER DOES NOT EXIST → Create new user account
const newUser = {
    id: "u" + Math.random().toString(36).substring(2, 6),
    name: email.split("@")[0],
    email: email.toLowerCase(),   // 🔥 VERY IMPORTANT FIX
    password
};

        await createUser(newUser);
        sessionStorage.setItem("currentUserId", newUser.id);
        localStorage.setItem("isLoggedIn", "true");   // 🔥 FIX
        window.location.href = "homepage.html";

        // Save user session
        sessionStorage.setItem("currentUserId", newUser.id);
        window.location.href = "homepage.html";

    });

});