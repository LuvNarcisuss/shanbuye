<template>
  <div class="rule">
    <el-card class="rule-card">
      <template #header>
        <div class="card-header">
          <span>规则配置</span>
          <div class="header-actions">
            <el-select v-model="selectedLineId" placeholder="选择产线" size="small" @change="loadRules">
              <el-option
                v-for="line in productionLines"
                :key="line.id"
                :label="line.lineName"
                :value="line.id"
              />
            </el-select>
            <el-button type="primary" size="small" @click="openAddRuleDialog">
              <el-icon><Plus /></el-icon>
              新增规则
            </el-button>
            <el-button type="info" size="small" @click="refreshData">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 规则列表 -->
      <el-table :data="rules" style="width: 100%" @row-dblclick="handleRowDoubleClick">
        <el-table-column prop="ruleCode" label="规则编码" width="120" />
        <el-table-column prop="ruleName" label="规则名称" />
        <el-table-column prop="lineId" label="所属产线" width="120">
          <template #default="scope">
            {{ getLineNameById(scope.row.lineId) }}
          </template>
        </el-table-column>
        <el-table-column prop="stationId" label="所属工位" width="120">
          <template #default="scope">
            {{ getStationNameById(scope.row.stationId) }}
          </template>
        </el-table-column>
        <el-table-column prop="defectType" label="缺陷类型" width="100">
          <template #default="scope">
            {{ defectTypes[scope.row.defectType] || scope.row.defectType }}
          </template>
        </el-table-column>
        <el-table-column prop="detectionMethod" label="检测方法" width="100">
          <template #default="scope">
            {{ detectionMethods[scope.row.detectionMethod] || scope.row.detectionMethod }}
          </template>
        </el-table-column>
        <el-table-column prop="confidenceThreshold" label="置信度阈值" width="120">
          <template #default="scope">
            {{ (scope.row.confidenceThreshold * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="version" label="版本" width="80" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditRuleDialog(scope.row)" circle>
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button type="success" size="small" @click="publishRule(scope.row.id)" circle>
              <el-icon><Upload /></el-icon>
            </el-button>
            <el-button type="warning" size="small" @click="validateRule(scope.row.id)" circle>
              <el-icon><Check /></el-icon>
            </el-button>
            <el-button type="danger" size="small" @click="deleteRule(scope.row.id)" circle>
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

    <!-- 新增/编辑规则对话框 -->
    <el-dialog
      v-model="ruleDialogVisible"
      :title="isEditing ? '编辑规则' : '新增规则'"
      width="70%"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="ruleRules"
        label-width="120px"
      >
        <el-form-item prop="ruleCode">
          <el-input v-model="ruleForm.ruleCode" placeholder="请输入规则编码" />
        </el-form-item>
        <el-form-item prop="ruleName">
          <el-input v-model="ruleForm.ruleName" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item prop="lineId">
          <el-select v-model="ruleForm.lineId" placeholder="请选择所属产线">
            <el-option
              v-for="line in productionLines"
              :key="line.id"
              :label="line.lineName"
              :value="line.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="stationId">
          <el-select v-model="ruleForm.stationId" placeholder="请选择所属工位">
            <el-option
              v-for="station in stations"
              :key="station.id"
              :label="station.stationName"
              :value="station.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="defectType">
          <el-select v-model="ruleForm.defectType" placeholder="请选择缺陷类型">
            <el-option
              v-for="(label, value) in defectTypes"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="detectionMethod">
          <el-select v-model="ruleForm.detectionMethod" placeholder="请选择检测方法">
            <el-option
              v-for="(label, value) in detectionMethods"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="confidenceThreshold">
          <el-slider
            v-model="ruleForm.confidenceThreshold"
            :min="0"
            :max="1"
            :step="0.01"
            :format-tooltip="value => (value * 100).toFixed(2) + '%'"
          />
          <div class="slider-value">{{ (ruleForm.confidenceThreshold * 100).toFixed(2) }}%</div>
        </el-form-item>
        <el-form-item prop="sortingStrategy">
          <el-select v-model="ruleForm.sortingStrategy" placeholder="请选择分拣策略">
            <el-option label="自动分拣" value="1" />
            <el-option label="人工复核" value="2" />
            <el-option label="忽略" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item prop="priority">
          <el-input-number v-model="ruleForm.priority" :min="1" :max="10" />
        </el-form-item>
        <el-form-item prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ruleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRule">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { getDetectionRulePage, addRule, updateRule, deleteRule as deleteRuleApi, publishRule as publishRuleApi, validateRule as validateRuleApi } from '@/api/detection-rule'
import { getProductionLinePage } from '@/api/production-line'

const rules = ref([])
const productionLines = ref([])
const stations = ref([])
const selectedLineId = ref('')
const pageInfo = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})
const ruleDialogVisible = ref(false)
const isEditing = ref(false)
const ruleFormRef = ref(null)
const ruleForm = reactive({
  id: '',
  ruleCode: '',
  ruleName: '',
  lineId: '',
  stationId: '',
  defectType: '',
  detectionMethod: '',
  confidenceThreshold: 0.8,
  sortingStrategy: 1,
  priority: 1,
  remark: ''
})

const ruleRules = {
  ruleCode: [{ required: true, message: '请输入规则编码', trigger: 'blur' }],
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  lineId: [{ required: true, message: '请选择所属产线', trigger: 'change' }],
  stationId: [{ required: true, message: '请选择所属工位', trigger: 'change' }],
  defectType: [{ required: true, message: '请选择缺陷类型', trigger: 'change' }],
  detectionMethod: [{ required: true, message: '请选择检测方法', trigger: 'change' }],
  confidenceThreshold: [{ required: true, message: '请设置置信度阈值', trigger: 'change' }],
  priority: [{ required: true, message: '请设置优先级', trigger: 'change' }]
}

const defectTypes = {
  1: '异物',
  2: '漏装',
  3: '封口不良',
  4: '其他'
}

const detectionMethods = {
  1: '视觉检测',
  2: '重量检测',
  3: '尺寸检测',
  4: '其他'
}

// 加载产线列表
const loadProductionLines = async () => {
  try {
    const data = await getProductionLinePage({ pageSize: 100 })
    productionLines.value = data.records || []
    if (productionLines.value.length > 0) {
      selectedLineId.value = productionLines.value[0].id
      loadRules()
    }
  } catch (error) {
    console.error('加载产线列表失败', error)
  }
}

// 加载规则列表
const loadRules = async () => {
  try {
    const params = {
      current: pageInfo.current,
      size: pageInfo.pageSize,
      lineId: selectedLineId.value
    }
    const data = await getDetectionRulePage(params)
    rules.value = data.records || []
    pageInfo.total = data.total || 0
  } catch (error) {
    console.error('加载规则列表失败', error)
  }
}

// 刷新数据
const refreshData = () => {
  loadRules()
}

// 打开新增规则对话框
const openAddRuleDialog = () => {
  isEditing.value = false
  Object.assign(ruleForm, {
    id: '',
    ruleCode: '',
    ruleName: '',
    lineId: selectedLineId.value,
    stationId: '',
    defectType: '',
    detectionMethod: '',
    confidenceThreshold: 0.8,
    sortingStrategy: 1,
    priority: 1,
    remark: ''
  })
  ruleDialogVisible.value = true
}

// 打开编辑规则对话框
const openEditRuleDialog = (row) => {
  isEditing.value = true
  Object.assign(ruleForm, row)
  ruleDialogVisible.value = true
}

// 保存规则
const saveRule = async () => {
  if (!ruleFormRef.value) return

  await ruleFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (isEditing.value) {
        await updateRule(ruleForm)
      } else {
        await addRule(ruleForm)
      }
      ruleDialogVisible.value = false
      loadRules()
    } catch (error) {
      console.error('保存规则失败', error)
    }
  })
}

