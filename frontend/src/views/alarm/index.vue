<template>
  <div class="alarm">
    <el-card class="alarm-card">
      <template #header>
        <div class="card-header">
          <span>报警管理</span>
          <div class="header-actions">
            <el-select v-model="alarmLevel" placeholder="选择报警级别" size="small" @change="loadAlarms">
              <el-option label="所有级别" value="" />
              <el-option label="紧急" value="1" />
              <el-option label="重要" value="2" />
              <el-option label="一般" value="3" />
            </el-select>
            <el-select v-model="alarmStatus" placeholder="选择报警状态" size="small" @change="loadAlarms">
              <el-option label="所有状态" value="" />
              <el-option label="未处理" value="0" />
              <el-option label="处理中" value="1" />
              <el-option label="已处理" value="2" />
              <el-option label="已忽略" value="3" />
            </el-select>
            <el-button type="info" size="small" @click="refreshData">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 报警列表 -->
      <el-table :data="alarms" style="width: 100%" @row-dblclick="handleRowDoubleClick">
        <el-table-column prop="id" label="报警ID" width="100" />
        <el-table-column prop="alarmCode" label="报警代码" width="120" />
        <el-table-column prop="alarmName" label="报警名称" />
        <el-table-column prop="alarmLevel" label="报警级别" width="100">
          <template #default="scope">
            <el-tag :type="getLevelTagType(scope.row.alarmLevel)">
              {{ getLevelText(scope.row.alarmLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="alarmSource" label="报警来源" width="150" />
        <el-table-column prop="alarmMessage" label="报警信息" />
        <el-table-column prop="alarmTime" label="报警时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="handler" label="处理人" width="100" />
        <el-table-column prop="handleTime" label="处理时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="viewAlarmDetail(scope.row)" circle>
              <el-icon><View /></el-icon>
            </el-button>
            <el-button type="success" size="small" v-if="scope.row.status === 0" @click="handleAlarm(scope.row.id)" circle>
              <el-icon><Check /></el-icon>
            </el-button>
            <el-button type="warning" size="small" v-if="scope.row.status === 0" @click="ignoreAlarm(scope.row.id)" circle>
              <el-icon><Close /></el-icon>
            </el-button>
            <el-button type="danger" size="small" @click="deleteAlarm(scope.row.id)" circle>
              <el-icon><Delete /></el-icon>
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

    <!-- 报警详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="报警详情"
      width="70%"
    >
      <div v-if="currentAlarm" class="alarm-detail">
        <el-form :model="currentAlarm" label-width="120px">
          <el-form-item label="报警ID">
            <el-input v-model="currentAlarm.id" disabled />
          </el-form-item>
          <el-form-item label="报警代码">
            <el-input v-model="currentAlarm.alarmCode" disabled />
          </el-form-item>
          <el-form-item label="报警名称">
            <el-input v-model="currentAlarm.alarmName" disabled />
          </el-form-item>
          <el-form-item label="报警级别">
            <el-tag :type="getLevelTagType(currentAlarm.alarmLevel)">
              {{ getLevelText(currentAlarm.alarmLevel) }}
            </el-tag>
          </el-form-item>
          <el-form-item label="报警来源">
            <el-input v-model="currentAlarm.alarmSource" disabled />
          </el-form-item>
          <el-form-item label="报警信息">
            <el-input v-model="currentAlarm.alarmMessage" type="textarea" :rows="3" disabled />
          </el-form-item>
          <el-form-item label="报警时间">
            <el-input v-model="currentAlarm.alarmTime" disabled />
          </el-form-item>
          <el-form-item label="状态">
            <el-tag :type="getStatusTagType(currentAlarm.status)">
              {{ getStatusText(currentAlarm.status) }}
            </el-tag>
          </el-form-item>
          <el-form-item label="处理人">
            <el-input v-model="currentAlarm.handler" disabled />
          </el-form-item>
          <el-form-item label="处理时间">
            <el-input v-model="currentAlarm.handleTime" disabled />
          </el-form-item>
          <el-form-item label="处理结果">
            <el-input v-model="currentAlarm.handleResult" type="textarea" :rows="3" disabled />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 处理报警对话框 -->
    <el-dialog
      v-model="handleDialogVisible"
      title="处理报警"
      width="50%"
    >
      <el-form
        ref="handleFormRef"
        :model="handleForm"
        :rules="handleRules"
        label-width="120px"
      >
        <el-form-item prop="handleResult">
          <el-input v-model="handleForm.handleResult" type="textarea" :rows="4" placeholder="请输入处理结果" />
        </el-form-item>
        <el-form-item prop="remark">
          <el-input v-model="handleForm.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitHandleAlarm">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const alarmLevel = ref('')
const alarmStatus = ref('')
const alarms = ref([])
const pageInfo = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 对话框状态
const detailDialogVisible = ref(false)
const handleDialogVisible = ref(false)
const currentAlarm = ref(null)
const currentAlarmId = ref(null)

// 处理表单
const handleFormRef = ref(null)
const handleForm = reactive({
  handleResult: '',
  remark: ''
})

const handleRules = {
  handleResult: [{ required: true, message: '请输入处理结果', trigger: 'blur' }]
}

// 加载报警列表
const loadAlarms = async () => {
  try {
    const params = {
      current: pageInfo.current,
      size: pageInfo.pageSize,
      alarmLevel: alarmLevel.value,
      status: alarmStatus.value
    }
    // 模拟API调用
    // const data = await getAlarmPage(params)
    // alarms.value = data.records || []
    // pageInfo.total = data.total || 0
    
    // 模拟数据
    alarms.value = [
      {
        id: 1,
        alarmCode: 'ALM-2024-0001',
        alarmName: '生产线A异常',
        alarmLevel: 1,
        alarmSource: '生产线A',
        alarmMessage: '生产线A检测到异常值，超出正常范围',
        alarmTime: '2024-01-01 10:00:00',
        status: 0,
        handler: '',
        handleTime: '',
        handleResult: ''
      },
      {
        id: 2,
        alarmCode: 'ALM-2024-0002',
        alarmName: '模型精度下降',
        alarmLevel: 2,
        alarmSource: '检测模型',
        alarmMessage: '当前模型精度下降超过10%',
        alarmTime: '2024-01-01 09:30:00',
        status: 1,
        handler: '张三',
        handleTime: '2024-01-01 09:45:00',
        handleResult: '正在分析原因'
      },
      {
        id: 3,
        alarmCode: 'ALM-2024-0003',
        alarmName: '设备温度过高',
        alarmLevel: 3,
        alarmSource: '设备1',
        alarmMessage: '设备1温度达到警戒值',
        alarmTime: '2024-01-01 08:15:00',
        status: 2,
        handler: '李四',
        handleTime: '2024-01-01 08:30:00',
        handleResult: '已检查设备，正常运行'
      }
    ]
    pageInfo.total = alarms.value.length
  } catch (error) {
    console.error('加载报警列表失败', error)
  }
}

// 刷新数据
const refreshData = () => {
  loadAlarms()
}

// 查看报警详情
const viewAlarmDetail = (alarm) => {
  currentAlarm.value = { ...alarm }
  detailDialogVisible.value = true
}

// 处理报警
const handleAlarm = (alarmId) => {
  currentAlarmId.value = alarmId
  Object.assign(handleForm, {
    handleResult: '',
    remark: ''
  })
  handleDialogVisible.value = true
}

// 提交处理结果
const submitHandleAlarm = async () => {
  if (!handleFormRef.value) return

  await handleFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      // 模拟API调用
      // await processAlarm(currentAlarmId.value, handleForm)
      
      // 更新本地数据
      const index = alarms.value.findIndex(item => item.id === currentAlarmId.value)
      if (index !== -1) {
        alarms.value[index].status = 2
        alarms.value[index].handler = '当前用户'
        alarms.value[index].handleTime = new Date().toLocaleString()
        alarms.value[index].handleResult = handleForm.handleResult
      }
      
      handleDialogVisible.value = false
      loadAlarms()
    } catch (error) {
      console.error('处理报警失败', error)
    }
  })
}

