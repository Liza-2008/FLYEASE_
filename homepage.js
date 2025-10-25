// homepage.js - Cleaned and Corrected Version

// =========================================================
// 1. Core Functionality: Button Click Listener
//    Attaches the redirect logic to the "Book Your Flight" button.
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Select the "Book Your Flight" button inside the 'book' section
    const bookFlightBtn = document.querySelector('#book .btn.primary');

    if (bookFlightBtn) {
        // Add a click listener to redirect the user to booking.html
        bookFlightBtn.addEventListener('click', () => {
            window.location.href = 'booking.html';
        });
    }

    // Since the fade-in elements might not be immediately visible,
    // we call the function here to handle elements visible on load.
    fadeInOnScroll();
});

// =========================================================
// 2. Smooth Scroll for Navigation Links (Existing Code)
// =========================================================
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// =========================================================
// 3. Highlight Active Section in Navbar (FIXED Selector)
// =========================================================
const sections = document.querySelectorAll('section');
// FIX: Targets all <a> elements inside <nav> directly.
const navLinks = document.querySelectorAll('nav a'); 

window.addEventListener('scroll', () => {
  let current = '';
  // Use window.scrollY (modern standard) instead of pageYOffset
  const scrollPosition = window.scrollY;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    // Check if the scroll position is within the section boundaries
    if (scrollPosition >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    
    // Only apply 'active' to smooth scroll links (href starting with #)
    if (link.getAttribute('href').startsWith('#') && link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
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
const fadeEls = document.querySelectorAll('.fade-in');

const fadeInOnScroll = () => {
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', fadeInOnScroll);