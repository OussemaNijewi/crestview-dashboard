<script setup>
import { reactive, watch } from 'vue'

const emit = defineEmits(['update:projection'])

const form = reactive({
  startingAmount: 37000,
  years: 10,
  annualRate: 6,
  compoundingFrequency: 1, // 1 = Annually, 2 = Semi-Annually, 12 = Monthly
  contributionAmount: 580,
  contributionFrequency: 12, // 12 = Monthly, 1 = Annually
  contributionTiming: 'end', // 'start' or 'end'
})

const calculateProjection = () => {
  const years = Math.max(1, Math.min(form.years, 40))
  const totalMonths = years * 12
  const annualRateDecimal = (form.annualRate || 0) / 100
  const m = form.compoundingFrequency // 1, 2, or 12
  const pmt = form.contributionAmount || 0

  let currentBalance = form.startingAmount || 0
  let cumulativeContributions = 0
  const startingAmountFixed = form.startingAmount || 0

  // Effective monthly rate conversion for precise compounding across frequencies
  const monthlyRate = Math.pow(1 + annualRateDecimal / m, m / 12) - 1

  const xAxis = []
  const startingAmountSeries = []
  const contributionsSeries = []
  const interestSeries = []

  for (let month = 1; month <= totalMonths; month++) {
    const isContributionMonth =
      form.contributionFrequency === 12 || (form.contributionFrequency === 1 && month % 12 === 0)

    if (isContributionMonth && form.contributionTiming === 'start') {
      currentBalance += pmt
      cumulativeContributions += pmt
    }

    // Accrue interest monthly using effective compounding rate
    const interestThisMonth = currentBalance * monthlyRate
    currentBalance += interestThisMonth

    if (isContributionMonth && form.contributionTiming === 'end') {
      currentBalance += pmt
      cumulativeContributions += pmt
    }

    // Record annual snapshot at the end of each year (every 12 months)
    if (month % 12 === 0) {
      const yearIndex = month / 12
      const currentInterest = Math.max(
        0,
        currentBalance - startingAmountFixed - cumulativeContributions,
      )

      xAxis.push(`Year ${yearIndex}`)
      startingAmountSeries.push(Math.round(startingAmountFixed))
      contributionsSeries.push(Math.round(cumulativeContributions))
      interestSeries.push(Math.round(currentInterest))
    }
  }

  const totalContributionsVal = cumulativeContributions
  const totalInterestVal = Math.max(0, currentBalance - startingAmountFixed - totalContributionsVal)

  emit('update:projection', {
    xAxis,
    startingAmountSeries,
    contributionsSeries,
    interestSeries,
    finalBalance: currentBalance,
    startingAmount: startingAmountFixed,
    totalContributions: totalContributionsVal,
    totalInterest: totalInterestVal,
  })
}

watch(form, () => calculateProjection(), { immediate: true, deep: true })
</script>

<template>
  <div class="calculator-card">
    <h2 class="card-title">TFSA Growth Parameters</h2>
    <div class="form-grid">
      <div class="form-group">
        <label for="startingAmount">Starting Amount ($)</label>
        <input
          id="startingAmount"
          v-model.number="form.startingAmount"
          type="number"
          min="0"
          step="500"
        />
      </div>

      <div class="form-group">
        <label for="years">Investment Time Horizon (Years)</label>
        <input id="years" v-model.number="form.years" type="number" min="1" max="40" />
      </div>

      <div class="form-group">
        <label for="annualRate">Expected Annual Return (%)</label>
        <input
          id="annualRate"
          v-model.number="form.annualRate"
          type="number"
          min="0"
          max="30"
          step="0.5"
        />
      </div>

      <div class="form-group">
        <label for="compoundingFrequency">Compounding Frequency</label>
        <select id="compoundingFrequency" v-model.number="form.compoundingFrequency">
          <option :value="12">Monthly</option>
          <option :value="2">Semi-Annually</option>
          <option :value="1">Annually</option>
        </select>
      </div>

      <div class="form-group">
        <label for="contributionAmount">Additional Contribution ($)</label>
        <input
          id="contributionAmount"
          v-model.number="form.contributionAmount"
          type="number"
          min="0"
          step="50"
        />
      </div>

      <div class="form-group">
        <label for="contributionFrequency">Contribution Frequency</label>
        <select id="contributionFrequency" v-model.number="form.contributionFrequency">
          <option :value="12">Monthly</option>
          <option :value="1">Annually</option>
        </select>
      </div>

      <div class="form-group">
        <label for="contributionTiming">Contribution Timing</label>
        <select id="contributionTiming" v-model="form.contributionTiming">
          <option value="end">End of Period</option>
          <option value="start">Beginning of Period</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calculator-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.form-group input,
.form-group select {
  padding: 0.6rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #0f172a;
  background-color: #ffffff;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #9f1d35;
}
</style>
