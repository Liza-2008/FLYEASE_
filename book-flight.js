document.addEventListener("DOMContentLoaded", () => {

    const flightDetailsDiv = document.getElementById("selected-flight-details");
    const bookingForm = document.getElementById("booking-form");
    const amountField = document.getElementById("amountField");

    // Get selected FLIGHT ID (like "FL001")
    const selectedId = sessionStorage.getItem("selectedFlightId");

    if (!selectedId) {
        flightDetailsDiv.innerHTML = "<p>No flight selected. Go back to Available Flights.</p>";
        return;
    }

    // Fetch this exact flight from JSON server
    async function loadFlightDetails() {
        try {
            const res = await fetch(`http://localhost:3000/flights/${selectedId}`);
            const flight = await res.json();

            if (!flight || !flight.id) {
                flightDetailsDiv.innerHTML = "<p>Flight not found.</p>";
                return;
            }

            renderFlightDetails(flight);

        } catch (err) {
            flightDetailsDiv.innerHTML =
                "<p style='color:red;'>Backend not running. Start json-server.</p>";
        }
    }

    // Show flight details on page
    function renderFlightDetails(f) {
        flightDetailsDiv.innerHTML = `
            <p><strong>Flight No:</strong> ${f.flightNumber}</p>
            <p><strong>Route:</strong> ${f.from} → ${f.to}</p>
            <p><strong>Date:</strong> ${f.date}</p>
            <p><strong>Time:</strong> ${f.time}</p>
            <p><strong>Price:</strong> ₹${f.price}</p>
        `;

        // auto fill price into booking form
        amountField.value = f.price;
    }

    function generatePNR() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Submit booking
    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(bookingForm);

        const booking = {
            id: "B" + Math.random().toString(36).substring(2, 6),
            pnr: generatePNR(),
            flightId: selectedId,
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            age: formData.get("age"),
            luggage: formData.get("luggage"),
            seat: "Not Assigned",
            paymentAmount: amountField.value,
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

            sessionStorage.setItem("lastBooking", JSON.stringify(savedBooking));

            window.location.href = "ticket.html";

        } catch (err) {
            alert("Error saving booking. Start json-server.");
        }
    });

    loadFlightDetails();
});