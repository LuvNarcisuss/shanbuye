import request from '@/utils/request'

/**
 * 分页查询报警列表
 */
export const getAlarmPage = (params) => {
  return request.get('/alarm/page', { params })
}

/**
 * 确认报警
 */
export const confirmAlarm = (alarmId, handlerId, remark) => {
  return request.post(`/alarm/confirm/${alarmId}`, null, { params: { handlerId, remark } })
}

/**
 * 处理报警
 */
export const handleAlarm = (alarmId, handlerId, status, remark) => {
  return request.post(`/alarm/handle/${alarmId}`, null, { params: { handlerId, status, remark } })
}

/**
 * 消音报警
 */
export const muteAlarm = (alarmId) => {
  return request.post(`/alarm/mute/${alarmId}`)
}

/**
 * 关闭报警
 */
export const closeAlarm = (alarmId, handlerId) => {
  return request.post(`/alarm/close/${alarmId}`, null, { params: { handlerId } })
}

/**
 * 获取未处理报警数量
 */
export const getUnhandledAlarmCount = () => {
  return request.get('/alarm/unhandled-count')
}
