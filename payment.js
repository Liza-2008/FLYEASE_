document.addEventListener("DOMContentLoaded", () => {

    // Load booking details from localStorage (filled on previous page)
    const booking = JSON.parse(localStorage.getItem("selectedFlight"));

    if (!booking) {
        alert("No booking details found.");
        return;
    }

    // Show summary
    document.getElementById("sumFlight").textContent = booking.flightCode;
    document.getElementById("sumRoute").textContent = `${booking.from} → ${booking.to}`;
    document.getElementById("sumDate").textContent = booking.date;
    document.getElementById("sumAmount").textContent = booking.price;

    // Payment submit
    document.getElementById("payment-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Generate PNR
        const pnr = generatePNR();

        // FINAL booking to save in backend
        const ticketData = {
            pnr: pnr,
            firstName: booking.firstName,
            lastName: booking.lastName,
            from: booking.from,
            to: booking.to,
            date: booking.date,
            amountPaid: booking.price,
            seat: booking.seat || "Not Assigned"
        };

        // Save to backend (json-server)
        await fetch("http://localhost:3000/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ticketData)
        });

        // Redirect to ticket page
        window.location.href = `ticket.html?pnr=${pnr}`;
    });

});

function generatePNR() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pnr = "";
    for (let i = 0; i < 6; i++) {
        pnr += chars[Math.floor(Math.random() * chars.length)];
    }
    return pnr;
}
