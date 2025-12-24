// routes.js - All API Routes for Hotel Management System
const express = require('express');
const router = express.Router();
const db = require('./db');

// ==================== STAFF APIs ====================

// 1. GET - Get all staff members
router.get('/staff', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM staff WHERE is_deleted = 0');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching staff members',
            error: error.message
        });
    }
});

// 2. GET - Get single staff member by ID
router.get('/staff/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM staff WHERE staff_id = ? AND is_deleted = 0', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching staff member',
            error: error.message
        });
    }
});

// 3. GET - Get staff by position
router.get('/staff/position/:position', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM staff WHERE position = ? AND is_deleted = 0', [req.params.position]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching staff by position',
            error: error.message
        });
    }
});

// 4. GET - Get active/inactive staff
router.get('/staff/status/:status', async (req, res) => {
    try {
        const isActive = req.params.status === 'active' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM staff WHERE is_active = ? AND is_deleted = 0', [isActive]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching staff by status',
            error: error.message
        });
    }
});

// 5. POST - Create new staff member
router.post('/staff', async (req, res) => {
    try {
        const { 
            staff_name, 
            phone_number, 
            email, 
            position, 
            salary, 
            hire_date, 
            is_active, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO staff (staff_name, phone_number, email, position, salary, hire_date, 
             is_active, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [staff_name, phone_number, email, position, salary, hire_date, 
             is_active, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'Staff member created successfully',
            staff_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating staff member',
            error: error.message
        });
    }
});

// 6. PUT - Update existing staff member
router.put('/staff/:id', async (req, res) => {
    try {
        const { 
            staff_name, 
            phone_number, 
            email, 
            position, 
            salary, 
            hire_date, 
            is_active, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE staff SET staff_name = ?, phone_number = ?, email = ?, position = ?, 
             salary = ?, hire_date = ?, is_active = ?, modified_by = ?, 
             modified_on = CURRENT_TIMESTAMP WHERE staff_id = ?`,
            [staff_name, phone_number, email, position, salary, hire_date, 
             is_active, modified_by, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Staff member updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating staff member',
            error: error.message
        });
    }
});

// 7. DELETE - Soft delete staff member
router.delete('/staff/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE staff SET is_deleted = 1, is_active = 0 WHERE staff_id = ?', 
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Staff member not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Staff member deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting staff member',
            error: error.message
        });
    }
});

// ==================== USERS APIs ====================

// 1. GET - Get all users
router.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE is_deleted = 0');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// 2. GET - Get single user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE user_id = ? AND is_deleted = 0', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
});

// 3. GET - Get users by customer type
router.get('/users/type/:type', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE cust_type = ? AND is_deleted = 0', [req.params.type]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching users by customer type',
            error: error.message
        });
    }
});

// 4. GET - Get active/inactive users
router.get('/users/status/:status', async (req, res) => {
    try {
        const isActive = req.params.status === 'active' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM users WHERE is_active = ? AND is_deleted = 0', [isActive]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching users by status',
            error: error.message
        });
    }
});

// 5. POST - Create new user
router.post('/users', async (req, res) => {
    try {
        const { 
            user_name, 
            password_hash, 
            gender, 
            date_of_birth, 
            u_phone, 
            u_address, 
            cust_type, 
            is_active, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO users (user_name, password_hash, gender, date_of_birth, u_phone, 
             u_address, cust_type, is_active, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_name, password_hash, gender, date_of_birth, u_phone, u_address, 
             cust_type, is_active, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

// 6. PUT - Update existing user
router.put('/users/:id', async (req, res) => {
    try {
        const { 
            user_name, 
            password_hash, 
            gender, 
            date_of_birth, 
            u_phone, 
            u_address, 
            cust_type, 
            is_active, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE users SET user_name = ?, password_hash = ?, gender = ?, date_of_birth = ?, 
             u_phone = ?, u_address = ?, cust_type = ?, is_active = ?, modified_by = ?, 
             modified_on = CURRENT_TIMESTAMP WHERE user_id = ?`,
            [user_name, password_hash, gender, date_of_birth, u_phone, u_address, 
             cust_type, is_active, modified_by, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
});

// 7. DELETE - Soft delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE users SET is_deleted = 1, is_active = 0 WHERE user_id = ?', 
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

// ==================== WAITERS APIs ====================

// 1. GET - Get all waiters
router.get('/waiters', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT w.*, u.user_name, s.staff_name 
            FROM waiters w
            LEFT JOIN users u ON w.user_id = u.user_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE w.is_deleted = 0
        `);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching waiters',
            error: error.message
        });
    }
});

// 2. GET - Get single waiter by ID
router.get('/waiters/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT w.*, u.user_name, s.staff_name 
            FROM waiters w
            LEFT JOIN users u ON w.user_id = u.user_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE w.waiter_id = ? AND w.is_deleted = 0
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Waiter not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching waiter',
            error: error.message
        });
    }
});

// 3. GET - Get waiters by table section
router.get('/waiters/section/:section', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT w.*, u.user_name, s.staff_name 
            FROM waiters w
            LEFT JOIN users u ON w.user_id = u.user_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE w.table_section = ? AND w.is_deleted = 0
        `, [req.params.section]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching waiters by section',
            error: error.message
        });
    }
});

