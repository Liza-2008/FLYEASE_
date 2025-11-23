// payment.js (FINAL VERSION — OPTION A)

const getQueryParam = (name) =>
  new URLSearchParams(window.location.search).get(name);

const generatePNR = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let p = "";
  for (let i = 0; i < 6; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p;
};

document.addEventListener("DOMContentLoaded", () => {
  const flightId = getQueryParam("flightId");

  const payForm = document.getElementById("payment-form");
  const payBtn = document.getElementById("pay-now-btn");

  const userId = localStorage.getItem("currentUserId");
  const passenger = JSON.parse(sessionStorage.getItem("passengerDetails") || "null");
  const flight = JSON.parse(sessionStorage.getItem("selectedFlightDetails") || "null");

  // If required DOM elements aren't present or data missing, show warning
  if (!payForm || !payBtn) {
    console.warn("Payment form or button not found in payment.html. Ensure payment-form and pay-now-btn exist.");
  }

  if (!flightId || !passenger || !flight) {
    alert("Missing flight or passenger information. Go back and retry.");
    window.location.href = "book-flight.html";
    return;
  }

  // show summary if elements exist
  const flightSummaryEl = document.getElementById("flight-summary");
  const amountEl = document.getElementById("amount-payable");
  if (flightSummaryEl) flightSummaryEl.textContent = `${flight.flightNumber} — ${flight.from} → ${flight.to}`;
  if (amountEl) amountEl.textContent = `₹${flight.price}`;

  if (payForm) {
    payForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (payBtn) {
        payBtn.disabled = true;
        payBtn.textContent = "Processing...";
      }

      const pnr = generatePNR();

      const bookingData = {
        userId,
        pnr,
        flightId,
        firstName: (passenger.fullName || "").split(" ")[0] || passenger.fullName || "Passenger",
        lastName: (passenger.fullName || "").split(" ").slice(1).join(" ") || "",
        email: passenger.email || "",
        phone: passenger.phone || "",
        idType: passenger.idType || "",
        idNumber: passenger.idNumber || "",
        luggage: passenger.luggage || "",
        seat: "Auto-" + Math.floor(10 + Math.random() * 90), // simple random seat
        paymentAmount: flight.price || 0,
        paymentStatus: "SUCCESS",
        status: "booked",
        bookedAt: new Date().toISOString()
      };

      try {
        const res = await fetch("http://localhost:3000/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData)
        });

        const saved = await res.json();
        // Save for ticket page (fallback)
        sessionStorage.setItem("lastBooking", JSON.stringify(saved));

        setTimeout(() => {
          alert("Payment Successful!");
          window.location.href = `ticket.html?pnr=${encodeURIComponent(pnr)}`;
        }, 800);

      } catch (err) {
        console.error(err);
        alert("Payment failed or backend not running. Start json-server and retry.");
        if (payBtn) {
          payBtn.disabled = false;
          payBtn.textContent = "Proceed to Pay";
        }
      }
    });
  }
});