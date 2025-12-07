// routes.js - Complete API Routes for All 11 Tables
const express = require('express');
const router = express.Router();
const db = require('./db');


// ==================== STAFF APIs ====================

router.get('/staff', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM STAFF');
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching staff', error: error.message });
    }
});

router.get('/staff/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM STAFF WHERE staff_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching staff', error: error.message });
    }
});

router.get('/staff/position/:position', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM STAFF WHERE position = ?', [req.params.position]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching staff', error: error.message });
    }
});

router.get('/staff/active/:status', async (req, res) => {
    try {
        const isActive = req.params.status === '1' || req.params.status.toLowerCase() === 'true' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM STAFF WHERE is_active = ?', [isActive]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching staff', error: error.message });
    }
});

router.post('/staff', async (req, res) => {
    try {
        const { staff_name, phone_number, email, position, salary, hire_date, is_active } = req.body;
        const [result] = await db.query(
            'INSERT INTO STAFF (staff_name, phone_number, email, position, salary, hire_date, is_active, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, "Admin", "Admin")',
            [staff_name, phone_number, email, position, salary, hire_date, is_active]
        );
        res.status(201).json({ success: true, message: 'Staff created successfully', staff_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating staff', error: error.message });
    }
});

router.put('/staff/:id', async (req, res) => {
    try {
        const { staff_name, phone_number, email, position, salary, hire_date, is_active } = req.body;
        const [result] = await db.query(
            'UPDATE STAFF SET staff_name = ?, phone_number = ?, email = ?, position = ?, salary = ?, hire_date = ?, is_active = ?, modified_by = "Admin" WHERE staff_id = ?',
            [staff_name, phone_number, email, position, salary, hire_date, is_active, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, message: 'Staff updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating staff', error: error.message });
    }
});

router.patch('/staff/:id/status', async (req, res) => {
    try {
        const { is_active } = req.body;
        const [result] = await db.query('UPDATE STAFF SET is_active = ?, modified_by = "Admin" WHERE staff_id = ?', [is_active, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, message: 'Staff status updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating status', error: error.message });
    }
});

router.delete('/staff/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM STAFF WHERE staff_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Staff not found' });
        res.json({ success: true, message: 'Staff deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting staff', error: error.message });
    }
});



// ==================== CATEGORY APIs ====================

router.get('/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM category');
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
    }
});

router.get('/categories/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM category WHERE categoryId = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Category not found' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching category', error: error.message });
    }
});

router.get('/categories/active/:status', async (req, res) => {
    try {
        const isActive = req.params.status === '1' || req.params.status.toLowerCase() === 'true' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM category WHERE is_active = ?', [isActive]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching categories', error: error.message });
    }
});

router.post('/categories', async (req, res) => {
    try {
        const { categoryname, is_active } = req.body;
        const [result] = await db.query(
            'INSERT INTO category (categoryname, is_active, created_by, modified_by) VALUES (?, ?, "Admin", "Admin")',
            [categoryname, is_active]
        );
        res.status(201).json({ success: true, message: 'Category created successfully', categoryId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating category', error: error.message });
    }
});

router.put('/categories/:id', async (req, res) => {
    try {
        const { categoryname, is_active } = req.body;
        const [result] = await db.query(
            'UPDATE category SET categoryname = ?, is_active = ?, modified_by = "Admin" WHERE categoryId = ?',
            [categoryname, is_active, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Category not found' });
        res.json({ success: true, message: 'Category updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating category', error: error.message });
    }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM category WHERE categoryId = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Category not found' });
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
    }
});

// ==================== MENU ITEMS APIs ====================

router.get('/menuitems', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM menuItems');
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching menu items', error: error.message });
    }
});

router.get('/menuitems/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM menuItems WHERE menuId = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Menu item not found' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching menu item', error: error.message });
    }
});

router.get('/menuitems/category/:categoryid', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM menuItems WHERE categoryId = ?', [req.params.categoryid]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching menu items', error: error.message });
    }
});

router.get('/menuitems/available/:status', async (req, res) => {
    try {
        const isAvailable = req.params.status === '1' || req.params.status.toLowerCase() === 'true' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM menuItems WHERE isavailable = ?', [isAvailable]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching menu items', error: error.message });
    }
});

