<template>
  <div class="statistics">
    <el-card class="statistics-card">
      <template #header>
        <div class="card-header">
          <span>数据统计</span>
          <div class="header-actions">
            <el-select v-model="timeRange" placeholder="选择时间范围" size="small" @change="loadStatistics">
              <el-option label="今日" value="today" />
              <el-option label="本周" value="week" />
              <el-option label="本月" value="month" />
              <el-option label="自定义" value="custom" />
            </el-select>
            <el-button type="info" size="small" @click="refreshData">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 统计卡片 -->
      <div class="stats-cards">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">总检测次数</div>
            <div class="stat-value">{{ statistics.totalDetectionCount }}</div>
            <div class="stat-trend" :class="{ 'up': statistics.detectionTrend > 0, 'down': statistics.detectionTrend < 0 }">
              <el-icon v-if="statistics.detectionTrend > 0"><ArrowUp /></el-icon>
              <el-icon v-else-if="statistics.detectionTrend < 0"><ArrowDown /></el-icon>
              <el-icon v-else><ArrowRight /></el-icon>
              {{ Math.abs(statistics.detectionTrend) }}%
            </div>
          </div>
        </el-card>
        
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">不合格数</div>
            <div class="stat-value">{{ statistics.defectiveCount }}</div>
            <div class="stat-trend" :class="{ 'up': statistics.defectiveTrend > 0, 'down': statistics.defectiveTrend < 0 }">
              <el-icon v-if="statistics.defectiveTrend > 0"><ArrowUp /></el-icon>
              <el-icon v-else-if="statistics.defectiveTrend < 0"><ArrowDown /></el-icon>
              <el-icon v-else><ArrowRight /></el-icon>
              {{ Math.abs(statistics.defectiveTrend) }}%
            </div>
          </div>
        </el-card>
        
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">合格率</div>
            <div class="stat-value">{{ statistics.qualifiedRate }}%</div>
            <div class="stat-trend" :class="{ 'up': statistics.qualifiedRateTrend > 0, 'down': statistics.qualifiedRateTrend < 0 }">
              <el-icon v-if="statistics.qualifiedRateTrend > 0"><ArrowUp /></el-icon>
              <el-icon v-else-if="statistics.qualifiedRateTrend < 0"><ArrowDown /></el-icon>
              <el-icon v-else><ArrowRight /></el-icon>
              {{ Math.abs(statistics.qualifiedRateTrend) }}%
            </div>
          </div>
        </el-card>
        
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-label">报警次数</div>
            <div class="stat-value">{{ statistics.alarmCount }}</div>
            <div class="stat-trend" :class="{ 'up': statistics.alarmTrend > 0, 'down': statistics.alarmTrend < 0 }">
              <el-icon v-if="statistics.alarmTrend > 0"><ArrowUp /></el-icon>
              <el-icon v-else-if="statistics.alarmTrend < 0"><ArrowDown /></el-icon>
              <el-icon v-else><ArrowRight /></el-icon>
              {{ Math.abs(statistics.alarmTrend) }}%
            </div>
          </div>
        </el-card>
      </div>

      <!-- 图表区域 -->
      <div class="charts-container">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">检测结果趋势</div>
          </template>
          <div ref="detectionChartRef" class="chart"></div>
        </el-card>
        
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">不合格类型分布</div>
          </template>
          <div ref="defectChartRef" class="chart"></div>
        </el-card>
        
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">生产线效率对比</div>
          </template>
          <div ref="efficiencyChartRef" class="chart"></div>
        </el-card>
        
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">报警类型分布</div>
          </template>
          <div ref="alarmChartRef" class="chart"></div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const timeRange = ref('today')
const statistics = reactive({
  totalDetectionCount: 0,
  defectiveCount: 0,
  qualifiedRate: 0,
  alarmCount: 0,
  detectionTrend: 0,
  defectiveTrend: 0,
  qualifiedRateTrend: 0,
  alarmTrend: 0
})

// 图表引用
const detectionChartRef = ref(null)
const defectChartRef = ref(null)
const efficiencyChartRef = ref(null)
const alarmChartRef = ref(null)

// 图表实例
let detectionChart = null
let defectChart = null
let efficiencyChart = null
let alarmChart = null

