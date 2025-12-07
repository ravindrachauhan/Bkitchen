// server.js - Main Server File
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ==================== ROUTES ====================
app.get('/', (req, res) => {
    res.json({
        message: '🎉 Welcome to Complete Management API System!',
        version: '1.0.0',
        totalTables: 11,
        totalEndpoints: '70+',
        documentation: 'See API_DOCUMENTATION.md for complete guide',
        
        endpoints: {
                               
                staff: {
                getAll: 'GET /api/staff',
                getOne: 'GET /api/staff/:id',
                getByPosition: 'GET /api/staff/position/:position',
                getByActiveStatus: 'GET /api/staff/active/:status',
                create: 'POST /api/staff',
                update: 'PUT /api/staff/:id',
                updateStatus: 'PATCH /api/staff/:id/status',
                delete: 'DELETE /api/staff/:id'
            },


                      
             categories: {
                getAll: 'GET /api/categories',
                getOne: 'GET /api/categories/:id',
                getActive: 'GET /api/categories/active/:status',
                create: 'POST /api/categories',
                update: 'PUT /api/categories/:id',
                delete: 'DELETE /api/categories/:id'
            },
            
            menuItems: {
                getAll: 'GET /api/menuitems',
                getOne: 'GET /api/menuitems/:id',
                getByCategory: 'GET /api/menuitems/category/:categoryid',
                getAvailable: 'GET /api/menuitems/available/:status',
                create: 'POST /api/menuitems',
                update: 'PUT /api/menuitems/:id',
                delete: 'DELETE /api/menuitems/:id'
            },
            
            orders: {
                getAll: 'GET /api/orders',
                getOne: 'GET /api/orders/:id',
                getByCustomer: 'GET /api/orders/customer/:customerid',
                getByStatus: 'GET /api/orders/status/:status',
                getByPaymentStatus: 'GET /api/orders/payment/:status',
                create: 'POST /api/orders',
                update: 'PUT /api/orders/:id',
                updateStatus: 'PATCH /api/orders/:id/status',
                delete: 'DELETE /api/orders/:id'
            },
            
            gymUsers: {
                getAll: 'GET /api/gymusers',
                getOne: 'GET /api/gymusers/:id',
                getByMembership: 'GET /api/gymusers/membership/:type',
                getByTrainer: 'GET /api/gymusers/trainer/:trainerid',
                getActive: 'GET /api/gymusers/active/:status',
                create: 'POST /api/gymusers',
                update: 'PUT /api/gymusers/:id',
                delete: 'DELETE /api/gymusers/:id'
            },
            
            waiters: {
                getAll: 'GET /api/waiters',
                getOne: 'GET /api/waiters/:id',
                getActive: 'GET /api/waiters/active/:status',
                create: 'POST /api/waiters',
                update: 'PUT /api/waiters/:id',
                updateStatus: 'PATCH /api/waiters/:id/status',
                delete: 'DELETE /api/waiters/:id'
            },
                
                systemUsers: {
                getAll: 'GET /api/users',
                getOne: 'GET /api/users/:id',
                getByType: 'GET /api/users/type/:type',
                getActive: 'GET /api/users/active/:status',
                create: 'POST /api/users',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id'
            }
        },
        
        quickTestLinks: [
            'http://localhost:3000/api/customers',
            'http://localhost:3000/api/members',
            'http://localhost:3000/api/staff',
            'http://localhost:3000/api/plans',
            'http://localhost:3000/api/trainers'
        ]
    });
});

app.use('/api', routes);

// ==================== ERROR HANDLING ====================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        availableRoutes: 'Visit http://localhost:3000 for all available endpoints'
    });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log('================================================');
    console.log('🚀 SERVER STARTED SUCCESSFULLY!');
    console.log('================================================');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📊 Total Tables: 11`);
    console.log(`🔗 Total Endpoints: 70+`);
    console.log('================================================');
    console.log('📚 Quick Test URLs:');
    console.log(`   • http://localhost:${PORT}/api/customers`);
    console.log(`   • http://localhost:${PORT}/api/members`);
    console.log(`   • http://localhost:${PORT}/api/staff`);
    console.log('================================================');
});