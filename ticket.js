// ticket.js — final backend version

function getQueryParam(name) {
  const p = new URLSearchParams(window.location.search);
  return p.get(name);
}

async function fetchBooking(pnr) {
  try {
    const r = await fetch(`http://localhost:3000/bookings?pnr=${pnr}`);
    const j = await r.json();
    return j[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function fetchFlight(id) {
  try {
    const r = await fetch(`http://localhost:3000/flights/${id}`);
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
}

function formatINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function escape(s) {
  return String(s || "").replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
}

function generatePDF(booking, flight) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("FlyEase — E-Ticket", 20, 20);

  doc.setFontSize(12);
  doc.text(`PNR: ${booking.pnr}`, 20, 30);
  doc.text(`Passenger: ${booking.firstName} ${booking.lastName}`, 20, 40);

  if (flight) {
    doc.text(`Flight: ${flight.flightNumber}`, 20, 50);
    doc.text(`Route: ${flight.from} → ${flight.to}`, 20, 60);
    doc.text(`Date: ${flight.date}  Time: ${flight.time}`, 20, 70);
  }

  doc.text(`Seat: ${booking.seat}`, 20, 80);
  doc.text(`Amount Paid: ${formatINR(booking.paymentAmount)}`, 20, 90);

  doc.save(`Ticket_${booking.pnr}.pdf`);
}

document.addEventListener("DOMContentLoaded", async () => {
  let booking = null;

  // 1 — try sessionStorage
  const stored = sessionStorage.getItem("lastBooking");
  if (stored) {
    try { booking = JSON.parse(stored); } catch {}
  }

  // 2 — fallback to query param
  if (!booking) {
    const pnr = getQueryParam("pnr");
    if (pnr) booking = await fetchBooking(pnr);
  }

  if (!booking) {
    document.querySelector(".status-banner").innerHTML = "❌ Booking not found";
    return;
  }

  const flight = await fetchFlight(booking.flightId);

  document.getElementById("pnr-display").textContent = booking.pnr;
  document.getElementById("passenger-name").textContent =
    `${booking.firstName} ${booking.lastName}`;

  document.getElementById("flight-route").textContent =
    flight ? `${flight.flightNumber} — ${flight.from} → ${flight.to}` : "N/A";

  document.getElementById("date-time").textContent =
    flight ? `${flight.date} • ${flight.time}` : "N/A";

  document.getElementById("seat-number").textContent = booking.seat || "N/A";
  document.getElementById("amount-paid").textContent =
    formatINR(booking.paymentAmount);

  // Success banner
  document.querySelector(".status-banner").textContent =
    "Payment Status: SUCCESS ✓";

  // Download button
  document.getElementById("download-btn").addEventListener("click", () => {
    generatePDF(booking, flight);
  });

  // Check-in button
  document.getElementById("checkin-btn").addEventListener("click", () => {
    window.location.href =
      `check-in.html?pnr=${booking.pnr}&lastName=${booking.lastName}`;
  });
});