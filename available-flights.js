// available-flights.js
// (keeps React header component if you still want it)
const FlightHeader = () => {
    return React.createElement("span", null, "Available Flights (Powered by React)");
};

document.addEventListener("DOMContentLoaded", () => {
    // render React header if element exists
    const headerTarget = document.getElementById("react-flight-header");
    if (headerTarget && window.React && window.ReactDOM) {
        ReactDOM.render(React.createElement(FlightHeader), headerTarget);
    }

    const resultsContainer = document.getElementById("flight-results-container");

    // Read search params from URL
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const qFrom = (params.get("from") || "").toLowerCase();
    const qTo = (params.get("to") || "").toLowerCase();
    const qDate = params.get("date") || "";
    const qCls = params.get("cls") || "";

    async function loadFlights() {
        try {
            const res = await fetch("http://localhost:3000/flights");
            const flights = await res.json();

            // Filter flights using from/to/date roughly (case-insensitive)
            const filtered = flights.filter(f => {
                const fromMatch = f.from && f.from.toLowerCase().includes(qFrom);
                const toMatch = f.to && f.to.toLowerCase().includes(qTo);
                const dateMatch = qDate ? (f.date === qDate) : true;
                return fromMatch && toMatch && dateMatch;
            });

            if (!filtered.length) {
                resultsContainer.innerHTML = "<p>No flights found for selected route.</p>";
                return;
            }

            renderFlightTable(filtered);

        } catch (err) {
            console.error(err);
            resultsContainer.innerHTML = "<p style='color:red;'>Backend not running. Start json-server.</p>";
        }
    }

    function renderFlightTable(flights) {
        resultsContainer.innerHTML = flights.map(f => `
            <div class="flight-card" style="border:1px solid #eee;padding:12px;margin-bottom:10px;border-radius:8px;background:#fff;">
                <p><b>${escapeHtml(f.flightNumber)}</b> — ${escapeHtml(f.from)} → ${escapeHtml(f.to)}</p>
                <p>Date: ${escapeHtml(f.date)} | Time: ${escapeHtml(f.time)}</p>
                <p>Price: ₹${escapeHtml(f.price)}</p>
                <button class="confirmBtn" data-id="${f.id}">Confirm Booking</button>
            </div>
        `).join("");

        // attach handlers
        document.querySelectorAll(".confirmBtn").forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                // Go to booking-details (page), not a modal/button
                window.location.href = `booking-details.html?flightId=${encodeURIComponent(id)}`;
            };
        });
    }

    function escapeHtml(s){ return String(s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

    loadFlights();
});