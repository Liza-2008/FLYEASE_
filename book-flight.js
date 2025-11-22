// book-flight.js  (Backend Connected Version)

document.addEventListener("DOMContentLoaded", () => {

    const flightDetailsDiv = document.getElementById("selected-flight-details");
    const bookingForm = document.getElementById("booking-form");

    // Get selected flight ID from session storage
    const selectedId = sessionStorage.getItem("selectedFlightId");

    if (!selectedId) {
        flightDetailsDiv.innerHTML = "<p>No flight selected. Please go back.</p>";
        return;
    }

    // Fetch flight details from backend
    async function loadFlightDetails() {
        try {
            const res = await fetch(`http://localhost:3000/flights/${selectedId}`);
            const flight = await res.json();

            if (!flight.id) {
                flightDetailsDiv.innerHTML = "<p>Flight not found.</p>";
                return;
            }

            renderFlightDetails(flight);

        } catch (err) {
            flightDetailsDiv.innerHTML =
                "<p style='color:red;'>Cannot connect to backend. Start json-server.</p>";
        }
    }

    // Display flight details
    function renderFlightDetails(f) {
        flightDetailsDiv.innerHTML = `
            <h3>Selected Flight</h3>
            <p><strong>Flight No:</strong> ${f.flightNumber}</p>
            <p><strong>From:</strong> ${f.from}</p>
            <p><strong>To:</strong> ${f.to}</p>
            <p><strong>Date:</strong> ${f.date}</p>
            <p><strong>Time:</strong> ${f.time}</p>
            <p><strong>Price:</strong> ₹${f.price}</p>
        `;
    }

    // Generate PNR
    function generatePNR() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Submit booking
    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(bookingForm);

        const booking = {
            pnr: generatePNR(),
            flightId: selectedId,
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            age: formData.get("age"),
            luggage: formData.get("luggage"),
            seat: formData.get("seat") || "Not Assigned",
            paymentAmount: formData.get("amount"),
            status: "booked",
            bookedAt: new Date().toISOString()
        };

        try {
            const res = await fetch("http://localhost:3000/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(booking)
            });

            const savedBooking = await res.json();

            // Save booking for ticket page
            sessionStorage.setItem("lastBooking", JSON.stringify(savedBooking));

            // redirect to ticket page
            window.location.href = "ticket.html";

        } catch (err) {
            alert("Error saving booking. Start json-server.");
        }
    });

    // Load the selected flight
    loadFlightDetails();
});