// 忽略报警
const ignoreAlarm = async (alarmId) => {
  try {
    // 模拟API调用
    // await ignoreAlarm(alarmId)
    
    // 更新本地数据
    const index = alarms.value.findIndex(item => item.id === alarmId)
    if (index !== -1) {
      alarms.value[index].status = 3
    }
    
    loadAlarms()
  } catch (error) {
    console.error('忽略报警失败', error)
  }
}

// 删除报警
const deleteAlarm = async (alarmId) => {
  try {
    // 模拟API调用
    // await deleteAlarm(alarmId)
    
    // 更新本地数据
    alarms.value = alarms.value.filter(item => item.id !== alarmId)
    pageInfo.total = alarms.value.length
    
    loadAlarms()
  } catch (error) {
    console.error('删除报警失败', error)
  }
}

// 双击行查看详情
const handleRowDoubleClick = (row) => {
  viewAlarmDetail(row)
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pageInfo.pageSize = size
  loadAlarms()
}

// 处理当前页变化
const handleCurrentChange = (current) => {
  pageInfo.current = current
  loadAlarms()
}

// 获取报警级别标签类型
const getLevelTagType = (level) => {
  const types = {
    1: 'danger',
    2: 'warning',
    3: 'info'
  }
  return types[level] || ''
}

// 获取报警级别文本
const getLevelText = (level) => {
  const texts = {
    1: '紧急',
    2: '重要',
    3: '一般'
  }
  return texts[level] || level
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const types = {
    0: 'danger',
    1: 'warning',
    2: 'success',
    3: 'info'
  }
  return types[status] || ''
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    0: '未处理',
    1: '处理中',
    2: '已处理',
    3: '已忽略'
  }
  return texts[status] || status
}

onMounted(() => {
  loadAlarms()
})
</script>

<style scoped lang="scss">
.alarm {
  .alarm-card {
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

  .alarm-detail {
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
</style>