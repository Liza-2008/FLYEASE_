// flight-schedules.js

document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');

    // Simulated data fetching (In a real app, this would be an API call to /flights)
    const fetchFlightData = () => {
        // Simulate a network delay
        setTimeout(() => {
            const flights = [
                // Data structure mirrors the Flight/Bookings table columns in the blueprint [cite: 118]
                { flightNo: 'AI-202', from: 'Delhi', to: 'Mumbai', departure: '07:30', arrival: '09:35', status: 'On Time' },
                { flightNo: 'SG-110', from: 'Bangalore', to: 'Kolkata', departure: '10:15', arrival: '13:20', status: 'Delayed' },
                { flightNo: 'EK-505', from: 'Mumbai', to: 'Dubai', departure: '14:00', arrival: '16:30', status: 'On Time' },
                { flightNo: 'BA-256', from: 'Delhi', to: 'London', departure: '02:45', arrival: '07:15', status: 'On Time' },
                { flightNo: 'UA-837', from: 'Delhi', to: 'San Francisco', departure: '23:55', arrival: '06:45 (+1)', status: 'On Time' },
                { flightNo: 'JL-740', from: 'Bangalore', to: 'Tokyo', departure: '11:20', arrival: '22:30', status: 'Cancelled' },
            ];
            renderTable(flights);
        }, 1000); // 1 second delay simulation
    };

    // Function to generate the HTML table from the data
    const renderTable = (flights) => {
        if (!flights || flights.length === 0) {
            scheduleContainer.innerHTML = '<p class="error-message">No flight schedules available at this time.</p>';
            return;
        }

        const tableHTML = `
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Flight No</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${flights.map(flight => `
                        <tr>
                            <td data-label="Flight No">${flight.flightNo}</td>
                            <td data-label="From">${flight.from}</td>
                            <td data-label="To">${flight.to}</td>
                            <td data-label="Departure">${flight.departure}</td>
                            <td data-label="Arrival">${flight.arrival}</td>
                            <td data-label="Status">
                                <span class="status ${flight.status.toLowerCase().replace(' ', '-')}">
                                    ${flight.status}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        scheduleContainer.innerHTML = tableHTML;
    };

    // Initiate data loading when the page is ready
    fetchFlightData();
});