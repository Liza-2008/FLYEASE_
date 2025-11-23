document.addEventListener("DOMContentLoaded", () => {

    // UI Elements
    const confirmSection = document.getElementById("finalBookingSection");
    const flightDetailsBox = document.getElementById("selected-flight-details");
    const bookingForm = document.getElementById("booking-form");

    // Read selected flight ID from sessionStorage
    const selectedId = sessionStorage.getItem("selectedFlightId");

    // If no ID found → hide confirmation area
    if (!selectedId) {
        confirmSection.style.display = "none";
    } else {
        confirmSection.style.display = "block";
        loadFlightDetails();
    }

    /* ---------------------------------------------
       LOAD SELECTED FLIGHT FROM JSON-SERVER
    --------------------------------------------- */
    async function loadFlightDetails() {
        try {
            const res = await fetch(`http://localhost:3000/flights/${selectedId}`);
            const flight = await res.json();

            flightDetailsBox.innerHTML = `
                <h3>Selected Flight</h3>
                <p><strong>Flight:</strong> ${flight.flightNumber}</p>
                <p><strong>Route:</strong> ${flight.from} → ${flight.to}</p>
                <p><strong>Date:</strong> ${flight.date}</p>
                <p><strong>Time:</strong> ${flight.time}</p>
                <p><strong>Price:</strong> ₹${flight.price}</p>
            `;

        } catch {
            flightDetailsBox.innerHTML = "<p style='color:red;'>Backend not running.</p>";
        }
    }

    /* ---------------------------------------------
       GENERATE PNR
    --------------------------------------------- */
    function generatePNR() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const part1 = chars[Math.floor(Math.random() * chars.length)];
        const part2 = chars[Math.floor(Math.random() * chars.length)];
        const nums = Math.floor(1000 + Math.random() * 9000);
        return part1 + part2 + nums;
    }

    /* ---------------------------------------------
       SUBMIT BOOKING
    --------------------------------------------- */
    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fd = new FormData(bookingForm);
        const pnr = generatePNR();

        const res = await fetch(`http://localhost:3000/flights/${selectedId}`);
        const flight = await res.json();

        const newBooking = {
            id: "B" + Math.random().toString(36).substring(2, 10),
            userId: sessionStorage.getItem("currentUserId") || "U001",
            flightId: selectedId,
            pnr,
            firstName: fd.get("firstName"),
            lastName: fd.get("lastName"),
            age: fd.get("age"),
            luggage: fd.get("luggage"),
            paymentAmount: fd.get("amount"),
            seat: "Not Assigned",
            status: "booked",
            checkInDone: false,
            date: flight.date,
            time: flight.time,
            from: flight.from,
            to: flight.to,
            flightNumber: flight.flightNumber
        };

        await fetch("http://localhost:3000/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBooking)
        });

        alert("Booking Successful!");

        sessionStorage.setItem("lastPNR", pnr);
        window.location.href = `booking-details.html?pnr=${pnr}`;
    });

});