// 加载统计数据
const loadStatistics = async () => {
  try {
    // 模拟API调用
    // const data = await getStatistics({ timeRange: timeRange.value })
    // Object.assign(statistics, data)
    
    // 模拟数据
    Object.assign(statistics, {
      totalDetectionCount: 1250,
      defectiveCount: 89,
      qualifiedRate: 93.2,
      alarmCount: 23,
      detectionTrend: 5.2,
      defectiveTrend: -3.1,
      qualifiedRateTrend: 1.5,
      alarmTrend: -2.8
    })
    
    // 更新图表
    updateCharts()
  } catch (error) {
    console.error('加载统计数据失败', error)
  }
}

// 刷新数据
const refreshData = () => {
  loadStatistics()
}

// 初始化图表
const initCharts = () => {
  if (detectionChartRef.value) {
    detectionChart = echarts.init(detectionChartRef.value)
  }
  if (defectChartRef.value) {
    defectChart = echarts.init(defectChartRef.value)
  }
  if (efficiencyChartRef.value) {
    efficiencyChart = echarts.init(efficiencyChartRef.value)
  }
  if (alarmChartRef.value) {
    alarmChart = echarts.init(alarmChartRef.value)
  }
}

// 更新图表
const updateCharts = () => {
  // 检测结果趋势图
  if (detectionChart) {
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['检测数量', '不合格数量']
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '检测数量',
          type: 'line',
          data: [1200, 1900, 1500, 1800, 2100, 2300],
          smooth: true
        },
        {
          name: '不合格数量',
          type: 'line',
          data: [90, 120, 80, 100, 110, 95],
          smooth: true
        }
      ]
    }
    detectionChart.setOption(option)
  }

  // 不合格类型分布图
  if (defectChart) {
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '不合格类型',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 30, name: '尺寸偏差' },
            { value: 25, name: '外观缺陷' },
            { value: 20, name: '材质问题' },
            { value: 15, name: '装配错误' },
            { value: 10, name: '其他' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    defectChart.setOption(option)
  }

  // 生产线效率对比图
  if (efficiencyChart) {
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['生产线A', '生产线B', '生产线C']
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value',
        name: '效率(%)'
      },
      series: [
        {
          name: '生产线A',
          type: 'bar',
          data: [92, 95, 93, 96, 94, 97]
        },
        {
          name: '生产线B',
          type: 'bar',
          data: [88, 90, 92, 91, 93, 94]
        },
        {
          name: '生产线C',
          type: 'bar',
          data: [90, 92, 94, 93, 95, 96]
        }
      ]
    }
    efficiencyChart.setOption(option)
  }

  // 报警类型分布图
  if (alarmChart) {
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '报警类型',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 35, name: '质量异常' },
            { value: 25, name: '设备故障' },
            { value: 20, name: '参数超限' },
            { value: 15, name: '原材料问题' },
            { value: 5, name: '其他' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    alarmChart.setOption(option)
  }
}

// 监听窗口大小变化
const handleResize = () => {
  detectionChart?.resize()
  defectChart?.resize()
  efficiencyChart?.resize()
  alarmChart?.resize()
}

onMounted(() => {
  initCharts()
  loadStatistics()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  detectionChart?.dispose()
  defectChart?.dispose()
  efficiencyChart?.dispose()
  alarmChart?.dispose()
})
</script>

<style scoped lang="scss">
.statistics {
  .statistics-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: bold;

      .header-actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
    }
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;

    .stat-card {
      .stat-item {
        text-align: center;

        .stat-label {
          font-size: 14px;
          color: #606266;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 10px;
        }

        .stat-trend {
          font-size: 12px;
          &.up {
            color: #67c23a;
          }
          &.down {
            color: #f56c6c;
          }
        }
      }
    }
  }

  .charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 20px;

    .chart-card {
      .chart-header {
        font-size: 14px;
        font-weight: bold;
      }

      .chart {
        width: 100%;
        height: 300px;
      }
    }
  }
}

@media (max-width: 768px) {
  .statistics {
    .charts-container {
      grid-template-columns: 1fr;

      .chart-card {
        .chart {
          height: 250px;
        }
      }
    }
  }
}
</style>