router.post('/menuitems', async (req, res) => {
    try {
        const { menuname, categoryId, price, description, isavailable } = req.body;
        const [result] = await db.query(
            'INSERT INTO menuItems (menuname, categoryId, price, description, isavailable, created_by, modified_by) VALUES (?, ?, ?, ?, ?, "Admin", "Admin")',
            [menuname, categoryId, price, description, isavailable]
        );
        res.status(201).json({ success: true, message: 'Menu item created successfully', menuId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating menu item', error: error.message });
    }
});

router.put('/menuitems/:id', async (req, res) => {
    try {
        const { menuname, categoryId, price, description, isavailable } = req.body;
        const [result] = await db.query(
            'UPDATE menuItems SET menuname = ?, categoryId = ?, price = ?, description = ?, isavailable = ?, modified_by = "Admin" WHERE menuId = ?',
            [menuname, categoryId, price, description, isavailable, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Menu item not found' });
        res.json({ success: true, message: 'Menu item updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating menu item', error: error.message });
    }
});

router.delete('/menuitems/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM menuItems WHERE menuId = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Menu item not found' });
        res.json({ success: true, message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting menu item', error: error.message });
    }
});

// ==================== ORDERS APIs ====================

router.get('/orders', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders');
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
    }
});

router.get('/orders/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders WHERE order_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching order', error: error.message });
    }
});

router.get('/orders/customer/:customerid', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders WHERE customer_id = ?', [req.params.customerid]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
    }
});

router.get('/orders/status/:status', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders WHERE order_status = ?', [req.params.status]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching orders', error: error.message });
    }
});

router.get('/orders/payment/:status', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM orders WHERE payment_status = ?', [req.params.status]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching orders', error: error.message });
    }
});

router.post('/orders', async (req, res) => {
    try {
        const { customer_id, table_id, waiter_id, total_amount, tax_amount, discount_amount, final_amount, order_status, payment_status, payment_method, special_instructions } = req.body;
        const [result] = await db.query(
            'INSERT INTO orders (customer_id, table_id, waiter_id, total_amount, tax_amount, discount_amount, final_amount, order_status, payment_status, payment_method, special_instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [customer_id, table_id, waiter_id, total_amount, tax_amount, discount_amount, final_amount, order_status, payment_status, payment_method, special_instructions]
        );
        res.status(201).json({ success: true, message: 'Order created successfully', order_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating order', error: error.message });
    }
});

router.put('/orders/:id', async (req, res) => {
    try {
        const { customer_id, table_id, waiter_id, total_amount, tax_amount, discount_amount, final_amount, order_status, payment_status, payment_method, special_instructions } = req.body;
        const [result] = await db.query(
            'UPDATE orders SET customer_id = ?, table_id = ?, waiter_id = ?, total_amount = ?, tax_amount = ?, discount_amount = ?, final_amount = ?, order_status = ?, payment_status = ?, payment_method = ?, special_instructions = ? WHERE order_id = ?',
            [customer_id, table_id, waiter_id, total_amount, tax_amount, discount_amount, final_amount, order_status, payment_status, payment_method, special_instructions, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating order', error: error.message });
    }
});

router.patch('/orders/:id/status', async (req, res) => {
    try {
        const { order_status } = req.body;
        const [result] = await db.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [order_status, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating status', error: error.message });
    }
});

router.delete('/orders/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM orders WHERE order_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting order', error: error.message });
    }
});
// ==================== WAITERS APIs ====================

router.get('/waiters', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM waiters');
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching waiters', error: error.message });
    }
});

router.get('/waiters/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM waiters WHERE waiter_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Waiter not found' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching waiter', error: error.message });
    }
});

router.get('/waiters/active/:status', async (req, res) => {
    try {
        const isActive = req.params.status === '1' || req.params.status.toLowerCase() === 'true' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM waiters WHERE is_active = ?', [isActive]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching waiters', error: error.message });
    }
});

router.post('/waiters', async (req, res) => {
    try {
        const { waiter_name, phone_number, email, hire_date, is_active } = req.body;
        const [result] = await db.query(
            'INSERT INTO waiters (waiter_name, phone_number, email, hire_date, is_active, created_by, modified_by) VALUES (?, ?, ?, ?, ?, "Admin", "Admin")',
            [waiter_name, phone_number, email, hire_date, is_active]
        );
        res.status(201).json({ success: true, message: 'Waiter created successfully', waiter_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating waiter', error: error.message });
    }
});

router.put('/waiters/:id', async (req, res) => {
    try {
        const { waiter_name, phone_number, email, hire_date, is_active } = req.body;
        const [result] = await db.query(
            'UPDATE waiters SET waiter_name = ?, phone_number = ?, email = ?, hire_date = ?, is_active = ?, modified_by = "Admin" WHERE waiter_id = ?',
            [waiter_name, phone_number, email, hire_date, is_active, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Waiter not found' });
        res.json({ success: true, message: 'Waiter updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating waiter', error: error.message });
    }
});

router.patch('/waiters/:id/status', async (req, res) => {
    try {
        const { is_active } = req.body;
        const [result] = await db.query('UPDATE waiters SET is_active = ?, modified_by = "Admin" WHERE waiter_id = ?', [is_active, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Waiter not found' });
        res.json({ success: true, message: 'Waiter status updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating status', error: error.message });
    }
});

router.delete('/waiters/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM waiters WHERE waiter_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Waiter not found' });
        res.json({ success: true, message: 'Waiter deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting waiter', error: error.message });
    }
});

// ==================== GYM USERS APIs ====================

router.get('/gymusers', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching gym users', error: error.message });
    }
});

