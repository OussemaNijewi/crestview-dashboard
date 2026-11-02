<script setup>
import { computed } from 'vue'

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
    default: () => [],
  },
  initialBalance: {
    type: Number,
    required: true,
    default: 0,
  },
})

/**
 * Since transactions arrive with pre-calculated historical running balances,
 * we only need to reverse the array for display (newest at the top of the table).
 */
const processedTransactions = computed(() => {
  if (!props.transactions || props.transactions.length === 0) return []
  return [...props.transactions].reverse()
})

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('en-US', options)
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val)
}
</script>

<template>
  <div class="transaction-table-container">
    <table class="cibc-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Transactions</th>
          <th class="col-amount">
            Debit
            <span class="tooltip-trigger" title="Money leaving your account">ⓘ</span>
          </th>
          <th class="col-amount">
            Credit
            <span class="tooltip-trigger" title="Money entering your account">ⓘ</span>
          </th>
          <th class="col-amount">Running Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="processedTransactions.length === 0">
          <td colspan="5" class="no-data">No transactions found for the selected time range.</td>
        </tr>
        <tr v-for="(tx, index) in processedTransactions" :key="index">
          <td class="col-date">{{ formatDate(tx.date) }}</td>
          <td class="col-desc">
            <div class="desc-main">{{ tx.description }}</div>
            <span class="category-tag">{{ tx.category }}</span>
          </td>
          <!-- Debit Column: displays only negative transaction amounts -->
          <td class="col-amount debit">
            <span v-if="tx.amount < 0">{{ formatCurrency(Math.abs(tx.amount)) }}</span>
          </td>
          <!-- Credit Column: displays only positive transaction amounts -->
          <td class="col-amount credit">
            <span v-if="tx.amount >= 0">{{ formatCurrency(tx.amount) }}</span>
          </td>
          <td class="col-amount balance">{{ formatCurrency(tx.runningBalance) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.transaction-table-container {
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  overflow-x: auto;
  border: 1px solid #e2e8f0;
}

.cibc-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.cibc-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.cibc-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
}

.cibc-table tbody tr:hover {
  background-color: #f8fafc;
}

.col-date {
  white-space: nowrap;
  color: #64748b;
}

.col-desc {
  max-width: 320px;
}

.desc-main {
  font-weight: 500;
  color: #0f172a;
}

.category-tag {
  display: inline-block;
  font-size: 0.75rem;
  background-color: #f1f5f9;
  color: #475569;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
}

.col-amount {
  text-align: right;
  white-space: nowrap;
}

.debit {
  color: #dc2626;
}

.credit {
  color: #16a34a;
}

.balance {
  font-weight: 600;
  color: #0f172a;
}

.tooltip-trigger {
  cursor: help;
  color: #9f1d35;
  margin-left: 4px;
  font-size: 0.85rem;
}

.no-data {
  text-align: center;
  padding: 2.5rem;
  color: #94a3b8;
  font-style: italic;
}
</style>
