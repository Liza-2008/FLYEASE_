// support.js - Airline Support Panel Functionality (Vanilla JS + Local Storage)

// Function to fetch a single booking based on PNR
const fetchBookingByPNR = (pnr) => {
    // Looks up the booking in the browser's simulated database
    const bookings = JSON.parse(localStorage.getItem('flyease_bookings')) || [];
    return bookings.find(b => b.pnr.toUpperCase() === pnr.toUpperCase());
};

// Function to render the booking details card and management buttons
const renderBookingDetails = (booking) => {
    const view = document.getElementById('booking-details-view');
    if (!booking) {
        view.innerHTML = '<p class="error-message">Booking not found. Please verify the PNR.</p>';
        return;
    }

    // Mock passenger/flight data (for display only, should be filled from payment/booking pages)
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

// Function to handle the actual verification and assignment actions
const attachEventListeners = () => {
    // Luggage Verification Simulation
    document.querySelector('.manage-luggage').addEventListener('click', (e) => {
        const btn = e.target;
        if (btn.dataset.verified === 'false') {
            alert(`Luggage verified for PNR ${btn.dataset.pnr}. (Simulated Update)`);
            btn.textContent = 'Verified ✅';
            btn.dataset.verified = 'true';
            btn.classList.remove('secondary');
            btn.classList.add('success-btn'); // Use a success-specific class
            // In a real app, this status would be updated in the LocalStorage booking object.
        }
    });

    // Seat Assignment Simulation
    document.querySelector('.manage-seat').addEventListener('click', (e) => {
        const btn = e.target;
        if (btn.dataset.status === 'Pending') {
            const assignedSeat = '14A';
            alert(`Seat assigned to ${assignedSeat} for PNR ${btn.dataset.pnr}. (Simulated Update)`);
            btn.textContent = assignedSeat;
            btn.dataset.status = assignedSeat;
            // In a real app, this seat would be updated in the LocalStorage booking object.
        }
    });
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