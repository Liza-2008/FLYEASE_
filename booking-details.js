// booking-details.js (FINAL VERSION FOR OPTION A)

document.addEventListener("DOMContentLoaded", () => {

    const summaryElement = document.getElementById("flight-details");
    const form = document.getElementById("booking-details-form");

    // Read userId from localStorage
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
            summaryElement.innerHTML = `<p class="error">❌ Backend not running.</p>`;
        }
    }

    function renderFlight(f) {
        summaryElement.innerHTML = `
            <p><strong>Flight:</strong> ${f.flightNumber}</p>
            <p><strong>Route:</strong> ${f.from} → ${f.to}</p>
            <p><strong>Date:</strong> ${f.date}</p>
            <p><strong>Time:</strong> ${f.time}</p>
            <p><strong>Price:</strong> ₹${f.price}</p>
        `;

        // Save flight details for payment page
        sessionStorage.setItem("selectedFlightDetails", JSON.stringify(f));
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const passengerData = {
            userId: userId,
            fullName: document.getElementById("fullName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            idType: document.getElementById("idType").value,
            idNumber: document.getElementById("idNumber").value,
            luggage: document.getElementById("luggage").value
        };

        sessionStorage.setItem("passengerDetails", JSON.stringify(passengerData));

        window.location.href = `payment.html?flightId=${flightId}`;
    });

    loadFlight();
});