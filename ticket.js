// ticket.js - PNR Retrieval and Ticket Display (Vanilla JS + Local Storage)

const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

// Function to simulate retrieving full booking data based on PNR
const fetchBookingDetails = (pnr) => {
    // Retrieve the booking from local JSON storage (saved in payment.js)
    const bookings = JSON.parse(localStorage.getItem('flyease_bookings')) || [];
    const booking = bookings.find(b => b.pnr.toUpperCase() === pnr.toUpperCase());

    // NOTE: This relies on the comprehensive object saved in payment.js
    if (booking) {
        return {
            pnr: booking.pnr,
            name: booking.name || 'John Doe',
            flightRoute: booking.flightRoute || 'AI-101 | DEL to JFK',
            dateTime: booking.time || '2025-11-15 @ 14:00',
            amount: booking.amountPaid || '₹45,000'
        };
    }
    
    // Fallback if PNR isn't found
    return { pnr: pnr, name: 'Guest', flightRoute: 'Data Not Found', dateTime: 'N/A', amount: 'N/A' };
};

document.addEventListener('DOMContentLoaded', () => {
    const pnr = getQueryParam('pnr');
    const checkinBtn = document.getElementById('checkin-btn');
    const downloadBtn = document.getElementById('download-btn');

    if (pnr) {
        // Fetch details using the PNR
        const details = fetchBookingDetails(pnr);
        
        // Populate Ticket Data (Blueprint Step 9)
        document.getElementById('pnr-display').textContent = details.pnr;
        document.getElementById('passenger-name').textContent = details.name;
        document.getElementById('flight-route').textContent = details.flightRoute;
        document.getElementById('date-time').textContent = details.dateTime;
        document.getElementById('amount-paid').textContent = details.amount;
    } else {
        document.getElementById('pnr-display').textContent = 'Error: PNR Missing!';
    }
    
    // --- Set up Action Buttons ---
    
    // Check-In Button (Blueprint Step 9: Redirects to check-in.html)
    if (checkinBtn) {
        checkinBtn.addEventListener('click', () => {
            // Passes the PNR to the check-in page for verification
            window.location.href = `check-in.html?pnr=${pnr}`; 
        });
    }

    // Download Button (Blueprint Step 9: Simulate PDF download)
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            alert(`Simulating PDF Download for E-Ticket PNR: ${pnr}...`);
            // In a full app, this would use jsPDF to generate the document.
        });
    }
});