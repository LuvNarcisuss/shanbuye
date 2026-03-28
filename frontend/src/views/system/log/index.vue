<template>
  <div class="log">
    <el-card class="log-card">
      <template #header>
        <div class="card-header">
          <span>系统日志</span>
          <div class="header-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索用户名或操作内容"
              size="small"
              style="width: 200px; margin-right: 10px"
              @keyup.enter="loadLogs"
            >
              <template #append>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="logType" placeholder="选择日志类型" size="small" @change="loadLogs">
              <el-option label="所有类型" value="" />
              <el-option label="登录" value="login" />
              <el-option label="操作" value="operation" />
              <el-option label="异常" value="error" />
              <el-option label="其他" value="other" />
            </el-select>
            <el-select v-model="logLevel" placeholder="选择日志级别" size="small" @change="loadLogs">
              <el-option label="所有级别" value="" />
              <el-option label="INFO" value="info" />
              <el-option label="WARN" value="warn" />
              <el-option label="ERROR" value="error" />
              <el-option label="DEBUG" value="debug" />
            </el-select>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              @change="loadLogs"
            />
            <el-button type="primary" size="small" @click="exportLogs">
              <el-icon><Download /></el-icon>
              导出日志
            </el-button>
          </div>
        </div>
      </template>

      <!-- 日志列表 -->
      <el-table :data="logs" style="width: 100%" @row-dblclick="viewLogDetail">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="operation" label="操作内容" />
        <el-table-column prop="logType" label="日志类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeTagType(scope.row.logType)">
              {{ getTypeText(scope.row.logType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="logLevel" label="日志级别" width="100">
          <template #default="scope">
            <el-tag :type="getLevelTagType(scope.row.logLevel)">
              {{ scope.row.logLevel.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ipAddress" label="IP地址" width="150" />
        <el-table-column prop="userAgent" label="用户代理" width="200" show-overflow-tooltip />
        <el-table-column prop="createTime" label="操作时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewLogDetail(scope.row)" circle>
              <el-icon><View /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" style="margin-top: 20px">
        <el-pagination
          v-model:current-page="pageInfo.current"
          v-model:page-size="pageInfo.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="日志详情"
      width="70%"
    >
      <div v-if="currentLog" class="log-detail">
        <el-form :model="currentLog" label-width="120px">
          <el-form-item label="日志ID">
            <el-input v-model="currentLog.id" disabled />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="currentLog.username" disabled />
          </el-form-item>
          <el-form-item label="操作内容">
            <el-input v-model="currentLog.operation" type="textarea" :rows="3" disabled />
          </el-form-item>
          <el-form-item label="日志类型">
            <el-tag :type="getTypeTagType(currentLog.logType)">
              {{ getTypeText(currentLog.logType) }}
            </el-tag>
          </el-form-item>
          <el-form-item label="日志级别">
            <el-tag :type="getLevelTagType(currentLog.logLevel)">
              {{ currentLog.logLevel.toUpperCase() }}
            </el-tag>
          </el-form-item>
          <el-form-item label="IP地址">
            <el-input v-model="currentLog.ipAddress" disabled />
          </el-form-item>
          <el-form-item label="用户代理">
            <el-input v-model="currentLog.userAgent" type="textarea" :rows="2" disabled />
          </el-form-item>
          <el-form-item label="操作时间">
            <el-input v-model="currentLog.createTime" disabled />
          </el-form-item>
          <el-form-item label="详细信息">
            <el-input v-model="currentLog.detail" type="textarea" :rows="4" disabled />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const searchQuery = ref('')
const logType = ref('')
const logLevel = ref('')
const dateRange = ref([])
const logs = ref([])
const pageInfo = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 对话框状态
const detailDialogVisible = ref(false)
const currentLog = ref(null)

// 加载日志列表
const loadLogs = async () => {
  try {
    const params = {
      current: pageInfo.current,
      size: pageInfo.pageSize,
      username: searchQuery.value,
      logType: logType.value,
      logLevel: logLevel.value,
      startTime: dateRange.value[0] ? dateRange.value[0] : '',
      endTime: dateRange.value[1] ? dateRange.value[1] : ''
    }
    // 模拟API调用
    // const data = await getLogPage(params)
    // logs.value = data.records || []
    // pageInfo.total = data.total || 0
    
    // 模拟数据
    logs.value = [
      {
        id: 1,
        username: 'admin',
        operation: '登录系统',
        logType: 'login',
        logLevel: 'info',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        createTime: '2024-01-01 10:00:00',
        detail: '用户admin从IP 192.168.1.100登录系统'
      },
      {
        id: 2,
        username: 'user1',
        operation: '新增用户',
        logType: 'operation',
        logLevel: 'info',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        createTime: '2024-01-01 10:30:00',
        detail: '用户user1新增了用户user2'
      },
      {
        id: 3,
        username: 'user2',
        operation: '上传模型',
        logType: 'operation',
        logLevel: 'info',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        createTime: '2024-01-01 11:00:00',
        detail: '用户user2上传了模型model_v1.0'
      },
      {
        id: 4,
        username: 'admin',
        operation: '删除用户',
        logType: 'operation',
        logLevel: 'warn',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        createTime: '2024-01-01 11:30:00',
        detail: '用户admin删除了用户user3'
      },
      {
        id: 5,
        username: 'user1',
        operation: '访问不存在的页面',
        logType: 'error',
        logLevel: 'error',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        createTime: '2024-01-01 12:00:00',
        detail: '用户user1访问了不存在的页面 /api/nonexistent'
      }
    ]
    pageInfo.total = logs.value.length
  } catch (error) {
    console.error('加载日志列表失败', error)
  }
}

// 刷新数据
const refreshData = () => {
  loadLogs()
}

// 查看日志详情
const viewLogDetail = (log) => {
  currentLog.value = { ...log }
  detailDialogVisible.value = true
}

// 导出日志
const exportLogs = async () => {
  try {
    // 模拟API调用
    // await exportLogs({
    //   username: searchQuery.value,
    //   logType: logType.value,
    //   logLevel: logLevel.value,
    //   startTime: dateRange.value[0] ? dateRange.value[0] : '',
    //   endTime: dateRange.value[1] ? dateRange.value[1] : ''
    // })
    
    // 模拟导出成功
    console.log('导出日志成功')
  } catch (error) {
    console.error('导出日志失败', error)
  }
}

// 获取日志类型标签类型
const getTypeTagType = (type) => {
  const types = {
    login: 'primary',
    operation: 'success',
    error: 'danger',
    other: 'info'
  }
  return types[type] || ''
}

// 获取日志类型文本
const getTypeText = (type) => {
  const texts = {
    login: '登录',
    operation: '操作',
    error: '异常',
    other: '其他'
  }
  return texts[type] || type
}

// 获取日志级别标签类型
const getLevelTagType = (level) => {
  const types = {
    info: 'info',
    warn: 'warning',
    error: 'danger',
    debug: 'success'
  }
  return types[level] || ''
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pageInfo.pageSize = size
  loadLogs()
}

// 处理当前页变化
const handleCurrentChange = (current) => {
  pageInfo.current = current
  loadLogs()
}

onMounted(() => {
  loadLogs()
})
</script>

<style scoped lang="scss">
.log {
  .log-card {
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

  .log-detail {
    .el-form-item {
      margin-bottom: 15px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

@media (max-width: 1200px) {
  .log {
    .log-card {
      .card-header {
        .header-actions {
          flex-wrap: wrap;
        }
      }
    }
  }
}
</style>