// 4. GET - Get waiters by shift timing
router.get('/waiters/shift/:shift', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT w.*, u.user_name, s.staff_name 
            FROM waiters w
            LEFT JOIN users u ON w.user_id = u.user_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE w.shift_timing = ? AND w.is_deleted = 0
        `, [req.params.shift]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching waiters by shift',
            error: error.message
        });
    }
});

// 5. GET - Get active/inactive waiters
router.get('/waiters/status/:status', async (req, res) => {
    try {
        const isActive = req.params.status === 'active' ? 1 : 0;
        const [rows] = await db.query(`
            SELECT w.*, u.user_name, s.staff_name 
            FROM waiters w
            LEFT JOIN users u ON w.user_id = u.user_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE w.is_active = ? AND w.is_deleted = 0
        `, [isActive]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching waiters by status',
            error: error.message
        });
    }
});

// 6. POST - Create new waiter
router.post('/waiters', async (req, res) => {
    try {
        const { 
            user_id, 
            staff_id, 
            table_section, 
            shift_timing, 
            tips_earned, 
            is_active, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO waiters (user_id, staff_id, table_section, shift_timing, tips_earned, 
             is_active, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, staff_id, table_section, shift_timing, tips_earned || 0, 
             is_active, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'Waiter created successfully',
            waiter_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating waiter',
            error: error.message
        });
    }
});

// 7. PUT - Update existing waiter
router.put('/waiters/:id', async (req, res) => {
    try {
        const { 
            user_id, 
            staff_id, 
            table_section, 
            shift_timing, 
            tips_earned, 
            is_active, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE waiters SET user_id = ?, staff_id = ?, table_section = ?, shift_timing = ?, 
             tips_earned = ?, is_active = ?, modified_by = ?, modified_on = CURRENT_TIMESTAMP 
             WHERE waiter_id = ?`,
            [user_id, staff_id, table_section, shift_timing, tips_earned, 
             is_active, modified_by, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Waiter not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Waiter updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating waiter',
            error: error.message
        });
    }
});

// 8. DELETE - Soft delete waiter
router.delete('/waiters/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE waiters SET is_deleted = 1, is_active = 0 WHERE waiter_id = ?', 
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Waiter not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Waiter deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting waiter',
            error: error.message
        });
    }
});

// ==================== CATEGORY APIs ====================

// 1. GET - Get all categories
router.get('/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM category WHERE is_deleted = 0');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
});

// 2. GET - Get single category by ID
router.get('/categories/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM category WHERE categoryId = ? AND is_deleted = 0', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
});

// 3. GET - Get active/inactive categories
router.get('/categories/status/:status', async (req, res) => {
    try {
        const isActive = req.params.status === 'active' ? 1 : 0;
        const [rows] = await db.query('SELECT * FROM category WHERE is_active = ? AND is_deleted = 0', [isActive]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching categories by status',
            error: error.message
        });
    }
});

