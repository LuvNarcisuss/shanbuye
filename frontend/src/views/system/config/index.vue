<template>
  <div class="config">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>系统配置</span>
          <div class="header-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索配置键名"
              size="small"
              style="width: 200px; margin-right: 10px"
              @keyup.enter="loadConfigs"
            >
              <template #append>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="configType" placeholder="选择配置类型" size="small" @change="loadConfigs">
              <el-option label="所有类型" value="" />
              <el-option label="系统" value="system" />
              <el-option label="数据库" value="database" />
              <el-option label="缓存" value="cache" />
              <el-option label="消息队列" value="mq" />
              <el-option label="其他" value="other" />
            </el-select>
            <el-button type="primary" size="small" @click="openAddDialog">
              <el-icon><Plus /></el-icon>
              新增配置
            </el-button>
          </div>
        </div>
      </template>

      <!-- 配置列表 -->
      <el-table :data="configs" style="width: 100%" @row-dblclick="handleRowDoubleClick">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="configKey" label="配置键" width="180" />
        <el-table-column prop="configValue" label="配置值" />
        <el-table-column prop="configType" label="配置类型" width="120" />
        <el-table-column prop="description" label="配置描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.status" @change="updateConfigStatus(scope.row.id, scope.row.status)" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditDialog(scope.row)" circle>
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="danger" size="small" @click="deleteConfig(scope.row.id)" circle>
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

    <!-- 新增/编辑配置对话框 -->
    <el-dialog
      v-model="configDialogVisible"
      :title="isEditMode ? '编辑配置' : '新增配置'"
      width="50%"
    >
      <el-form
        ref="configFormRef"
        :model="configForm"
        :rules="configRules"
        label-width="120px"
      >
        <el-form-item prop="configKey">
          <el-input v-model="configForm.configKey" placeholder="请输入配置键" :disabled="isEditMode" />
        </el-form-item>
        <el-form-item prop="configValue">
          <el-input v-model="configForm.configValue" placeholder="请输入配置值" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item prop="configType">
          <el-select v-model="configForm.configType" placeholder="选择配置类型">
            <el-option label="系统" value="system" />
            <el-option label="数据库" value="database" />
            <el-option label="缓存" value="cache" />
            <el-option label="消息队列" value="mq" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item prop="description">
          <el-input v-model="configForm.description" placeholder="请输入配置描述" type="textarea" />
        </el-form-item>
        <el-form-item prop="status">
          <el-switch v-model="configForm.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="configDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveConfig">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const searchQuery = ref('')
const configType = ref('')
const configs = ref([])
const pageInfo = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 对话框状态
const configDialogVisible = ref(false)
const isEditMode = ref(false)

// 表单数据
const configFormRef = ref(null)
const configForm = reactive({
  id: '',
  configKey: '',
  configValue: '',
  configType: 'system',
  description: '',
  status: true
})

// 表单验证规则
const configRules = {
  configKey: [{ required: true, message: '请输入配置键', trigger: 'blur' }],
  configValue: [{ required: true, message: '请输入配置值', trigger: 'blur' }],
  configType: [{ required: true, message: '请选择配置类型', trigger: 'change' }]
}

// 加载配置列表
const loadConfigs = async () => {
  try {
    const params = {
      current: pageInfo.current,
      size: pageInfo.pageSize,
      configKey: searchQuery.value,
      configType: configType.value
    }
    // 模拟API调用
    // const data = await getConfigPage(params)
    // configs.value = data.records || []
    // pageInfo.total = data.total || 0
    
    // 模拟数据
    configs.value = [
      {
        id: 1,
        configKey: 'system.title',
        configValue: '智能制造系统',
        configType: 'system',
        description: '系统标题',
        status: 1,
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00'
      },
      {
        id: 2,
        configKey: 'system.version',
        configValue: '1.0.0',
        configType: 'system',
        description: '系统版本',
        status: 1,
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00'
      },
      {
        id: 3,
        configKey: 'database.url',
        configValue: 'jdbc:mysql://localhost:3306/shanbuye',
        configType: 'database',
        description: '数据库连接地址',
        status: 1,
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00'
      },
      {
        id: 4,
        configKey: 'cache.redis.url',
        configValue: 'redis://localhost:6379',
        configType: 'cache',
        description: 'Redis连接地址',
        status: 0,
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00'
      },
      {
        id: 5,
        configKey: 'mq.rabbitmq.url',
        configValue: 'amqp://localhost:5672',
        configType: 'mq',
        description: 'RabbitMQ连接地址',
        status: 1,
        createTime: '2024-01-01 00:00:00',
        updateTime: '2024-01-01 00:00:00'
      }
    ]
    pageInfo.total = configs.value.length
  } catch (error) {
    console.error('加载配置列表失败', error)
  }
}

// 刷新数据
const refreshData = () => {
  loadConfigs()
}

// 打开新增对话框
const openAddDialog = () => {
  isEditMode.value = false
  Object.assign(configForm, {
    id: '',
    configKey: '',
    configValue: '',
    configType: 'system',
    description: '',
    status: true
  })
  configDialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = (config) => {
  isEditMode.value = true
  Object.assign(configForm, {
    id: config.id,
    configKey: config.configKey,
    configValue: config.configValue,
    configType: config.configType,
    description: config.description,
    status: config.status
  })
  configDialogVisible.value = true
}

// 保存配置
const saveConfig = async () => {
  if (!configFormRef.value) return

  await configFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      // 模拟API调用
      // if (isEditMode.value) {
      //   await updateConfig(configForm)
      // } else {
      //   await addConfig(configForm)
      // }
      
      // 更新本地数据
      if (isEditMode.value) {
        const index = configs.value.findIndex(item => item.id === configForm.id)
        if (index !== -1) {
          configs.value[index] = { ...configs.value[index], ...configForm, updateTime: new Date().toLocaleString() }
        }
      } else {
        const newConfig = {
          id: configs.value.length + 1,
          ...configForm,
          createTime: new Date().toLocaleString(),
          updateTime: new Date().toLocaleString()
        }
        configs.value.unshift(newConfig)
      }
      
      configDialogVisible.value = false
      loadConfigs()
    } catch (error) {
      console.error('保存配置失败', error)
    }
  })
}

// 更新配置状态
const updateConfigStatus = async (configId, status) => {
  try {
    // 模拟API调用
    // await updateConfigStatus(configId, status)
    
    // 更新本地数据
    const index = configs.value.findIndex(item => item.id === configId)
    if (index !== -1) {
      configs.value[index].status = status
      configs.value[index].updateTime = new Date().toLocaleString()
    }
  } catch (error) {
    console.error('更新配置状态失败', error)
  }
}

// 删除配置
const deleteConfig = async (configId) => {
  try {
    // 模拟API调用
    // await deleteConfig(configId)
    
    // 更新本地数据
    configs.value = configs.value.filter(item => item.id !== configId)
    pageInfo.total = configs.value.length
    
    loadConfigs()
  } catch (error) {
    console.error('删除配置失败', error)
  }
}

// 双击行编辑
const handleRowDoubleClick = (row) => {
  openEditDialog(row)
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pageInfo.pageSize = size
  loadConfigs()
}

// 处理当前页变化
const handleCurrentChange = (current) => {
  pageInfo.current = current
  loadConfigs()
}

onMounted(() => {
  loadConfigs()
})
</script>

<style scoped lang="scss">
.config {
  .config-card {
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

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>