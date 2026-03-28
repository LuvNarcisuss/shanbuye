<template>
  <div class="model">
    <el-card class="model-card">
      <template #header>
        <div class="card-header">
          <span>模型管理</span>
          <div class="header-actions">
            <el-select v-model="modelType" placeholder="选择模型类型" size="small" @change="loadModels">
              <el-option label="所有类型" value="" />
              <el-option label="视觉检测模型" value="1" />
              <el-option label="重量检测模型" value="2" />
              <el-option label="尺寸检测模型" value="3" />
            </el-select>
            <el-button type="primary" size="small" @click="openUploadDialog">
              <el-icon><Upload /></el-icon>
              上传模型
            </el-button>
            <el-button type="info" size="small" @click="refreshData">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <!-- 模型列表 -->
      <el-table :data="models" style="width: 100%" @row-dblclick="handleRowDoubleClick">
        <el-table-column prop="modelName" label="模型名称" />
        <el-table-column prop="modelVersion" label="版本" width="100" />
        <el-table-column prop="modelType" label="模型类型" width="120">
          <template #default="scope">
            {{ getModelTypeText(scope.row.modelType) }}
          </template>
        </el-table-column>
        <el-table-column prop="modelFormat" label="模型格式" width="100" />
        <el-table-column prop="fileSize" label="文件大小" width="100">
          <template #default="scope">
            {{ formatFileSize(scope.row.fileSize) }}
          </template>
        </el-table-column>
        <el-table-column prop="inputSize" label="输入尺寸" width="120" />
        <el-table-column prop="classCount" label="类别数" width="80" />
        <el-table-column prop="mapValue" label="mAP" width="80">
          <template #default="scope">
            {{ (scope.row.mapValue * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column prop="fps" label="FPS" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isCurrent" label="当前使用" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.isCurrent" @change="handleSetCurrentModel(scope.row.id, scope.row.isCurrent)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleParseModelMeta(scope.row.id)" circle>
                <el-icon><Reading /></el-icon>
              </el-button>
              <el-button type="success" size="small" @click="handleGrayPublishModel(scope.row.id)" circle>
                <el-icon><Sunny /></el-icon>
              </el-button>
              <el-button type="warning" size="small" @click="handleRollbackModel(scope.row.id)" circle>
                <el-icon><RefreshLeft /></el-icon>
              </el-button>
              <el-button type="danger" size="small" @click="deleteModel(scope.row.id)" circle>
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

    <!-- 上传模型对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传模型"
      width="70%"
    >
      <el-form
        ref="uploadFormRef"
        :model="uploadForm"
        :rules="uploadRules"
        label-width="120px"
      >
        <el-form-item prop="modelName">
          <el-input v-model="uploadForm.modelName" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item prop="modelVersion">
          <el-input v-model="uploadForm.modelVersion" placeholder="请输入模型版本" />
        </el-form-item>
        <el-form-item prop="modelType">
          <el-select v-model="uploadForm.modelType" placeholder="请选择模型类型">
            <el-option label="视觉检测模型" value="1" />
            <el-option label="重量检测模型" value="2" />
            <el-option label="尺寸检测模型" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item prop="modelFormat">
          <el-select v-model="uploadForm.modelFormat" placeholder="请选择模型格式">
            <el-option label="ONNX" value="onnx" />
            <el-option label="PyTorch" value="pt" />
            <el-option label="TensorFlow" value="pb" />
            <el-option label="TensorRT" value="engine" />
          </el-select>
        </el-form-item>
        <el-form-item prop="file">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :limit="1"
            accept=".onnx,.pt,.pth,.engine,.trt,.pb"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持的格式：onnx, pt, pth, engine, trt, pb
              </div>
            </template>
          </el-upload>
          <div v-if="uploadForm.fileName" class="file-name">
            已选择：{{ uploadForm.fileName }}
          </div>
        </el-form-item>
        <el-form-item prop="remark">
          <el-input v-model="uploadForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="uploadModel">上传</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 模型对比对话框 -->
    <el-dialog
      v-model="compareDialogVisible"
      title="模型对比"
      width="80%"
    >
      <div class="compare-container">
        <el-form :model="compareForm" label-width="120px">
          <el-form-item label="模型A">
            <el-select v-model="compareForm.modelIdA" placeholder="请选择模型A">
              <el-option
                v-for="model in models"
                :key="model.id"
                :label="`${model.modelName} v${model.modelVersion}`"
                :value="model.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="模型B">
            <el-select v-model="compareForm.modelIdB" placeholder="请选择模型B">
              <el-option
                v-for="model in models"
                :key="model.id"
                :label="`${model.modelName} v${model.modelVersion}`"
                :value="model.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="compare-result" v-if="compareResult">
          <el-card>
            <template #header>
              <div class="card-header">对比结果</div>
            </template>
            <pre>{{ compareResult }}</pre>
          </el-card>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="compareDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="compareModels">对比</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getDetectionModelPage, uploadDetectionModel, parseModelMeta, setCurrentModel, grayPublishModel, rollbackModel, deleteDetectionModel, compareModel } from '@/api/detection-model'

const models = ref([])
const modelType = ref('')
const pageInfo = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})
const uploadDialogVisible = ref(false)
const compareDialogVisible = ref(false)
const uploadFormRef = ref(null)
const uploadForm = reactive({
  modelName: '',
  modelVersion: '',
  modelType: '',
  modelFormat: '',
  fileName: '',
  file: null,
  remark: ''
})
const compareForm = reactive({
  modelIdA: '',
  modelIdB: ''
})
const compareResult = ref('')

const uploadRules = {
  modelName: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
  modelVersion: [{ required: true, message: '请输入模型版本', trigger: 'blur' }],
  modelType: [{ required: true, message: '请选择模型类型', trigger: 'change' }],
  modelFormat: [{ required: true, message: '请选择模型格式', trigger: 'change' }],
  file: [{ required: true, message: '请选择模型文件', trigger: 'change' }]
}

// 加载模型列表
const loadModels = async () => {
  try {
    const params = {
      current: pageInfo.current,
      size: pageInfo.pageSize,
      modelType: modelType.value
    }
    const data = await getDetectionModelPage(params)
    models.value = data.records || []
    pageInfo.total = data.total || 0
  } catch (error) {
    console.error('加载模型列表失败', error)
  }
}

// 刷新数据
const refreshData = () => {
  loadModels()
}

// 打开上传模型对话框
const openUploadDialog = () => {
  Object.assign(uploadForm, {
    modelName: '',
    modelVersion: '',
    modelType: '',
    modelFormat: '',
    fileName: '',
    file: null,
    remark: ''
  })
  uploadDialogVisible.value = true
}

// 处理文件选择
const handleFileChange = (file) => {
  uploadForm.file = file.raw
  uploadForm.fileName = file.name
}

// 上传模型
const uploadModel = async () => {
  if (!uploadFormRef.value) return

  await uploadFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      const formData = new FormData()
      formData.append('modelName', uploadForm.modelName)
      formData.append('modelVersion', uploadForm.modelVersion)
      formData.append('modelType', uploadForm.modelType)
      formData.append('modelFormat', uploadForm.modelFormat)
      formData.append('file', uploadForm.file)
      formData.append('remark', uploadForm.remark)

      await uploadDetectionModel(formData)
      uploadDialogVisible.value = false
      loadModels()
    } catch (error) {
      console.error('上传模型失败', error)
    }
  })
}

