// homepage.js - Final Stable Version with Data Seeding AND AUTH GATE

// --- PNR Constants (Must match constants in check-in.js) ---
const TEST_PNR_GOOD = "G00D1A";    // Works immediately (for testing)
const TEST_PNR_FUTURE = "FUTU8B";  // Fails check-in window (for testing)


// --- Authentication Gatekeeper Function ---
const checkAuthAndRedirect = (e) => {
    // Check if the user is logged in (flag set in user-login.js)
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        e.preventDefault(); // Stop the transactional action
        
        // Use a simple local flag to ensure the alert only fires once per protected click attempt
        const hasAlerted = localStorage.getItem('auth_alerted') === 'true';
        
        if (!hasAlerted) {
             alert('Please log in to access this feature.');
             localStorage.setItem('auth_alerted', 'true');
        }
        
        // Redirect to the login selection page
        window.location.href = 'login.html';
        return false;
    }
    // If authenticated, clear the alert flag and proceed
    localStorage.removeItem('auth_alerted');
    return true;
};


// =========================================================
// 0. Data Seeding Function (Simulated Database)
// =========================================================

const seedInitialBookings = () => {
    const existingBookings = JSON.parse(localStorage.getItem('flyease_bookings')) || [];

    const getDateHoursAgo = (hours) => {
        const d = new Date();
        d.setHours(d.getHours() - hours);
        return d.toISOString();
    };
    
    // --- PNR 1: GOOD PNR (Check-in available now) ---
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

    // --- PNR 2: FUTURE PNR (Too early for check-in) ---
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
    console.log('Test booking data seeded.');
};


// --- Function to handle the fade-in effect ---
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
// 1. Core Functionality: Button Click Listeners & Form Submissions
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    seedInitialBookings(); 
    
    // --- PROTECTED BUTTON: "Book Your Flight" Teaser Button ---
    const bookFlightBtn = document.querySelector('#book .btn.primary');
    if (bookFlightBtn) {
        bookFlightBtn.addEventListener('click', (e) => {
            if (checkAuthAndRedirect(e)) {
                // If checkAuthAndRedirect returns true, this code runs:
                window.location.href = 'book-flight.html';
            }
        });
    }

    // Logic for "View Live Schedules" button (UNPROTECTED)
    const viewScheduleBtn = document.getElementById('view-schedule-btn');
    if (viewScheduleBtn) {
        viewScheduleBtn.addEventListener('click', (e) => {
             // NO AUTH CHECK NEEDED
            window.location.href = 'flight-schedules.html'; 
        });
    }
    
    // --- PROTECTED FORM: HOMEPAGE CHECK-IN FORM SUBMISSION ---
    const homeCheckinForm = document.getElementById("homepage-checkin-form");
    if (homeCheckinForm) {
        homeCheckinForm.addEventListener('submit', (e) => {
            if (checkAuthAndRedirect(e)) { 
                // If authenticated, proceed with original redirection logic
                e.preventDefault(); // Prevent default submission if auth passes
                const pnr = document.getElementById("pnr-input-home").value;
                const lastName = document.getElementById("lastname-input-home").value;
                window.location.href = `check-in.html?pnr=${pnr}&lastName=${lastName}`;
            } else {
                 e.preventDefault(); // Ensure form doesn't submit if auth fails
            }
        });
    }

    // Call fade-in on load
    fadeInOnScroll();
});


// =========================================================
// 2. Navigation Link Protections & Smooth Scroll
// =========================================================
document.querySelectorAll('nav a').forEach(link => {
    const linkHref = link.getAttribute('href');

    // Filter out smooth scroll links (starts with #)
    if (linkHref.startsWith('#')) {
        // --- UNPROTECTED: SMOOTH SCROLL ---
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    } 
    // Filter out known UNPROTECTED external links (Login, Destinations, Flight Schedules, Home)
    else if (
        linkHref.includes('login.html') ||
        linkHref.includes('flight-schedules.html') ||
        linkHref.includes('destinations') || // Anchor links for destinations
        linkHref.includes('homepage.html')
    ) {
        // --- UNPROTECTED: Public Links (Let the default link action run) ---
    }
    else {
        // --- PROTECTED: TRANSACTIONAL LINKS (Book, Check-in, My Tickets, Logout) ---
        link.addEventListener('click', (e) => {
            // This is the gatekeeper for all links that lead to transactional pages
            checkAuthAndRedirect(e);
            // If checkAuthAndRedirect returns true, the default link action proceeds.
        });
    }
});


// =========================================================
// 4. Optional: Scroll-to-top button (if present)
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
// 5. Optional: Fade-in animation on scroll
// =========================================================
window.addEventListener('scroll', fadeInOnScroll);