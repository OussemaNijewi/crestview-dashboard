<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
    default: () => [],
  },
})

// DOM reference for the ECharts container
const chartRef = ref(null)
let chartInstance = null

/**
 * Transforms transactions into ECharts format.
 * Since transactions arrive newest-first, we reverse them back to chronological order (oldest to newest)
 * so the line chart flows naturally from left to right over time.
 */
const updateChartData = () => {
  if (!chartInstance) return

  // Create chronological copy (oldest to newest for the x-axis timeline)
  const chronological = [...props.transactions].sort((a, b) => new Date(a.date) - new Date(b.date))

  const dates = chronological.map((tx) => {
    // Format date nicely for x-axis (e.g., "Feb 27, 2026")
    return new Date(tx.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  })

  const balances = chronological.map((tx) => tx.runningBalance)

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const param = params[0]
        return `${param.name}<br/><strong>Balance: $${param.value.toFixed(2)}</strong>`
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    series: [
      {
        data: balances,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#9f1d35', // CIBC brand red theme
        },
        lineStyle: {
          width: 3,
          color: '#9f1d35',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(159, 29, 53, 0.25)' },
            { offset: 1, color: 'rgba(159, 29, 53, 0.0)' },
          ]),
        },
      },
    ],
  }

  chartInstance.setOption(option, true) // true forces complete option overwrite on filter change
}

// Initialize chart on mount
onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    updateChartData()

    // Handle responsive window resizing
    window.addEventListener('resize', handleResize)
  }
})

// Cleanup listeners and chart instance on unmount
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  chartInstance?.resize()
}

// Watch for prop changes (when filter bar emits new transactions) and redraw chart instantly
watch(
  () => props.transactions,
  () => {
    updateChartData()
  },
  { deep: true },
)
</script>

<template>
  <div class="chart-card-container">
    <div class="chart-header">
      <h3>Account Balance Chart</h3>
    </div>
    <p class="chart-desc">
      Visualizing historical running balance trends over the selected timeframe.
    </p>
    <!-- ECharts DOM Target -->
    <div ref="chartRef" class="echarts-canvas"></div>
  </div>
</template>

<style scoped>
.chart-card-container {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  min-height: 450px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.chart-header h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.chart-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.echarts-canvas {
  width: 100%;
  flex: 1;
  min-height: 320px;
}
</style>
