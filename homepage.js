// homepage.js - Final Stable Version with Data Seeding AND AUTH GATE

// --- PNR Constants (Must match constants in check-in.js) ---
const TEST_PNR_GOOD = "G00D1A";    // Works immediately (for testing)
const TEST_PNR_FUTURE = "FUTU8B";  // Fails check-in window (for testing)


// =========================================================
// AUTHENTICATION GATEKEEPER FUNCTION
// =========================================================
const checkAuthAndRedirect = (e) => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        e.preventDefault();

        const hasAlerted = localStorage.getItem('auth_alerted') === 'true';
        if (!hasAlerted) {
            alert('Please log in to access this feature.');
            localStorage.setItem('auth_alerted', 'true');
        }

        window.location.href = 'login.html';
        return false;
    }

    localStorage.removeItem('auth_alerted');
    return true;
};


// =========================================================
// DATA SEEDING FUNCTION (Simulated Database)
// =========================================================
const seedInitialBookings = () => {
    const existingBookings = JSON.parse(localStorage.getItem('flyease_bookings')) || [];

    const getDateHoursAgo = (hours) => {
        const d = new Date();
        d.setHours(d.getHours() - hours);
        return d.toISOString();
    };
    
    if (!existingBookings.some(b => b.pnr === TEST_PNR_GOOD)) {
        existingBookings.push({
            pnr: TEST_PNR_GOOD,
            name: 'Priya Sharma',
            lastName: 'Sharma', 
            flightRoute: 'AI-101 (DEL to JFK)',
            paymentStatus: 'SUCCESS',
            paymentDate: getDateHoursAgo(30),
        });
    }

    if (!existingBookings.some(b => b.pnr === TEST_PNR_FUTURE)) {
        existingBookings.push({
            pnr: TEST_PNR_FUTURE,
            name: 'Raj Singh',
            lastName: 'Singh',
            flightRoute: 'EK-203 (DEL to DXB)',
            paymentStatus: 'SUCCESS',
            paymentDate: getDateHoursAgo(12),
        });
    }

    localStorage.setItem('flyease_bookings', JSON.stringify(existingBookings));
    console.log('✅ Test booking data seeded.');
};


// =========================================================
// NAVIGATION BAR UPDATER + LOGOUT HANDLER
// =========================================================
const updateNavForAuth = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const nav = document.querySelector('.site-nav');

    if (nav) {
        if (isLoggedIn) {
            nav.innerHTML = `
                <a href="homepage.html">Home</a>
                <a href="#book">Book Flights</a>
                <a href="flight-schedules.html">Flight Schedules</a>
                <a href="check-in.html">Check-In</a>
                <a href="my-tickets.html">My Tickets</a> 
                <a href="#" id="logoutLink">Logout</a>
            `;
        } else {
            nav.innerHTML = `
                <a href="homepage.html">Home</a>
                <a href="#destinations">Destinations</a>
                <a href="flight-schedules.html">Flight Schedules</a>
                <a href="check-in.html">Check-In</a>
                <a href="login.html">Login</a>
            `;
        }

        // ✅ Add Logout logic dynamically
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                alert("You have been logged out.");
                window.location.href = "homepage.html";
            });
        }
    }
};


// =========================================================
// FADE-IN EFFECT ON SCROLL
// =========================================================
const fadeEls = document.querySelectorAll('.fade-in');
const fadeInOnScroll = () => {
    fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
};


// =========================================================
// MAIN DOMContentLoaded FUNCTION
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    seedInitialBookings();
    updateNavForAuth();

    // --- PROTECTED BUTTON: "Book Your Flight" ---
    const bookFlightBtn = document.querySelector('#book .btn.primary');
    if (bookFlightBtn) {
        bookFlightBtn.addEventListener('click', (e) => {
            if (checkAuthAndRedirect(e)) {
                window.location.href = 'book-flight.html';
            }
        });
    }

    // --- UNPROTECTED: "View Live Schedules" ---
    const viewScheduleBtn = document.getElementById('view-schedule-btn');
    if (viewScheduleBtn) {
        viewScheduleBtn.addEventListener('click', () => {
            window.location.href = 'flight-schedules.html'; 
        });
    }

    // --- PROTECTED FORM: HOMEPAGE CHECK-IN FORM ---
    const homeCheckinForm = document.getElementById("homepage-checkin-form");
    if (homeCheckinForm) {
        homeCheckinForm.addEventListener('submit', (e) => {
            if (checkAuthAndRedirect(e)) {
                e.preventDefault();
                const pnr = document.getElementById("pnr-input-home").value;
                const lastName = document.getElementById("lastname-input-home").value;
                window.location.href = `check-in.html?pnr=${pnr}&lastName=${lastName}`;
            } else {
                e.preventDefault();
            }
        });
    }

    fadeInOnScroll();
});


// =========================================================
// PROTECT LINKS (for dynamic nav)
// =========================================================
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        const linkHref = e.target.getAttribute('href');
        if (!linkHref) return;

        if (
            linkHref.includes('book-flight.html') ||
            linkHref.includes('check-in.html') ||
            linkHref.includes('my-tickets.html')
        ) {
            checkAuthAndRedirect(e);
        }
    }
});


// =========================================================
// SCROLL-TO-TOP BUTTON
// =========================================================
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        scrollTopBtn.style.display = window.scrollY > 400 ? 'block' : 'none';
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// =========================================================
// FADE-IN ANIMATION
// =========================================================
window.addEventListener('scroll', fadeInOnScroll);
