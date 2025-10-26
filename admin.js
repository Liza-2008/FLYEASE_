// admin.js - FINAL INTEGRATED CODE (Uses centralized data-manager.js utilities)

// NOTE: Assumes getCollection and updateCollection are exposed globally by data-manager.js

// --- 1. CORE DASHBOARD FUNCTIONS ---

// Update quick stats (Blueprint Step 11: View total bookings, View revenue reports)
const updateStats = () => {
    // CRITICAL FIX: Use the global utility to fetch centralized data
    const flights = getCollection('flights');
    const bookings = getCollection('bookings'); 
    
    // Calculate total revenue
    const totalRevenue = bookings.reduce((sum, booking) => {
        // Safely parse amount from "₹XX,XXX" format
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
            
            // CRITICAL FIX: Use the global utility to fetch and update data
            let flights = getCollection('flights');
            const flightIndex = flights.findIndex(f => f.flightId === flightId);
            if (flightIndex > -1) {
                flights[flightIndex].status = newStatus;
                updateCollection('flights', flights); // Save updated data back to Local Storage
                alert(`Status for ${flights[flightIndex].flightNo} updated to ${newStatus}.`);
                updateStats(); // Refresh stats display
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
                alert('Flight deleted! (Simulated)');
            }
        });
    });
};


// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // NOTE: The local initialization/fetching functions (ensureDataStore, fetchAllFlights) 
    // are REMOVED as data-manager.js now handles the initialization on homepage load.
    
    updateStats();
    const flights = getCollection('flights'); // Fetch using global utility
    renderFlightTable(flights);
});