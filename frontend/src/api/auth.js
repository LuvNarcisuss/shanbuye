import request from '@/utils/request'

/**
 * 用户登录
 */
export const login = (data) => {
  return request.post('/auth/login', data)
}

/**
 * 用户退出
 */
export const logout = () => {
  return request.post('/auth/logout')
}
