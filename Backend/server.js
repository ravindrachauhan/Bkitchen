// server.js - Main Server File for Hotel Management System
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
// Parse JSON bodies
app.use(express.json());

// Enable CORS (allows frontend to connect)
app.use(cors());

// Log all incoming requests (helpful for debugging)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ==================== ROUTES ====================
// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Hotel Management System API!',
        version: '1.0.0',
        endpoints: {
            staff: {
                getAll: 'GET /api/staff',
                getOne: 'GET /api/staff/:id',
                searchByPosition: 'GET /api/staff/position/:position',
                searchByStatus: 'GET /api/staff/status/:status (active/inactive)',
                create: 'POST /api/staff',
                update: 'PUT /api/staff/:id',
                delete: 'DELETE /api/staff/:id'
            },
            users: {
                getAll: 'GET /api/users',
                getOne: 'GET /api/users/:id',
                searchByType: 'GET /api/users/type/:type (Staff/Premium)',
                searchByStatus: 'GET /api/users/status/:status (active/inactive)',
                create: 'POST /api/users',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id'
            },
            waiters: {
                getAll: 'GET /api/waiters',
                getOne: 'GET /api/waiters/:id',
                searchBySection: 'GET /api/waiters/section/:section',
                searchByShift: 'GET /api/waiters/shift/:shift (Morning/Evening/Night)',
                searchByStatus: 'GET /api/waiters/status/:status (active/inactive)',
                create: 'POST /api/waiters',
                update: 'PUT /api/waiters/:id',
                delete: 'DELETE /api/waiters/:id'
            },
            categories: {
                getAll: 'GET /api/categories',
                getOne: 'GET /api/categories/:id',
                searchByStatus: 'GET /api/categories/status/:status (active/inactive)',
                create: 'POST /api/categories',
                update: 'PUT /api/categories/:id',
                delete: 'DELETE /api/categories/:id'
            },
            menuitems: {
                getAll: 'GET /api/menuitems',
                getOne: 'GET /api/menuitems/:id',
                searchByCategory: 'GET /api/menuitems/category/:categoryId',
                searchByAvailability: 'GET /api/menuitems/availability/:status (available/unavailable)',
                searchByStatus: 'GET /api/menuitems/status/:status (active/inactive)',
                create: 'POST /api/menuitems',
                update: 'PUT /api/menuitems/:id',
                delete: 'DELETE /api/menuitems/:id'
            },
            orders: {
                getAll: 'GET /api/orders',
                getOne: 'GET /api/orders/:id',
                searchByCustomer: 'GET /api/orders/customer/:customerId',
                searchByWaiter: 'GET /api/orders/waiter/:waiterId',
                searchByOrderStatus: 'GET /api/orders/orderstatus/:status (Pending/Preparing/Served/Completed)',
                searchByPaymentStatus: 'GET /api/orders/paymentstatus/:status (Paid/Unpaid)',
                searchByDate: 'GET /api/orders/date/:date (YYYY-MM-DD)',
                searchByTable: 'GET /api/orders/table/:tableId',
                create: 'POST /api/orders',
                update: 'PUT /api/orders/:id',
                delete: 'DELETE /api/orders/:id'
            },
            reports: {
                dailySales: 'GET /api/reports/daily-sales/:date (YYYY-MM-DD)',
                waiterPerformance: 'GET /api/reports/waiter-performance',
                popularItems: 'GET /api/reports/popular-items'
            }
        }
    });
});

// All API routes start with /api
app.use('/api', routes);

// ==================== ERROR HANDLING ====================
// Handle 404 - Route not found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
    console.log('=================================');
});
