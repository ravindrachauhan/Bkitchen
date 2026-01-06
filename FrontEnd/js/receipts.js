// receipts.js - Complete Receipts Management Frontend Logic
const API_BASE_URL = 'http://localhost:3000/api';

class ReceiptsManager {
    constructor() {
        this.receipts = [];
        this.allReceipts = [];
        this.currentReceipt = null;
        this.init();
    }

    async init() {
        await this.loadReceipts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('searchReceipts').addEventListener('input', (e) => {
            this.searchReceipts(e.target.value);
        });

        document.getElementById('filterDate').addEventListener('change', (e) => {
            this.filterByDate(e.target.value);
        });

        document.getElementById('filterPaymentStatus').addEventListener('change', (e) => {
            this.filterByPaymentStatus(e.target.value);
        });

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
                this.allReceipts = result.data;
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
        
        const itemsHTML = receipt.items.map(item => `
            <tr>
                <td style="text-align: left; padding: 6px 4px;">${item.menuname}</td>
                <td style="text-align: center; padding: 6px 4px;">${item.quantity}</td>
                <td style="text-align: right; padding: 6px 4px;">₹${parseFloat(item.item_price).toFixed(2)}</td>
                <td style="text-align: right; padding: 6px 4px;">₹${parseFloat(item.subtotal).toFixed(2)}</td>
            </tr>
            ${item.special_notes ? `<tr><td colspan="4" style="font-size: 10px; color: #666; padding: 2px 4px;">Note: ${item.special_notes}</td></tr>` : ''}
        `).join('');
        
        return `
            <div style="font-family: 'Courier New', monospace; font-size: 12px; max-width: 400px; margin: 0 auto;" id="printableReceipt">
                <div style="text-align: center; margin-bottom: 15px;">
                    <h3 style="font-size: 20px; margin: 0 0 5px 0; font-weight: bold;">Bhatt's Kitchen</h3>
                    <p style="font-size: 11px; margin: 3px 0; line-height: 1.4;">Traditional Indian Cuisine</p>
                    <p style="font-size: 10px; margin: 5px 0 0 0; line-height: 1.4;">
                        123 Main Street, City Name<br>
                        Phone: +91 98765 43210<br>
                        GSTIN: 22AAAAA0000A1Z5
                    </p>
                </div>

                <div style="border-top: 1px dashed #000; margin: 12px 0;"></div>

                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
                        <span>Receipt No:</span> <strong>${receipt.receipt_number}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
                        <span>Order ID:</span> <strong>#${receipt.order_id}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
                        <span>Order Date:</span> <span>${orderDate.toLocaleDateString('en-IN')} ${orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
                        <span>Receipt Date:</span> <span>${generatedDate.toLocaleDateString('en-IN')} ${generatedDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
                        <span>Customer:</span> <span>${receipt.customer_name || 'Walk-in Customer'}</span>
                    </div>
                    ${receipt.customer_phone ? `<div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;"><span>Phone:</span> <span>${receipt.customer_phone}</span></div>` : ''}
                    ${receipt.customer_address ? `<div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;"><span>Address:</span> <span>${receipt.customer_address}</span></div>` : ''}
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;">
                        <span>Order Type:</span> <span>${receipt.order_type || 'Dine-in'}</span>
                    </div>
                    ${receipt.table_id ? `<div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;"><span>Table No:</span> <span>${receipt.table_id}</span></div>` : ''}
                    ${receipt.waiter_name ? `<div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 11px;"><span>Server:</span> <span>${receipt.waiter_name}</span></div>` : ''}
                </div>

                <div style="border-top: 1px dashed #000; margin: 12px 0;"></div>

                <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin: 10px 0;">
                    <thead>
                        <tr style="border-bottom: 1px solid #000;">
                            <th style="text-align: left; padding: 5px 4px; width: 50%;">Item</th>
                            <th style="text-align: center; padding: 5px 4px; width: 15%;">Qty</th>
                            <th style="text-align: right; padding: 5px 4px; width: 17.5%;">Price</th>
                            <th style="text-align: right; padding: 5px 4px; width: 17.5%;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>

                <div style="border-top: 1px dashed #000; margin: 12px 0;"></div>

                <div style="margin-top: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px;">
                        <span>Subtotal:</span>
                        <span>₹${parseFloat(receipt.total_amount).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px;">
                        <span>Tax (9%):</span>
                        <span>₹${parseFloat(receipt.tax_amount).toFixed(2)}</span>
                    </div>
                    ${parseFloat(receipt.discount_amount) > 0 ? `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; color: #d4a017;">
                            <span>Discount:</span>
                            <span>-₹${parseFloat(receipt.discount_amount).toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div style="border-top: 2px solid #000; margin: 8px 0;"></div>
                    <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; font-weight: bold;">
                        <span>TOTAL:</span>
                        <span>₹${parseFloat(receipt.final_amount).toFixed(2)}</span>
                    </div>
                    <div style="border-top: 1px dashed #000; margin: 12px 0;"></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px;">
                        <span>Payment Method:</span>
                        <span><strong>${receipt.payment_method || 'Not specified'}</strong></span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px;">
                        <span>Payment Status:</span>
                        <span style="color: ${paymentStatus === 'Paid' ? '#2d5a3d' : '#d4a017'};"><strong>${paymentStatus}</strong></span>
                    </div>
                </div>

                ${receipt.special_instructions ? `
                    <div style="border-top: 1px dashed #000; margin: 12px 0;"></div>
                    <div style="font-size: 11px; margin-top: 10px;">
                        <strong>Special Instructions:</strong><br>
                        ${receipt.special_instructions}
                    </div>
                ` : ''}

                <div style="text-align: center; margin-top: 15px; font-size: 11px; line-height: 1.5;">
                    <p style="margin: 4px 0;">Thank you for dining with us!</p>
                    <p style="margin: 4px 0;">Please visit again</p>
                    <p style="margin: 10px 0 4px 0;">---</p>
                    <p style="margin: 4px 0; font-size: 10px;">This is a computer-generated receipt</p>
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

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Receipt - Bhatt's Kitchen</title>
                <style>
                    @page {
                        margin: 15mm;
                        size: A4;
                    }
                    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        display: flex;
                        justify-content: center;
                        align-items: flex-start;
                        min-height: 100vh;
                        padding: 20px;
                        background: #f5f5f5;
                    }
                    
                    @media print {
                        body {
                            background: white;
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div style="border: 2px solid #000; padding: 20px; background: white; max-width: 400px; width: 100%;">
                    ${printContent}
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                        }, 250);
                    };
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    }

    closeModal() {
        document.getElementById('receiptModal').classList.remove('active');
        this.currentReceipt = null;
    }

    async openGenerateReceiptModal() {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`);
            const result = await response.json();
            
            if (result.success) {
                const ordersWithoutReceipts = [];
                
                for (const order of result.data) {
                    try {
                        const receiptCheck = await fetch(`${API_BASE_URL}/receipts/order/${order.order_id}`);
                        const receiptResult = await receiptCheck.json();
                        
                        if (!receiptResult.success) {
                            ordersWithoutReceipts.push(order);
                        }
                    } catch (error) {
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
                await this.loadReceipts();
                
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
        document.getElementById('paymentStatus').value = 'Paid';
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
    
    // Check for page action from dashboard
    checkPageAction();
});

// Check if there's a page action from dashboard
function checkPageAction() {
    const pageAction = sessionStorage.getItem('pageAction');
    
    if (pageAction) {
        sessionStorage.removeItem('pageAction');
        
        if (pageAction === 'generate') {
            setTimeout(() => {
                receiptsManager.openGenerateReceiptModal();
            }, 500);
        } else if (pageAction === 'view') {
            console.log('Viewing receipts - page loaded normally');
        }
    }
}