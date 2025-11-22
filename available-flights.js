// --- React Component (exam requirement) ---
const FlightHeader = () => {
    return React.createElement("span", null, "Available Flights (Powered by React)");
};

document.addEventListener("DOMContentLoaded", () => {
    ReactDOM.render(
        React.createElement(FlightHeader),
        document.getElementById("react-flight-header")
    );
});

// --- Actual backend code below ---
document.addEventListener("DOMContentLoaded", () => {
    const resultsContainer = document.getElementById("flight-results-container");

    async function loadFlights() {
        try {
            const res = await fetch("http://localhost:3000/flights");
            const flights = await res.json();

            if (!flights.length) {
                resultsContainer.innerHTML = "<p>No flights available.</p>";
                return;
            }

            renderFlightTable(flights);

        } catch {
            resultsContainer.innerHTML = "<p style='color:red;'>Backend not running.</p>";
        }
    }

    function renderFlightTable(flights) {
        resultsContainer.innerHTML = flights.map(f => `
            <div class="flight-card">
                <p><b>${f.flightNumber}</b> — ${f.from} → ${f.to}</p>
                <p>Date: ${f.date} | Time: ${f.time}</p>
                <p>Price: ₹${f.price}</p>
                <button class="bookBtn" data-id="${f.id}">Book Now</button>
            </div>
        `).join("");

        document.querySelectorAll(".bookBtn").forEach(btn => {
            btn.onclick = () => {
                sessionStorage.setItem("selectedFlightId", btn.dataset.id);
                window.location.href = "book-flight.html";
            };
        });
    }

    loadFlights();
});