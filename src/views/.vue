<template>
  <div class="register-container">
    <div class="register-background"></div>
    <div class="register-content">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="router.push('/login')">
        <i class="fas fa-arrow-left"></i>
      </button>

      <!-- Logo 区域 -->
      <div class="logo-section">
        <img src="@/assets/images/logo.png" alt="Logo" class="logo">
        <h1>创建账号</h1>
        <p class="subtitle">加入我们，开启音乐之旅</p>
      </div>

      <!-- 注册表单 -->
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <label>用户名</label>
          <input 
            type="text" 
            v-model="formData.username" 
            placeholder="请输入用户名"
            :disabled="isLoading"
            required
          >
        </div>

        <div class="form-group">
          <label>密码</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="formData.password" 
              placeholder="请输入密码（至少6位）"
              :disabled="isLoading"
              required
              minlength="6"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>确认密码</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="formData.confirmPassword" 
              placeholder="请再次输入密码"
              :disabled="isLoading"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label>邮箱</label>
          <input 
            type="email" 
            v-model="formData.email" 
            placeholder="请输入邮箱"
            :disabled="isLoading"
            required
          >
        </div>

        <!-- 注册按钮 -->
        <button 
          type="submit" 
          class="submit-btn"
          :disabled="isLoading || !isFormValid"
        >
          {{ isLoading ? '注册中...' : '立即注册' }}
        </button>

        <!-- 分割线 -->
        <div class="divider">
          <span>已有账号？</span>
        </div>

        <!-- 返回登录 -->
        <button 
          type="button" 
          class="login-btn"
          @click="router.push('/login')"
          :disabled="isLoading"
        >
          返回登录
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showPassword = ref(false)
const isLoading = ref(false)

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: ''
})

// 表单验证
const isFormValid = computed(() => {
  return formData.value.username &&
         formData.value.password &&
         formData.value.password.length >= 6 &&
         formData.value.password === formData.value.confirmPassword &&
         formData.value.email &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)
})

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  try {
    isLoading.value = true
    await authStore.register({
      username: formData.value.username,
      password: formData.value.password,
      email: formData.value.email
    })
    
    alert('注册成功！请登录')
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
    alert(error.message || '注册失败，请重试')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 40px;
  overflow: hidden;
}

.register-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #2b1b2f 0%, #453256 100%);
  z-index: -1;
}

.register-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, 
    rgba(163, 100, 255, 0.1) 0%, 
    rgba(163, 100, 255, 0) 50%
  );
  animation: pulse 4s ease-in-out infinite;
}

.register-content {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 60px;
  box-shadow: 0 8px 32px rgba(89, 54, 128, 0.3);
  animation: fadeIn 0.5s ease;
  position: relative;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: #ffffff;
}

/* 复用登录页面的其他样式，但更改类名 */
.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 24px;
  animation: scaleIn 0.5s ease;
}

h1 {
  color: #ffffff;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  letter-spacing: 0.3px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ... 复用 LoginForm 的其他样式 ... */

.submit-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #8e44ad, #a364ff);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #9b59b6, #b375ff);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(163, 100, 255, 0.3);
}

.login-btn {
  width: 100%;
  padding: 16px;
  border: 2px solid #a364ff;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  color: #a364ff;
}

.login-btn:hover:not(:disabled) {
  background: rgba(163, 100, 255, 0.1);
  transform: translateY(-1px);
}

/* 动画效果 */
@keyframes pulse {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .register-container {
    padding: 20px;
  }

  .register-content {
    padding: 40px 24px;
  }

  .back-btn {
    top: 16px;
    left: 16px;
    font-size: 16px;
  }
}
</style> 