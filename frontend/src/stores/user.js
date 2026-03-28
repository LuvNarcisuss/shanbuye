import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, logout as logoutApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))

  const isLogin = computed(() => !!token.value)

  // 登录
  const login = async (loginForm) => {
    const data = await loginApi(loginForm)
    token.value = data.token
    userInfo.value = {
      userId: data.userId,
      username: data.username,
      realName: data.realName,
      avatar: data.avatar,
      roleId: data.roleId,
      roleName: data.roleName,
      roleCode: data.roleCode,
      permissions: data.permissions,
      menus: data.menus
    }
    localStorage.setItem('token', data.token)
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    return data
  }

  // 退出登录
  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('退出登录失败', error)
    } finally {
      token.value = ''
      userInfo.value = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }

  // 检查权限
  const hasPermission = (permission) => {
    if (!userInfo.value.permissions || userInfo.value.permissions.length === 0) {
      return false
    }
    return userInfo.value.permissions.includes(permission)
  }

  return {
    token,
    userInfo,
    isLogin,
    login,
    logout,
    hasPermission
  }
})