// 解析模型元信息
const handleParseModelMeta = async (modelId) => {
  try {
    await parseModelMeta(modelId)
    loadModels()
  } catch (error) {
    console.error('解析模型元信息失败', error)
  }
}

// 设为当前使用模型
const handleSetCurrentModel = async (modelId, isCurrent) => {
  try {
    await setCurrentModel(modelId)
    loadModels()
  } catch (error) {
    console.error('设置当前模型失败', error)
  }
}

// 灰度发布模型
const handleGrayPublishModel = async (modelId) => {
  try {
    await grayPublishModel(modelId, {})
    loadModels()
  } catch (error) {
    console.error('灰度发布模型失败', error)
  }
}

// 回滚模型
const handleRollbackModel = async (modelId) => {
  try {
    await rollbackModel(modelId)
    loadModels()
  } catch (error) {
    console.error('回滚模型失败', error)
  }
}

// 删除模型
const deleteModel = async (modelId) => {
  try {
    await deleteDetectionModel(modelId)
    loadModels()
  } catch (error) {
    console.error('删除模型失败', error)
  }
}

// 打开模型对比对话框
const openCompareDialog = () => {
  Object.assign(compareForm, {
    modelIdA: '',
    modelIdB: ''
  })
  compareResult.value = ''
  compareDialogVisible.value = true
}

// 对比模型
const compareModels = async () => {
  if (!compareForm.modelIdA || !compareForm.modelIdB) {
    return
  }

  try {
    const result = await compareModel(compareForm.modelIdA, compareForm.modelIdB)
    compareResult.value = result
  } catch (error) {
    console.error('对比模型失败', error)
  }
}

// 双击行编辑
const handleRowDoubleClick = (row) => {
  // 可以实现编辑功能
  console.log('编辑模型', row)
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pageInfo.pageSize = size
  loadModels()
}

// 处理当前页变化
const handleCurrentChange = (current) => {
  pageInfo.current = current
  loadModels()
}

// 获取模型类型文本
const getModelTypeText = (type) => {
  const types = {
    1: '视觉检测模型',
    2: '重量检测模型',
    3: '尺寸检测模型'
  }
  return types[type] || type
}

// 格式化文件大小
const formatFileSize = (size) => {
  if (!size) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return size.toFixed(2) + ' ' + units[i]
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const types = {
    0: 'info',
    1: 'success',
    2: 'warning',
    3: 'danger'
  }
  return types[status] || ''
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    0: '未启用',
    1: '生产中',
    2: '灰度测试中',
    3: '已归档'
  }
  return texts[status] || status
}

onMounted(() => {
  loadModels()
})
</script>

<style scoped lang="scss">
.model {
  .model-card {
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

  .file-name {
    margin-top: 10px;
    padding: 8px;
    background-color: #f0f9eb;
    border: 1px solid #e1f5fe;
    border-radius: 4px;
    font-size: 14px;
  }

  .compare-container {
    .compare-result {
      margin-top: 20px;

      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: 'Courier New', Courier, monospace;
        font-size: 14px;
        line-height: 1.5;
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