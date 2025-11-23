// booking-details.js (FINAL VERSION FOR OPTION A)

document.addEventListener("DOMContentLoaded", () => {

    const summaryElement = document.getElementById("flight-details");
    const form = document.getElementById("booking-details-form");

    // Read userId from localStorage (if you set this on login)
    const userId = localStorage.getItem("currentUserId");

    // Read flightId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const flightId = urlParams.get("flightId");

    if (!flightId) {
        summaryElement.innerHTML = "<p class='error'>Error: No flight selected.</p>";
        return;
    }

    // Fetch flight from backend
    async function loadFlight() {
        try {
            const res = await fetch(`http://localhost:3000/flights/${flightId}`);
            const flight = await res.json();

            if (!flight || !flight.id) {
                summaryElement.innerHTML = "<p class='error'>Flight not found.</p>";
                return;
            }

            renderFlight(flight);

        } catch (err) {
            console.error(err);
            summaryElement.innerHTML = `<p class="error">❌ Backend not running.</p>`;
        }
    }

    function renderFlight(f) {
        summaryElement.innerHTML = `
            <p><strong>Flight:</strong> ${escapeHtml(f.flightNumber)}</p>
            <p><strong>Route:</strong> ${escapeHtml(f.from)} → ${escapeHtml(f.to)}</p>
            <p><strong>Date:</strong> ${escapeHtml(f.date)}</p>
            <p><strong>Time:</strong> ${escapeHtml(f.time)}</p>
            <p><strong>Price:</strong> ₹${escapeHtml(f.price)}</p>
        `;

        // Save flight details for payment page
        sessionStorage.setItem("selectedFlightDetails", JSON.stringify(f));
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const passengerData = {
            userId: userId,
            fullName: document.getElementById("fullName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            idType: document.getElementById("idType").value,
            idNumber: document.getElementById("idNumber").value.trim(),
            luggage: document.getElementById("luggage").value
        };

        sessionStorage.setItem("passengerDetails", JSON.stringify(passengerData));

        window.location.href = `payment.html?flightId=${encodeURIComponent(flightId)}`;
    });

    function escapeHtml(s){ return String(s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

    loadFlight();
});