// 发布规则
const publishRule = async (ruleId) => {
  try {
    await publishRuleApi(ruleId)
    loadRules()
  } catch (error) {
    console.error('发布规则失败', error)
  }
}

// 验证规则
const validateRule = async (ruleId) => {
  try {
    const result = await validateRuleApi({ id: ruleId })
    if (result) {
      ElMessage.success('规则验证通过')
    } else {
      ElMessage.warning('规则验证失败')
    }
  } catch (error) {
    console.error('验证规则失败', error)
  }
}

// 删除规则
const deleteRule = async (ruleId) => {
  try {
    await deleteRuleApi(ruleId)
    loadRules()
  } catch (error) {
    console.error('删除规则失败', error)
  }
}

// 双击行编辑
const handleRowDoubleClick = (row) => {
  openEditRuleDialog(row)
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pageInfo.pageSize = size
  loadRules()
}

// 处理当前页变化
const handleCurrentChange = (current) => {
  pageInfo.current = current
  loadRules()
}

// 根据ID获取产线名称
const getLineNameById = (lineId) => {
  const line = productionLines.value.find(l => l.id === lineId)
  return line ? line.lineName : lineId
}

// 根据ID获取工位名称
const getStationNameById = (stationId) => {
  const station = stations.value.find(s => s.id === stationId)
  return station ? station.stationName : stationId
}

// 获取标签类型
const getTagType = (status) => {
  switch (status) {
    case 0:
      return 'info'
    case 1:
      return 'success'
    case 2:
      return 'warning'
    case 3:
      return 'danger'
    default:
      return ''
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 0:
      return '未启用'
    case 1:
      return '生产中'
    case 2:
      return '灰度测试中'
    case 3:
      return '已归档'
    default:
      return status
  }
}

onMounted(() => {
  loadProductionLines()
})
</script>

<style scoped lang="scss">
.rule {
  .rule-card {
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

  .slider-value {
    text-align: center;
    margin-top: 10px;
    font-weight: bold;
    color: #409eff;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>