// 4. POST - Create new category
router.post('/categories', async (req, res) => {
    try {
        const { categoryname, is_active, created_by } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO category (categoryname, is_active, created_by, modified_by) 
             VALUES (?, ?, ?, ?)`,
            [categoryname, is_active, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            categoryId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
});

// 5. PUT - Update existing category
router.put('/categories/:id', async (req, res) => {
    try {
        const { categoryname, is_active, modified_by } = req.body;
        
        const [result] = await db.query(
            `UPDATE category SET categoryname = ?, is_active = ?, modified_by = ?, 
             modified_on = CURRENT_TIMESTAMP WHERE categoryId = ?`,
            [categoryname, is_active, modified_by, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Category updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
});

// 6. DELETE - Soft delete category
router.delete('/categories/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE category SET is_deleted = 1, is_active = 0 WHERE categoryId = ?', 
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
});

// ==================== MENU ITEMS APIs ====================

// 1. GET - Get all menu items
router.get('/menuitems', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, c.categoryname 
            FROM menuitems m
            LEFT JOIN category c ON m.categoryId = c.categoryId
            WHERE m.is_deleted = 0
        `);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching menu items',
            error: error.message
        });
    }
});

// 2. GET - Get single menu item by ID
router.get('/menuitems/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, c.categoryname 
            FROM menuitems m
            LEFT JOIN category c ON m.categoryId = c.categoryId
            WHERE m.menuId = ? AND m.is_deleted = 0
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching menu item',
            error: error.message
        });
    }
});

// 3. GET - Get menu items by category
router.get('/menuitems/category/:categoryId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, c.categoryname 
            FROM menuitems m
            LEFT JOIN category c ON m.categoryId = c.categoryId
            WHERE m.categoryId = ? AND m.is_deleted = 0
        `, [req.params.categoryId]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching menu items by category',
            error: error.message
        });
    }
});

// 4. GET - Get available/unavailable menu items
router.get('/menuitems/availability/:status', async (req, res) => {
    try {
        const isAvailable = req.params.status === 'available' ? 1 : 0;
        const [rows] = await db.query(`
            SELECT m.*, c.categoryname 
            FROM menuitems m
            LEFT JOIN category c ON m.categoryId = c.categoryId
            WHERE m.isavailable = ? AND m.is_deleted = 0
        `, [isAvailable]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching menu items by availability',
            error: error.message
        });
    }
});

// 5. GET - Get active/inactive menu items
router.get('/menuitems/status/:status', async (req, res) => {
    try {
        const isActive = req.params.status === 'active' ? 1 : 0;
        const [rows] = await db.query(`
            SELECT m.*, c.categoryname 
            FROM menuitems m
            LEFT JOIN category c ON m.categoryId = c.categoryId
            WHERE m.is_active = ? AND m.is_deleted = 0
        `, [isActive]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching menu items by status',
            error: error.message
        });
    }
});

// 6. POST - Create new menu item
router.post('/menuitems', async (req, res) => {
    try {
        const { 
            menuname, 
            categoryId, 
            price, 
            description, 
            isavailable, 
            is_active, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO menuitems (menuname, categoryId, price, description, isavailable, 
             is_active, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [menuname, categoryId, price, description, isavailable, 
             is_active, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            menuId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating menu item',
            error: error.message
        });
    }
});

// 7. PUT - Update existing menu item
router.put('/menuitems/:id', async (req, res) => {
    try {
        const { 
            menuname, 
            categoryId, 
            price, 
            description, 
            isavailable, 
            is_active, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE menuitems SET menuname = ?, categoryId = ?, price = ?, description = ?, 
             isavailable = ?, is_active = ?, modified_by = ?, modified_on = CURRENT_TIMESTAMP 
             WHERE menuId = ?`,
            [menuname, categoryId, price, description, isavailable, 
             is_active, modified_by, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Menu item updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating menu item',
            error: error.message
        });
    }
});

// 8. DELETE - Soft delete menu item
router.delete('/menuitems/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE menuitems SET is_deleted = 1, is_active = 0 WHERE menuId = ?', 
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting menu item',
            error: error.message
        });
    }
});

// ==================== ORDERS APIs ====================

