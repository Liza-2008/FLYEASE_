// available-flights.js  (Backend Connected Version)

document.addEventListener("DOMContentLoaded", () => {
    const resultsContainer = document.getElementById("flight-results-container");

    // Fetch flights from backend
    async function loadFlights() {
        try {
            const res = await fetch("http://localhost:3000/flights");
            const flights = await res.json();

            if (!flights.length) {
                resultsContainer.innerHTML = "<p>No flights available right now.</p>";
                return;
            }

            renderFlightTable(flights);
        } catch (err) {
            resultsContainer.innerHTML =
                "<p style='color:red;'>Cannot connect to server. Start json-server first.</p>";
        }
    }

    // Render in your existing table format
    function renderFlightTable(flights) {
        const tableHTML = `
            <table class="schedule-table full-results-table">
                <thead>
                    <tr>
                        <th>Flight No</th>
                        <th>Airline</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Date</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Price</th>
                        <th>Available Seats</th>
                        <th>Book Now</th>
                    </tr>
                </thead>
                <tbody>
                    ${flights
                        .map(
                            (flight) => `
                        <tr>
                            <td>${flight.flightNumber}</td>
                            <td>${flight.airline || "—"}</td>
                            <td>${flight.from}</td>
                            <td>${flight.to}</td>
                            <td>${flight.date}</td>
                            <td>${flight.time}</td>
                            <td>${flight.arrival || "—"}</td>
                            <td>₹${flight.price}</td>
                            <td>${flight.seatsAvailable}</td>
                            <td>
                                <button class="btn primary book-now-btn" data-id="${flight.id}">
                                    Book Now
                                </button>
                            </td>
                        </tr>
                    `
                        )
                        .join("")}
                </tbody>
            </table>
        `;

        resultsContainer.innerHTML = tableHTML;

        document.querySelectorAll(".book-now-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;

                // Store flight ID for booking page
                sessionStorage.setItem("selectedFlightId", id);

                window.location.href = "book-flight.html";
            });
        });
    }

    // Load flights from backend
    loadFlights();
});