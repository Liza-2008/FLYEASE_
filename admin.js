// admin.js

// --- 1. MOCK DATA (Simulated Database) ---
const initialFlightData = [
    { flightId: 'FL001', flightNo: 'AI-101', from: 'DEL', to: 'JFK', date: '2025-11-15', time: '14:00', seats: 50, price: 45000, status: 'On Time' },
    { flightId: 'FL002', flightNo: 'EK-203', from: 'DEL', to: 'DXB', date: '2025-11-15', time: '22:00', seats: 120, price: 25000, status: 'Delayed' },
    { flightId: 'FL003', flightNo: 'SQ-440', from: 'DEL', to: 'SIN', date: '2025-11-16', time: '06:00', seats: 15, price: 38000, status: 'On Time' },
];

// Function to fetch or initialize mock data from LocalStorage
const ensureDataStore = () => {
    if (!localStorage.getItem('admin_flights')) {
        localStorage.setItem('admin_flights', JSON.stringify(initialFlightData));
    }
    // Ensure mock bookings exist for revenue calculation
    if (!localStorage.getItem('flyease_bookings')) {
        localStorage.setItem('flyease_bookings', JSON.stringify([
             { pnr: 'A1B2C3', flightId: 'FL001', amountPaid: '₹45,000', paymentStatus: 'SUCCESS' },
             { pnr: 'B4D5E6', flightId: 'FL003', amountPaid: '₹38,000', paymentStatus: 'SUCCESS' }
        ]));
    }
};

const fetchAllFlights = () => {
    ensureDataStore();
    return JSON.parse(localStorage.getItem('admin_flights'));
};

const fetchAllBookings = () => {
    return JSON.parse(localStorage.getItem('flyease_bookings'));
};


// --- 2. CORE DASHBOARD FUNCTIONS ---

// Update quick stats (Blueprint Step 11: View total bookings, View revenue reports)
const updateStats = () => {
    const flights = fetchAllFlights();
    const bookings = fetchAllBookings();
    
    // Calculate total revenue
    const totalRevenue = bookings.reduce((sum, booking) => {
        // Safely parse amount, assuming it's in the format "₹XX,XXX"
        const amount = parseInt(booking.amountPaid.replace('₹', '').replace(',', ''));
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    document.getElementById('stat-flights').textContent = flights.length;
    document.getElementById('stat-bookings').textContent = bookings.length;
    document.getElementById('stat-revenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
};

// Render the flight management table (Blueprint Step 11: View all flights, Status Management)
const renderFlightTable = (flights) => {
    const container = document.getElementById('flight-management-container');
    
    const tableHTML = `
        <table class="schedule-table admin-table">
            <thead>
                <tr>
                    <th>Flight ID</th>
                    <th>Route</th>
                    <th>Date / Time</th>
                    <th>Price</th>
                    <th>Seats (Avail.)</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${flights.map(flight => `
                    <tr data-flight-id="${flight.flightId}">
                        <td>${flight.flightNo}</td>
                        <td>${flight.from} → ${flight.to}</td>
                        <td>${flight.date} @ ${flight.time}</td>
                        <td>₹${flight.price.toLocaleString('en-IN')}</td>
                        <td>${flight.seats}</td>
                        <td>
                            <select class="status-selector" data-id="${flight.flightId}">
                                <option value="On Time" ${flight.status === 'On Time' ? 'selected' : ''}>On Time</option>
                                <option value="Delayed" ${flight.status === 'Delayed' ? 'selected' : ''}>Delayed</option>
                                <option value="Cancelled" ${flight.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </td>
                        <td>
                            <button class="btn primary small-btn edit-btn" data-id="${flight.flightId}">Edit</button>
                            <button class="btn small-btn delete-btn" data-id="${flight.flightId}">Del</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = tableHTML;
    attachEventListeners();
};

// Attaches listeners for status change and edit/delete buttons
const attachEventListeners = () => {
    // Admin Feature: Manage flight status (Update status)
    document.querySelectorAll('.status-selector').forEach(select => {
        select.addEventListener('change', (e) => {
            const flightId = e.target.dataset.id;
            const newStatus = e.target.value;
            
            let flights = fetchAllFlights();
            const flightIndex = flights.findIndex(f => f.flightId === flightId);
            if (flightIndex > -1) {
                flights[flightIndex].status = newStatus;
                localStorage.setItem('admin_flights', JSON.stringify(flights));
                alert(`Status for ${flights[flightIndex].flightNo} updated to ${newStatus}.`);
            }
        });
    });

    // Admin Feature: Add/Edit/Delete flight entries (Simulated)
    document.querySelector('.add-flight-btn').addEventListener('click', () => {
        alert('Simulating: Opens form to add new flight.');
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('Are you sure you want to delete this flight? (Simulated)')) {
                 // In production, this would make an API call to delete the flight.
                alert('Flight deleted! (Simulated)');
            }
        });
    });
};


// --- 3. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    const flights = fetchAllFlights();
    renderFlightTable(flights);
});