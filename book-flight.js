// book-flight.js
document.addEventListener("DOMContentLoaded", () => {
  // Tabs and return-show/hide
  const tabs = document.querySelectorAll(".tab");
  const selectedTrip = document.getElementById("selected-trip");
  const returnWrapper = document.getElementById("returnWrapper");

  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      tabs.forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      selectedTrip.value = t.dataset.form;
      // show/hide return
      if (t.dataset.form === "round-trip") {
    returnWrapper.style.display = "flex";   // not "block"
} else {
    returnWrapper.style.display = "none";
}
    });
  });

  // Search form -> redirect to available-flights with query params
  const form = document.getElementById("search-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // collect values
    const trip = document.getElementById("selected-trip").value;
    const from = document.getElementById("fromInput").value.trim();
    const to = document.getElementById("toInput").value.trim();
    const date = document.getElementById("departInput").value;
    const ret = document.getElementById("returnInput") ? document.getElementById("returnInput").value : "";
    const cls = document.getElementById("classInput").value;
    const pax = document.getElementById("passengerInput").value;

    // simple validation
    if (!from || !to || !date) {
      alert("Please enter From, To and Depart date.");
      return;
    }

    const params = new URLSearchParams({
      trip, from, to, date, ret, cls, pax
    });

    // redirect (this is a page, not a button)
    window.location.href = `available-flights.html?${params.toString()}`;
  });
});
