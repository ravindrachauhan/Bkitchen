// inventory.js - Complete Inventory Management Frontend Logic
const API_BASE_URL = 'http://localhost:3000/api';

class InventoryManager {
    constructor() {
        this.inventory = [];
        this.allInventory = [];
        this.categories = [];
        this.currentItem = null;
        this.init();
    }

    async init() {
        await this.loadCategories();
        await this.loadInventory();
        await this.loadStats();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchInventory(e.target.value);
            });
        }

        // Close modals on outside click
        const addModal = document.getElementById('addItemModal');
        const updateModal = document.getElementById('updateStockModal');
        
        if (addModal) {
            addModal.addEventListener('click', (e) => {
                if (e.target === addModal) {
                    this.closeAddItemModal();
                }
            });
        }
        
        if (updateModal) {
            updateModal.addEventListener('click', (e) => {
                if (e.target === updateModal) {
                    this.closeUpdateStockModal();
                }
            });
        }
    }

    async loadCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            const result = await response.json();
            
            if (result.success) {
                this.categories = result.data;
                this.renderCategoryFilter();
                this.renderCategoryOptions();
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    renderCategoryFilter() {
        const filterBtn = document.querySelector('.filter-group .btn-outline');
        if (!filterBtn) return;
        
        // Create dropdown
        const dropdown = document.createElement('select');
        dropdown.id = 'categoryFilter';
        dropdown.className = 'btn btn-outline';
        dropdown.style.cssText = 'padding: 11px 20px; cursor: pointer;';
        
        dropdown.innerHTML = '<option value="">All Categories</option>' +
            this.categories.map(cat => 
                `<option value="${cat.categoryId}">${cat.categoryname}</option>`
            ).join('');
        
        dropdown.addEventListener('change', (e) => {
            this.filterByCategory(e.target.value);
        });
        
        filterBtn.replaceWith(dropdown);
    }

    renderCategoryOptions() {
        const addCategorySelect = document.querySelector('#addItemModal select[required]');
        const updateCategorySelect = document.querySelector('#updateItemModal select');
        
        const options = this.categories.map(cat => 
            `<option value="${cat.categoryId}">${cat.categoryname}</option>`
        ).join('');
        
        if (addCategorySelect) {
            addCategorySelect.innerHTML = '<option value="">Select Category</option>' + options;
        }
    }

    async loadStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/inventory/stats`);
            const result = await response.json();
            
            if (result.success) {
                this.renderStats(result.data);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    renderStats(stats) {
        const statCards = document.querySelectorAll('.stat-card p');
        if (statCards.length >= 4) {
            statCards[0].textContent = stats.totalItems;
            statCards[1].textContent = stats.lowStockItems;
            statCards[2].textContent = stats.outOfStock;
            statCards[3].textContent = stats.reorderRequired;
        }
    }

    async loadInventory() {
        try {
            const response = await fetch(`${API_BASE_URL}/inventory`);
            const result = await response.json();
            
            if (result.success) {
                this.inventory = result.data;
                this.allInventory = result.data;
                this.renderInventory(this.inventory);
            }
        } catch (error) {
            console.error('Error loading inventory:', error);
            this.showNotification('Error loading inventory', 'error');
        }
    }
   
    renderInventory(items) {
    const tbody = document.querySelector('.inventory-table tbody');
    
    if (!tbody) return;
    
    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                    No inventory items found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = items.map(item => {
        // Determine status class based on stock status
        let statusClass = '';
        if (item.stock_status === 'Out of Stock') {
            statusClass = 'status-out-of-stock';
        } else if (item.stock_status === 'Low Stock') {
            statusClass = 'status-low';
        } else if (item.stock_status === 'Medium Stock') {
            statusClass = 'status-medium';
        } else {
            statusClass = 'status-high';
        }
        
        return `
            <tr>
                <td><strong>${item.item_name}</strong></td>
                <td>${item.category}</td>
                <td>${item.current_stock} ${item.unit}</td>
                <td>${item.unit}</td>
                <td>${item.reorder_level} ${item.unit}</td>
                <td><span class="stock-status ${statusClass}">${item.stock_status}</span></td>
                <td>
                    <button class="btn btn-primary btn-small" onclick="inventoryManager.openUpdateStockModal(${item.menuId}, '${item.item_name}')">
                        Update
                    </button>
                </td>
            </tr>
        `;
        }).join('');
    }

    searchInventory(searchTerm) {
        const filtered = this.allInventory.filter(item => {
            const term = searchTerm.toLowerCase();
            return item.item_name.toLowerCase().includes(term) ||
                   item.category.toLowerCase().includes(term);
        });
        
        this.renderInventory(filtered);
    }

    async filterByCategory(categoryId) {
        if (!categoryId) {
            this.renderInventory(this.allInventory);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/inventory/category/${categoryId}`);
            const result = await response.json();
            
            if (result.success) {
                this.renderInventory(result.data);
            }
        } catch (error) {
            console.error('Error filtering by category:', error);
        }
    }

    openAddItemModal() {
        document.getElementById('addItemModal').classList.add('active');
    }

    closeAddItemModal() {
        document.getElementById('addItemModal').classList.remove('active');
        document.querySelector('#addItemModal form').reset();
    }

    openUpdateStockModal(menuId, itemName) {
        this.currentItem = menuId;
        document.getElementById('updateItemName').value = itemName;
        document.getElementById('updateStockModal').classList.add('active');
    }

    closeUpdateStockModal() {
        document.getElementById('updateStockModal').classList.remove('active');
        document.querySelector('#updateStockModal form').reset();
        this.currentItem = null;
    }

    async handleAddItem(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            menuname: formData.get('itemName'),
            categoryId: formData.get('category'),
            price: formData.get('price') || 0,
            description: formData.get('description') || '',
            current_stock: formData.get('currentStock'),
            unit: formData.get('unit'),
            reorder_level: formData.get('reorderLevel'),
            isavailable: 1,
            created_by: 'Manager'
        };

        try {
            const response = await fetch(`${API_BASE_URL}/inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Item added successfully!', 'success');
                this.closeAddItemModal();
                await this.loadInventory();
                await this.loadStats();
            } else {
                this.showNotification('Error: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            this.showNotification('Error adding item', 'error');
        }
    }

    async handleUpdateStock(event) {
        event.preventDefault();
        
        const action = document.getElementById('stockAction').value;
        const quantity = document.getElementById('stockQuantity').value;

        if (!this.currentItem) {
            this.showNotification('No item selected', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/inventory/${this.currentItem}/stock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: action,
                    quantity: parseFloat(quantity),
                    modified_by: 'Manager'
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showNotification('Stock updated successfully!', 'success');
                this.closeUpdateStockModal();
                await this.loadInventory();
                await this.loadStats();
            } else {
                this.showNotification('Error: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Error updating stock:', error);
            this.showNotification('Error updating stock', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            background: ${type === 'success' ? '#2d5a3d' : type === 'error' ? '#c77e3f' : '#d4a017'};
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize on page load
let inventoryManager;
document.addEventListener('DOMContentLoaded', () => {
    inventoryManager = new InventoryManager();
});

// Global functions for inline onclick handlers
function openAddItemModal() {
    inventoryManager.openAddItemModal();
}

function closeAddItemModal() {
    inventoryManager.closeAddItemModal();
}

function closeUpdateStockModal() {
    inventoryManager.closeUpdateStockModal();
}

function handleAddItem(event) {
    inventoryManager.handleAddItem(event);
}

function handleUpdateStock(event) {
    inventoryManager.handleUpdateStock(event);
}