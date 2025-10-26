// data-manager.js - Complete Database Schema Initialization (Local Storage JSON)

const getDateHoursAgo = (hours) => {
    const d = new Date();
    d.setHours(d.getHours() - hours);
    return d.toISOString();
};

const mockUsers = [
    { _id: 'U001', name: 'Priya Sharma', email: 'priya@flyease.com', password: 'password123', role: 'user' },
    { _id: 'U002', name: 'Admin User', email: 'admin@flyease.com', password: 'admin', role: 'admin' },
    { _id: 'U003', name: 'Support Staff', email: 'support@flyease.com', password: 'support', role: 'support' },
];

const mockFlights = [
    { flightId: 'FL001', flightNo: 'AI-101', from: 'DEL', to: 'JFK', date: '2025-11-15', time: '14:00', seats: 50, price: 45000, status: 'On Time' },
    { flightId: 'FL002', flightNo: 'EK-203', from: 'DEL', to: 'DXB', date: '2025-11-15', time: '22:00', seats: 120, price: 25000, status: 'Delayed' },
    { flightId: 'FL003', flightNo: 'SQ-440', from: 'DEL', to: 'SIN', date: '2025-11-16', time: '06:00', seats: 15, price: 38000, status: 'On Time' },
];

const mockBookings = [
    { 
        bookingId: 'B001', userId: 'U001', flightId: 'FL001', 
        pnr: 'G00D1A', name: 'Priya Sharma', lastName: 'Sharma',
        flightRoute: 'AI-101 (DEL to JFK)', amountPaid: '₹45,000', 
        paymentStatus: 'SUCCESS', paymentDate: getDateHoursAgo(30),
        seat: '15C', luggageVerified: true, checkinComplete: true 
    },
    { 
        bookingId: 'B002', userId: 'U001', flightId: 'FL002', 
        pnr: 'FUTU8B', name: 'Raj Singh', lastName: 'Singh',
        flightRoute: 'EK-203 (DEL to DXB)', amountPaid: '₹25,000', 
        paymentStatus: 'SUCCESS', paymentDate: getDateHoursAgo(12),
        seat: null, luggageVerified: false, checkinComplete: false 
    },
];

const initialDatabase = {
    users: mockUsers,
    flights: mockFlights,
    bookings: mockBookings,
    payments: [],
};

const initializeDatabase = () => {
    if (localStorage.getItem('flyease_db_initialized') !== 'true') {
        
        for (const collectionName in initialDatabase) {
            localStorage.setItem(collectionName, JSON.stringify(initialDatabase[collectionName]));
        }

        localStorage.setItem('flyease_db_initialized', 'true');
        console.log('Database Initialized in Local Storage with full schema.');
    }
};

const getCollection = (collectionName) => {
    const data = localStorage.getItem(collectionName);
    return data ? JSON.parse(data) : [];
};

const updateCollection = (collectionName, newArray) => {
    localStorage.setItem(collectionName, JSON.stringify(newArray));
};

window.initializeDatabase = initializeDatabase;
window.getCollection = getCollection;
window.updateCollection = updateCollection;