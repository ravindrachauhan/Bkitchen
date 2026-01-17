// auth-check.js - Authentication Check for All Pages
// Include this script at the top of every page (Dashboard, Orders, etc.)

(function() {
    // Check authentication on page load
    function checkAuth() {
        // Try to get staff data from localStorage or sessionStorage
        let staffData = localStorage.getItem('staffData') || sessionStorage.getItem('staffData');
        
        if (!staffData) {
            // No login data found, redirect to login
            window.location.href = '/Loginpage-new.html';
            return null;
        }
        
        try {
            const staff = JSON.parse(staffData);
            
            // Check if login is not too old (optional - 24 hours)
            if (staff.loginTime) {
                const loginTime = new Date(staff.loginTime);
                const now = new Date();
                const hoursPassed = (now - loginTime) / (1000 * 60 * 60);
                
                if (hoursPassed > 24) {
                    // Session expired
                    logout();
                    return null;
                }
            }
            
            return staff;
        } catch (error) {
            console.error('Error parsing staff data:', error);
            logout();
            return null;
        }
    }

    // Logout function
    function logout() {
        localStorage.removeItem('staffData');
        sessionStorage.removeItem('staffData');
        window.location.href = '/Loginpage-new.html';
    }

    // Update user display in navbar
    function updateUserDisplay(staff) {
        const userNameElements = document.querySelectorAll('.user-name');
        const userRoleElements = document.querySelectorAll('.user-role');
        
        userNameElements.forEach(el => {
            el.textContent = staff.staff_name;
        });
        
        userRoleElements.forEach(el => {
            el.textContent = staff.position;
        });
    }

    // Filter sidebar menu based on access level
    function filterSidebarMenu(staff) {
        if (!staff.access_level || !staff.access_level.menus) {
            return;
        }
        
        const allowedMenus = staff.access_level.menus;
        const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
        
        sidebarLinks.forEach(link => {
            const linkText = link.textContent.trim();
            
            // Check if this menu item is allowed
            const isAllowed = allowedMenus.some(menu => 
                linkText.includes(menu) || menu.includes(linkText)
            );
            
            if (!isAllowed) {
                // Hide the parent <li> element
                const listItem = link.closest('li');
                if (listItem) {
                    listItem.style.display = 'none';
                }
            }
        });
    }

    // Setup logout button
    function setupLogoutButton() {
        const logoutButtons = document.querySelectorAll('.logout-btn');
        
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (confirm('Are you sure you want to logout?')) {
                    logout();
                }
            });
        });
    }

    // Initialize authentication check
    function init() {
        const staff = checkAuth();
        
        if (staff) {
            updateUserDisplay(staff);
            filterSidebarMenu(staff);
            setupLogoutButton();
            
            // Make staff data globally available
            window.currentStaff = staff;
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose logout function globally
    window.logout = logout;
    window.checkAuth = checkAuth;
})();