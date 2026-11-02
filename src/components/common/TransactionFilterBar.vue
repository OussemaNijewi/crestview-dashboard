<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import clientData from '@/mock/client.json'

const props = defineProps({
  // Accepts 'chequing' or 'savings' prop passed by the parent component to determine which account data to pull from client.json
  accountType: {
    type: String,
    required: true,
    default: 'chequing',
  },
})

const emit = defineEmits(['update:transactions'])

// Active filter state
const activeFilter = ref('4weeks') // '4weeks', '3months', '6months', '12months', 'all', or 'custom-month'
const selectedMonth = ref('') // Formatted 'YYYY-MM'

// Dynamic month list generator from Jan 2025 to Present
const availableMonths = computed(() => {
  const months = []
  const startDate = new Date(2025, 0, 1) // Jan 2025
  const currentDate = new Date()

  let iter = new Date(startDate)
  while (iter <= currentDate) {
    const year = iter.getFullYear()
    const month = String(iter.getMonth() + 1).padStart(2, '0')
    const label = iter.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    months.push({ value: `${year}-${month}`, label })
    iter.setMonth(iter.getMonth() + 1)
  }
  return months.reverse() // Latest month first
})

// Quick Filter Definitions
const quickFilters = [
  { key: '4weeks', label: 'Last 4 Weeks', days: 28 },
  { key: '3months', label: 'Last 3 Months', days: 90 },
  { key: '6months', label: 'Last 6 Months', days: 180 },
  { key: '12months', label: 'Last 12 Months', days: 365 },
  { key: 'all', label: 'All Time', days: null },
]

// Fetch & Filter Logic
const filterAndEmitTransactions = () => {
  // Pull transactions for the specific account type from client.json
  const rawAccount = clientData.accounts[props.accountType] || {}
  const transactions = rawAccount.transactions || []

  let filtered = [...transactions]

  if (activeFilter.value === 'custom-month' && selectedMonth.value) {
    filtered = transactions.filter((tx) => tx.date.startsWith(selectedMonth.value))
  } else if (activeFilter.value !== 'all') {
    const selectedFilterObj = quickFilters.find((f) => f.key === activeFilter.value)
    if (selectedFilterObj && selectedFilterObj.days) {
      const now = new Date()
      const cutoffTime = new Date().setDate(now.getDate() - selectedFilterObj.days)
      filtered = transactions.filter((tx) => new Date(tx.date) >= cutoffTime)
    }
  }

  // Emit the prepared dataset to be consumed by TransactionTable
  emit('update:transactions', {
    transactions: filtered,
    initialBalance: rawAccount.balance || 0,
    accountName: rawAccount.accountName || '',
    accountNumber: rawAccount.accountNumber || '',
  })
}

// Event Handlers
const handleQuickFilterClick = (filterKey) => {
  activeFilter.value = filterKey
  selectedMonth.value = '' // Reset dropdown selection when quick filter is picked
  filterAndEmitTransactions()
}

const handleMonthSelect = (event) => {
  const val = event.target.value
  if (!val) return
  selectedMonth.value = val
  activeFilter.value = 'custom-month'
  filterAndEmitTransactions()
}

// Watch for account type route switches (e.g. switching from Chequing to Savings)
watch(
  () => props.accountType,
  () => {
    filterAndEmitTransactions()
  },
)

// Initialize data on mount
onMounted(() => {
  filterAndEmitTransactions()
})
</script>

<template>
  <div class="filter-bar-container">
    <div class="quick-filters-group">
      <button
        v-for="filter in quickFilters"
        :key="filter.key"
        @click="handleQuickFilterClick(filter.key)"
        :class="['filter-btn', { active: activeFilter === filter.key }]"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="month-dropdown-group">
      <label for="month-select" class="dropdown-label">Select Month:</label>
      <select
        id="month-select"
        :value="selectedMonth"
        @change="handleMonthSelect"
        :class="['cibc-select', { active: activeFilter === 'custom-month' }]"
      >
        <option value="" disabled>Choose a month...</option>
        <option v-for="m in availableMonths" :key="m.value" :value="m.value">
          {{ m.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.filter-bar-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: #ffffff;
  padding: 0.85rem 1.25rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.quick-filters-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.filter-btn.active {
  background-color: #9f1d35;
  color: #ffffff;
  border-color: #9f1d35;
}

.month-dropdown-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dropdown-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #64748b;
}

.cibc-select {
  padding: 0.45rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  color: #1e293b;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cibc-select:focus,
.cibc-select.active {
  border-color: #9f1d35;
  background-color: #ffffff;
}
</style>
