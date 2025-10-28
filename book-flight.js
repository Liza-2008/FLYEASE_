// book-flight.js - Complete Code (Fading, Form Submission, and Tab Switching)

document.addEventListener("DOMContentLoaded", () => {
    // =========================================================
    // 1. FADE-IN EFFECT (Existing Logic)
    // =========================================================
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
    window.addEventListener("load", fadeInOnScroll);


   // book-flight.js (Section 2: Primary Form Submission)

// =========================================================
// 2. PRIMARY FORM SUBMISSION (FIXED to include all forms)
// =========================================================

const forms = ['one-way-form', 'round-trip-form', 'multi-city-form'];

forms.forEach(formId => {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            // All forms redirect to the Available Flights page
            window.location.href = "available-flights.html"; 
        });
    }
});

    // =========================================================
    // 3. TAB SWITCHING LOGIC (New Sliding Feature)
    // =========================================================
    const tabs = document.querySelectorAll(".tab");
    const formWrapper = document.getElementById("form-wrapper");
    
    // Function to handle the actual form switch
    const switchForm = (targetFormId) => {
        // 1. Update the tab visual state
        tabs.forEach(t => {
            t.classList.remove("active");
            if (t.dataset.form === targetFormId) {
                t.classList.add("active");
            }
        });

        // 2. Manage the form containers
        const allForms = formWrapper.querySelectorAll('.search-form');
        
        allForms.forEach(form => {
            if (form.id === `${targetFormId}-form`) {
                // Show target form
                form.classList.remove("hidden-form");
                form.classList.add("active-form");
                
                // Adjust wrapper height to prevent jumping (critical for smooth transition)
                formWrapper.style.height = `${form.offsetHeight}px`;
            } else {
                // Hide other forms
                form.classList.remove("active-form");
                form.classList.add("hidden-form");
            }
        });
    }

    // Attach click listeners to tabs
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetFormId = tab.dataset.form; // 'one-way', 'round-trip', or 'multi-city'
            switchForm(targetFormId);
        });
    });

    // Initialize height on load (run after forms are structured)
    const activeForm = document.querySelector('.active-form');
    if (activeForm) {
        formWrapper.style.height = `${activeForm.offsetHeight}px`;
    }
});