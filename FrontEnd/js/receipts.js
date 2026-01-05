// receipts.js - Complete Receipts Management Frontend Logic
const API_BASE_URL = 'http://localhost:3000/api';

class ReceiptsManager {
    constructor() {
        this.receipts = [];
        this.allReceipts = []; // Store all receipts for filtering
        this.currentReceipt = null;
        this.init();
    }

    async init() {
        await this.loadReceipts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchReceipts').addEventListener('input', (e) => {
            this.searchReceipts(e.target.value);
        });

        // Filter by date
        document.getElementById('filterDate').addEventListener('change', (e) => {
            this.filterByDate(e.target.value);
        });

        // Filter by payment status
        document.getElementById('filterPaymentStatus').addEventListener('change', (e) => {
            this.filterByPaymentStatus(e.target.value);
        });

        // Close modal on outside click
        document.getElementById('receiptModal').addEventListener('click', (e) => {
            if (e.target.id === 'receiptModal') {
                this.closeModal();
            }
        });

        document.getElementById('generateReceiptModal').addEventListener('click', (e) => {
            if (e.target.id === 'generateReceiptModal') {
                this.closeGenerateModal();
            }
        });
    }

    async loadReceipts() {
        try {
            const response = await fetch(`${API_BASE_URL}/receipts`);
            const result = await response.json();
            
            if (result.success) {
                this.receipts = result.data;
                this.allReceipts = result.data; // Store for filtering
                this.renderReceipts(this.receipts);
            } else {
                this.showNotification('Error loading receipts: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Error loading receipts:', error);
            this.showNotification('Error loading receipts', 'error');
        }
    }

    renderReceipts(receipts) {
    const tbody = document.getElementById('receiptsTableBody');
    
    if (receipts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                    No receipts found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = receipts.map(receipt => {
        // Get payment status with color coding
        const paymentStatus = receipt.payment_status || 'Paid';
        const statusColor = paymentStatus === 'Paid' ? '#2d5a3d' : '#d4a017';
        
        return `
            <tr>
                <td><span class="receipt-id">${receipt.receipt_number}</span></td>
                <td>#${receipt.order_id}</td>
                <td>${receipt.customer_name || 'Walk-in Customer'}</td>
                <td>${this.formatDateTime(receipt.generated_date)}</td>
                <td><strong>₹${parseFloat(receipt.final_amount).toFixed(2)}</strong></td>
                <td>
                    <span style="display: inline-block;">
                        ${receipt.payment_method || 'Not specified'}
                    </span>
                    <br>
                    <span style="color: ${statusColor}; font-size: 12px; font-weight: 600;">
                        ${paymentStatus}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-small" onclick="receiptsManager.viewReceipt(${receipt.receipt_id})">
                            👁 View
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="receiptsManager.printReceipt(${receipt.receipt_id})">
                            🖨 Print
                        </button>
                    </div>
                </td>
            </tr>
        `;
     }).join('');
    }

    async viewReceipt(receiptId) {
        try {
            const response = await fetch(`${API_BASE_URL}/receipts/${receiptId}`);
            const result = await response.json();
            
            if (result.success) {
                this.currentReceipt = result.data;
                this.showReceiptModal();
            } else {
                this.showNotification('Error loading receipt: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Error loading receipt details:', error);
            this.showNotification('Error loading receipt details', 'error');
        }
    }

    showReceiptModal() {
        const modal = document.getElementById('receiptModal');
        const preview = document.getElementById('receiptPreview');
        
        const receipt = this.currentReceipt;
        const receiptHTML = this.generateReceiptHTML(receipt);
        
        preview.innerHTML = receiptHTML;
        modal.classList.add('active');
    }
  
    generateReceiptHTML(receipt) {
    const orderDate = new Date(receipt.order_date);
    const generatedDate = new Date(receipt.generated_date);
    const paymentStatus = receipt.payment_status || 'Paid';
    
    return `
        <div class="receipt-preview" id="printableReceipt">
            <div class="receipt-header">
                <h3>Bhatt's Kitchen</h3>
                <p>Traditional Indian Cuisine</p>
                <p style="font-size: 10px; margin-top: 5px;">
                    123 Main Street, City Name<br>
                    Phone: +91 98765 43210<br>
                    GSTIN: 22AAAAA0000A1Z5
                </p>
            </div>

            <div class="receipt-info">
                <div><span>Receipt No:</span> <strong>${receipt.receipt_number}</strong></div>
                <div><span>Order ID:</span> <strong>#${receipt.order_id}</strong></div>
                <div><span>Order Date:</span> <span>${orderDate.toLocaleDateString('en-IN')} ${orderDate.toLocaleTimeString('en-IN')}</span></div>
                <div><span>Receipt Date:</span> <span>${generatedDate.toLocaleDateString('en-IN')} ${generatedDate.toLocaleTimeString('en-IN')}</span></div>
                <div><span>Customer:</span> <span>${receipt.customer_name || 'Walk-in Customer'}</span></div>
                ${receipt.customer_phone ? `<div><span>Phone:</span> <span>${receipt.customer_phone}</span></div>` : ''}
                ${receipt.customer_address ? `<div><span>Address:</span> <span>${receipt.customer_address}</span></div>` : ''}
                <div><span>Order Type:</span> <span>${receipt.order_type || 'Dine-in'}</span></div>
                ${receipt.table_id ? `<div><span>Table No:</span> <span>${receipt.table_id}</span></div>` : ''}
                ${receipt.waiter_name ? `<div><span>Server:</span> <span>${receipt.waiter_name}</span></div>` : ''}
            </div>

            <div class="receipt-items">
                <div style="display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
                    <span style="flex: 2;">Item</span>
                    <span style="width: 40px; text-align: center;">Qty</span>
                    <span style="width: 70px; text-align: right;">Price</span>
                    <span style="width: 80px; text-align: right;">Amount</span>
                </div>
                ${receipt.items.map(item => `
                    <div class="receipt-item">
                        <div style="flex: 2;">${item.menuname}</div>
                        <div style="width: 40px; text-align: center;">${item.quantity}</div>
                        <div style="width: 70px; text-align: right;">₹${parseFloat(item.item_price).toFixed(2)}</div>
                        <div style="width: 80px; text-align: right;">₹${parseFloat(item.subtotal).toFixed(2)}</div>
                    </div>
                    ${item.special_notes ? `<div style="font-size: 11px; color: #666; margin-left: 10px;">Note: ${item.special_notes}</div>` : ''}
                `).join('')}
            </div>

            <div style="margin-top: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Subtotal:</span>
                    <span>₹${parseFloat(receipt.total_amount).toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Tax (9%):</span>
                    <span>₹${parseFloat(receipt.tax_amount).toFixed(2)}</span>
                </div>
                ${parseFloat(receipt.discount_amount) > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #d4a017;">
                        <span>Discount:</span>
                        <span>-₹${parseFloat(receipt.discount_amount).toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="receipt-total" style="display: flex; justify-content: space-between; font-size: 16px;">
                    <span>TOTAL:</span>
                    <span>₹${parseFloat(receipt.final_amount).toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 13px;">
                    <span>Payment Method:</span>
                    <span><strong>${receipt.payment_method || 'Not specified'}</strong></span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 13px;">
                    <span>Payment Status:</span>
                    <span style="color: ${paymentStatus === 'Paid' ? '#2d5a3d' : '#d4a017'};"><strong>${paymentStatus}</strong></span>
                </div>
            </div>

            ${receipt.special_instructions ? `
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #999; font-size: 11px;">
                    <strong>Special Instructions:</strong><br>
                    ${receipt.special_instructions}
                </div>
            ` : ''}

            <div class="receipt-footer">
                <p>Thank you for dining with us!</p>
                <p>Please visit again</p>
                <p style="margin-top: 10px;">---</p>
                <p style="font-size: 10px;">This is a computer-generated receipt</p>
            </div>
        </div>
        `;
    }

    printReceipt(receiptId) {
        if (this.currentReceipt && this.currentReceipt.receipt_id === receiptId) {
            this.doPrint();
        } else {
            this.viewReceipt(receiptId).then(() => {
                setTimeout(() => this.doPrint(), 500);
            });
        }
    }

    doPrint() {
        const printContent = document.getElementById('printableReceipt').innerHTML;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt - Bhatt's Kitchen</title>
                <style>
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        margin: 20px;
                        max-width: 400px;
                    }
                    .receipt-preview {
                        border: 2px solid #000;
                        padding: 20px;
                    }
                    .receipt-header {
                        text-align: center;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #000;
                    }
                    .receipt-header h3 {
                        font-size: 20px;
                        margin-bottom: 5px;
                    }
                    .receipt-header p {
                        font-size: 11px;
                        margin: 3px 0;
                    }
                    .receipt-info div {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                        font-size: 12px;
                    }
                    .receipt-items {
                        margin: 20px 0;
                        border-top: 1px dashed #000;
                        border-bottom: 1px dashed #000;
                        padding: 15px 0;
                    }
                    .receipt-item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                    }
                    .receipt-total {
                        font-weight: bold;
                        font-size: 14px;
                        margin-top: 10px;
                        padding-top: 10px;
                        border-top: 2px solid #000;
                    }
                    .receipt-footer {
                        text-align: center;
                        margin-top: 20px;
                        padding-top: 15px;
                        border-top: 1px dashed #000;
                        font-size: 11px;
                    }
                    @media print {
                        body { margin: 0; }
                        .receipt-preview { border: none; }
                    }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }

    closeModal() {
        document.getElementById('receiptModal').classList.remove('active');
        this.currentReceipt = null;
    }

    async openGenerateReceiptModal() {
        try {
            // Load orders that don't have receipts yet
            const response = await fetch(`${API_BASE_URL}/orders`);
            const result = await response.json();
            
            if (result.success) {
                // Filter orders that don't have receipts
                const ordersWithoutReceipts = [];
                
                for (const order of result.data) {
                    try {
                        const receiptCheck = await fetch(`${API_BASE_URL}/receipts/order/${order.order_id}`);
                        const receiptResult = await receiptCheck.json();
                        
                        // If no receipt found, add to list
                        if (!receiptResult.success) {
                            ordersWithoutReceipts.push(order);
                        }
                    } catch (error) {
                        // If error (likely 404), no receipt exists
                        ordersWithoutReceipts.push(order);
                    }
                }
                
                this.renderOrderSelection(ordersWithoutReceipts);
                document.getElementById('generateReceiptModal').classList.add('active');
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showNotification('Error loading orders', 'error');
        }
    }

    renderOrderSelection(orders) {
        const select = document.getElementById('selectOrder');
        
        if (orders.length === 0) {
            select.innerHTML = '<option value="">No orders available for receipt generation</option>';
            return;
        }
        
        select.innerHTML = '<option value="">-- Select an Order --</option>' +
            orders.map(order => {
                const customerInfo = order.customer_name || 'Walk-in';
                return `
                    <option value="${order.order_id}">
                        Order #${order.order_id} - ${customerInfo} - ₹${parseFloat(order.final_amount).toFixed(2)}
                    </option>
                `;
            }).join('');
    }
   
    async generateReceipt() {
    const orderId = document.getElementById('selectOrder').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const paymentStatus = document.getElementById('paymentStatus').value;
    
    if (!orderId) {
        this.showNotification('Please select an order', 'error');
        return;
    }

    if (!paymentMethod) {
        this.showNotification('Please select a payment method', 'error');
        return;
    }

    if (!paymentStatus) {
        this.showNotification('Please select a payment status', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/receipts/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_id: orderId,
                payment_method: paymentMethod,
                payment_status: paymentStatus,
                created_by: 'Manager'
            })
        });

        const result = await response.json();
        
        if (result.success) {
            this.showNotification('Receipt generated successfully!', 'success');
            this.closeGenerateModal();
            await this.loadReceipts(); // Reload receipts list
            
            // Automatically view the newly created receipt
            setTimeout(() => {
                this.viewReceipt(result.data.receipt_id);
            }, 500);
        } else {
            this.showNotification('Error: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Error generating receipt:', error);
        this.showNotification('Error generating receipt', 'error');
    }
    }
  
    closeGenerateModal() {
    document.getElementById('generateReceiptModal').classList.remove('active');
    document.getElementById('selectOrder').value = '';
    document.getElementById('paymentMethod').value = '';
    document.getElementById('paymentStatus').value = 'Paid'; // Reset to default
    }

    searchReceipts(searchTerm) {
        const filtered = this.allReceipts.filter(receipt => {
            const receiptNumber = receipt.receipt_number.toLowerCase();
            const orderId = `#${receipt.order_id}`;
            const customerName = (receipt.customer_name || '').toLowerCase();
            const term = searchTerm.toLowerCase();
            
            return receiptNumber.includes(term) ||
                   orderId.includes(term) ||
                   customerName.includes(term);
        });
        
        this.renderReceipts(filtered);
    }

    filterByDate(date) {
        if (!date) {
            this.renderReceipts(this.allReceipts);
            return;
        }

        const filtered = this.allReceipts.filter(receipt => {
            const receiptDate = new Date(receipt.generated_date).toISOString().split('T')[0];
            return receiptDate === date;
        });
        
        this.renderReceipts(filtered);
    }   

    filterByPaymentStatus(status) {
    if (!status) {
        this.renderReceipts(this.allReceipts);
        return;
    }

    const filtered = this.allReceipts.filter(receipt => 
        receipt.payment_status === status
    );
    
    this.renderReceipts(filtered);
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        const dateStr = date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        const timeStr = date.toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        });
        return `${dateStr} - ${timeStr}`;
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
let receiptsManager;
document.addEventListener('DOMContentLoaded', () => {
    receiptsManager = new ReceiptsManager();
});