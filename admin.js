// Example data
const flights = [
  { id: "99eb", flight: "AI203", from: "DEL", to: "JFK", price: 45000 },
  { id: "b837", flight: "EK507", from: "DEL", to: "DXB", price: 25000 },
  { id: "484c", flight: "SQ401", from: "DEL", to: "SIN", price: 38000 },
];

// Populate flight table
const tableBody = document.getElementById("flightTableBody");

function renderFlights() {
  tableBody.innerHTML = "";
  flights.forEach(flight => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${flight.id}</td>
      <td>${flight.flight}</td>
      <td>${flight.from}</td>
      <td>${flight.to}</td>
      <td>₹${flight.price.toLocaleString()}</td>
      <td>
        <button class="action-btn edit-btn">Edit</button>
        <button class="action-btn delete-btn">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

renderFlights();

// Add New Flight (demo)
document.getElementById("addFlightBtn").addEventListener("click", () => {
  const newFlight = {
    id: Math.random().toString(36).substring(2, 6),
    flight: "NEW123",
    from: "DEL",
    to: "LHR",
    price: 50000,
  };
  flights.push(newFlight);
  renderFlights();
});
