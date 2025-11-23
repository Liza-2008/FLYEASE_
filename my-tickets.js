// my-tickets.js (FINAL VERSION — OPTION A)

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("tickets-container");
  const hint = document.getElementById("user-hint");

  const userId = localStorage.getItem("currentUserId");

  hint.textContent = "Showing tickets for user: " + userId;

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

  async function loadTickets() {
    const bookings = await fetchBookings();
    const userBookings = bookings.filter(b => b.userId === userId);

    if (userBookings.length === 0) {
      container.innerHTML = "<p>No tickets found.</p>";
      return;
    }

    let html = `
      <table>
        <tr>
          <th>PNR</th>
          <th>Name</th>
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
          <td>${b.seat}</td>
          <td>${formatINR(b.paymentAmount)}</td>
          <td>${b.status}</td>
          <td>
            <button onclick="window.location.href='ticket.html?pnr=${b.pnr}'">View</button>
          </td>
        </tr>
      `;
    }

    html += `</table>`;

    container.innerHTML = html;
  }

  loadTickets();
});
