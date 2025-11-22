// admin.js (Backend Connected Version)

document.addEventListener("DOMContentLoaded", () => {

    const flightTable = document.getElementById("flightTableBody");
    const addFlightBtn = document.getElementById("addFlightBtn");

    // Dashboard counters
    const totalFlightsBox = document.getElementById("total-flights");
    const totalBookingsBox = document.getElementById("total-bookings");
    const revenueBox = document.getElementById("revenue");

    // Fetch functions
    async function getFlights() {
        const res = await fetch("http://localhost:3000/flights");
        return res.json();
    }

    async function getBookings() {
        const res = await fetch("http://localhost:3000/bookings");
        return res.json();
    }

    async function addFlight(data) {
        const res = await fetch("http://localhost:3000/flights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return res.json();
    }

    async function deleteFlight(id) {
        await fetch(`http://localhost:3000/flights/${id}`, {
            method: "DELETE"
        });
    }

    async function cancelBooking(id) {
        await fetch(`http://localhost:3000/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: "cancelled",
                cancelReason: "Cancelled by Admin"
            })
        });
    }

    // Render Flights Table
    function renderFlights(flights) {
        flightTable.innerHTML = "";

        flights.forEach((flight) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${flight.id}</td>
                <td>${flight.flightNumber}</td>
                <td>${flight.from}</td>
                <td>${flight.to}</td>
                <td>₹${flight.price}</td>
                <td>
                    <button class="action-btn delete-btn" data-id="${flight.id}">Delete</button>
                </td>
            `;

            flightTable.appendChild(tr);
        });

        // Attach delete events
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                if (confirm("Delete this flight?")) {
                    await deleteFlight(id);
                    loadDashboard();
                }
            });
        });
    }

    // Render dashboard counters
    function renderDashboard(flights, bookings) {
        totalFlightsBox.innerText = flights.length;
        totalBookingsBox.innerText = bookings.length;

        const revenue = bookings
            .filter(b => b.status !== "cancelled")
            .reduce((sum, b) => sum + Number(b.paymentAmount), 0);

        revenueBox.innerText = "₹" + revenue;
    }

    // Load everything
    async function loadDashboard() {
        const flights = await getFlights();
        const bookings = await getBookings();

        renderFlights(flights);
        renderDashboard(flights, bookings);

        renderBookingsTable(bookings);
    }

    // Render bookings table
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
                            <td>
                                ${
                                    b.status === "cancelled"
                                        ? "—"
                                        : `<button class="cancel-booking" data-id="${b.id}">Cancel</button>`
                                }
                            </td>
                        </tr>
                    `
                        )
                        .join("")}
                </tbody>
            </table>
        `;

        document.querySelectorAll(".cancel-booking").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (confirm("Cancel this booking?")) {
                    await cancelBooking(btn.dataset.id);
                    loadDashboard();
                }
            });
        });
    }

    // Add new flight
    addFlightBtn.addEventListener("click", async () => {
        const id = Math.random().toString(36).substring(2, 6);

        const newFlight = {
            id,
            flightNumber: prompt("Flight Number? (e.g. AI203)") || "NA",
            from: prompt("From? (e.g. DEL)") || "DEL",
            to: prompt("To? (e.g. BOM)") || "BOM",
            price: Number(prompt("Price?")) || 3000,
            date: "2025-01-01",
            time: "12:00",
            seatsAvailable: 120
        };

        await addFlight(newFlight);
        loadDashboard();
    });

    // Initialize Dashboard
    loadDashboard();
});