<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total">
              <el-icon :size="32"><Box /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalOutput || 0 }}</div>
              <div class="stat-label">今日产量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon qualified">
              <el-icon :size="32"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.qualifiedCount || 0 }}</div>
              <div class="stat-label">合格数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon unqualified">
              <el-icon :size="32"><CircleClose /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.unqualifiedCount || 0 }}</div>
              <div class="stat-label">不合格数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon rate">
              <el-icon :size="32"><DataLine /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ (statistics.qualifiedRate * 100).toFixed(2) }}%</div>
              <div class="stat-label">合格率</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>不合格率趋势</span>
            </div>
          </template>
          <div ref="trendChartRef" style="width: 100%; height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>缺陷类型分布</span>
            </div>
          </template>
          <div ref="defectChartRef" style="width: 100%; height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>产线产量分布</span>
            </div>
          </template>
          <div ref="lineChartRef" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getStatistics } from '@/api/detection-record'

const statistics = ref({})
const trendChartRef = ref(null)
const defectChartRef = ref(null)
const lineChartRef = ref(null)

let trendChart = null
let defectChart = null
let lineChart = null

// 加载统计数据
const loadStatistics = async () => {
  try {
    const data = await getStatistics({})
    statistics.value = data

    // 更新图表
    updateCharts(data)
  } catch (error) {
    console.error('加载统计数据失败', error)
  }
}

// 更新图表
const updateCharts = (data) => {
  // 不合格率趋势图
  if (trendChart) {
    const trendOption = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: data.unqualifiedRateTrend?.map((item) => item.time) || []
      },
      yAxis: {
        type: 'value',
        name: '不合格率(%)',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '不合格率',
          type: 'line',
          smooth: true,
          data: data.unqualifiedRateTrend?.map((item) => (item.value * 100).toFixed(2)) || []
        }
      ]
    }
    trendChart.setOption(trendOption)
  }

  // 缺陷类型分布图
  if (defectChart) {
    const defectOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center'
      },
      series: [
        {
          name: '缺陷类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          data:
            data.defectDistribution?.map((item) => ({
              name: item.defectTypeName,
              value: item.count
            })) || []
        }
      ]
    }
    defectChart.setOption(defectOption)
  }

  // 产线产量分布图
  if (lineChart) {
    const lineOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['产量', '合格数', '不合格数']
      },
      xAxis: {
        type: 'category',
        data: data.lineOutputList?.map((item) => item.lineName) || []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '产量',
          type: 'bar',
          data: data.lineOutputList?.map((item) => item.output) || []
        },
        {
          name: '合格数',
          type: 'bar',
          data: data.lineOutputList?.map((item) => item.qualifiedCount) || []
        },
        {
          name: '不合格数',
          type: 'bar',
          data: data.lineOutputList?.map((item) => item.unqualifiedCount) || []
        }
      ]
    }
    lineChart.setOption(lineOption)
  }
}

// 初始化图表
const initCharts = () => {
  trendChart = echarts.init(trendChartRef.value)
  defectChart = echarts.init(defectChartRef.value)
  lineChart = echarts.init(lineChartRef.value)
}

// 窗口大小改变时重新渲染图表
const handleResize = () => {
  trendChart?.resize()
  defectChart?.resize()
  lineChart?.resize()
}

onMounted(() => {
  initCharts()
  loadStatistics()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  defectChart?.dispose()
  lineChart?.dispose()
})
</script>

<style scoped lang="scss">
.dashboard {
  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;

        &.total {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }

        &.qualified {
          background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
          color: #fff;
        }

        &.unqualified {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          color: #fff;
        }

        &.rate {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: #fff;
        }
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 14px;
          color: #999;
        }
      }
    }
  }

  .chart-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>
