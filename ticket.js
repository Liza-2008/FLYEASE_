function getPNRFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("pnr");
}

async function fetchBooking(pnr) {
    try {
        const r = await fetch("http://localhost:3000/bookings");
        const all = await r.json();
        return all.find(b => b.pnr.toLowerCase() === pnr.toLowerCase()) || null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    const pnr = getPNRFromURL();
    if (!pnr) {
        alert("PNR not found.");
        return;
    }

    document.getElementById("pnr-display").textContent = pnr;

    const booking = await fetchBooking(pnr);

    if (!booking) {
        alert("Invalid PNR or ticket not found.");
        return;
    }

    document.querySelector(".status-banner").textContent = "BOOKING CONFIRMED";

    // ⭐ Updated for new structure
    console.log("Booking Data:", booking);
    const passengerName = booking.fullName || "Unknown Passenger";
document.getElementById("passenger-name").textContent = passengerName;
    const route = `${booking.from} → ${booking.to}`;
    const dateTime = booking.date || "—";
    const amountPaid = booking.price || booking.amountPaid || "—";

    document.getElementById("passenger-name").textContent = passengerName;
    document.getElementById("flight-route").textContent = route;
    document.getElementById("date-time").textContent = dateTime;
    document.getElementById("seat-number").textContent = booking.seat || "Not Assigned";
    document.getElementById("amount-paid").textContent = "₹" + amountPaid;

    // --------- PDF GENERATION FIX ----------
    document.getElementById("download-btn").onclick = () => {

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        pdf.setFontSize(18);
        pdf.text("FlyEase — E-Ticket", 20, 20);

        pdf.setFontSize(12);
        pdf.text(`PNR: ${pnr}`, 20, 40);
        pdf.text(`Passenger: ${passengerName}`, 20, 50);
        pdf.text(`Route: ${route}`, 20, 60);
        pdf.text(`Date: ${dateTime}`, 20, 70);
        pdf.text(`Seat: ${booking.seat || "Not Assigned"}`, 20, 80);
        pdf.text(`Amount Paid: ₹${amountPaid}`, 20, 90);
        pdf.text(`Flight Number: ${booking.flightNumber || "—"}`, 20, 100);

        pdf.save(`Ticket_${pnr}.pdf`);
    };

    document.getElementById("checkin-btn").onclick = () => {
        window.location.href = `check-in.html?pnr=${pnr}`;
    };
});
