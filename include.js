/* include.js — Universal Header & Footer Loader */

// STEP 1: Load external HTML components
document.addEventListener("DOMContentLoaded", () => {
    const includes = document.querySelectorAll("[data-include]");

    includes.forEach(el => {
        const file = el.getAttribute("data-include");

        fetch(file)
            .then(resp => resp.text())
            .then(html => {
                el.innerHTML = html;
                if (file === "header.html") setupDynamicNavbar(); 
            });
    });
});

// STEP 2: Dynamic Navbar for all pages
function setupDynamicNavbar() {

    const nav = document.getElementById("global-nav");
    if (!nav) return;

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
        nav.innerHTML = `
            <a href="homepage.html">Home</a>
            <a href="book-flight.html">Book Flights</a>
            <a href="flight-schedules.html">Flight Schedules</a>
            <a href="check-in.html">Check-In</a>
            <a href="my-tickets.html">My Tickets</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;
    } else {
        nav.innerHTML = `
            <a href="homepage.html">Home</a>
            <a href="book-flight.html">Book Flights</a>
            <a href="flight-schedules.html">Flight Schedules</a>
            <a href="check-in.html">Check-In</a>
            <a href="login.html">Login</a>
        `;
    }

    // Logout handler
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            alert("Logged out!");
            window.location.href = "homepage.html";
        });
    }
}
