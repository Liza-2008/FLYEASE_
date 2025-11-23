// homepage.js
document.addEventListener("DOMContentLoaded", () => {

    // --------------------------------------
    // MOBILE MENU TOGGLE
    // --------------------------------------
    const menuBtn = document.getElementById("menubutton");
    const navMenu = document.getElementById("nav-menu");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("hidden");
        });
    }

    // --------------------------------------
    // LOGIN STATE CHECK
    // --------------------------------------
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUserId = sessionStorage.getItem("currentUserId");

    // --------------------------------------
    // NAV MENU CONTENT (BASED ON LOGIN)
    // --------------------------------------
    if (navMenu) {
        if (isLoggedIn && currentUserId) {
            navMenu.innerHTML = `
                <a href="homepage.html">Home</a>
                <a href="available-flights.html">Book Flights</a>
                <a href="flight-schedules.html">Flight Schedules</a>
                <a href="my-tickets.html">My Tickets</a>
                <a href="check-in.html">Check-in</a>
                <a href="#" id="logoutLink">Logout</a>
            `;
        } else {
            navMenu.innerHTML = `
                <a href="homepage.html">Home</a>
                <a href="#destinations">Destinations</a>
                <a href="flight-schedules.html">Flight Schedules</a>
                <a href="check-in.html">Check-in</a>
                <a href="login.html">Login</a>
            `;
        }
    }

    // --------------------------------------
    // LOGOUT
    // --------------------------------------
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("currentUserId");
            window.location.href = "homepage.html";
        });
    }

    // --------------------------------------
    // PROTECT REDIRECT (LOGIN REQUIRED)
    // --------------------------------------
    const requiresLogin = (callback) => {
        if (!isLoggedIn || !currentUserId) {
            alert("Please log in first.");
            window.location.href = "login.html";
            return false;
        }
        callback();
    };

    // --------------------------------------
    // BOOK FLIGHT BUTTON (NOW -> book-flight.html)
    // --------------------------------------
    const bookBtn = document.getElementById("homepage-book-btn");
    if (bookBtn) {
        bookBtn.addEventListener("click", () => {
            requiresLogin(() => {
                // Redirect to the trip selection page (book-flight.html)
                window.location.href = "book-flight.html";
            });
        });
    }

    // --------------------------------------
    // VIEW SCHEDULE
    // --------------------------------------
    const scheduleBtn = document.getElementById("view-schedule-btn");
    if (scheduleBtn) {
        scheduleBtn.addEventListener("click", () => {
            window.location.href = "flight-schedules.html";
        });
    }

    // --------------------------------------
    // CHECK-IN FORM
    // --------------------------------------
    const checkinForm = document.getElementById("homepage-checkin-form");
    if (checkinForm) {
        checkinForm.addEventListener("submit", (e) => {
            e.preventDefault();

            requiresLogin(() => {
                const pnr = document.getElementById("pnr-input-home").value;
                const last = document.getElementById("lastname-input-home").value;

                window.location.href = `check-in.html?pnr=${encodeURIComponent(pnr)}&lastName=${encodeURIComponent(last)}`;
            });
        });
    }

    // --------------------------------------
    // FADE-IN SCROLL EFFECT
    // --------------------------------------
    const fadeEls = document.querySelectorAll(".fade-in");

    const fadeInOnScroll = () => {
        fadeEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add("visible");
            }
        });
    };

    window.addEventListener("scroll", fadeInOnScroll);
    fadeInOnScroll(); // initial run

});