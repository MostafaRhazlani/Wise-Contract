<template>

    <div class="bg-white shadow-lg w-full h-full" ref="editorPageRef">
        <div v-if="isInvoiceType" class="invoice-template">
            <!-- Header -->
            <div class="invoice-header">
                <div class="header-content">
                    <div class="company-section">
                        <div class="logo-container">
                            <input 
                                ref="fileInput" 
                                type="file" 
                                accept="image/*" 
                                @change="onFileSelected" 
                                class="hidden"
                            />
                            <div 
                                v-if="!logoUrl"
                                @click="handleLogoUpload"
                                class="logo-upload-area"
                            >
                                Add Logo
                            </div>
                            <div 
                                v-else
                                @click="handleLogoUpload"
                                class="logo-preview"
                            >
                                <img :src="logoUrl" alt="Logo">
                            </div>
                        </div>
                        <div class="company-details">
                            <input 
                                type="text" 
                                v-model="companyInfo.name"
                                placeholder="Company Name"
                                class="company-name"
                            />
                            <textarea 
                                v-model="companyInfo.address"
                                placeholder="Company Address"
                                class="company-address"
                                rows="3"
                            ></textarea>
                        </div>
                    </div>
                    <div class="invoice-title-section">
                        <h1 class="invoice-title">INVOICE</h1>
                        <div class="invoice-number">
                            <span>#</span>
                            <input type="text" v-model="invoiceInfo.number" class="invoice-number-input" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Billing -->
            <div class="billing-section">
                <div class="billing-grid">
                    <div class="billing-card">
                        <div class="card-header">Bill To</div>
                        <textarea 
                            v-model="billingInfo.billTo"
                            placeholder="Client Name&#10;Address"
                            class="billing-textarea"
                            rows="4"
                        ></textarea>
                    </div>
                    <div class="billing-card">
                        <div class="card-header">Ship To</div>
                        <textarea 
                            v-model="billingInfo.shipTo"
                            placeholder="Shipping Address"
                            class="billing-textarea"
                            rows="4"
                        ></textarea>
                    </div>
                    <div class="billing-card">
                        <div class="card-header">Details</div>
                        <div class="detail-grid">
                            <div class="detail-row">
                                <span>Date:</span>
                                <input type="date" v-model="invoiceDetails.date" class="detail-input">
                            </div>
                            <div class="detail-row">
                                <span>Due:</span>
                                <input type="date" v-model="invoiceDetails.dueDate" class="detail-input">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Items -->
            <div class="items-section">
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in items" :key="item.id">
                            <td>
                                <input 
                                    type="text" 
                                    v-model="item.description"
                                    class="item-input" 
                                    :placeholder="`Item ${index + 1}`"
                                >
                            </td>
                            <td>
                                <input 
                                    type="number" 
                                    v-model.number="item.quantity"
                                    @input="updateItemAmount(item)"
                                    class="number-input" 
                                    min="0"
                                >
                            </td>
                            <td>
                                <input 
                                    type="number" 
                                    v-model.number="item.rate"
                                    @input="updateItemAmount(item)"
                                    class="number-input" 
                                    min="0" 
                                    step="0.01"
                                >
                            </td>
                            <td class="amount-cell">
                                {{ formatCurrency(item.amount) }}
                            </td>
                            <td>
                                <button 
                                    v-if="items.length > 1"
                                    @click="removeLineItem(item.id)"
                                    class="delete-btn"
                                >
                                    ×
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5">
                                <button @click="addLineItem" class="add-btn">
                                    + Add Item
                                </button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Totals -->
            <div class="footer-section">
                <div class="footer-grid">
                    <div class="notes-card">
                        <div class="card-header">Notes</div>
                        <textarea 
                            v-model="invoiceNotes.content"
                            placeholder="Payment terms and notes"
                            class="notes-textarea"
                            rows="5"
                        ></textarea>
                    </div>
                    <div class="totals-card">
                        <div class="total-row">
                            <span>Subtotal:</span>
                            <span>{{ formatCurrency(invoiceData.subtotal) }}</span>
                        </div>
                        <div class="total-row">
                            <span>Tax (%):</span>
                            <div class="tax-group">
                                <input 
                                    type="number" 
                                    v-model.number="invoiceData.taxRate"
                                    @input="updateTotals"
                                    class="tax-input" 
                                    min="0" 
                                    max="100"
                                >
                                <span>{{ formatCurrency(invoiceData.taxAmount) }}</span>
                            </div>
                        </div>
                        <div class="total-row grand-total">
                            <span>Total:</span>
                            <span>{{ formatCurrency(invoiceData.total) }}</span>
                        </div>
                        <div class="total-row">
                            <span>Paid:</span>
                            <input 
                                type="number" 
                                v-model.number="invoiceData.amountPaid"
                                @input="updateTotals"
                                class="payment-input" 
                                min="0" 
                                step="0.01"
                            >
                        </div>
                        <div class="total-row balance-due">
                            <span>Balance Due:</span>
                            <span>{{ formatCurrency(invoiceData.balanceDue) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="p-12">
            <EditorContent :editor="editor" />
        </div>

    </div>
</template>

<script setup lang="ts">

import { Editor, EditorContent } from '@tiptap/vue-3';
import { computed, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useTypeStore } from '@/store/typeStore';

const props = defineProps<{ 
    editor: Editor
}>();

const route = useRoute();
const typeStore = useTypeStore();

const isInvoiceType = computed(() => {
    const typeId = Number(route.params.type_id);
    const currentType = typeStore.types.find(type => type.id === typeId);
    return currentType?.title?.toLowerCase().includes('invoice') || false;
});

// Logo
const logoUrl = ref<string>('');
const fileInput = ref<HTMLInputElement | null>(null);

// Data
const companyInfo = reactive({
    name: '',
    address: ''
});

const invoiceInfo = reactive({
    number: 'INV-001'
});

const billingInfo = reactive({
    billTo: '',
    shipTo: ''
});

const invoiceDetails = reactive({
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
});

const invoiceNotes = reactive({
    content: ''
});

// Items
interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

const items = ref<InvoiceItem[]>([
    { id: 1, description: '', quantity: 1, rate: 0, amount: 0 }
]);

const invoiceData = reactive({
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    amountPaid: 0,
    balanceDue: 0
});

// Functions
const handleLogoUpload = () => {
    fileInput.value?.click();
};

const onFileSelected = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            logoUrl.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const addLineItem = () => {
    const newId = Math.max(...items.value.map(item => item.id)) + 1;
    items.value.push({
        id: newId,
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
    });
};

const removeLineItem = (id: number) => {
    if (items.value.length > 1) {
        items.value = items.value.filter(item => item.id !== id);
        updateTotals();
    }
};

const updateItemAmount = (item: InvoiceItem) => {
    item.amount = item.quantity * item.rate;
    updateTotals();
};

const updateTotals = () => {
    invoiceData.subtotal = items.value.reduce((sum, item) => sum + item.amount, 0);
    invoiceData.taxAmount = (invoiceData.subtotal * invoiceData.taxRate) / 100;
    invoiceData.total = invoiceData.subtotal + invoiceData.taxAmount;
    invoiceData.balanceDue = invoiceData.total - invoiceData.amountPaid;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount || 0);
};

</script>

<style scoped>
.invoice-template {
    max-width: 210mm;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    font-family: Arial, sans-serif;
}

.invoice-header {
    border-bottom: 2px solid #eee;
    padding-bottom: 2rem;
    margin-bottom: 2rem;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
}

.company-section {
    flex: 1;
}

.logo-container {
    margin-bottom: 1rem;
}

.logo-upload-area {
    width: 120px;
    height: 60px;
    border: 2px dashed #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #666;
    font-size: 0.9rem;
}

.logo-upload-area:hover {
    border-color: #999;
}

.logo-preview {
    width: 120px;
    height: 60px;
    cursor: pointer;
    border: 1px solid #eee;
}

.logo-preview img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.company-name {
    width: 100%;
    border: none;
    border-bottom: 1px solid #ddd;
    padding: 0.5rem 0;
    font-size: 1.2rem;
    font-weight: bold;
    outline: none;
}

.company-address {
    width: 100%;
    border: 1px solid #ddd;
    padding: 0.5rem;
    margin-top: 0.5rem;
    outline: none;
    resize: vertical;
}

.invoice-title-section {
    text-align: right;
}

.invoice-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0 0 1rem 0;
}

