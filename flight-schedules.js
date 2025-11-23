document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');

    async function loadFromBackend() {
        try {
            const res = await fetch('http://localhost:3000/flights');
            const flights = await res.json();
            renderTable(flights);
        } catch (err) {
            console.error(err);
            scheduleContainer.innerHTML = '<p class="error-message" style="color:red">Cannot load flight schedules. Start json-server.</p>';
        }
    }

    function renderTable(flights) {
        if (!flights || flights.length === 0) {
            scheduleContainer.innerHTML = '<p class="error-message">No flight schedules available at this time.</p>';
            return;
        }

        const rows = flights.map(f => {
            const statusClass = (f.status || 'On Time').toLowerCase().replace(/\s+/g, '-');
            return `
                <tr>
                    <td data-label="Flight No">${f.flightNumber || f.flightNo || f.id}</td>
                    <td data-label="From">${f.from}</td>
                    <td data-label="To">${f.to}</td>
                    <td data-label="Departure">${f.time || f.departure || f.depTime || ''}</td>
                    <td data-label="Arrival">${f.arrival || f.arrivalTime || ''}</td>
                    <td data-label="Status"><span class="status ${statusClass}">${f.status || 'On Time'}</span></td>
                </tr>
            `;
        }).join('');

        scheduleContainer.innerHTML = `
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
                    ${rows}
                </tbody>
            </table>
        `;
    }

    loadFromBackend();
});