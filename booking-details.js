// booking-details.js
// Backend-connected booking/ticket display using PNR

document.addEventListener("DOMContentLoaded", () => {

  const el = {
    loading: document.getElementById("loading"),
    notfound: document.getElementById("notfound"),
    detailsWrap: document.getElementById("bookingDetails"),
    pnrel: document.getElementById("bd-pnr"),
    passenger: document.getElementById("bd-passenger"),
    age: document.getElementById("bd-age"),
    flight: document.getElementById("bd-flight"),
    route: document.getElementById("bd-route"),
    datetime: document.getElementById("bd-date-time"),
    status: document.getElementById("bd-status"),
    seat: document.getElementById("bd-seat"),
    amount: document.getElementById("bd-amount"),
    paymentDate: document.getElementById("bd-payment-date"),
    cancelReason: document.getElementById("bd-cancel-reason"),
    downloadBtn: document.getElementById("downloadTicket"),
    checkinBtn: document.getElementById("goCheckin"),
    backBtn: document.getElementById("backToTickets")
  };

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  const pnrFromUrl = getQueryParam("pnr");
  const fallbackPNR = sessionStorage.getItem("lastPNR");
  const pnr = (pnrFromUrl && pnrFromUrl.trim()) ? pnrFromUrl.trim() : (fallbackPNR || "");

  if (!pnr) {
    el.loading.style.display = "none";
    el.notfound.style.display = "block";
    return;
  }

  async function fetchBookingByPNR(pnrValue) {
    try {
      const r = await fetch(`http://localhost:3000/bookings?pnr=${encodeURIComponent(pnrValue)}`);
      const arr = await r.json();
      return arr[0] || null;
    } catch (err) {
      console.error(err);
      throw new Error("backend");
    }
  }

  (async () => {
    try {
      const b = await fetchBookingByPNR(pnr);

      el.loading.style.display = "none";

      if (!b) {
        el.notfound.style.display = "block";
        return;
      }

      // Fill UI
      el.detailsWrap.style.display = "block";
      el.pnrel.textContent = b.pnr || "—";
      el.passenger.textContent = `${b.firstName || ""} ${b.lastName || ""}`;
      el.age.textContent = b.age ? `Age: ${b.age}` : "";
      el.flight.textContent = b.flightNumber || (b.flightId || "—");
      el.route.textContent = `${b.from || ""} → ${b.to || ""}`;
      el.datetime.textContent = `${b.date || ""} ${b.time || ""}`;
      el.status.textContent = (b.status || "booked").toUpperCase();
      el.seat.textContent = b.seat || "Not Assigned";
      el.amount.textContent = b.paymentAmount ? `₹${Number(b.paymentAmount).toLocaleString('en-IN')}` : (b.price ? `₹${b.price}` : "—");
      el.paymentDate.textContent = b.paymentDate ? `Paid: ${new Date(b.paymentDate).toLocaleString()}` : (b.bookedAt ? `Booked: ${new Date(b.bookedAt).toLocaleString()}` : "");
      
      if (b.status === "cancelled" && b.cancelReason) {
        el.cancelReason.style.display = "block";
        el.cancelReason.textContent = "Cancelled: " + b.cancelReason;
      } else {
        el.cancelReason.style.display = "none";
      }

      // Buttons logic
      el.downloadBtn.addEventListener("click", () => {
        generatePDF(b);
      });

      el.backBtn.addEventListener("click", () => {
        window.location.href = "my-tickets.html";
      });

      // If cancelled → hide checkin
      if (b.status === "cancelled") {
        el.checkinBtn.style.display = "none";
      } else {
        el.checkinBtn.style.display = "inline-block";
        el.checkinBtn.addEventListener("click", () => {
          const last = (b.lastName || "");
          window.location.href = `check-in.html?pnr=${encodeURIComponent(b.pnr)}&lastName=${encodeURIComponent(last)}`;
        });
      }

    } catch (err) {
      el.loading.style.display = "none";
      alert("Cannot connect to backend. Start json-server on port 3000.");
      el.notfound.style.display = "block";
    }
  })();

  function generatePDF(booking) {
    if (window.jspdf && window.jspdf.jsPDF) {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("FlyEase — E-Ticket / Boarding Pass", 14, 20);

        doc.setFontSize(11);
        const left = 14;
        let y = 34;
        doc.text(`PNR: ${booking.pnr}`, left, y); y += 8;
        doc.text(`Name: ${booking.firstName} ${booking.lastName}`, left, y); y += 8;
        doc.text(`Flight: ${booking.flightNumber || booking.flightId}`, left, y); y += 8;
        doc.text(`Route: ${booking.from} → ${booking.to}`, left, y); y += 8;
        doc.text(`Date/Time: ${booking.date} ${booking.time}`, left, y); y += 8;
        doc.text(`Seat: ${booking.seat || "Not Assigned"}`, left, y); y += 8;
        doc.text(`Amount: ${booking.paymentAmount || booking.price || "—"}`, left, y); y += 12;
        doc.text(`Status: ${(booking.status || "booked").toUpperCase()}`, left, y);

        doc.save(`E-Ticket_${booking.pnr}.pdf`);
        return;
      } catch (e) {
        console.warn("jspdf error", e);
      }
    }

    // Fallback printable HTML
    const html = `
      <html>
        <head><title>FlyEase Ticket ${booking.pnr}</title></head>
        <body>
          <h2>FlyEase — E-Ticket</h2>
          <p><strong>PNR:</strong> ${booking.pnr}</p>
          <p><strong>Name:</strong> ${booking.firstName} ${booking.lastName}</p>
          <p><strong>Flight:</strong> ${booking.flightNumber || booking.flightId}</p>
          <p><strong>Route:</strong> ${booking.from} → ${booking.to}</p>
          <p><strong>Date/Time:</strong> ${booking.date} ${booking.time}</p>
          <p><strong>Seat:</strong> ${booking.seat || "Not Assigned"}</p>
          <p><strong>Amount:</strong> ${booking.paymentAmount || booking.price || "—"}</p>
          <p><strong>Status:</strong> ${(booking.status||"booked").toUpperCase()}</p>
        </body>
      </html>
    `;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }

});