router.get('/gymusers/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'Gym user not found' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching gym user', error: error.message });
    }
});

router.get('/gymusers/membership/:type', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE membership_type = ?', [req.params.type]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching gym users', error: error.message });
    }
});

router.get('/gymusers/trainer/:trainerid', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE trainer_id = ?', [req.params.trainerid]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching gym users', error: error.message });
    }
});

router.get('/gymusers/active/:status', async (req, res) => {
    try {
        const isActive = req.params.status === '1' || req.params.status.toLowerCase() === 'true' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM users WHERE is_active = ?', [isActive]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching gym users', error: error.message });
    }
});

router.post('/gymusers', async (req, res) => {
    try {
        const { user_name, email, password_hash, gender, user_dob, user_phone, u_address, membership_type, trainer_id, is_active } = req.body;
        const [result] = await db.query(
            'INSERT INTO users (user_name, email, password_hash, gender, user_dob, user_phone, u_address, membership_type, trainer_id, is_active, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "admin", "admin")',
            [user_name, email, password_hash, gender, user_dob, user_phone, u_address, membership_type, trainer_id, is_active]
        );
        res.status(201).json({ success: true, message: 'Gym user created successfully', user_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating gym user', error: error.message });
    }
});

router.put('/gymusers/:id', async (req, res) => {
    try {
        const { user_name, email, password_hash, gender, user_dob, user_phone, u_address, membership_type, trainer_id, is_active } = req.body;
        const [result] = await db.query(
            'UPDATE users SET user_name = ?, email = ?, password_hash = ?, gender = ?, user_dob = ?, user_phone = ?, u_address = ?, membership_type = ?, trainer_id = ?, is_active = ?, modified_by = "admin" WHERE user_id = ?',
            [user_name, email, password_hash, gender, user_dob, user_phone, u_address, membership_type, trainer_id, is_active, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Gym user not found' });
        res.json({ success: true, message: 'Gym user updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating gym user', error: error.message });
    }
});

router.delete('/gymusers/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Gym user not found' });
        res.json({ success: true, message: 'Gym user deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting gym user', error: error.message });
    }
});

// ==================== SYSTEM USERS APIs ====================

router.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Users');
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching system users', error: error.message });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Users WHERE user_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'System user not found' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching system user', error: error.message });
    }
});

router.get('/users/type/:type', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Users WHERE cust_type = ?', [req.params.type]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching system users', error: error.message });
    }
});

router.get('/users/active/:status', async (req, res) => {
    try {
        const isActive = req.params.status === '1' || req.params.status.toLowerCase() === 'true' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM Users WHERE is_active = ?', [isActive]);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error searching system users', error: error.message });
    }
});

router.post('/users', async (req, res) => {
    try {
        const { user_name, password_hash, gender, date_of_birth, u_phone, u_address, cust_type, is_active } = req.body;
        const [result] = await db.query(
            'INSERT INTO Users (user_name, password_hash, gender, date_of_birth, u_phone, u_address, cust_type, is_active, created_by, modified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "Admin", "Admin")',
            [user_name, password_hash, gender, date_of_birth, u_phone, u_address, cust_type, is_active]
        );
        res.status(201).json({ success: true, message: 'System user created successfully', user_id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating system user', error: error.message });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const { user_name, password_hash, gender, date_of_birth, u_phone, u_address, cust_type, is_active } = req.body;
        const [result] = await db.query(
            'UPDATE Users SET user_name = ?, password_hash = ?, gender = ?, date_of_birth = ?, u_phone = ?, u_address = ?, cust_type = ?, is_active = ?, modified_by = "Admin" WHERE user_id = ?',
            [user_name, password_hash, gender, date_of_birth, u_phone, u_address, cust_type, is_active, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'System user not found' });
        res.json({ success: true, message: 'System user updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating system user', error: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Users WHERE user_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'System user not found' });
        res.json({ success: true, message: 'System user deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting system user', error: error.message });
    }
});

module.exports = router;