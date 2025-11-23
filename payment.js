// payment.js — create booking + payment, then redirect to ticket page

document.addEventListener("DOMContentLoaded", () => {

  // helper to generate PNR (6 chars alnum)
  function generatePNR() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let out = "";
    for (let i = 0; i < 6; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
    return out;
  }

  const summaryBox = document.getElementById("payment-summary");
  const form = document.getElementById("payment-form");
  const payBtn = document.getElementById("pay-now-btn");

  // read flight and passenger saved earlier
  const flight = JSON.parse(sessionStorage.getItem("selectedFlightDetails") || "null");
  const passenger = JSON.parse(sessionStorage.getItem("passengerDetails") || "null");

  if (!flight || !passenger) {
    summaryBox.innerHTML = `<p class="error">Missing booking details. Please go back to booking and try again.</p>`;
    form.style.display = "none";
    return;
  }

  // show summary
  summaryBox.innerHTML = `
    <h3>Payment Summary</h3>
    <p><strong>Passenger:</strong> ${escapeHtml(passenger.fullName || passenger.fullname || "")}</p>
    <p><strong>Flight:</strong> ${escapeHtml(flight.flightNumber || flight.id || "")}</p>
    <p><strong>Route:</strong> ${escapeHtml(flight.from)} → ${escapeHtml(flight.to)}</p>
    <p><strong>Date:</strong> ${escapeHtml(flight.date)} ${escapeHtml(flight.time || "")}</p>
    <p style="margin-top:8px"><strong>Amount:</strong> ₹${Number(flight.price || flight.amount || 0).toLocaleString('en-IN')}</p>
  `;

  // form submit: create booking then payment
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    payBtn.disabled = true;
    payBtn.textContent = "Processing...";

    const pnr = generatePNR();

    // build booking object (store enough info to display later)
    const bookingObj = {
      id: "B" + Math.random().toString(36).substring(2, 8),
      pnr,
      flightId: flight.id,
      flightNumber: flight.flightNumber || flight.id,
      from: flight.from,
      to: flight.to,
      date: flight.date,
      time: flight.time,
      firstName: (passenger.fullName || passenger.fullname || "").split(" ")[0] || "",
      lastName: (passenger.fullName || passenger.fullname || "").split(" ").slice(1).join(" ") || "",
      age: passenger.age || null,
      luggage: passenger.luggage || passenger.luggage || "",
      seat: "Not Assigned",
      paymentAmount: flight.price || 0,
      status: "booked",
      checkInDone: false,
      bookedAt: new Date().toISOString()
    };

    try {
      // 1) Save booking
      const bookingResp = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(bookingObj)
      });

      if (!bookingResp.ok) throw new Error("Failed to save booking");

      const savedBooking = await bookingResp.json();

      // 2) Save payment record
      const paymentObj = {
        id: "P" + Math.random().toString(36).substring(2, 8),
        bookingId: savedBooking.id,
        pnr: savedBooking.pnr,
        flightId: flight.id,
        amount: savedBooking.paymentAmount,
        method: new FormData(form).get("payment_mode") || "card",
        status: "SUCCESS",
        paidAt: new Date().toISOString()
      };

      const paymentResp = await fetch("http://localhost:3000/payments", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(paymentObj)
      });

      if (!paymentResp.ok) throw new Error("Failed to save payment");

      const savedPayment = await paymentResp.json();

      // 3) keep last booking & payment in sessionStorage for ticket page
      sessionStorage.setItem("lastBooking", JSON.stringify(savedBooking));
      sessionStorage.setItem("lastPayment", JSON.stringify(savedPayment));

      // short success feedback and redirect to ticket
      setTimeout(() => {
        window.location.href = `ticket.html?pnr=${encodeURIComponent(savedBooking.pnr)}`;
      }, 400);

    } catch (err) {
      console.error(err);
      alert("Payment failed — please ensure json-server is running and try again.");
      payBtn.disabled = false;
      payBtn.textContent = "Pay Now";
    }
  });

  // small helper to escape text to avoid accidental HTML injection in display
  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

});