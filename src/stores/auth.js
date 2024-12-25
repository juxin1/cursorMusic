import { defineStore } from 'pinia'
import axios from 'axios'
import qs from 'qs'

const http = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = token
  }

  if (config.url === '/login') {
    const formData = new URLSearchParams()
    formData.append('username', config.data.username)
    formData.append('password', config.data.password)
    config.data = formData
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return config
})

http.interceptors.response.use(
  response => {
    const { code, msg, data } = response.data
    
    if (code === 0) {
      const error = new Error(msg || data || '请求失败')
      error.response = response
      throw error
    }
    
    return response
  },
  error => {
    if (!error.response) {
      throw new Error('网络连接失败')
    }
    throw error
  }
)

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login({ username, password }) {
      try {
        const response = await http.post('/login', {
          username: username.trim(),
          password: password
        })

        const userData = response.data.data
        if (!userData || typeof userData !== 'object') {
          throw new Error('登录响应数据格式错误')
        }

        this.user = userData
        this.token = userData.id?.toString()
        
        if (!this.token) {
          throw new Error('登录失败：无效的用户ID')
        }
        
        localStorage.setItem('token', this.token)
        return true
      } catch (error) {
        console.error('登录失败:', error)
        const errorMsg = error.response?.data?.msg || 
                        error.response?.data?.data || 
                        error.message || 
                        '登录失败'
        throw new Error(errorMsg)
      }
    },

    async getUserInfo() {
      try {
        if (!this.token) {
          throw new Error('未登录状态')
        }

        const response = await http.get(`/user/${this.token}`)
        const { code, data, msg } = response.data
        
        if (code === 0 || !data) {
          throw new Error(msg || '获取用户信息失败')
        }

        this.user = {
          ...data,
          avatarUrl: data.avatarUrl || '/api/default-avatar.jpg'
        }
        return this.user
      } catch (error) {
        console.error('获取用户信息失败:', error)
        if (error.response?.status === 401) {
          await this.logout()
        }
        throw error
      }
    },

    async updateProfile(profileData) {
      try {
        const userData = {
          id: this.token,
          nickname: profileData.nickname,
          email: profileData.email,
          phone: profileData.phone,
          gender: profileData.gender,
          bio: profileData.bio
        }

        const response = await http.put('/user', userData)
        
        const { code, msg } = response.data
        if (code === 0) {
          throw new Error(msg || '更新用户资料失败')
        }
        
        return this.getUserInfo()
      } catch (error) {
        console.error('更新用户资料失败:', error)
        throw new Error(error.response?.data?.msg || error.message || '更新用户资料失败')
      }
    },

    async uploadAvatar(formData) {
      try {
        const response = await http.post(`/user/${this.token}/avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        const { code, msg, data } = response.data
        if (code === 0) {
          throw new Error(msg || '上传头像失败')
        }

        await this.getUserInfo()
        return true
      } catch (error) {
        console.error('上传头像失败:', error)
        throw new Error(error.response?.data?.msg || error.message || '上传头像失败')
      }
    },

    async logout() {
      try {
        localStorage.removeItem('token')
        this.token = null
        this.user = null
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    },

    async updatePassword({ oldPassword, newPassword }) {
      try {
        if (!this.user || !this.token) {
          throw new Error('未获取到用户信息')
        }

        // 构造请求数据，符合后端 @RequestBody User user, String oldPassword, String newPassword 的格式
        const requestData = {
          id: parseInt(this.token),
          username: this.user.username,
          nickname: this.user.nickname,
          email: this.user.email,
          phone: this.user.phone,
          gender: this.user.gender,
          status: this.user.status
        }

        // 使用 params 传递 oldPassword 和 newPassword
        const response = await http.put('/user/password', requestData, {
          params: {
            oldPassword,
            newPassword
          }
        })
        
        // 从响应中获取状态和消息
        const { data } = response
        
        // 根据后端 Result 类的状态判断
        if (!data) {
          return {
            success: false,
            message: '服务器响应错误'
          }
        }

        return {
          success: data.status === 1,  // status 为 1 表示成功
          message: data.msg || (data.status === 1 ? '密码修改成功' : '密码修改失败')
        }

      } catch (error) {
        console.error('修改密码失败:', error)
        return {
          success: false,
          message: error.response?.data?.msg || error.message || '修改密码失败'
        }
      }
    },

    async register(userData) {
      try {
        const user = {
          username: userData.username,
          password: userData.password,
          nickname: userData.nickname || userData.username,
          email: userData.email,
          phone: userData.phone || '',
          gender: parseInt(userData.gender) || 0,
          bio: userData.bio || '',
          status: 1
        }

        const response = await http.post('/user', user)
        
        const { code, msg } = response.data
        if (code === 0) {
          throw new Error(msg || '注册失败')
        }
        
        return true
      } catch (error) {
        console.error('注册失败:', error)
        throw new Error(error.response?.data?.msg || error.message || '注册失败')
      }
    },

    async deleteAccount() {
      try {
        if (!this.token) {
          throw new Error('未登录状态')
        }

        const response = await http.delete(`/user?ids=${parseInt(this.token)}`)
        
        const { code, msg } = response.data
        if (code === 0) {
          throw new Error(msg || '注销账号失败')
        }
        
        await this.logout()
        return true
      } catch (error) {
        console.error('注销账号失败:', error)
        throw new Error(error.response?.data?.msg || error.message || '注销账号失败')
      }
    }
  }
}) 