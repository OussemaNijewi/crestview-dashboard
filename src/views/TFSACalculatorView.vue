<script setup>
import { ref } from 'vue'
import TFSACalculator from '@/components/common/TFSACalculator.vue'
import BarChart from '@/components/common/BarChart.vue'

const projectionData = ref({
  xAxis: [],
  startingAmountSeries: [],
  contributionsSeries: [],
  interestSeries: [],
  finalBalance: 0,
  totalContributions: 0,
  totalInterest: 0,
})

const handleProjectionUpdate = (payload) => {
  projectionData.value = payload
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val || 0)
}
</script>

<template>
  <div class="tfsa-container">
    <div class="tfsa-header">
      <h1>TFSA Growth Calculator</h1>
      <p>
        Estimate your tax-free compound growth with customized contributions and interest rates.
      </p>
    </div>

    <div class="tfsa-grid">
      <div class="column">
        <TFSACalculator @update:projection="handleProjectionUpdate" />
      </div>

      <div class="column chart-column">
        <div class="results-card">
          <div class="metrics-grid">
            <div class="metric-box highlight">
              <span class="label">Projected Total Value</span>
              <span class="value">{{ formatCurrency(projectionData.finalBalance) }}</span>
            </div>
            <div class="metric-box">
              <span class="label">Total Contributed</span>
              <span class="value">{{ formatCurrency(projectionData.totalContributions) }}</span>
            </div>
            <div class="metric-box">
              <span class="label">Interest Earned</span>
              <span class="value red-text">{{ formatCurrency(projectionData.totalInterest) }}</span>
            </div>
          </div>

          <BarChart
            :xAxisData="projectionData.xAxis"
            :startingAmountData="projectionData.startingAmountSeries"
            :contributionsData="projectionData.contributionsSeries"
            :interestData="projectionData.interestSeries"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tfsa-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #ffffff;
  min-height: 100vh;
}

.tfsa-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.tfsa-header p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

.tfsa-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .tfsa-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.column {
  width: 100%;
}

.chart-column {
  position: sticky;
  top: 1.5rem;
}

.results-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.metric-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
}

.metric-box.highlight {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.metric-box .label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.metric-box .value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1d9f2e;
}

.metric-box.highlight .value {
  color: #0f172a;
}

.red-text {
  color: #9f1d35 !important;
}
</style>
