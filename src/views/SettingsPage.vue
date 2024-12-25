<template>
  <div class="settings-container">
    <!-- 头部 -->
    <header class="settings-header">
      <button 
        class="back-btn" 
        @click="() => router.back()" 
        title="返回"
      >
        <i class="fas fa-arrow-left"></i>
      </button>
      <h2 class="page-title">设置</h2>
    </header>

    <!-- 内容区域 -->
    <div class="settings-content">
      <!-- 账号设置 -->
      <section class="settings-section">
        <h3>账号设置</h3>
        <div class="setting-item">
          <div class="setting-info">
            <h4>修改密码</h4>
            <p>定期更改密码可以提高账号安全性</p>
          </div>
          <button class="action-btn" @click="showChangePasswordModal = true">
            修改
          </button>
        </div>
      </section>

      <!-- 通知设置 -->
      <section class="settings-section">
        <h3>通知设置</h3>
        <div class="setting-item">
          <div class="setting-info">
            <h4>新歌提醒</h4>
            <p>关注歌手发布新歌时通知我</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="settings.newSongNotification">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </section>

      <!-- 播放设置 -->
      <section class="settings-section">
        <h3>播放设置</h3>
        <div class="setting-item">
          <div class="setting-info">
            <h4>自动播放</h4>
            <p>打开歌单时自动开始播放</p>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="settings.autoPlay">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </section>
    </div>

    <!-- 修改密码弹窗 -->
    <Modal 
      v-if="showChangePasswordModal" 
      title="修改密码"
      @close="closePasswordModal"
    >
      <div class="password-modal-content">
        <div class="form-group">
          <label>当前密码</label>
          <input 
            type="password" 
            v-model="passwordForm.currentPassword"
            placeholder="请输入当前密码"
          >
        </div>

        <div class="form-group">
          <label>新密码</label>
          <input 
            type="password" 
            v-model="passwordForm.newPassword"
            placeholder="请输入新密码（至少6位）"
          >
        </div>

        <div class="form-group">
          <label>确认新密码</label>
          <input 
            type="password" 
            v-model="passwordForm.confirmPassword"
            placeholder="请再次输入新密码"
          >
        </div>

        <div v-if="passwordError" class="error-message">
          {{ passwordError }}
        </div>
      </div>

      <template #footer>
        <div class="modal-footer">
          <button 
            class="cancel-btn" 
            @click="closePasswordModal"
            :disabled="isChangingPassword"
          >
            取消
          </button>
          <button 
            class="confirm-btn"
            @click="handleChangePassword"
            :disabled="isChangingPassword || !isPasswordFormValid"
          >
            {{ isChangingPassword ? '修改中...' : '确认修改' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/Modal.vue'

// 路由和状态管理
const router = useRouter()
const authStore = useAuthStore()

// 响应式变量
const showChangePasswordModal = ref(false)
const isChangingPassword = ref(false)
const passwordError = ref('')

// 设置相关
const settings = ref({
  newSongNotification: true,
  autoPlay: false
})

// 密码表单
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码表单验证
const isPasswordFormValid = computed(() => {
  return passwordForm.value.currentPassword &&
         passwordForm.value.newPassword &&
         passwordForm.value.newPassword.length >= 6 &&
         passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

// 加载用户数据
const loadUserData = async () => {
  try {
    if (!authStore.token) {
      throw new Error('未登录状态')
    }
    const userData = await authStore.getUserInfo()
    if (!userData) {
      throw new Error('获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    router.replace({
      path: '/login',
      query: { redirect: '/settings' }
    })
  }
}

// 修改密码处理
const handleChangePassword = async () => {
  if (!isPasswordFormValid.value) {
    passwordError.value = '请确保填写正确的密码信息'
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = '新密码长度不能小于6位'
    return
  }

  try {
    isChangingPassword.value = true
    
    if (!authStore.user) {
      throw new Error('未获取到用户信息')
    }

    const result = await authStore.updatePassword({
      oldPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })

    if (result.success) {
      alert(result.message)
      closePasswordModal()
      await authStore.logout()
      router.replace('/login')
    } else {
      passwordError.value = result.message
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    passwordError.value = '修改密码失败，请重试'
  } finally {
    isChangingPassword.value = false
  }
}

// 关闭密码修改弹窗
const closePasswordModal = () => {
  showChangePasswordModal.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordError.value = ''
  isChangingPassword.value = false
}

// 生命周期钩子
onMounted(async () => {
  await loadUserData()
  
  const savedSettings = localStorage.getItem('userSettings')
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings)
  }
})

// 监听设置变化
watch(settings, (newSettings) => {
  localStorage.setItem('userSettings', JSON.stringify(newSettings))
}, { deep: true })
</script>

<style scoped>
/* 设置页面基础样式 */
.settings-container {
  min-height: 100vh;
  background-color: #121212;
  color: #ffffff;
  padding: 80px 20px 20px;
}

.settings-content {
  max-width: 800px;
  margin: 0 auto;
}

/* 头部样式 */
.settings-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 100;
}

.back-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s;
}

.back-btn:hover {
  opacity: 0.8;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

/* 设置区块样式 */
.settings-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.settings-section h3 {
  margin: 0 0 16px;
  color: #1db954;
  font-size: 18px;
  font-weight: 600;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.setting-info h4 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 500;
}

.setting-info p {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

/* 开关按钮样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #1db954;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* 按钮样式 */
.action-btn {
  background: #1db954;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #1ed760;
  transform: translateY(-1px);
}

/* 修改密码弹窗样式 */
.password-modal-content {
  padding: 20px;
  color: white;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #1db954;
  outline: none;
  box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.2);
}

.error-message {
  color: #ff4466;
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn,
.confirm-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.confirm-btn {
  background: #1db954;
  border: none;
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  background: #1ed760;
  transform: translateY(-1px);
}

.cancel-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.confirm-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 输入框占位符样式 */
.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* 输入框自动填充样式 */
.form-group input:-webkit-autofill,
.form-group input:-webkit-autofill:hover,
.form-group input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0.3) inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-container {
    padding: 60px 16px 16px;
  }

  .settings-header {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.2rem;
  }

  .settings-section {
    padding: 16px;
  }
}
</style> 