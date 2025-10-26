// available-flights.js

document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('flight-results-container');

    // --- SIMULATED DYNAMIC FLIGHT DATA ---
    const mockFlights = [
        // Data structure includes all required Blueprint columns (Flight No, Airline, Price, Seats) [cite: 45, 46]
        { id: 'FL001', flightNo: 'AI-101', airline: 'Air India', from: 'DEL', to: 'JFK', date: '2025-11-15', departure: '14:00', arrival: '19:30', price: 45000, seats: 50 },
        { id: 'FL002', flightNo: 'EK-203', airline: 'Emirates', from: 'DEL', to: 'DXB', date: '2025-11-15', departure: '22:00', arrival: '01:00', price: 25000, seats: 120 },
        { id: 'FL003', flightNo: 'SQ-440', airline: 'Singapore', from: 'DEL', to: 'SIN', date: '2025-11-16', departure: '06:00', arrival: '14:00', price: 38000, seats: 15 },
    ];

    const renderFlightTable = (flights) => {
        const tableHTML = `
            <table class="schedule-table full-results-table">
                <thead>
                    <tr>
                        <th>Flight No</th>
                        <th>Airline</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Date</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Price</th>
                        <th>Available Seats</th>
                        <th>Book Now</th>
                    </tr>
                </thead>
                <tbody>
                    ${flights.map(flight => `
                        <tr>
                            <td>${flight.flightNo}</td>
                            <td>${flight.airline}</td>
                            <td>${flight.from}</td>
                            <td>${flight.to}</td>
                            <td>${flight.date}</td>
                            <td>${flight.departure}</td>
                            <td>${flight.arrival}</td>
                            <td>₹${flight.price.toLocaleString()}</td>
                            <td>${flight.seats}</td>
                            <td>
                                <button class="btn primary book-now-btn" data-flight-id="${flight.id}">Book Now</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        resultsContainer.innerHTML = tableHTML;

        // Attach event listeners to the new "Book Now" buttons
        document.querySelectorAll('.book-now-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const flightId = e.target.dataset.flightId;
                
                // Blueprint Step 6: Redirect to booking-details.html with Flight ID in query
                window.location.href = `booking-details.html?flightId=${flightId}`;
            });
        });
    };

    // Simulate fetching data after search (1 second delay)
    setTimeout(() => renderFlightTable(mockFlights), 1000);
});