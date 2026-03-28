import request from '@/utils/request'

/**
 * 分页查询检测记录
 */
export const getDetectionRecordPage = (params) => {
  return request.get('/detection-record/page', { params })
}

/**
 * 获取统计数据
 */
export const getStatistics = (params) => {
  return request.get('/detection-record/statistics', { params })
}

/**
 * 导出检测记录
 */
export const exportDetectionRecords = (data) => {
  return request.post('/detection-record/export', data)
}
