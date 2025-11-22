/* ------------------ REACT BADGE COMPONENT ------------------ */

const AdminBadge = () => {
  return React.createElement(
    "div",
    {
      style: {
        padding: "8px",
        background: "#007bff",
        color: "white",
        fontWeight: "bold",
        width: "230px",
        borderRadius: "6px",
        marginBottom: "15px",
      },
    },
    "Admin Panel (React Component Active)"
  );
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(AdminBadge),
    document.getElementById("react-admin-badge")
  );
});

/* ------------------ FULL BACKEND ADMIN PANEL ------------------ */

document.addEventListener("DOMContentLoaded", () => {

  const flightTable = document.getElementById("flightTableBody");
  const addFlightBtn = document.getElementById("addFlightBtn");

  const totalFlightsBox = document.getElementById("total-flights");
  const totalBookingsBox = document.getElementById("total-bookings");
  const revenueBox = document.getElementById("revenue");

  async function getFlights() {
    const res = await fetch("http://localhost:3000/flights");
    return res.json();
  }

  async function getBookings() {
    const res = await fetch("http://localhost:3000/bookings");
    return res.json();
  }

  async function addFlight(data) {
    return fetch("http://localhost:3000/flights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function deleteFlight(id) {
    return fetch(`http://localhost:3000/fllights/${id}`, {
      method: "DELETE",
    });
  }

  async function cancelBooking(id) {
    return fetch(`http://localhost:3000/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "cancelled",
        cancelReason: "Cancelled by Admin",
      }),
    });
  }

  function renderFlights(flights) {
    flightTable.innerHTML = flights
      .map(
        (f) => `
      <tr>
        <td>${f.flightNumber}</td>
        <td>${f.from}</td>
        <td>${f.to}</td>
        <td>₹${f.price}</td>
        <td>
          <button class="deleteBtn" data-id="${f.id}">Delete</button>
        </td>
      </tr>
    `
      )
      .join("");

    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.onclick = async () => {
        await deleteFlight(btn.dataset.id);
        loadDashboard();
      };
    });
  }

  function renderDashboard(flights, bookings) {
    totalFlightsBox.innerText = flights.length;
    totalBookingsBox.innerText = bookings.length;

    const revenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + Number(b.paymentAmount), 0);

    revenueBox.innerText = "₹" + revenue;
  }

  async function loadDashboard() {
    const flights = await getFlights();
    const bookings = await getBookings();

    renderFlights(flights);
    renderDashboard(flights, bookings);
    renderBookingsTable(bookings);
  }

  function renderBookingsTable(bookings) {
    const bookingSection = document.getElementById("react-admin-panel");

    bookingSection.innerHTML = `
      <h3>Bookings</h3>
      <table class="admin-table">
        <thead>
          <tr>
            <th>PNR</th>
            <th>Passenger</th>
            <th>Flight</th>
            <th>Status</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          ${bookings
            .map(
              (b) => `
            <tr>
              <td>${b.pnr}</td>
              <td>${b.firstName} ${b.lastName}</td>
              <td>${b.flightId}</td>
              <td>${b.status}</td>
              <td>${
                b.status === "cancelled"
                  ? "—"
                  : `<button class="cancel-booking" data-id="${b.id}">Cancel</button>`
              }</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;

    document.querySelectorAll(".cancel-booking").forEach((btn) => {
      btn.onclick = async () => {
        await cancelBooking(btn.dataset.id);
        loadDashboard();
      };
    });
  }

  addFlightBtn.onclick = async () => {
    const id = Math.random().toString(36).substring(2, 6);

    await addFlight({
      id,
      flightNumber: prompt("Flight Number?") || "XX001",
      from: prompt("From?") || "DEL",
      to: prompt("To?") || "BOM",
      price: Number(prompt("Price?")) || 3000,
      date: "2025-01-01",
      time: "10:00",
      seatsAvailable: 120,
    });

    loadDashboard();
  };

  loadDashboard();
});