/* ------------------ REACT TITLE COMPONENT ------------------ */

const MyTicketsTitle = () => {
    return React.createElement(
        "div",
        {
            style: {
                color: "#007bff",
                fontSize: "22px",
                fontWeight: "bold",
                marginBottom: "10px"
            }
        },
        "My Tickets (React Component Active)"
    );
};

document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(
        React.createElement(MyTicketsTitle),
        document.getElementById("react-ticket-title")
    );
});

/* ------------------ BACKEND TICKET LOGIC ------------------ */

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("tickets-container");
  const hint = document.getElementById("user-hint");

  const userId = sessionStorage.getItem("currentUserId") || "U001";

  hint.textContent = "Showing tickets for: " + userId;

  async function fetchBookings() {
    const r = await fetch("http://localhost:3000/bookings");
    return r.json();
  }

  async function fetchFlight(id) {
    const r = await fetch("http://localhost:3000/flights/" + id);
    return r.ok ? r.json() : null;
  }

  function formatINR(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }

  function downloadPDF(booking, flight) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("FlyEase E-Ticket", 20, 20);
    doc.text(`PNR: ${booking.pnr}`, 20, 30);
    doc.text(`Passenger: ${booking.firstName} ${booking.lastName}`, 20, 40);
    doc.text(`Flight: ${flight.flightNumber}`, 20, 50);
    doc.text(`Route: ${flight.from} → ${flight.to}`, 20, 60);
    doc.text(`Date/Time: ${flight.date} ${flight.time}`, 20, 70);
    doc.text(`Seat: ${booking.seat || "Not Assigned"}`, 20, 80);
    doc.text(`Amount: ${formatINR(booking.paymentAmount)}`, 20, 90);

    doc.save(`E-Ticket_${booking.pnr}.pdf`);
  }

  async function loadTickets() {
    const bookings = await fetchBookings();

    const userBookings = bookings.filter(b => b.userId === userId);

    if (userBookings.length === 0) {
      container.innerHTML = "<p>No tickets found.</p>";
      return;
    }

    let html = `<table>
      <tr>
        <th>PNR</th>
        <th>Passenger</th>
        <th>Flight</th>
        <th>Route</th>
        <th>Date</th>
        <th>Seat</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    `;

    for (let b of userBookings) {
      const f = await fetchFlight(b.flightId);

      html += `
        <tr>
          <td>${b.pnr}</td>
          <td>${b.firstName} ${b.lastName}</td>
          <td>${f.flightNumber}</td>
          <td>${f.from} → ${f.to}</td>
          <td>${f.date}</td>
          <td>${b.seat || "—"}</td>
          <td>${formatINR(b.paymentAmount)}</td>
          <td>${b.status}</td>
          <td>
            <button class="download-btn" data-pnr="${b.pnr}">Download</button>
            ${
              b.status !== "cancelled"
                ? `<button class="check-btn" data-pnr="${b.pnr}" data-last="${b.lastName}">Check-In</button>`
                : ""
            }
          </td>
        </tr>
      `;
    }

    html += "</table>";
    container.innerHTML = html;

    document.querySelectorAll(".download-btn").forEach(btn => {
      btn.onclick = async () => {
        const pnr = btn.dataset.pnr;
        const r = await fetch(`http://localhost:3000/bookings?pnr=${pnr}`);
        const [b] = await r.json();
        const f = await fetchFlight(b.flightId);
        downloadPDF(b, f);
      };
    });

    document.querySelectorAll(".check-btn").forEach(btn => {
      btn.onclick = () => {
        const pnr = btn.dataset.pnr;
        const last = btn.dataset.last;
        window.location.href = `check-in.html?pnr=${pnr}&lastName=${last}`;
      };
    });
  }

  loadTickets();

});