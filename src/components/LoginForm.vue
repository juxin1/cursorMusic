<template>
  <div class="login-container">
    <div class="login-background"></div>
    <div class="login-content">
      <!-- Logo 区域 -->
      <div class="logo-section">
        <img src="@/assets/images/logo.png" alt="Logo" class="logo">
        <h1>欢迎回来</h1>
        <p class="subtitle">登录您的账号以继续使用</p>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label>用户名</label>
          <input 
            type="text" 
            v-model="username" 
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
              v-model="password" 
              placeholder="请输入密码"
              :disabled="isLoading"
              required
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

        <!-- 记住我和忘记密码 -->
        <div class="form-options">
          <label class="remember-me">
            <div class="checkbox-wrapper">
              <input type="checkbox" v-model="rememberMe">
              <span class="checkbox-custom"></span>
            </div>
            <span class="remember-text">记住我</span>
          </label>
          <button type="button" class="forgot-password" @click="handleForgotPassword">
            忘记密码？
          </button>
        </div>

        <!-- 登录按钮 -->
        <button 
          type="submit" 
          class="login-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>

        <!-- 分割线 -->
        <div class="divider">
          <span>还没有账号？</span>
        </div>

        <!-- 注册按钮 -->
        <button 
          type="button" 
          class="register-btn"
          @click="handleRegister"
          :disabled="isLoading"
        >
          立即注册
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const rememberMe = ref(false)

const handleSubmit = async () => {
  if (!username.value || !password.value) return
  
  try {
    isLoading.value = true
    await authStore.login({
      username: username.value,
      password: password.value
    })
    
    // 如果有重定向地址，则跳转到重定向地址
    const redirectPath = route.query.redirect || '/home'
    router.replace(redirectPath)
  } catch (error) {
    console.error('登录失败:', error)
    alert(error.message || '登录失败，请重试')
  } finally {
    isLoading.value = false
  }
}

const handleRegister = () => {
  router.push('/register')
}

const handleForgotPassword = () => {
  router.push('/forgot-password')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 40px;
  overflow: hidden;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #2b1b2f 0%, #453256 100%);
  z-index: -1;
}

.login-content {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 60px;
  box-shadow: 0 8px 32px rgba(89, 54, 128, 0.3);
  animation: fadeIn 0.5s ease;
}

.logo-section {
  text-align: center;
  margin-bottom: 50px;
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  margin-left: 4px;
}

.password-input {
  position: relative;
}

input {
  width: 100%;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #a364ff;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 4px rgba(163, 100, 255, 0.1);
}

input::placeholder {
  color: #808080;
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #808080;
  cursor: pointer;
  padding: 8px;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #ffffff;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin: 4px 0;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b3b3b3;
  cursor: pointer;
  transition: color 0.3s ease;
  user-select: none;
}

.checkbox-wrapper {
  position: relative;
  display: inline-block;
  width: 18px;
  height: 18px;
}

.remember-me input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.remember-me:hover .checkbox-custom {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.remember-me input:checked ~ .checkbox-custom {
  background-color: #a364ff;
  border-color: #a364ff;
}

.checkbox-custom:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.remember-me input:checked ~ .checkbox-custom:after {
  display: block;
}

.remember-text {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.3s ease;
}

.remember-me:hover .remember-text {
  color: rgba(255, 255, 255, 0.9);
}

.forgot-password {
  background: none;
  border: none;
  color: #a364ff;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  transition: all 0.3s ease;
}

.forgot-password:hover {
  color: #b375ff;
  text-decoration: underline;
}

.login-btn, .register-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn {
  background: linear-gradient(45deg, #8e44ad, #a364ff);
  color: white;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #9b59b6, #b375ff);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(163, 100, 255, 0.3);
}

.register-btn {
  background: transparent;
  border: 2px solid #a364ff;
  color: #a364ff;
}

.register-btn:hover:not(:disabled) {
  background: rgba(163, 100, 255, 0.1);
  transform: translateY(-1px);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #808080;
  margin: 8px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(163, 100, 255, 0.2);
  margin: 0 16px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  background: rgba(163, 100, 255, 0.5);
}

/* 添加动画 */
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
  .login-container {
    padding: 20px;
  }

  .login-content {
    padding: 40px 24px;
  }

  .logo {
    width: 80px;
    height: 80px;
  }

  h1 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
  }

  input, .login-btn, .register-btn {
    padding: 14px;
    font-size: 14px;
  }
}

/* 添加背景动画效果 */
.login-background::before {
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
</style> 