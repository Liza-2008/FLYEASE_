// support.js - FINAL INTEGRATED Airline Support Panel Functionality

// NOTE: Assumes getCollection and updateCollection are exposed globally by data-manager.js

// Function to fetch a single booking based on PNR (Uses global utility)
const fetchBookingByPNR = (pnr) => {
    // CRITICAL FIX: Use global utility to fetch the central bookings array
    const bookings = getCollection('bookings'); 
    return bookings.find(b => b.pnr.toUpperCase() === pnr.toUpperCase());
};

// Function to handle the actual verification and assignment actions
const attachEventListeners = () => {
    // Luggage Verification Simulation
    document.querySelector('.manage-luggage').addEventListener('click', (e) => {
        const btn = e.target;
        const pnr = btn.dataset.pnr;

        if (btn.dataset.verified === 'false') {
            alert(`Luggage verified for PNR ${pnr}. (Simulated Update)`);
            
            // 1. Update the local view
            btn.textContent = 'Verified ✅';
            btn.dataset.verified = 'true';
            btn.classList.remove('secondary');
            btn.classList.add('success-btn'); 

            // 2. CRITICAL FIX: Update the status in the central JSON store
            let bookings = getCollection('bookings');
            const bookingIndex = bookings.findIndex(b => b.pnr === pnr);
            if (bookingIndex > -1) {
                bookings[bookingIndex].luggageVerified = true;
                updateCollection('bookings', bookings); // Save change
            }
        }
    });

    // Seat Assignment Simulation
    document.querySelector('.manage-seat').addEventListener('click', (e) => {
        const btn = e.target;
        const pnr = btn.dataset.pnr;

        if (btn.dataset.status === 'Pending') {
            const assignedSeat = '14A';
            alert(`Seat assigned to ${assignedSeat} for PNR ${pnr}. (Simulated Update)`);
            
            // 1. Update the local view
            btn.textContent = assignedSeat;
            btn.dataset.status = assignedSeat;

            // 2. CRITICAL FIX: Update the status in the central JSON store
            let bookings = getCollection('bookings');
            const bookingIndex = bookings.findIndex(b => b.pnr === pnr);
            if (bookingIndex > -1) {
                bookings[bookingIndex].seat = assignedSeat;
                updateCollection('bookings', bookings); // Save change
            }
        }
    });
};

// Function to render the booking details card and management buttons
const renderBookingDetails = (booking) => {
    const view = document.getElementById('booking-details-view');
    if (!booking) {
        view.innerHTML = '<p class="error-message">Booking not found. Please verify the PNR.</p>';
        return;
    }

    // Mock passenger/flight data (for display only)
    const mockData = { 
        name: booking.name || 'Jane Smith', 
        seat: booking.seat || 'Pending', 
        luggageVerified: booking.luggageVerified || false,
        flightRoute: booking.flightRoute || 'DEL to JFK',
        time: booking.time || '14:00'
    };
    
    view.innerHTML = `
        <div class="booking-card">
            <h3>Booking Details for PNR: <span class="highlight">${booking.pnr}</span></h3>
            <div class="detail-row"><strong>Flight:</strong> ${mockData.flightRoute} at ${mockData.time}</div>
            <div class="detail-row"><strong>Passenger:</strong> ${mockData.name}</div>
            <div class="detail-row"><strong>Status:</strong> ${booking.paymentStatus}</div>
            
            <hr>

            <h4>Check-in Management</h4>
            <div class="action-grid">
                
                <div class="management-item">
                    <p>Seat Confirmation:</p>
                    <button class="btn primary small-btn manage-seat" data-pnr="${booking.pnr}" data-status="${mockData.seat}">
                        ${mockData.seat === 'Pending' ? 'Assign Seat' : mockData.seat}
                    </button>
                </div>

                <div class="management-item">
                    <p>Luggage Verification:</p>
                    <button class="btn secondary small-btn manage-luggage ${mockData.luggageVerified ? 'verified' : ''}" data-pnr="${booking.pnr}" data-verified="${mockData.luggageVerified}">
                        ${mockData.luggageVerified ? 'Verified ✅' : 'Verify Luggage'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    attachEventListeners();
};


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('pnr-search-form');
    
    // Attach listener for the PNR search form
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pnr = document.getElementById('pnr-input').value.trim();
            const booking = fetchBookingByPNR(pnr);
            renderBookingDetails(booking);
        });
    }
});