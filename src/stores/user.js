import { defineStore } from 'pinia'
import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null
  }),

  actions: {
    // 获取当前用户信息
    async getCurrentUser() {
      try {
        const token = localStorage.getItem('token')
        if (!token) return null

        // 添加 token 到请求头
        http.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // 使用 token 作为用户 ID 获取信息
        const response = await http.get(`/user/${token}`)
        if (response.data.status === 1) {
          this.currentUser = response.data.data
          return this.currentUser
        }
        return null
      } catch (error) {
        console.error('Failed to get user info:', error)
        if (error.response?.status === 401) {
          // token 无效，清除登录状态
          this.logout()
        }
        return null
      }
    },

    // 更新用户资料
    async updateProfile(profileData) {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('未登录')

        const response = await http.put(`/user/${token}`, profileData)
        if (response.data.status === 1) {
          this.currentUser = response.data.data
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to update profile:', error)
        throw new Error('更新资料失败')
      }
    },

    // 更新用户头像
    async updateAvatar(formData) {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('未登录')

        const response = await http.post(`/user/${token}/avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        if (response.data.status === 1) {
          this.currentUser = {
            ...this.currentUser,
            avatarUrl: response.data.data.avatarUrl
          }
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to upload avatar:', error)
        throw new Error('上传头像失败')
      }
    },

    // 退出登录
    logout() {
      this.currentUser = null
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
    }
  }
}) 