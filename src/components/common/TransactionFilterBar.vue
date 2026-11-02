<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import clientData from '@/mock/client.json'

const props = defineProps({
  accountType: {
    type: String,
    required: true,
    default: 'chequing',
  },
})

const emit = defineEmits(['update:transactions'])

const activeFilter = ref('4weeks')
const selectedMonth = ref('')

const availableMonths = computed(() => {
  const months = []
  const startDate = new Date(2025, 0, 1)
  const currentDate = new Date()

  let iter = new Date(startDate)
  while (iter <= currentDate) {
    const year = iter.getFullYear()
    const month = String(iter.getMonth() + 1).padStart(2, '0')
    const label = iter.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    months.push({ value: `${year}-${month}`, label })
    iter.setMonth(iter.getMonth() + 1)
  }
  return months.reverse()
})

const quickFilters = [
  { key: '4weeks', label: 'Last 4 Weeks', days: 28 },
  { key: '3months', label: 'Last 3 Months', days: 90 },
  { key: '6months', label: 'Last 6 Months', days: 180 },
  { key: '12months', label: 'Last 12 Months', days: 365 },
  { key: 'all', label: 'All Time', days: null },
]

const filterAndEmitTransactions = () => {
  const rawAccount = clientData.accounts[props.accountType] || {}
  const transactions = rawAccount.transactions || []

  // STEP 1: Sort the ENTIRE master transaction history oldest-to-newest
  const sortedMaster = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))

  // STEP 2: Calculate absolute historical running balances across the entire timeline
  let runningBalance = 0
  const masterWithBalance = sortedMaster.map((tx) => {
    runningBalance += tx.amount
    return {
      ...tx,
      runningBalance: Number(runningBalance.toFixed(2)),
    }
  })

  // STEP 3: Apply filters to the master list that already contains historical balances
  let filtered = masterWithBalance

  if (activeFilter.value === 'custom-month' && selectedMonth.value) {
    filtered = masterWithBalance.filter((tx) => tx.date.startsWith(selectedMonth.value))
  } else if (activeFilter.value !== 'all') {
    const selectedFilterObj = quickFilters.find((f) => f.key === activeFilter.value)
    if (selectedFilterObj && selectedFilterObj.days) {
      const now = new Date()
      const cutoffTime = new Date().setDate(now.getDate() - selectedFilterObj.days)
      filtered = masterWithBalance.filter((tx) => new Date(tx.date) >= cutoffTime)
    }
  }

  // STEP 4: Emit the filtered subset
  emit('update:transactions', {
    transactions: filtered,
    initialBalance: rawAccount.balance || 0,
    accountName: rawAccount.accountName || '',
    accountNumber: rawAccount.accountNumber || '',
  })
}

const handleQuickFilterClick = (filterKey) => {
  activeFilter.value = filterKey
  selectedMonth.value = ''
  filterAndEmitTransactions()
}

const handleMonthSelect = (event) => {
  const val = event.target.value
  if (!val) return
  selectedMonth.value = val
  activeFilter.value = 'custom-month'
  filterAndEmitTransactions()
}

watch(
  () => props.accountType,
  () => {
    filterAndEmitTransactions()
  },
)

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
