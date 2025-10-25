// portal.js
// Smooth and simple interactivity — fully aligned with your current design.

// ===== Smooth Scroll for Any Internal Links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId.length > 1 && document.querySelector(targetId)) {
      e.preventDefault();
      document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Tab Switching or Section Toggle (if used) =====
// Example: <div class="tab" data-target="section1"></div>
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

if (tabs.length && tabContents.length) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;

      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Activate the clicked tab and its target content
      tab.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

// ===== Optional: Fade-in or Slide Animations on Scroll =====
const fadeItems = document.querySelectorAll('.fade, .fade-in, .slide-in');

const handleScrollAnimations = () => {
  fadeItems.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);

// ===== Optional: Form or Button Feedback (if any buttons exist) =====
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', e => {
    // Add a small press animation
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 150);
  });
});

// ===== Optional: Sticky Header / Navbar effect =====
const header = document.querySelector('header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}