.invoice-number {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    justify-content: flex-end;
}

.invoice-number-input {
    border: none;
    border-bottom: 1px solid #ddd;
    padding: 0.25rem;
    outline: none;
    text-align: right;
}

.billing-section {
    margin-bottom: 2rem;
}

.billing-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
}

.billing-card {
    border: 1px solid #eee;
}

.card-header {
    background: #f8f9fa;
    padding: 0.75rem;
    border-bottom: 1px solid #eee;
    font-weight: bold;
    font-size: 0.9rem;
    text-transform: uppercase;
}

.billing-textarea {
    width: 100%;
    border: none;
    padding: 0.75rem;
    outline: none;
    resize: none;
}

.detail-grid {
    padding: 0.75rem;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.detail-input {
    padding: 0.25rem;
    border: 1px solid #ddd;
    outline: none;
}

.items-section {
    margin-bottom: 2rem;
}

.items-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #eee;
}

.items-table th {
    background: #f8f9fa;
    padding: 0.75rem;
    text-align: left;
    border-bottom: 2px solid #eee;
    font-weight: bold;
}

.items-table td {
    padding: 0.75rem;
    border-bottom: 1px solid #f0f0f0;
}

.item-input, .number-input {
    width: 100%;
    border: none;
    padding: 0.25rem;
    outline: none;
}

.number-input {
    text-align: center;
}

.amount-cell {
    text-align: right;
    font-weight: bold;
}

.delete-btn {
    background: none;
    border: none;
    color: #dc3545;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
}

.delete-btn:hover {
    background: #f8d7da;
}

.add-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    width: 100%;
}

.add-btn:hover {
    background: #0056b3;
}

.footer-section {
    margin-top: 2rem;
}

.footer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.notes-card, .totals-card {
    border: 1px solid #eee;
}

.notes-textarea {
    width: 100%;
    border: none;
    padding: 0.75rem;
    outline: none;
    resize: vertical;
}

.totals-card {
    padding: 1rem;
}

.total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
}

.tax-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tax-input {
    width: 60px;
    padding: 0.25rem;
    border: 1px solid #ddd;
    text-align: center;
    outline: none;
}

.payment-input {
    padding: 0.25rem;
    border: 1px solid #ddd;
    text-align: right;
    outline: none;
    width: 100px;
}

.grand-total {
    font-weight: bold;
    font-size: 1.1rem;
    border-top: 2px solid #333;
    border-bottom: 2px solid #333;
}

.balance-due {
    background: #343a40;
    color: white;
    font-weight: bold;
    padding: 0.75rem;
    margin-top: 0.5rem;
}

@media print {
    .invoice-template {
        padding: 0;
        box-shadow: none;
    }
    
    .delete-btn, .add-btn {
        display: none;
    }
    
    input, textarea {
        border: none !important;
        background: transparent !important;
    }
}

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
    }
    
    .billing-grid, .footer-grid {
        grid-template-columns: 1fr;
    }
    
    .items-table {
        font-size: 0.8rem;
    }
}
</style>