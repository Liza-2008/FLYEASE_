// payment.js (FINAL VERSION — OPTION A)

const getQueryParam = (name) =>
  new URLSearchParams(window.location.search).get(name);

const generatePNR = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let p = "";
  for (let i = 0; i < 6; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p;
};

document.addEventListener("DOMContentLoaded", () => {
  const flightId = getQueryParam("flightId");

  const payForm = document.getElementById("payment-form");
  const payBtn = document.getElementById("pay-now-btn");

  const userId = localStorage.getItem("currentUserId");
  const passenger = JSON.parse(sessionStorage.getItem("passengerDetails"));
  const flight = JSON.parse(sessionStorage.getItem("selectedFlightDetails"));

  payForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    payBtn.disabled = true;
    payBtn.textContent = "Processing...";

    const pnr = generatePNR();

    const bookingData = {
      userId,
      pnr,
      flightId,
      firstName: passenger.fullName.split(" ")[0],
      lastName: passenger.fullName.split(" ")[1] || "",
      email: passenger.email,
      phone: passenger.phone,
      idType: passenger.idType,
      idNumber: passenger.idNumber,
      luggage: passenger.luggage,
      seat: "Not Assigned",
      paymentAmount: flight.price,
      paymentStatus: "SUCCESS",
      status: "booked",
      bookedAt: new Date().toISOString()
    };

    await fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData)
    });

    sessionStorage.setItem("lastBooking", JSON.stringify(bookingData));

    setTimeout(() => {
      alert("Payment Successful!");
      window.location.href = `ticket.html?pnr=${pnr}`;
    }, 1500);
  });
});