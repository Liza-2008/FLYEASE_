// ticket.js — final backend version

function getQueryParam(name) {
  const p = new URLSearchParams(window.location.search);
  return p.get(name);
}

async function fetchBooking(pnr) {
  try {
    const r = await fetch(`http://localhost:3000/bookings?pnr=${encodeURIComponent(pnr)}`);
    const j = await r.json();
    return j[0] || null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function fetchFlight(id) {
  try {
    const r = await fetch(`http://localhost:3000/flights/${encodeURIComponent(id)}`);
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
}

function formatINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function generatePDF(booking, flight) {
  try {
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
  } catch (e) {
    alert('PDF generation failed. Make sure jsPDF is included.');
    console.error(e);
  }
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
    const banner = document.querySelector(".status-banner");
    if (banner) banner.innerHTML = "❌ Booking not found";
    return;
  }

  const flight = await fetchFlight(booking.flightId);

  const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

  setText("pnr-display", booking.pnr);
  setText("passenger-name", `${booking.firstName} ${booking.lastName}`);
  setText("flight-route", flight ? `${flight.flightNumber} — ${flight.from} → ${flight.to}` : (booking.flightRoute || "N/A"));
  setText("date-time", flight ? `${flight.date} • ${flight.time}` : "N/A");
  setText("seat-number", booking.seat || "N/A");
  setText("amount-paid", formatINR(booking.paymentAmount));

  // Success banner
  const banner = document.querySelector(".status-banner");
  if (banner) banner.textContent = "Payment Status: " + (booking.paymentStatus || booking.status || "SUCCESS") + " ✓";

  // Download button
  const downloadBtn = document.getElementById("download-btn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      generatePDF(booking, flight);
    });
  }

  // Check-in button
  const checkinBtn = document.getElementById("checkin-btn");
  if (checkinBtn) {
    checkinBtn.addEventListener("click", () => {
      window.location.href = `check-in.html?pnr=${encodeURIComponent(booking.pnr)}&lastName=${encodeURIComponent(booking.lastName || "")}`;
    });
  }
});