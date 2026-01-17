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
// 1. Fix GET /orders endpoint (around line 1030)
router.get('/orders', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, 
                   COALESCE(o.customer_name, u.user_name) as customer_name,
                   o.customer_phone,
                   o.customer_address,
                   w.waiter_id, 
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

// 2. Fix GET /orders/:id/details endpoint (around line 1055)
router.get('/orders/:id/details', async (req, res) => {
    try {
        // Get order details
        const [orders] = await db.query(`
            SELECT 
                o.*,
                COALESCE(o.customer_name, u.user_name) as customer_name,
                COALESCE(o.customer_phone, u.u_phone) as customer_phone,
                o.customer_address,
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

// 3. Fix GET /orders/:id endpoint (around line 1095)
router.get('/orders/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, 
                   COALESCE(o.customer_name, u.user_name) as customer_name,
                   o.customer_phone,
                   o.customer_address,
                   w.waiter_id, 
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

// 4. Fix GET /orders/customer/:customerId
router.get('/orders/customer/:customerId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, 
                   COALESCE(o.customer_name, u.user_name) as customer_name,
                   o.customer_phone,
                   o.customer_address,
                   w.waiter_id, 
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

// 5. Fix GET /orders/waiter/:waiterId
router.get('/orders/waiter/:waiterId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, 
                   COALESCE(o.customer_name, u.user_name) as customer_name,
                   o.customer_phone,
                   o.customer_address,
                   w.waiter_id, 
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

// 6. Fix GET /orders/orderstatus/:status
router.get('/orders/orderstatus/:status', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, 
                   COALESCE(o.customer_name, u.user_name) as customer_name,
                   o.customer_phone,
                   o.customer_address,
                   w.waiter_id, 
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

// 7. Fix GET /orders/paymentstatus/:status
router.get('/orders/paymentstatus/:status', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, 
                   COALESCE(o.customer_name, u.user_name) as customer_name,
                   o.customer_phone,
                   o.customer_address,
                   w.waiter_id, 
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

// 8. Fix GET /orders/date/:date
router.get('/orders/date/:date', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, 
                   COALESCE(o.customer_name, u.user_name) as customer_name,
                   o.customer_phone,
                   o.customer_address,
                   w.waiter_id, 
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

// 9. Fix GET /orders/table/:tableId
router.get('/orders/table/:tableId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, 
                   COALESCE(o.customer_name, u.user_name) as customer_name,
                   o.customer_phone,
                   o.customer_address,
                   w.waiter_id, 
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
// router.put('/orders/:id', async (req, res) => {
//     try {
//         const { 
//             customer_id, 
//             table_id, 
//             waiter_id, 
//             total_amount, 
//             tax_amount, 
//             discount_amount, 
//             final_amount, 
//             order_status, 
//             payment_status, 
//             payment_method, 
//             special_instructions, 
//             is_active, 
//             modified_by 
//         } = req.body;
        
//         const [result] = await db.query(
//             `UPDATE orders SET customer_id = ?, table_id = ?, waiter_id = ?, total_amount = ?, 
//              tax_amount = ?, discount_amount = ?, final_amount = ?, order_status = ?, 
//              payment_status = ?, payment_method = ?, special_instructions = ?, is_active = ?, 
//              modified_by = ?, modified_on = CURRENT_TIMESTAMP WHERE order_id = ?`,
//             [customer_id, table_id, waiter_id, total_amount, tax_amount, discount_amount, 
//              final_amount, order_status, payment_status, payment_method, special_instructions, 
//              is_active, modified_by, req.params.id]
//         );
        
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Order not found'
//             });
//         }
        
//         res.json({
//             success: true,
//             message: 'Order updated successfully'
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Error updating order',
//             error: error.message
//         });
//     }
// });

router.put('/orders/:id', async (req, res) => {
    try {
        const { 
            customer_id,
            customer_name,      // NEW
            customer_phone,     // NEW  
            customer_address,   // NEW
            table_id, 
            waiter_id, 
            total_amount, 
            tax_amount, 
            discount_amount, 
            final_amount, 
            order_status,
            order_type,         // NEW
            payment_status, 
            payment_method, 
            special_instructions, 
            is_active, 
            modified_by 
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE orders SET 
             customer_id = ?, customer_name = ?, customer_phone = ?, customer_address = ?,
             table_id = ?, waiter_id = ?, total_amount = ?, 
             tax_amount = ?, discount_amount = ?, final_amount = ?, order_status = ?,
             order_type = ?, payment_status = ?, payment_method = ?, special_instructions = ?, is_active = ?, 
             modified_by = ?, modified_on = CURRENT_TIMESTAMP 
             WHERE order_id = ?`,
            [
                customer_id, customer_name, customer_phone, customer_address,
                table_id, waiter_id, total_amount, tax_amount, discount_amount, 
                final_amount, order_status, order_type, payment_status, payment_method, special_instructions, 
                is_active, modified_by, req.params.id
            ]
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

// POST - Create new order with items (ENHANCED VERSION)
// router.post('/orders/create-with-items', async (req, res) => {
//     const connection = await db.getConnection();
    
//     try {
//         await connection.beginTransaction();
        
//         const { 
//             customer_id, 
//             table_id, 
//             waiter_id, 
//             items, // Array of {menu_id, quantity}
//             tax_rate,
//             discount_amount,
//             special_instructions,
//             created_by 
//         } = req.body;
        
//         // Validate required fields
//         if (!table_id || !waiter_id || !items || items.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Table ID, Waiter ID, and at least one item are required'
//             });
//         }
        
//         // Fetch menu item prices
//         let total_amount = 0;
//         const itemsWithPrices = [];
        
//         for (const item of items) {
//             const [menuItem] = await connection.query(
//                 'SELECT menuId, menuname, price FROM menuitems WHERE menuId = ? AND is_deleted = 0',
//                 [item.menu_id]
//             );
            
//             if (menuItem.length === 0) {
//                 await connection.rollback();
//                 return res.status(404).json({
//                     success: false,
//                     message: `Menu item with ID ${item.menu_id} not found`
//                 });
//             }
            
//             const price = parseFloat(menuItem[0].price);
//             const quantity = parseInt(item.quantity);
//             const subtotal = price * quantity;
//             total_amount += subtotal;
            
//             itemsWithPrices.push({
//                 menu_id: item.menu_id,
//                 menuname: menuItem[0].menuname,
//                 quantity: quantity,
//                 item_price: price,
//                 subtotal: subtotal,
//                 special_notes: item.special_notes || null
//             });
//         }
        
//         // Calculate tax and final amount
//         const tax_amount = total_amount * (tax_rate || 0.09); // Default 9% tax
//         const discount = parseFloat(discount_amount || 0);
//         const final_amount = total_amount + tax_amount - discount;
        
//         // Insert order
//         const [orderResult] = await connection.query(
//             `INSERT INTO orders (
//                 customer_id, table_id, waiter_id, 
//                 total_amount, tax_amount, discount_amount, final_amount, 
//                 order_status, payment_status, special_instructions, 
//                 is_active, created_by, modified_by
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Incoming', 'Unpaid', ?, 1, ?, ?)`,
//             [
//                 customer_id || null, 
//                 table_id, 
//                 waiter_id, 
//                 total_amount.toFixed(2), 
//                 tax_amount.toFixed(2), 
//                 discount.toFixed(2), 
//                 final_amount.toFixed(2), 
//                 special_instructions || null, 
//                 created_by || 'System', 
//                 created_by || 'System'
//             ]
//         );
        
//         const order_id = orderResult.insertId;
        
//         // Insert order items
//         for (const item of itemsWithPrices) {
//             await connection.query(
//                 `INSERT INTO order_items (
//                     order_id, menu_id, quantity, item_price, subtotal, 
//                     special_notes, created_by, modified_by
//                 ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//                 [
//                     order_id, 
//                     item.menu_id, 
//                     item.quantity, 
//                     item.item_price, 
//                     item.subtotal, 
//                     item.special_notes, 
//                     created_by || 'System', 
//                     created_by || 'System'
//                 ]
//             );
//         }
        
//         await connection.commit();
        
//         res.status(201).json({
//             success: true,
//             message: 'Order created successfully',
//             data: {
//                 order_id: order_id,
//                 table_id: table_id,
//                 total_amount: total_amount.toFixed(2),
//                 tax_amount: tax_amount.toFixed(2),
//                 discount_amount: discount.toFixed(2),
//                 final_amount: final_amount.toFixed(2),
//                 items: itemsWithPrices
//             }
//         });
        
//     } catch (error) {
//         await connection.rollback();
//         console.error('Error creating order:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error creating order',
//             error: error.message
//         });
//     } finally {
//         connection.release();
//     }
// });

router.post('/orders/create-with-items', async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { 
            customer_id,
            customer_name,      // NEW
            customer_phone,     // NEW
            customer_address,   // NEW
            order_type,         // NEW (Dine-in or Takeaway)
            table_id, 
            waiter_id, 
            items,
            tax_rate,
            discount_amount,
            special_instructions,
            created_by 
        } = req.body;
        
        // Validate required fields
        if (!customer_name || !customer_phone) {
            return res.status(400).json({
                success: false,
                message: 'Customer name and phone number are required'
            });
        }
        
        if (!order_type || !['Dine-in', 'Takeaway'].includes(order_type)) {
            return res.status(400).json({
                success: false,
                message: 'Order type must be either "Dine-in" or "Takeaway"'
            });
        }
        
        // Table is required for Dine-in, optional for Takeaway
        if (order_type === 'Dine-in' && !table_id) {
            return res.status(400).json({
                success: false,
                message: 'Table number is required for Dine-in orders'
            });
        }
        
        if (!waiter_id || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Waiter and at least one item are required'
            });
        }
        
        // Fetch menu item prices
        let total_amount = 0;
        const itemsWithPrices = [];
        
        for (const item of items) {
            const [menuItem] = await connection.query(
                'SELECT menuId, menuname, price FROM menuitems WHERE menuId = ? AND is_deleted = 0',
                [item.menu_id]
            );
            
            if (menuItem.length === 0) {
                await connection.rollback();
                return res.status(404).json({
                    success: false,
                    message: `Menu item with ID ${item.menu_id} not found`
                });
            }
            
            const price = parseFloat(menuItem[0].price);
            const quantity = parseInt(item.quantity);
            const subtotal = price * quantity;
            total_amount += subtotal;
            
            itemsWithPrices.push({
                menu_id: item.menu_id,
                menuname: menuItem[0].menuname,
                quantity: quantity,
                item_price: price,
                subtotal: subtotal,
                special_notes: item.special_notes || null
            });
        }
        
        // Calculate tax and final amount
        const tax_amount = total_amount * (tax_rate || 0.09);
        const discount = parseFloat(discount_amount || 0);
        const final_amount = total_amount + tax_amount - discount;
        
        // Insert order with customer details
        const [orderResult] = await connection.query(
            `INSERT INTO orders (
                customer_id, customer_name, customer_phone, customer_address,
                table_id, waiter_id, 
                total_amount, tax_amount, discount_amount, final_amount, 
                order_status, order_type, payment_status, special_instructions, 
                is_active, created_by, modified_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Incoming', ?, 'Unpaid', ?, 1, ?, ?)`,
            [
                customer_id || null,
                customer_name,
                customer_phone,
                customer_address || null,
                order_type === 'Dine-in' ? table_id : null,
                waiter_id, 
                total_amount.toFixed(2), 
                tax_amount.toFixed(2), 
                discount.toFixed(2), 
                final_amount.toFixed(2),
                order_type,
                special_instructions || null, 
                created_by || 'System', 
                created_by || 'System'
            ]
        );
        
        const order_id = orderResult.insertId;
        
        // Insert order items
        for (const item of itemsWithPrices) {
            await connection.query(
                `INSERT INTO order_items (
                    order_id, menu_id, quantity, item_price, subtotal, 
                    special_notes, created_by, modified_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    order_id, 
                    item.menu_id, 
                    item.quantity, 
                    item.item_price, 
                    item.subtotal, 
                    item.special_notes, 
                    created_by || 'System', 
                    created_by || 'System'
                ]
            );
        }

        // After inserting order items, reduce stock
        for (const item of itemsWithPrices) {
            // Reduce stock
            await connection.query(
                `UPDATE menuitems 
                SET current_stock = GREATEST(0, current_stock - ?),
                    modified_on = CURRENT_TIMESTAMP
                WHERE menuId = ?`,
                [item.quantity, item.menu_id]
            );
        }
        
        await connection.commit();
        
        res.status(201).json({
            success: true,
            message: `${order_type} order created successfully`,
            data: {
                order_id: order_id,
                customer_name: customer_name,
                customer_phone: customer_phone,
                order_type: order_type,
                table_id: table_id,
                total_amount: total_amount.toFixed(2),
                tax_amount: tax_amount.toFixed(2),
                discount_amount: discount.toFixed(2),
                final_amount: final_amount.toFixed(2),
                items: itemsWithPrices
            }
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    } finally {
        connection.release();
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

// 1. GET - Get all receipts with order details
router.get('/receipts', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.*,
                o.order_date,
                o.total_amount,
                o.tax_amount,
                o.discount_amount,
                o.final_amount,
                o.order_type,
                o.table_id,
                COALESCE(o.customer_name, u.user_name) as customer_name,
                COALESCE(o.customer_phone, u.u_phone) as customer_phone,
                o.customer_address,
                s.staff_name as waiter_name
            FROM receipts r
            INNER JOIN orders o ON r.order_id = o.order_id
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE r.is_deleted = 0
            ORDER BY r.generated_date DESC
        `);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching receipts',
            error: error.message
        });
    }
});

// 2. GET - Get single receipt by ID
router.get('/receipts/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.*,
                o.order_date,
                o.total_amount,
                o.tax_amount,
                o.discount_amount,
                o.final_amount,
                o.order_type,
                o.table_id,
                o.special_instructions,
                COALESCE(o.customer_name, u.user_name) as customer_name,
                COALESCE(o.customer_phone, u.u_phone) as customer_phone,
                o.customer_address,
                s.staff_name as waiter_name
            FROM receipts r
            INNER JOIN orders o ON r.order_id = o.order_id
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE r.receipt_id = ? AND r.is_deleted = 0
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Receipt not found'
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
        `, [rows[0].order_id]);
        
        res.json({
            success: true,
            data: {
                ...rows[0],
                items: items
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching receipt',
            error: error.message
        });
    }
});

// 3. GET - Get receipt by order ID
router.get('/receipts/order/:orderId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.*,
                o.order_date,
                o.total_amount,
                o.tax_amount,
                o.discount_amount,
                o.final_amount,
                o.order_type,
                o.table_id,
                o.special_instructions,
                COALESCE(o.customer_name, u.user_name) as customer_name,
                COALESCE(o.customer_phone, u.u_phone) as customer_phone,
                o.customer_address,
                s.staff_name as waiter_name
            FROM receipts r
            INNER JOIN orders o ON r.order_id = o.order_id
            LEFT JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN waiters w ON o.waiter_id = w.waiter_id
            LEFT JOIN staff s ON w.staff_id = s.staff_id
            WHERE r.order_id = ? AND r.is_deleted = 0
            ORDER BY r.generated_date DESC
        `, [req.params.orderId]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No receipt found for this order'
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
        `, [req.params.orderId]);
        
        res.json({
            success: true,
            data: {
                ...rows[0],
                items: items
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching receipt',
            error: error.message
        });
    }
});

// 4. POST - Generate new receipt
router.post('/receipts/generate', async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { order_id, payment_method, payment_status, created_by } = req.body;
        
        if (!order_id || !payment_method) {
            return res.status(400).json({
                success: false,
                message: 'Order ID and payment method are required'
            });
        }
        
        // Check if order exists
        const [orderCheck] = await connection.query(
            'SELECT order_id, payment_status FROM orders WHERE order_id = ? AND is_deleted = 0',
            [order_id]
        );
        
        if (orderCheck.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Check if receipt already exists
        const [existingReceipt] = await connection.query(
            'SELECT receipt_id FROM receipts WHERE order_id = ? AND is_deleted = 0',
            [order_id]
        );
        
        if (existingReceipt.length > 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Receipt already exists for this order',
                receipt_id: existingReceipt[0].receipt_id
            });
        }
        
        // Generate receipt number
        const receiptNumber = `RCP-${String(order_id).padStart(6, '0')}`;
        
        // Determine payment status (default to 'Paid' if not provided)
        const finalPaymentStatus = payment_status || 'Paid';
        
        // Insert receipt
        const [receiptResult] = await connection.query(
            `INSERT INTO receipts (order_id, receipt_number, payment_method, payment_status, created_by, modified_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [order_id, receiptNumber, payment_method, finalPaymentStatus, created_by || 'Manager', created_by || 'Manager']
        );
        
        // Update order status
        await connection.query(
            `UPDATE orders 
             SET order_status = 'Completed', 
                 payment_status = ?,
                 payment_method = ?,
                 modified_by = ?,
                 modified_on = CURRENT_TIMESTAMP
             WHERE order_id = ?`,
            [finalPaymentStatus, payment_method, created_by || 'Manager', order_id]
        );
        
        await connection.commit();
        
        res.status(201).json({
            success: true,
            message: 'Receipt generated successfully',
            data: {
                receipt_id: receiptResult.insertId,
                receipt_number: receiptNumber,
                order_id: order_id,
                payment_status: finalPaymentStatus
            }
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('Error generating receipt:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating receipt',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// ==================== INVENTORY APIs ====================

// 1. GET - Get inventory statistics
router.get('/inventory/stats', async (req, res) => {
    try {
        const [totalItems] = await db.query(`
            SELECT COUNT(*) as total 
            FROM menuitems 
            WHERE is_deleted = 0 AND is_active = 1
        `);
        
        const [lowStock] = await db.query(`
            SELECT COUNT(*) as count 
            FROM menuitems 
            WHERE current_stock > 0 
            AND current_stock <= reorder_level 
            AND is_deleted = 0 AND is_active = 1
        `);
        
        const [outOfStock] = await db.query(`
            SELECT COUNT(*) as count 
            FROM menuitems 
            WHERE current_stock = 0 
            AND is_deleted = 0 AND is_active = 1
        `);
        
        const [reorderRequired] = await db.query(`
            SELECT COUNT(*) as count 
            FROM menuitems 
            WHERE current_stock <= reorder_level 
            AND is_deleted = 0 AND is_active = 1
        `);
        
        res.json({
            success: true,
            data: {
                totalItems: totalItems[0].total,
                lowStockItems: lowStock[0].count,
                outOfStock: outOfStock[0].count,
                reorderRequired: reorderRequired[0].count
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching inventory statistics',
            error: error.message
        });
    }
});

// 2. GET - Get all inventory items
router.get('/inventory', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                m.menuId,
                m.menuname as item_name,
                c.categoryname as category,
                m.current_stock,
                m.unit,
                m.reorder_level,
                m.price,
                m.last_restocked_date,
                CASE 
                    WHEN m.current_stock = 0 THEN 'Out of Stock'
                    WHEN m.current_stock <= m.reorder_level THEN 'Low Stock'
                    WHEN m.current_stock <= (m.reorder_level * 2) THEN 'Medium Stock'
                    ELSE 'High Stock'
                END as stock_status
            FROM menuitems m
            LEFT JOIN category c ON m.categoryId = c.categoryId
            WHERE m.is_deleted = 0 AND m.is_active = 1
            ORDER BY m.current_stock ASC, m.menuname ASC
        `);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching inventory',
            error: error.message
        });
    }
});

// 3. GET - Get inventory by category
router.get('/inventory/category/:categoryId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                m.menuId,
                m.menuname as item_name,
                c.categoryname as category,
                m.current_stock,
                m.unit,
                m.reorder_level,
                m.price,
                m.last_restocked_date,
                CASE 
                    WHEN m.current_stock = 0 THEN 'Out of Stock'
                    WHEN m.current_stock <= m.reorder_level THEN 'Low Stock'
                    WHEN m.current_stock <= (m.reorder_level * 2) THEN 'Medium Stock'
                    ELSE 'High Stock'
                END as stock_status
            FROM menuitems m
            LEFT JOIN category c ON m.categoryId = c.categoryId
            WHERE m.categoryId = ? AND m.is_deleted = 0 AND m.is_active = 1
            ORDER BY m.current_stock ASC
        `, [req.params.categoryId]);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching inventory by category',
            error: error.message
        });
    }
});

// 4. PUT - Update inventory stock
router.put('/inventory/:id/stock', async (req, res) => {
    try {
        const { action, quantity, modified_by } = req.body;
        
        if (!action || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Action and quantity are required'
            });
        }
        
        // Get current stock
        const [currentItem] = await db.query(
            'SELECT current_stock FROM menuitems WHERE menuId = ? AND is_deleted = 0',
            [req.params.id]
        );
        
        if (currentItem.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        let newStock;
        const currentStock = parseFloat(currentItem[0].current_stock);
        const qty = parseFloat(quantity);
        
        switch(action) {
            case 'add':
                newStock = currentStock + qty;
                break;
            case 'remove':
                newStock = Math.max(0, currentStock - qty);
                break;
            case 'set':
                newStock = qty;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid action. Use: add, remove, or set'
                });
        }
        
        const [result] = await db.query(
            `UPDATE menuitems 
             SET current_stock = ?, 
                 last_restocked_date = CURRENT_TIMESTAMP,
                 modified_by = ?,
                 modified_on = CURRENT_TIMESTAMP 
             WHERE menuId = ?`,
            [newStock, modified_by || 'Manager', req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Stock updated successfully',
            data: {
                previous_stock: currentStock,
                new_stock: newStock
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating stock',
            error: error.message
        });
    }
});

// 5. POST - Add new inventory item
router.post('/inventory', async (req, res) => {
    try {
        const {
            menuname,
            categoryId,
            price,
            description,
            current_stock,
            unit,
            reorder_level,
            isavailable,
            created_by
        } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO menuitems 
             (menuname, categoryId, price, description, current_stock, unit, reorder_level, 
              isavailable, is_active, last_restocked_date, created_by, modified_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, ?, ?)`,
            [
                menuname,
                categoryId,
                price,
                description || '',
                current_stock || 0,
                unit || 'pcs',
                reorder_level || 10,
                isavailable !== undefined ? isavailable : 1,
                created_by || 'Manager',
                created_by || 'Manager'
            ]
        );
        
        res.status(201).json({
            success: true,
            message: 'Inventory item added successfully',
            menuId: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding inventory item',
            error: error.message
        });
    }
});

// 6. PUT - Update inventory item details
router.put('/inventory/:id', async (req, res) => {
    try {
        const {
            menuname,
            categoryId,
            price,
            description,
            current_stock,
            unit,
            reorder_level,
            isavailable,
            modified_by
        } = req.body;
        
        const [result] = await db.query(
            `UPDATE menuitems 
             SET menuname = ?, categoryId = ?, price = ?, description = ?,
                 current_stock = ?, unit = ?, reorder_level = ?,
                 isavailable = ?, modified_by = ?, modified_on = CURRENT_TIMESTAMP
             WHERE menuId = ? AND is_deleted = 0`,
            [
                menuname,
                categoryId,
                price,
                description,
                current_stock,
                unit,
                reorder_level,
                isavailable,
                modified_by || 'Manager',
                req.params.id
            ]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Inventory item updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating inventory item',
            error: error.message
        });
    }
});

// ==================== AUTHENTICATION APIs ====================

// POST - Login endpoint
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        
        // Query staff table for credentials
        const [rows] = await db.query(
            `SELECT 
                staff_id, 
                staff_name, 
                email, 
                password_hash, 
                position, 
                phone_number,
                is_active 
             FROM staff 
             WHERE email = ? AND is_deleted = 0`,
            [email]
        );
        
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        const staff = rows[0];
        
        // Check if staff is active
        if (staff.is_active === 0) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact administrator.'
            });
        }
        
        // Verify password
        if (password !== staff.password_hash) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Determine access level
        const accessLevel = getAccessLevel(staff.position);
        
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                staff_id: staff.staff_id,
                staff_name: staff.staff_name,
                email: staff.email,
                position: staff.position,
                phone_number: staff.phone_number,
                access_level: accessLevel
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
});

// Helper function for access levels
function getAccessLevel(position) {
    const pos = position.toLowerCase();
    
    if (pos === 'admin' || pos === 'manager') {
        return {
            role: position,
            menus: ['Dashboard', 'Order Management', 'Inventory', 'Reports', 'Discounts', 'Receipts'],
            fullAccess: true
        };
    } else if (pos === 'supervisor') {
        return {
            role: position,
            menus: ['Dashboard', 'Order Management', 'Inventory', 'Discounts', 'Receipts'],
            fullAccess: false
        };
    } else if (pos === 'chef' || pos === 'assistant chef') {
        return {
            role: position,
            menus: ['Order Management', 'Inventory', 'Receipts'],
            fullAccess: false
        };
    } else if (pos === 'waiter' || pos === 'cashier' || pos === 'receptionist') {
        return {
            role: position,
            menus: ['Order Management', 'Inventory', 'Discounts', 'Receipts'],
            fullAccess: false
        };
    } else if (pos === 'helper' || pos === 'cleaner') {
        return {
            role: position,
            menus: [],
            fullAccess: false
        };
    } else {
        return {
            role: position,
            menus: [],
            fullAccess: false
        };
    }
}

// POST - Logout endpoint
router.post('/auth/logout', async (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// GET - Verify session
router.get('/auth/verify', async (req, res) => {
    const staffId = req.query.staff_id;
    
    if (!staffId) {
        return res.status(401).json({
            success: false,
            message: 'No session found'
        });
    }
    
    try {
        const [rows] = await db.query(
            `SELECT staff_id, staff_name, email, position, is_active 
             FROM staff 
             WHERE staff_id = ? AND is_deleted = 0`,
            [staffId]
        );
        
        if (rows.length === 0 || rows[0].is_active === 0) {
            return res.status(401).json({
                success: false,
                message: 'Session expired or invalid'
            });
        }
        
        const accessLevel = getAccessLevel(rows[0].position);
        
        res.json({
            success: true,
            data: {
                ...rows[0],
                access_level: accessLevel
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying session',
            error: error.message
        });
    }
});

module.exports = router;
