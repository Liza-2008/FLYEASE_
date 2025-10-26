// payment.js

// Function to parse query parameters from the URL
const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

// Function to generate a random 6-digit PNR (Blueprint Step 8)
const generatePNR = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
        pnr += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return pnr;
};

// Function to simulate saving the booking data (Blueprint Step 8)
const saveBookingToLocalJSON = (bookingData) => {
    const bookings = JSON.parse(localStorage.getItem('flyease_bookings')) || [];
    bookings.push(bookingData);
    localStorage.setItem('flyease_bookings', JSON.stringify(bookings));
};

document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    const payNowBtn = document.getElementById('pay-now-btn');
    const flightId = getQueryParam('flightId');
    
    // --- (In a real app, logic to fetch final amount based on flightId goes here) ---
    // For prototype simplicity, we assume the amount is known from the previous page.
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            payNowBtn.disabled = true;
            payNowBtn.textContent = 'Processing...'; // Simulated processing (Blueprint Step 8)

            // 1. Generate PNR and prepare data
            const generatedPNR = generatePNR();
            
            // NOTE: In a full app, you would retrieve ALL passenger details here.
            const newBooking = {
                pnr: generatedPNR,
                flightId: flightId,
                amountPaid: document.getElementById('amount-payable').textContent, // For display
                paymentStatus: 'SUCCESS',
                // Add passenger data retrieved from previous storage/form submission
            };

            // 2. Simulate success delay and save data
            setTimeout(() => {
                // Save the booking data to the browser's JSON storage
                saveBookingToLocalJSON(newBooking);

                // Blueprint Step 8: Redirects to Ticket Page
                alert('Payment Successful! Generating E-Ticket.');
                window.location.href = `ticket.html?pnr=${generatedPNR}`;
                
            }, 2500); // 2.5 second simulated payment processing delay
        });
    }
});