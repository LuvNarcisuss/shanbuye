<template>
  <div class="monitor">
    <el-card class="monitor-card">
      <template #header>
        <div class="card-header">
          <span>生产线监控</span>
          <div class="header-actions">
            <el-select v-model="selectedLineId" placeholder="选择产线" size="small" @change="loadLineStatus">
              <el-option
                v-for="line in productionLines"
                :key="line.id"
                :label="line.lineName"
                :value="line.id"
              />
            </el-select>
            <el-button type="primary" size="small" @click="refreshData">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <el-row :gutter="20">
        <!-- 产线状态概览 -->
        <el-col :span="8">
          <el-card class="status-card">
            <div class="status-title">产线状态</div>
            <div class="status-content">
              <div class="status-item">
                <span class="status-label">运行状态：</span>
                <span :class="['status-value', lineStatus.status === 'running' ? 'status-running' : 'status-stopped']">
                  {{ lineStatus.status === 'running' ? '运行中' : '已停止' }}
                </span>
              </div>
              <div class="status-item">
                <span class="status-label">当前速度：</span>
                <span class="status-value">{{ lineStatus.speed || 0 }} 包/分钟</span>
              </div>
              <div class="status-item">
                <span class="status-label">今日产量：</span>
                <span class="status-value">{{ lineStatus.todayOutput || 0 }} 包</span>
              </div>
              <div class="status-item">
                <span class="status-label">合格率：</span>
                <span class="status-value">{{ (lineStatus.qualifiedRate * 100).toFixed(2) }}%</span>
              </div>
              <div class="status-item">
                <span class="status-label">当前班次：</span>
                <span class="status-value">{{ lineStatus.currentShift || '无' }}</span>
              </div>
              <div class="status-item">
                <span class="status-label">负责人：</span>
                <span class="status-value">{{ lineStatus.managerName || '无' }}</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 工位状态 -->
        <el-col :span="16">
          <el-card class="stations-card">
            <div class="status-title">工位状态</div>
            <div class="stations-list">
              <el-row :gutter="10">
                <el-col :span="8" v-for="station in lineStatus.stations" :key="station.id" class="station-item">
                  <el-card :class="['station-card', station.status === 'normal' ? 'station-normal' : 'station-warning']">
                    <div class="station-name">{{ station.stationName }}</div>
                    <div class="station-status">
                      <el-badge :type="station.status === 'normal' ? 'success' : 'warning'" :value="station.status === 'normal' ? '正常' : '异常'" />
                    </div>
                    <div class="station-info">
                      <div class="info-item">
                        <span>检测速度：</span>
                        <span>{{ station.detectionSpeed || 0 }} 件/分钟</span>
                      </div>
                      <div class="info-item">
                        <span>异常数：</span>
                        <span>{{ station.errorCount || 0 }}</span>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 流水线监控 -->
      <el-card class="video-card" style="margin-top: 20px;">
        <template #header>
          <div class="video-header">
            <span>流水线监控</span>
            <div class="video-controls">
              <el-select v-model="selectedLine" placeholder="选择流水线" size="small" @change="updateLineImage">
                <el-option label="流水线1" value="1" />
                <el-option label="流水线2" value="2" />
              </el-select>
              <el-button type="primary" size="small" @click="toggleVideoPlay">
                <el-icon><VideoPlay /></el-icon>
                {{ isVideoPlaying ? '暂停' : '播放' }}
              </el-button>
              <el-button type="success" size="small" @click="toggleFullscreen">
                <el-icon><FullScreen /></el-icon>
                全屏
              </el-button>
            </div>
          </div>
        </template>
        <div class="video-container">
          <video
            ref="videoRef"
            class="monitor-video"
            :src="videoUrl"
            controls
            autoplay
            muted
            playsinline
          >
            您的浏览器不支持视频播放
          </video>
          <div class="video-info">
            <div class="info-item">
              <span>流水线：</span>
              <span>流水线{{ selectedLine }}</span>
            </div>
            <div class="info-item">
              <span>状态：</span>
              <span :class="isVideoPlaying ? 'status-running' : 'status-stopped'">
                {{ isVideoPlaying ? '播放中' : '已暂停' }}
              </span>
            </div>
            <div class="info-item">
              <span>分辨率：</span>
              <span>1920x1080</span>
            </div>
            <div class="info-item">
              <span>视频文件：</span>
              <span>{{ videoUrl.split('/').pop() }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 实时数据趋势 -->
      <el-card class="chart-card" style="margin-top: 20px;">
        <template #header>
          <div class="chart-header">
            <span>实时数据趋势</span>
            <el-select v-model="chartTimeRange" placeholder="时间范围" size="small">
              <el-option label="最近1小时" value="1h" />
              <el-option label="最近4小时" value="4h" />
              <el-option label="最近8小时" value="8h" />
              <el-option label="最近24小时" value="24h" />
            </el-select>
          </div>
        </template>
        <div ref="trendChartRef" style="width: 100%; height: 300px;"></div>
      </el-card>

      <!-- 最近报警记录 -->
      <el-card class="alarm-card" style="margin-top: 20px;">
        <template #header>
          <div class="alarm-header">
            <span>最近报警记录</span>
            <el-button type="primary" size="small" @click="viewAllAlarms">
              查看全部
            </el-button>
          </div>
        </template>
        <el-table :data="recentAlarms" style="width: 100%">
          <el-table-column prop="alarmTime" label="报警时间" width="180" />
          <el-table-column prop="stationName" label="工位" width="120" />
          <el-table-column prop="alarmType" label="报警类型" width="120" />
          <el-table-column prop="alarmContent" label="报警内容" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'unhandled' ? 'danger' : 'success'">
                {{ scope.row.status === 'unhandled' ? '未处理' : '已处理' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getProductionLinePage } from '@/api/production-line'

const productionLines = ref([])
const selectedLineId = ref('')
const lineStatus = ref({
  status: 'stopped',
  speed: 0,
  todayOutput: 0,
  qualifiedRate: 0,
  currentShift: '',
  managerName: '',
  stations: []
})
const recentAlarms = ref([])
const chartTimeRange = ref('4h')
const trendChartRef = ref(null)
let trendChart = null
let refreshTimer = null

// 视频监控相关
const selectedLine = ref('1')
const isVideoPlaying = ref(true)
const videoRef = ref(null)
const videoUrl = ref('/src/assets/videos/视频1.mp4')

// 更新流水线视频
const updateLineImage = () => {
  if (selectedLine.value === '1') {
    videoUrl.value = '/src/assets/videos/视频1.mp4'
  } else if (selectedLine.value === '2') {
    videoUrl.value = '/src/assets/videos/视频2.mp4'
  }
  // 切换视频后自动播放
  setTimeout(() => {
    if (videoRef.value) {
      videoRef.value.play().catch(err => {
        console.error('Error playing video:', err)
      })
      isVideoPlaying.value = true
    }
  }, 100)
}

// 加载产线列表
const loadProductionLines = async () => {
  try {
    const data = await getProductionLinePage({ pageSize: 100 })
    productionLines.value = data.records || []
    if (productionLines.value.length > 0) {
      selectedLineId.value = productionLines.value[0].id
      loadLineStatus()
    }
  } catch (error) {
    console.error('加载产线列表失败', error)
  }
}

// 加载产线状态
const loadLineStatus = async () => {
  if (!selectedLineId.value) return
  
  // 模拟数据，实际应该调用API获取
  lineStatus.value = {
    status: 'running',
    speed: 120,
    todayOutput: 86400,
    qualifiedRate: 0.985,
    currentShift: '白班',
    managerName: '张三',
    stations: [
      {
        id: 1,
        stationName: '正面相机工位',
        status: 'normal',
        detectionSpeed: 120,
        errorCount: 0
      },
      {
        id: 2,
        stationName: '背面相机工位',
        status: 'normal',
        detectionSpeed: 120,
        errorCount: 0
      },
      {
        id: 3,
        stationName: '剔除工位',
        status: 'warning',
        detectionSpeed: 120,
        errorCount: 5
      }
    ]
  }
  
  // 加载最近报警记录
  loadRecentAlarms()
  
  // 更新趋势图
  updateTrendChart()
}

// 加载最近报警记录
const loadRecentAlarms = () => {
  // 模拟数据，实际应该调用API获取
  recentAlarms.value = [
    {
      alarmTime: '2026-02-07 12:30:00',
      stationName: '剔除工位',
      alarmType: '机械故障',
      alarmContent: '剔除机构动作异常',
      status: 'unhandled'
    },
    {
      alarmTime: '2026-02-07 11:15:00',
      stationName: '背面相机工位',
      alarmType: '相机异常',
      alarmContent: '相机连接超时',
      status: 'handled'
    }
  ]
}

// 初始化趋势图
const initTrendChart = () => {
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
  }
}

// 更新趋势图
const updateTrendChart = () => {
  if (!trendChart) return
  
  // 模拟数据
  const hours = []
  const outputData = []
  const qualifiedRateData = []
  
  const now = new Date()
  for (let i = 7; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
    hours.push(hour.getHours() + ':00')
    outputData.push(Math.floor(Math.random() * 5000) + 10000)
    qualifiedRateData.push((Math.random() * 0.05 + 0.95).toFixed(3))
  }
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['产量', '合格率']
    },
    xAxis: {
      type: 'category',
      data: hours
    },
    yAxis: [
      {
        type: 'value',
        name: '产量',
        position: 'left'
      },
      {
        type: 'value',
        name: '合格率',
        position: 'right',
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '产量',
        type: 'bar',
        data: outputData
      },
      {
        name: '合格率',
        type: 'line',
        yAxisIndex: 1,
        data: qualifiedRateData.map(item => parseFloat(item) * 100)
      }
    ]
  }
  
  trendChart.setOption(option)
}

