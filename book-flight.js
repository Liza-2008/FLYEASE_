// booking.js

document.addEventListener("DOMContentLoaded", () => {
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

  // Handle form submission (redirect to available flights page)
  const form = document.getElementById("searchForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = "available-flights.html";
    });
  }
});
