// book-flight.js
document.addEventListener("DOMContentLoaded", () => {
  // tabs
  const tabs = document.querySelectorAll(".tab");
  const selectedTrip = document.getElementById("selected-trip");
  const returnWrapper = document.getElementById("returnWrapper");

  tabs.forEach(t => {
    t.addEventListener("click", () => {
      tabs.forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      selectedTrip.value = t.dataset.form;
      // show/hide return
      returnWrapper.style.display = (t.dataset.form === "round-trip") ? "block" : "none";
    });
  });

  const form = document.getElementById("search-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
      trip: document.getElementById("selected-trip").value,
      from: document.getElementById("fromInput").value.trim(),
      to: document.getElementById("toInput").value.trim(),
      date: document.getElementById("departInput").value,
      cls: document.getElementById("classInput").value,
      pax: document.getElementById("passengerInput").value
    });

    // Redirect to available-flights with query params (page, not a button)
    window.location.href = `available-flights.html?${params.toString()}`;
  });
});