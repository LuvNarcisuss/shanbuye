import request from '@/utils/request'

/**
 * 分页查询产线列表
 */
export const getProductionLinePage = (params) => {
  return request.get('/production-line/page', { params })
}

/**
 * 获取产线监控数据
 */
export const getLineMonitorData = (lineId) => {
  return request.get(`/production-line/monitor/${lineId}`)
}

/**
 * 获取所有产线监控数据
 */
export const getAllLineMonitorData = () => {
  return request.get('/production-line/monitor/all')
}

/**
 * 更新产线状态
 */
export const updateLineStatus = (lineId, status) => {
  return request.put(`/production-line/status/${lineId}`, null, { params: { status } })
}