// 刷新数据
const refreshData = () => {
  loadLineStatus()
}

// 查看全部报警
const viewAllAlarms = () => {
  // 跳转到报警页面
  // router.push('/alarm')
  console.log('跳转到报警页面')
}

// 视频监控相关方法
const toggleVideoPlay = () => {
  if (videoRef.value) {
    if (isVideoPlaying.value) {
      videoRef.value.pause()
    } else {
      videoRef.value.play().catch(err => {
        console.error('Error playing video:', err)
      })
    }
    isVideoPlaying.value = !isVideoPlaying.value
  }
}

const toggleFullscreen = () => {
  if (videoRef.value) {
    if (!document.fullscreenElement) {
      videoRef.value.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }
}

// 窗口大小改变时重新渲染图表
const handleResize = () => {
  trendChart?.resize()
}

onMounted(() => {
  loadProductionLines()
  initTrendChart()
  window.addEventListener('resize', handleResize)
  
  // 设置自动刷新
  refreshTimer = setInterval(loadLineStatus, 30000)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style scoped lang="scss">
.monitor {
  .monitor-card {
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

  .status-card {
    .status-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #333;
    }

    .status-content {
      .status-item {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;

        .status-label {
          color: #666;
        }

        .status-value {
          font-weight: bold;

          &.status-running {
            color: #67c23a;
          }

          &.status-stopped {
            color: #f56c6c;
          }
        }
      }
    }
  }

  .stations-card {
    .status-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #333;
    }

    .station-item {
      .station-card {
        .station-name {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .station-status {
          margin-bottom: 10px;
        }

        .station-info {
          .info-item {
            font-size: 12px;
            margin-bottom: 5px;
            color: #666;
          }
        }

        &.station-normal {
          border-left: 4px solid #67c23a;
        }

        &.station-warning {
          border-left: 4px solid #e6a23c;
        }
      }
    }
  }

  .chart-card {
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .alarm-card {
    .alarm-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .video-card {
    .video-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: bold;

      .video-controls {
        display: flex;
        gap: 10px;
        align-items: center;
      }
    }

    .video-container {
      position: relative;
      width: 100%;

      .monitor-video {
        width: 100%;
        height: 400px;
        object-fit: cover;
        border-radius: 4px;
      }

      .video-info {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 10px;
        border-radius: 4px;
        font-size: 12px;

        .info-item {
          margin-bottom: 5px;
          display: flex;
          justify-content: space-between;
          min-width: 200px;

          span:first-child {
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>