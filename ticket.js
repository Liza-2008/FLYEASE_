// ticket.js — backend-connected version

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Format currency
function formatINR(n) {
  if (n == null) return 'N/A';
  return '₹' + Number(n).toLocaleString('en-IN');
}

// Fetch booking by PNR from backend
async function fetchBookingByPNR(pnr) {
  try {
    const res = await fetch(`http://localhost:3000/bookings?pnr=${encodeURIComponent(pnr)}`);
    const arr = await res.json();
    return arr[0] || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Fetch flight details by ID
async function fetchFlightById(id) {
  try {
    const res = await fetch(`http://localhost:3000/flights/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

// Populate ticket DOM
async function populateTicket(booking) {
  if (!booking) {
    document.getElementById('pnr-display').textContent = 'Booking not found';
    document.getElementById('passenger-name').textContent = 'N/A';
    document.getElementById('flight-route').textContent = 'N/A';
    document.getElementById('date-time').textContent = 'N/A';
    document.getElementById('amount-paid').textContent = 'N/A';
    return;
  }

  // Fetch flight info
  const flight = await fetchFlightById(booking.flightId);

  document.getElementById('pnr-display').textContent = booking.pnr;
  document.getElementById('passenger-name').textContent = `${booking.firstName} ${booking.lastName}`;
  document.getElementById('flight-route').textContent = flight ? `${flight.flightNumber} — ${flight.from} → ${flight.to}` : (booking.flightRoute || 'N/A');
  document.getElementById('date-time').textContent = flight ? `${flight.date} • ${flight.time}` : 'N/A';
  document.getElementById('seat-number').textContent = booking.seat || 'Auto-Assigned';
  document.getElementById('amount-paid').textContent = formatINR(booking.paymentAmount);

  // Status banner
  const banner = document.querySelector('.status-banner');
  if (booking.status === 'cancelled') {
    banner.textContent = 'Payment Status: CANCELLED ❌';
    banner.classList.remove('success');
    banner.style.background = '#ffecec';
    banner.style.color = '#a11';
  } else {
    banner.textContent = 'Payment Status: ' + (booking.paymentStatus || 'UNKNOWN') + (booking.paymentStatus === 'SUCCESS' ? ' ✅' : '');
  }

  // Buttons
  const checkinBtn = document.getElementById('checkin-btn');
  const downloadBtn = document.getElementById('download-btn');

  if (checkinBtn) {
    checkinBtn.addEventListener('click', () => {
      // pass both pnr and lastName to check-in for verification
      const p = booking.pnr;
      const last = booking.lastName || '';
      window.location.href = `check-in.html?pnr=${encodeURIComponent(p)}&lastName=${encodeURIComponent(last)}`;
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      downloadPDF(booking, flight);
    });
  }
}

// Generate PDF using jsPDF
function downloadPDF(booking, flight) {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('FlyEase — E-Ticket', 14, 20);
    doc.setFontSize(11);
    doc.text(`PNR: ${booking.pnr}`, 14, 32);
    doc.text(`Passenger: ${booking.firstName} ${booking.lastName}`, 14, 40);
    if (flight) {
      doc.text(`Flight: ${flight.flightNumber}`, 14, 48);
      doc.text(`Route: ${flight.from} → ${flight.to}`, 14, 56);
      doc.text(`Date/Time: ${flight.date} • ${flight.time}`, 14, 64);
    } else if (booking.flightRoute) {
      doc.text(`Flight/Route: ${booking.flightRoute}`, 14, 48);
      doc.text(`Date/Time: ${booking.paymentDate || 'N/A'}`, 14, 56);
    }
    doc.text(`Seat: ${booking.seat || 'Auto-Assigned'}`, 14, 74);
    doc.text(`Luggage: ${ booking.luggageKg != null ? booking.luggageKg + ' kg' : 'N/A' }`, 14, 82);
    doc.text(`Amount Paid: ${formatINR(booking.paymentAmount)}`, 14, 90);
    doc.text(booking.checkInDone ? 'Check-in done successfully — Happy journey' : 'Check-in: Not completed', 14, 104);

    doc.save(`E-Ticket_${booking.pnr}.pdf`);
  } catch (e) {
    alert('PDF generation failed. Make sure jsPDF is included.');
    console.error(e);
  }
}

// MAIN
document.addEventListener('DOMContentLoaded', async () => {
  // 1) Try sessionStorage first (booking flow stores lastBooking)
  const stored = sessionStorage.getItem('lastBooking');
  let booking = null;

  if (stored) {
    try {
      booking = JSON.parse(stored);
    } catch (e) {
      booking = null;
    }
  }

  // 2) If no stored booking, try query param ?pnr=...
  if (!booking) {
    const pnr = getQueryParam('pnr');
    if (pnr) {
      booking = await fetchBookingByPNR(pnr);
    }
  }

  await populateTicket(booking);
});