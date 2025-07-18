<template>
  <div class="chart-wrapper">
    <apexchart
      type="line"
      height="100%"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

interface ChartDataPoint {
  timestamp: string
  price: number
}

interface Props {
  chartData: ChartDataPoint[]
  cryptoName: string
}

const props = defineProps<Props>()

const series = computed(() => [{
  name: props.cryptoName,
  data: props.chartData.map(point => ({
    x: new Date(point.timestamp).getTime(),
    y: point.price
  }))
}])

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    background: 'transparent',
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true
      }
    },
    zoom: {
      enabled: true,
      type: 'x',
      autoScaleYaxis: true
    }
  },
  theme: {
    mode: 'dark'
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    colors: ['#f7d046']
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    strokeDashArray: 3
  },
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px'
      },
      datetimeFormatter: {
        year: 'yyyy',
        month: 'MMM \'yy',
        day: 'dd MMM',
        hour: 'HH:mm'
      }
    },
    axisBorder: {
      show: true,
      color: 'rgba(255, 255, 255, 0.1)'
    },
    axisTicks: {
      show: true,
      color: 'rgba(255, 255, 255, 0.1)'
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px'
      },
      formatter: (value: number) => {
        if (value >= 1) {
          return '$' + value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })
        } else {
          return '$' + value.toFixed(6)
        }
      }
    },
    axisBorder: {
      show: true,
      color: 'rgba(255, 255, 255, 0.1)'
    }
  },
  tooltip: {
    theme: 'dark',
    style: {
      fontSize: '12px',
      backgroundColor: 'rgba(26, 26, 46, 0.9)'
    },
    x: {
      format: 'dd MMM yyyy HH:mm'
    },
    y: {
      formatter: (value: number) => {
        if (value >= 1) {
          return '$' + value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })
        } else {
          return '$' + value.toFixed(6)
        }
      }
    },
    marker: {
      show: true
    },
    fillSeriesColor: false,
    onDatasetHover: {
      highlightDataSeries: false
    }
  },
  markers: {
    size: 0,
    hover: {
      size: 6,
      sizeOffset: 3
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: ['#f39c12'],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100, 100, 100]
    }
  },
  responsive: [{
    breakpoint: 768,
    options: {
      chart: {
        toolbar: {
          show: false
        }
      },
      xaxis: {
        labels: {
          show: true,
          maxHeight: 60
        }
      },
      yaxis: {
        labels: {
          show: true,
          maxWidth: 80
        }
      }
    }
  }]
}))
</script>

<style scoped>
.chart-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}

:deep(.apexcharts-canvas) {
  background: transparent !important;
}

:deep(.apexcharts-tooltip) {
  background: rgba(26, 26, 46, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

:deep(.apexcharts-tooltip-title) {
  background: rgba(247, 208, 70, 0.1) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.apexcharts-toolbar) {
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.apexcharts-toolbar svg) {
  fill: rgba(255, 255, 255, 0.7) !important;
}

:deep(.apexcharts-zoom-icon svg),
:deep(.apexcharts-pan-icon svg),
:deep(.apexcharts-reset-icon svg),
:deep(.apexcharts-download-icon svg) {
  fill: rgba(255, 255, 255, 0.7) !important;
}

:deep(.apexcharts-zoom-icon:hover svg),
:deep(.apexcharts-pan-icon:hover svg),
:deep(.apexcharts-reset-icon:hover svg),
:deep(.apexcharts-download-icon:hover svg) {
  fill: #f7d046 !important;
}
</style>