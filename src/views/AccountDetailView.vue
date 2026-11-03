<script setup>
import { ref } from 'vue'
import TransactionFilterBar from '@/components/common/TransactionFilterBar.vue'
import TransactionTable from '@/components/common/TransactionTable.vue'
import SpendingChart from '@/components/common/SpendingChart.vue'

const props = defineProps({
  accountType: {
    type: String,
    required: true,
    default: 'chequing',
  },
})

// Parent container state holding the data emitted by the Filter Bar
const transactions = ref([])
const initialBalance = ref(0)
const accountName = ref('')
const accountNumber = ref('')

const handleTransactionUpdate = (payload) => {
  transactions.value = payload.transactions
  initialBalance.value = payload.initialBalance
  accountName.value = payload.accountName
  accountNumber.value = payload.accountNumber
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val || 0)
}
</script>

<template>
  <div class="account-detail-container">
    <!-- Account Summary Header Card -->
    <div class="account-header-card">
      <div class="header-info">
        <h1 class="account-title">{{ accountName || 'Account Overview' }}</h1>
        <span class="account-number">Account No: {{ accountNumber }}</span>
      </div>
      <div class="header-balance">
        <span class="balance-label">Current Balance</span>
        <span class="balance-value">{{ formatCurrency(initialBalance) }}</span>
      </div>
    </div>

    <!-- Filter Bar Component (Emits filtered data up) -->
    <div class="filter-wrapper">
      <TransactionFilterBar
        :accountType="accountType"
        @update:transactions="handleTransactionUpdate"
      />
    </div>

    <!-- Main Content Layout Grid (Table + Future Chart Sidebar) -->
    <div class="dashboard-grid">
      <!-- Left Column: Transaction Table -->
      <div class="table-column">
        <TransactionTable :transactions="transactions" :initialBalance="initialBalance" />
      </div>

      <!-- Right Column: Interactive Spending Chart -->
      <div class="chart-column">
        <SpendingChart :transactions="transactions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Account Header Card */
.account-header-card {
  background: linear-gradient(135deg, #9f1d35 0%, #7b1428 100%);
  color: #ffffff;
  padding: 1.75rem 2rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 15px rgba(159, 29, 53, 0.2);
}

.account-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.account-number {
  font-size: 0.9rem;
  opacity: 0.85;
  letter-spacing: 0.5px;
}

.header-balance {
  text-align: right;
}

.balance-label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.balance-value {
  font-size: 1.8rem;
  font-weight: 700;
}

/* Filter Wrapper */
.filter-wrapper {
  width: 100%;
}

/* Dashboard Grid Layout (50-50 Split with independent heights) */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start; /* Crucial: prevents columns from forcing each other to match heights */
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr; /* 50-50 equal width split */
  }
}

.table-column {
  width: 100%;
}

/* Chart Column Styles */
.chart-column {
  width: 100%;
  position: sticky; /* Keeps the analytics card locked in view while scrolling long tables */
  top: 1.5rem;
}

.chart-placeholder-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  min-height: 450px; /* Gives the chart card a clean, balanced height */
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.chart-header h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.badge {
  background-color: #f1f5f9;
  color: #64748b;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.chart-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.chart-mockup-visual {
  flex: 1;
  background-color: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
}

.mockup-icon {
  font-size: 2.5rem;
  opacity: 0.5;
}
</style>
