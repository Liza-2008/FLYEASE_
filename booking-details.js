document.addEventListener("DOMContentLoaded", () => {

    const summaryElement = document.getElementById("flight-details");
    const form = document.getElementById("booking-details-form");

    let selectedFlight = null;  // Store the loaded flight here

    const userId = localStorage.getItem("currentUserId");
    const params = new URLSearchParams(window.location.search);
    const flightId = params.get("flightId");

    if (!flightId) {
        summaryElement.innerHTML = "<p class='error'>❌ No flight selected.</p>";
        return;
    }

    async function loadFlight() {
        try {
            const res = await fetch(`http://localhost:3000/flights/${flightId}`);
            const flight = await res.json();

            if (!flight || !flight.id) {
                summaryElement.innerHTML = "<p class='error'>Flight not found.</p>";
                return;
            }

            selectedFlight = flight; // ⭐ Save for submit handler
            renderFlight(flight);

        } catch (e) {
            summaryElement.innerHTML = "<p class='error'>Backend not running.</p>";
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

        sessionStorage.setItem("selectedFlightDetails", JSON.stringify(f));
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // ⭐ MATCHED WITH YOUR FORM INPUT IDs
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const idType = document.getElementById("idType").value;
        const idNumber = document.getElementById("idNumber").value;
        const luggage = document.getElementById("luggage").value;

const nameParts = fullName.trim().split(" ");
const firstName = nameParts[0] || "";
const lastName = nameParts.slice(1).join(" ") || "";

const bookingData = {
    firstName,
    lastName,
    email,
    phone,
    idType,
    idNumber,
    luggage,
    from: selectedFlight.from,
    to: selectedFlight.to,
    flightNumber: selectedFlight.flightNumber,
    date: selectedFlight.date,
    price: selectedFlight.price
};

        localStorage.setItem("selectedFlight", JSON.stringify(bookingData));

        window.location.href = "payment.html";
    });

    loadFlight();
});
