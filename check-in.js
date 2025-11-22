document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("checkin-form");
  const resultBox = document.getElementById("checkin-result");
  const messageBox = document.getElementById("checkin-message");

  let currentBooking = null;

  async function fetchBookingByPNR(pnr) {
    try {
      const res = await fetch(`http://localhost:3000/bookings?pnr=${pnr}`);
      const arr = await res.json();
      return arr[0] || null;
    } catch {
      showMessage("Backend not running.", true);
      return null;
    }
  }

  async function fetchFlight(id) {
    const r = await fetch(`http://localhost:3000/flights/${id}`);
    return r.ok ? r.json() : null;
  }

  function showMessage(msg, error = false) {
    messageBox.style.display = "block";
    messageBox.style.color = error ? "red" : "green";
    messageBox.textContent = msg;
    resultBox.style.display = "none";
  }

  async function patchBooking(id, patch) {
    const r = await fetch(`http://localhost:3000/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    });
    return r.json();
  }

  async function patchFlight(id, patch) {
    const r = await fetch(`http://localhost:3000/flights/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    });
    return r.json();
  }

  async function displayBooking(b) {
    const f = await fetchFlight(b.flightId);
    currentBooking = { ...b, flight: f };

    resultBox.innerHTML = `
      <h3>Booking Found</h3>
      <p><strong>PNR:</strong> ${b.pnr}</p>
      <p><strong>Name:</strong> ${b.firstName} ${b.lastName}</p>
      <p><strong>Flight:</strong> ${f.flightNumber}</p>
      <p><strong>Route:</strong> ${f.from} → ${f.to}</p>
      <p><strong>Date:</strong> ${f.date}</p>
      <p><strong>Time:</strong> ${f.time}</p>
      <p><strong>Status:</strong> ${b.status}</p>
      <p><strong>Seat:</strong> ${b.seat || "Not Assigned"}</p>

      ${b.checkInDone
        ? `<button id="downloadPDF">Download PDF</button>`
        : `<button id="checkinBtn">Complete Check-In</button>`}
    `;

    messageBox.style.display = "none";
    resultBox.style.display = "block";

    if (b.checkInDone) {
      document.getElementById("downloadPDF").onclick = downloadPDF;
    } else {
      document.getElementById("checkinBtn").onclick = completeCheckIn;
    }
  }

  async function completeCheckIn() {
    const b = currentBooking;
    const f = await fetchFlight(b.flightId);

    const seatNum = f.seatsAvailable;
    const seat = `${seatNum}${String.fromCharCode(65 + (seatNum % 6))}`;

    const updated = await patchBooking(b.id, {
      seat,
      checkInDone: true,
      status: "checked-in"
    });

    await patchFlight(f.id, { seatsAvailable: f.seatsAvailable - 1 });

    showMessage("Check-in successful. Seat: " + seat);
    setTimeout(() => displayBooking(updated), 400);
  }

  function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const b = currentBooking;
    const f = b.flight;

    doc.text("FlyEase Boarding Pass", 20, 20);
    doc.text(`PNR: ${b.pnr}`, 20, 30);
    doc.text(`Name: ${b.firstName} ${b.lastName}`, 20, 40);
    doc.text(`Flight: ${f.flightNumber}`, 20, 50);
    doc.text(`Route: ${f.from} → ${f.to}`, 20, 60);
    doc.text(`Date/Time: ${f.date} ${f.time}`, 20, 70);
    doc.text(`Seat: ${b.seat}`, 20, 80);
    doc.text("Status: CHECKED-IN", 20, 90);

    doc.save(`BoardingPass_${b.pnr}.pdf`);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pnr = document.getElementById("pnr").value.toUpperCase();
    const last = document.getElementById("lastname").value.toLowerCase();

    showMessage("Searching...");

    const b = await fetchBookingByPNR(pnr);

    if (!b) return showMessage("Booking not found.", true);
    if (b.status === "cancelled") return showMessage("Booking cancelled.", true);
    if (b.lastName.toLowerCase() !== last)
      return showMessage("Last name mismatch.", true);

    displayBooking(b);
  });

});