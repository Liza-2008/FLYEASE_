document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");

  includes.forEach(el => {
    const file = el.getAttribute("data-include");

    fetch(file)
      .then(res => res.text())
      .then(html => {
        el.innerHTML = html;

        if (file === "header.html") {
          setupNavbar();
        }
      });
  });
});

function setupNavbar() {
  const nav = document.getElementById("global-nav");
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

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      window.location.href = "homepage.html";
    });
  }

  // mobile
  const menuBtn = document.getElementById("menubutton");
menuBtn.onclick = () => {
    if (nav.style.display === "flex") {
        nav.style.display = "none";
    } else {
        nav.style.display = "flex";
        nav.style.flexDirection = "column";
        nav.style.background = "white";
        nav.style.padding = "15px";
        nav.style.position = "absolute";
        nav.style.top = "60px";
        nav.style.right = "10px";
        nav.style.borderRadius = "8px";
        nav.style.boxShadow = "0 3px 12px rgba(0,0,0,0.2)";
    }
};
}