// 1. GET - Get all orders
router.get('/orders', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, u.user_name as customer_name, w.waiter_id, 
                   s.staff_name as waiter_name
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE o.is_deleted = 0
            ORDER BY o.order_date DESC
        `);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

// 2. GET - Get order details with items (MUST BE BEFORE /orders/:id)
router.get('/orders/:id/details', async (req, res) => {
    try {
        // Get order details
        const [orders] = await db.query(`
            SELECT 
                o.*,
                u.user_name as customer_name,
                u.u_phone as customer_phone,
                s.staff_name as waiter_name,
                w.waiter_id
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE o.order_id = ? AND o.is_deleted = 0
        `, [req.params.id]);
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Get order items
        const [items] = await db.query(`
            SELECT 
                oi.*,
                m.menuname,
                m.description,
                c.categoryname
            FROM order_items oi
            LEFT JOIN menuitems m ON oi.menu_id = m.menuId
            LEFT JOIN category c ON m.categoryId = c.categoryId
            WHERE oi.order_id = ? AND oi.is_deleted = 0
            ORDER BY oi.order_item_id
        `, [req.params.id]);
        
        res.json({
            success: true,
            data: {
                ...orders[0],
                items: items
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order details',
            error: error.message
        });
    }
});

// 3. GET - Get single order by ID (MUST BE AFTER /orders/:id/details)
router.get('/orders/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, u.user_name as customer_name, w.waiter_id, 
                   s.staff_name as waiter_name
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE o.order_id = ? AND o.is_deleted = 0
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
});

// // 2. GET - Get single order by ID
// router.get('/orders/:id', async (req, res) => {
//     try {
//         const [rows] = await db.query(`
//             SELECT o.*, u.user_name as customer_name, w.waiter_id, 
//                    s.staff_name as waiter_name
//             FROM orders o
//             LEFT JOIN users u ON o.customer_id = u.user_id
//             LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
//             LEFT JOIN staff s ON w.staff_id = s.staff_id
//             WHERE o.order_id = ? AND o.is_deleted = 0
//         `, [req.params.id]);
        
//         if (rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Order not found'
//             });
//         }
        
//         res.json({
//             success: true,
//             data: rows[0]
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching order',
//             error: error.message
//         });
//     }
// });

// 3. GET - Get orders by customer
router.get('/orders/customer/:customerId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, u.user_name as customer_name, w.waiter_id, 
                   s.staff_name as waiter_name
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE o.customer_id = ? AND o.is_deleted = 0
            ORDER BY o.order_date DESC
        `, [req.params.customerId]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching orders by customer',
            error: error.message
        });
    }
});

// 4. GET - Get orders by waiter
router.get('/orders/waiter/:waiterId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, u.user_name as customer_name, w.waiter_id, 
                   s.staff_name as waiter_name
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE o.waiter_id = ? AND o.is_deleted = 0
            ORDER BY o.order_date DESC
        `, [req.params.waiterId]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching orders by waiter',
            error: error.message
        });
    }
});

// 5. GET - Get orders by order status
router.get('/orders/orderstatus/:status', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, u.user_name as customer_name, w.waiter_id, 
                   s.staff_name as waiter_name
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE o.order_status = ? AND o.is_deleted = 0
            ORDER BY o.order_date DESC
        `, [req.params.status]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching orders by order status',
            error: error.message
        });
    }
});

// 6. GET - Get orders by payment status
router.get('/orders/paymentstatus/:status', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, u.user_name as customer_name, w.waiter_id, 
                   s.staff_name as waiter_name
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE o.payment_status = ? AND o.is_deleted = 0
            ORDER BY o.order_date DESC
        `, [req.params.status]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching orders by payment status',
            error: error.message
        });
    }
});

// 7. GET - Get orders by date
router.get('/orders/date/:date', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, u.user_name as customer_name, w.waiter_id, 
                   s.staff_name as waiter_name
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE DATE(o.order_date) = ? AND o.is_deleted = 0
            ORDER BY o.order_date DESC
        `, [req.params.date]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching orders by date',
            error: error.message
        });
    }
});

// 8. GET - Get orders by table
router.get('/orders/table/:tableId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, u.user_name as customer_name, w.waiter_id, 
                   s.staff_name as waiter_name
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE o.table_id = ? AND o.is_deleted = 0
            ORDER BY o.order_date DESC
        `, [req.params.tableId]);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching orders by table',
            error: error.message
        });
    }
});

