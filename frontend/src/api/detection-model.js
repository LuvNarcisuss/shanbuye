import request from '@/utils/request'

/**
 * 分页查询模型列表
 */
export const getDetectionModelPage = (params) => {
  return request.get('/detection-model/page', { params })
}

/**
 * 上传模型
 */
export const uploadDetectionModel = (data) => {
  return request.post('/detection-model', data)
}

/**
 * 解析模型元信息
 */
export const parseModelMeta = (modelId) => {
  return request.post(`/detection-model/parse/${modelId}`)
}

/**
 * 设为当前使用模型
 */
export const setCurrentModel = (modelId) => {
  return request.post(`/detection-model/current/${modelId}`)
}

/**
 * 灰度发布
 */
export const grayPublishModel = (modelId, data) => {
  return request.post(`/detection-model/gray-publish/${modelId}`, data)
}

/**
 * 回滚模型
 */
export const rollbackModel = (modelId) => {
  return request.post(`/detection-model/rollback/${modelId}`)
}

/**
 * 删除模型
 */
export const deleteDetectionModel = (modelId) => {
  return request.delete(`/detection-model/${modelId}`)
}

/**
 * 模型对比
 */
export const compareModel = (modelIdA, modelIdB) => {
  return request.get('/detection-model/compare', { params: { modelIdA, modelIdB } })
}
