// available-flights.js
// React header (kept)
const FlightHeader = () => {
    return React.createElement("span", null, "Available Flights (Powered by React)");
};

document.addEventListener("DOMContentLoaded", () => {

    const headerTarget = document.getElementById("react-flight-header");
    if (headerTarget && window.React && window.ReactDOM) {
        ReactDOM.render(React.createElement(FlightHeader), headerTarget);
    }

    const resultsContainer = document.getElementById("flight-results-container");

    // ---------------------
    // CITY → AIRPORT CODES
    // ---------------------
    const CITY_TO_CODE = {
        "delhi": "DEL",
        "amritsar": "ATQ",
        "chandigarh": "IXC"
    };

    // Read URL params
    const url = new URL(window.location.href);
    const rawFrom = (url.searchParams.get("from") || "").toLowerCase();
    const rawTo = (url.searchParams.get("to") || "").toLowerCase();
    const qDate = url.searchParams.get("date") || "";

    // Convert city to airport code
    const qFrom = CITY_TO_CODE[rawFrom] || rawFrom.toUpperCase();
    const qTo = CITY_TO_CODE[rawTo] || rawTo.toUpperCase();

    async function loadFlights() {
        try {
            const res = await fetch("http://localhost:3000/flights");
            const flights = await res.json();

            // NEW STRICT MATCHING
            const filtered = flights.filter(f =>
                f.from.toUpperCase() === qFrom &&
                f.to.toUpperCase() === qTo &&
                (!qDate || f.date === qDate)
            );

            if (!filtered.length) {
                resultsContainer.innerHTML = "<p>No flights found for selected route.</p>";
                return;
            }

            renderFlightCards(filtered);

        } catch (err) {
            console.error(err);
            resultsContainer.innerHTML =
                "<p style='color:red;'>Backend not running. Start json-server.</p>";
        }
    }

    function renderFlightCards(flights) {
        resultsContainer.innerHTML = flights.map(f => `
            <div class="flight-card" style="
                border:1px solid #eee;
                padding:12px;
                margin-bottom:10px;
                border-radius:8px;
                background:#fff;">
                
                <p><b>${f.flightNumber}</b> — ${f.from} → ${f.to}</p>
                <p>Date: ${f.date} | Time: ${f.time}</p>
                <p>Price: ₹${f.price}</p>

                <button class="confirmBtn" data-id="${f.id}">
                    Confirm Booking
                </button>
            </div>
        `).join("");

        document.querySelectorAll(".confirmBtn").forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                window.location.href = `booking-details.html?flightId=${id}`;
            };
        });
    }

    loadFlights();
});
