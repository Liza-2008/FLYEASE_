// booking-details.js

// Function to parse query parameters from the URL
const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

// Simulated data lookup based on the flightId passed from available-flights.html
const fetchFlightSummary = (flightId) => {
    // In production, this would be an API call (e.g., /flights/details?id=FL001)
    const mockFlightData = {
        'FL001': { route: 'Delhi (DEL) to New York (JFK)', date: '2025-11-15', price: 45000, flightNo: 'AI-101' },
        'FL002': { route: 'Delhi (DEL) to Dubai (DXB)', date: '2025-11-15', price: 25000, flightNo: 'EK-203' },
        // ... add other mock flights as needed
    };
    return mockFlightData[flightId];
};

document.addEventListener('DOMContentLoaded', () => {
    const flightId = getQueryParam('flightId');
    const summaryElement = document.getElementById('flight-details');
    const form = document.getElementById('booking-details-form');
    
    // Auto-fill Flight Details
    if (flightId) {
        const flight = fetchFlightSummary(flightId);
        if (flight) {
            summaryElement.innerHTML = `
                <p><strong>Flight:</strong> ${flight.flightNo}</p>
                <p><strong>Route:</strong> ${flight.route}</p>
                <p><strong>Date:</strong> ${flight.date}</p>
                <p><strong>Total Price:</strong> ₹${flight.price.toLocaleString()}</p>
            `;
        } else {
            summaryElement.innerHTML = `<p class="error">Error: Flight details not found for ID: ${flightId}</p>`;
        }
    } else {
        summaryElement.innerHTML = `<p class="error">Error: No flight selected.</p>`;
    }
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // --- SIMULATED REDIRECTION TO PAYMENT ---
            
            // Blueprint Step 7: "Proceed to Payment" button goes to payment.html
            // We pass the flightId along again for the payment page to use.
            alert('Details confirmed! Redirecting to Payment...');
            window.location.href = `payment.html?flightId=${flightId}`;
        });
    }
});