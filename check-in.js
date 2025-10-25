// check-in.js
// Matches your existing check-in page — no color or layout changes.

// ===== Smooth Scroll for Internal Links (if any) =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId.length > 1 && document.querySelector(targetId)) {
      e.preventDefault();
      document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Form Validation =====
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', e => {
    let valid = true;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });

    if (!valid) {
      e.preventDefault();
      alert('Please fill out all required fields before submitting.');
    } else {
      // Optional: confirmation animation
      form.classList.add('submitted');
      setTimeout(() => form.classList.remove('submitted'), 1000);
    }
  });

  // Remove error highlight on typing
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });
}

// ===== Optional: Fade-in or Animation on Scroll =====
const fadeEls = document.querySelectorAll('.fade-in, .slide-in');

const showOnScroll = () => {
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', showOnScroll);
window.addEventListener('load', showOnScroll);

// ===== Optional: Button Click Animation =====
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 150);
  });
});
