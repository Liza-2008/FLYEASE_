// check-in.js  (Backend Connected Version)

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("checkin-form");
    const resultBox = document.getElementById("checkin-result");
    const messageBox = document.getElementById("checkin-message");

    let currentBooking = null;

    // Lookup booking from backend
    async function fetchBooking(pnr) {
        try {
            const res = await fetch(`http://localhost:3000/bookings?pnr=${pnr}`);
            const data = await res.json();
            return data[0] || null;
        } catch (err) {
            showMessage("Unable to connect to backend. Start json-server.", true);
            return null;
        }
    }

    // Update booking (PATCH)
    async function updateBooking(id, patch) {
        const res = await fetch(`http://localhost:3000/bookings/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch)
        });
        return res.json();
    }

    // Load flight details (for display)
    async function fetchFlight(id) {
        const res = await fetch(`http://localhost:3000/flights/${id}`);
        return res.json();
    }

    // Show status messages
    function showMessage(msg, isError = false) {
        messageBox.style.display = "block";
        messageBox.style.color = isError ? "red" : "green";
        messageBox.textContent = msg;

        resultBox.style.display = "none";
    }

    // Display booking details
    async function showBookingDetails(booking) {
        const flight = await fetchFlight(booking.flightId);

        currentBooking = { ...booking, flight };

        resultBox.innerHTML = `
            <h3>Booking Found</h3>
            <p><strong>PNR:</strong> ${booking.pnr}</p>
            <p><strong>Name:</strong> ${booking.firstName} ${booking.lastName}</p>
            <p><strong>Flight:</strong> ${flight.flightNumber}</p>
            <p><strong>Route:</strong> ${flight.from} → ${flight.to}</p>
            <p><strong>Date:</strong> ${flight.date}</p>
            <p><strong>Time:</strong> ${flight.time}</p>
            <p><strong>Status:</strong> ${booking.checkInDone ? "Checked-in" : "Not Checked-in"}</p>
            
            ${
                booking.checkInDone 
                ? `<button id="downloadTicketBtn">Download Ticket (PDF)</button>`
                : `<button id="checkinBtn">Complete Check-In</button>`
            }
        `;

        messageBox.style.display = "none";
        resultBox.style.display = "block";

        // Assign button events
        if (!booking.checkInDone) {
            document.getElementById("checkinBtn").addEventListener("click", completeCheckin);
        } else {
            document.getElementById("downloadTicketBtn").addEventListener("click", downloadPDF);
        }
    }

    // Complete check-in
    async function completeCheckin() {
        if (!currentBooking) return;

        const updated = await updateBooking(currentBooking.id, {
            checkInDone: true,
            status: "checked-in"
        });

        showMessage("Check-In successful. You can now download your boarding pass.");

        setTimeout(() => showBookingDetails(updated), 500);
    }

    // Download PDF ticket
    function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const b = currentBooking;
        const f = b.flight;

        doc.setFontSize(12);
        doc.text(`FlyEase Boarding Pass`, 10, 10);
        doc.text(`PNR: ${b.pnr}`, 10, 20);
        doc.text(`Passenger: ${b.firstName} ${b.lastName}`, 10, 30);
        doc.text(`Flight: ${f.flightNumber}`, 10, 40);
        doc.text(`Route: ${f.from} → ${f.to}`, 10, 50);
        doc.text(`Date/Time: ${f.date} ${f.time}`, 10, 60);
        doc.text(`Status: Checked-In`, 10, 70);
        doc.text(`Happy Journey!`, 10, 85);

        doc.save(`BoardingPass_${b.pnr}.pdf`);
    }

    // When form is submitted
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const pnr = document.getElementById("pnr").value.trim().toUpperCase();
        const last = document.getElementById("lastname").value.trim().toLowerCase();

        showMessage("Validating...");

        const booking = await fetchBooking(pnr);

        if (!booking) {
            showMessage("No booking found for this PNR.", true);
            return;
        }

        if (booking.status === "cancelled") {
            showMessage("Your booking has been cancelled by the airline.", true);
            return;
        }

        if (booking.lastName.toLowerCase() !== last) {
            showMessage("Last name does not match booking record.", true);
            return;
        }

        // Valid
        showBookingDetails(booking);
    });
});