// 9. POST - Create new order
router.post('/orders', async (req, res) => {
    try {
        const { 
            customer_id, 
            table_id, 
            waiter_id, 
            total_amount, 
            tax_amount, 
            discount_amount, 
            final_amount, 
            order_status, 
            payment_status, 
            payment_method, 
            special_instructions, 
            is_active, 
            created_by 
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO orders (customer_id, table_id, waiter_id, total_amount, tax_amount, 
             discount_amount, final_amount, order_status, payment_status, payment_method, 
             special_instructions, is_active, created_by, modified_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [customer_id, table_id, waiter_id, total_amount, tax_amount, discount_amount, 
             final_amount, order_status, payment_status, payment_method, special_instructions, 
             is_active, created_by, created_by]
        );
        
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
});

// 10. PUT - Update existing order
router.put('/orders/:id', async (req, res) => {
    try {
        const { 
            customer_id, 
            table_id, 
            waiter_id, 
            total_amount, 
            tax_amount, 
            discount_amount, 
            final_amount, 
            order_status, 
            payment_status, 
            payment_method, 
            special_instructions, 
            is_active, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE orders SET customer_id = ?, table_id = ?, waiter_id = ?, total_amount = ?, 
             tax_amount = ?, discount_amount = ?, final_amount = ?, order_status = ?, 
             payment_status = ?, payment_method = ?, special_instructions = ?, is_active = ?, 
             modified_by = ?, modified_on = CURRENT_TIMESTAMP WHERE order_id = ?`,
            [customer_id, table_id, waiter_id, total_amount, tax_amount, discount_amount, 
             final_amount, order_status, payment_status, payment_method, special_instructions, 
             is_active, modified_by, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Order updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order',
            error: error.message
        });
    }
});

// 11. DELETE - Soft delete order
router.delete('/orders/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE orders SET is_deleted = 1, is_active = 0 WHERE order_id = ?', 
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting order',
            error: error.message
        });
    }
});

// 12. GET - Get order details with items
router.get('/orders/:id/details', async (req, res) => {
    try {
        // Get order details
        const [orders] = await db.query(`
            SELECT 
                o.*,
                u.user_name as customer_name,
                u.u_phone as customer_phone,
                s.staff_name as waiter_name,
                w.waiter_id
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE o.order_id = ? AND o.is_deleted = 0
        `, [req.params.id]);
        
        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Get order items
        const [items] = await db.query(`
            SELECT 
                oi.*,
                m.menuname,
                m.description,
                c.categoryname
            FROM order_items oi
            LEFT JOIN menuitems m ON oi.menu_id = m.menuId
            LEFT JOIN category c ON m.categoryId = c.categoryId
            WHERE oi.order_id = ? AND oi.is_deleted = 0
            ORDER BY oi.order_item_id
        `, [req.params.id]);
        
        res.json({
            success: true,
            data: {
                ...orders[0],
                items: items
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order details',
            error: error.message
        });
    }
});


// ==================== ANALYTICS & REPORTS APIs ====================

// GET - Daily sales report
router.get('/reports/daily-sales/:date', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                DATE(order_date) as sale_date,
                COUNT(*) as total_orders,
                SUM(total_amount) as total_sales,
                SUM(tax_amount) as total_tax,
                SUM(discount_amount) as total_discount,
                SUM(final_amount) as net_sales
            FROM orders
            WHERE DATE(order_date) = ? AND is_deleted = 0
            GROUP BY DATE(order_date)
        `, [req.params.date]);
        
        res.json({
            success: true,
            data: rows[0] || {
                sale_date: req.params.date,
                total_orders: 0,
                total_sales: 0,
                total_tax: 0,
                total_discount: 0,
                net_sales: 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating daily sales report',
            error: error.message
        });
    }
});

// GET - Waiter performance report
router.get('/reports/waiter-performance', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                w.waiter_id,
                s.staff_name as waiter_name,
                w.tips_earned,
                COUNT(o.order_id) as total_orders,
                SUM(o.final_amount) as total_sales
            FROM waiters w
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            LEFT JOIN orders o ON w.waiter_id = o.waiter_id AND o.is_deleted = 0
            WHERE w.is_deleted = 0
            GROUP BY w.waiter_id, s.staff_name, w.tips_earned
            ORDER BY total_sales DESC
        `);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating waiter performance report',
            error: error.message
        });
    }
});

// GET - Popular menu items report
router.get('/reports/popular-items', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                m.menuId,
                m.menuname,
                c.categoryname,
                m.price,
                m.isavailable
            FROM menuitems m
            LEFT JOIN category c ON m.categoryId = c.categoryId
            WHERE m.is_deleted = 0 AND m.is_active = 1
            ORDER BY m.menuname
        `);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating popular items report',
            error: error.message
        });
    }
});

module.exports = router;
