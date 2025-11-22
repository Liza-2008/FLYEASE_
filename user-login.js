document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("userLoginForm");
    const errorMsg = document.getElementById("login-error");

    async function fetchUsers() {
        const res = await fetch("http://localhost:3000/users");
        return res.json();
    }

    async function createUser(user) {
        return fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        let users = await fetchUsers();
        let foundUser = users.find(
            u => u.email.toLowerCase() === email.toLowerCase()
        );

        // ✔ If user already exists, validate password
        if (foundUser) {
            if (foundUser.password === password) {
                sessionStorage.setItem("currentUserId", foundUser.id);
                window.location.href = "homepage.html";
            } else {
                errorMsg.textContent = "Incorrect password.";
            }
            return;
        }

        // ✔ If user does not exist, create a new account
        const newUser = {
            id: "U" + Math.random().toString(36).substring(2, 6),
            name: email.split("@")[0],
            email,
            password,
            role: "passenger"
        };

        await createUser(newUser);

        sessionStorage.setItem("currentUserId", newUser.id);
        window.location.href = "homepage.html";

    });

});