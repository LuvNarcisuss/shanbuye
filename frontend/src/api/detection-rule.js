import request from '@/utils/request'

/**
 * 分页查询规则列表
 */
export const getDetectionRulePage = (params) => {
  return request.get('/detection-rule/page', { params })
}

/**
 * 新增规则
 */
export const addRule = (data) => {
  return request.post('/detection-rule', data)
}

/**
 * 编辑规则
 */
export const updateRule = (data) => {
  return request.put('/detection-rule', data)
}

/**
 * 删除规则
 */
export const deleteRule = (ruleId) => {
  return request.delete(`/detection-rule/${ruleId}`)
}

/**
 * 复制规则
 */
export const copyDetectionRule = (ruleId) => {
  return request.post(`/detection-rule/copy/${ruleId}`)
}

/**
 * 启用/停用规则
 */
export const updateRuleStatus = (ruleId, status) => {
  return request.put(`/detection-rule/status/${ruleId}`, null, { params: { status } })
}

/**
 * 发布规则
 */
export const publishRule = (ruleId) => {
  return request.post(`/detection-rule/publish/${ruleId}`)
}

/**
 * 规则校验
 */
export const validateRule = (data) => {
  return request.post('/detection-rule/validate', data)
}

/**
 * 规则回滚
 */
export const rollbackRule = (ruleId, targetVersion) => {
  return request.post(`/detection-rule/rollback/${ruleId}`, null, { params: { targetVersion } })
}
