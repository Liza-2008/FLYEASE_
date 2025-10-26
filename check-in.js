// check-in.js - Final Verification Logic with 3 PNR Scenarios

// --- PNR Constants (Must match constants in homepage.js) ---
const TEST_PNR_GOOD = "G00D1A";    // Works immediately
const TEST_PNR_FUTURE = "FUTU8B";  // Fails 24-hour rule (too early)


// Function to check if 24 hours have passed since payment (simulating check-in window)
const isCheckinAvailable = (paymentDateString) => {
    // 24 hours in milliseconds
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
    
    const paymentTime = new Date(paymentDateString).getTime();
    const currentTime = new Date().getTime();
    
    // Check-in is available if 24 hours have passed since payment.
    return (currentTime - paymentTime) >= TWENTY_FOUR_HOURS_MS;
};

const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

// Function to find booking (simulated backend verification)
const verifyBooking = (pnr, lastName) => {
    const bookings = JSON.parse(localStorage.getItem('flyease_bookings')) || [];
    const booking = bookings.find(b => b.pnr.toUpperCase() === pnr.toUpperCase());
    
    // --- STEP 1: Basic PNR and Last Name Verification ---
    if (!booking || lastName.toLowerCase() !== (booking.lastName || 'doe').toLowerCase()) {
        // PNR 3: Any other PNR (Verification Failed)
        return { 
            status: 'failed', 
            message: 'Verification Failed: PNR or Last Name is incorrect. Please check your details.' 
        };
    }
    
    // --- STEP 2: Check-in Window Verification (PNR 2 Logic) ---
    if (booking.pnr.toUpperCase() === TEST_PNR_FUTURE) {
        if (!isCheckinAvailable(booking.paymentDate)) {
            // PNR 2: Check-in too early
            return { 
                status: 'too_early', 
                message: 'Check-in is not yet available. Please try again 24 hours after your payment.',
                booking: booking
            };
        }
        // If 24 hours HAVE passed for the Future PNR, it now proceeds as a success.
    }

    // PNR 1: GOOD PNR (Default case for successful verification)
    return { 
        status: 'success', 
        booking: {
            ...booking,
            passengerName: booking.name || 'John Doe',
            flightRoute: booking.flightRoute || 'AI-101 (DEL to JFK)',
        }
    };
};

// Function to render flight details after successful verification
const renderDetails = (booking) => {
    document.getElementById('loading-message').style.display = 'none';
    const displayDiv = document.getElementById('flight-details-verified');
    displayDiv.style.display = 'block';

    document.getElementById('pnr-info').innerHTML = `<strong>PNR:</strong> ${booking.pnr}`;
    document.getElementById('passenger-info').innerHTML = `<strong>Passenger:</strong> ${booking.passengerName}`;
    document.getElementById('route-info').innerHTML = `<strong>Flight:</strong> ${booking.flightRoute}`;
};

// Function to display an error/information message
const displayMessage = (message) => {
    document.getElementById('loading-message').style.display = 'none';
    const errorDisplay = document.getElementById('error-display');
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
};

// Function to simulate generating the boarding pass
const generateBoardingPass = (booking, seat) => {
    alert(`Check-In Complete! Boarding Pass Generated.\n\nFlight: ${booking.flightRoute}\nSeat: ${seat}`);
    window.location.href = `ticket.html?pnr=${booking.pnr}&checkedin=true`;
};


document.addEventListener('DOMContentLoaded', () => {
    const pnr = getQueryParam('pnr');
    const lastName = getQueryParam('lastName');
    let currentBooking = null;
    
    // --- Step 1: Initial Verification from URL parameters ---
    if (pnr && lastName) {
        document.getElementById('loading-message').style.display = 'block';

        // Add a slight delay to simulate network call
        setTimeout(() => {
            const result = verifyBooking(pnr, lastName); 
            
            if (result.status === 'success') {
                // PNR 1: Good PNR (Verification successful)
                currentBooking = result.booking;
                renderDetails(currentBooking);
            } else if (result.status === 'too_early') {
                // PNR 2: FUTURE PNR (Show special message)
                displayMessage(result.message);
                // Optionally display summary details from the booking for confirmation
                document.getElementById('loading-message').style.display = 'none';
            } else {
                // PNR 3: Verification Failed
                displayMessage(result.message);
            }
        }, 500); // 0.5 second delay for better UX
    } else {
        // Fallback message if user navigated here directly
        displayMessage('Please return to the homepage and use the Check-In form.');
    }
    
    // --- Step 2: Handle Final Check-in Confirmation ---
    const completeCheckinBtn = document.getElementById('complete-checkin-btn');
    if (completeCheckinBtn) {
        completeCheckinBtn.addEventListener('click', () => {
            if (currentBooking) {
                const selectedSeat = document.getElementById('seat-selection').value;
                generateBoardingPass(currentBooking, selectedSeat);
            } else {
                // This case should be prevented by the UI showing an error message.
                alert('Verification Failed. Please ensure your PNR and Last Name were correct.');
            }
        });
    }
});