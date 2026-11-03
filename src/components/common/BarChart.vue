<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  xAxisData: {
    type: Array,
    required: true,
    default: () => [],
  },
  startingAmountData: {
    type: Array,
    required: true,
    default: () => [],
  },
  contributionsData: {
    type: Array,
    required: true,
    default: () => [],
  },
  interestData: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const chartRef = ref(null)
let chartInstance = null

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(val || 0)
}

const updateChart = () => {
  if (!chartInstance) return

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params) => {
        let total = 0
        let tooltipText = `<strong style="color: #1e293b;">${params[0].name}</strong><br/>`

        // Reverse parameters so the top of the stack appears first in tooltip hover
        ;[...params].reverse().forEach((item) => {
          total += item.value
          tooltipText += `${item.marker} ${item.seriesName}: <strong>${formatCurrency(item.value)}</strong><br/>`
        })
        tooltipText += `<hr style="margin: 4px 0; border: none; border-top: 1px solid #e2e8f0;"/>`
        tooltipText += `Total Portfolio Value: <strong>${formatCurrency(total)}</strong>`
        return tooltipText
      },
    },
    legend: {
      bottom: '0%',
      icon: 'circle',
      textStyle: { color: '#64748b', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '5%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: props.xAxisData,
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#64748b', fontSize: 11 },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f1f5f9' } },
        axisLabel: {
          color: '#64748b',
          fontSize: 11,
          formatter: (val) => `$${(val / 1000).toFixed(0)}k`,
        },
      },
    ],
    series: [
      {
        name: 'Starting Amount',
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        itemStyle: { color: '#2563eb' },
        data: props.startingAmountData,
      },
      {
        name: 'Contributions',
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        itemStyle: { color: '#16a34a' },
        data: props.contributionsData,
      },
      {
        name: 'Interest / Growth',
        type: 'bar',
        stack: 'total',
        emphasis: { focus: 'series' },
        itemStyle: { color: '#9f1d35' },
        data: props.interestData,
      },
    ],
  }

  chartInstance.setOption(option, true)
}

const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    updateChart()
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})

watch(
  [
    () => props.xAxisData,
    () => props.startingAmountData,
    () => props.contributionsData,
    () => props.interestData,
  ],
  () => updateChart(),
  { deep: true },
)
</script>

<template>
  <div class="chart-wrapper">
    <div ref="chartRef" class="echarts-canvas"></div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
.echarts-canvas {
  width: 100%;
  flex: 1;
  min-height: 380px;
}
</style>
