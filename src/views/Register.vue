<template>
  <div class="register-container">
    <div class="register-background"></div>
    <div class="register-content">
      <!-- Logo 区域 -->
      <div class="logo-section">
        <img src="@/assets/images/logo.png" alt="Logo" class="logo">
        <h1>创建账号</h1>
        <p class="subtitle">加入我们，开启音乐之旅</p>
      </div>

      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <label>用户名 <span class="required">*</span></label>
          <input 
            type="text" 
            v-model="formData.username" 
            placeholder="请输入用户名"
            :disabled="isLoading"
            required
          >
          <span class="error-message">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label>昵称</label>
          <input 
            type="text" 
            v-model="formData.nickname" 
            placeholder="设置昵称（选填）"
            :disabled="isLoading"
          >
        </div>

        <div class="form-group">
          <label>密码 <span class="required">*</span></label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="formData.password" 
              placeholder="至少6位字符"
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
          <span class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label>确认密码 <span class="required">*</span></label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="formData.confirmPassword" 
              placeholder="请再次输入密码"
              :disabled="isLoading"
              required
            >
          </div>
          <span class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <div class="form-group">
          <label>邮箱 <span class="required">*</span></label>
          <input 
            type="email" 
            v-model="formData.email" 
            placeholder="example@domain.com"
            :disabled="isLoading"
            required
          >
          <span class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>手机号码</label>
          <input 
            type="tel" 
            v-model="formData.phone" 
            placeholder="请输入手机号码"
            :disabled="isLoading"
            pattern="[0-9]{11}"
          >
          <span class="error-message">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label>性别</label>
          <select 
            v-model="formData.gender" 
            :disabled="isLoading"
            class="gender-select"
          >
            <option value="0">保密</option>
            <option value="1">男</option>
            <option value="2">女</option>
          </select>
        </div>

        <div class="form-group">
          <label>个人简介</label>
          <textarea 
            v-model="formData.bio" 
            placeholder="介绍一下自己吧（选填）"
            :disabled="isLoading"
            rows="3"
          ></textarea>
        </div>

        <div class="agreement">
          <label class="checkbox-wrapper">
            <input 
              type="checkbox" 
              v-model="agreedToTerms"
              :disabled="isLoading"
              required
            >
            <span class="checkbox-custom"></span>
            <span class="agreement-text">
              我已阅读并同意<a href="#" @click.prevent="showTerms">服务条款</a>和<a href="#" @click.prevent="showPrivacy">隐私政策</a>
            </span>
          </label>
        </div>

        <button 
          type="submit" 
          class="submit-btn"
          :disabled="isLoading || !isFormValid"
        >
          {{ isLoading ? '注册中...' : '创建账号' }}
        </button>

        <div class="divider">
          <span>已有账号？</span>
        </div>

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
const agreedToTerms = ref(false)

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  email: '',
  phone: '',
  gender: '0',
  bio: '',
  status: 1
})

const errors = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: ''
})

const isFormValid = computed(() => {
  return formData.value.username &&
         formData.value.password &&
         formData.value.password.length >= 6 &&
         formData.value.password === formData.value.confirmPassword &&
         formData.value.email &&
         agreedToTerms.value
})

const validateForm = () => {
  let isValid = true
  errors.value = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: ''
  }

  // 用户名验证
  if (!formData.value.username) {
    errors.value.username = '请输入用户名'
    isValid = false
  }

  // 密码验证
  if (!formData.value.password) {
    errors.value.password = '请输入密码'
    isValid = false
  } else if (formData.value.password.length < 6) {
    errors.value.password = '密码长度不能小于6位'
    isValid = false
  }

  // 确认密码验证
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  // 邮箱验证
  if (!formData.value.email) {
    errors.value.email = '请输入邮箱'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
    isValid = false
  }

  // 手机号验证（如果填写了的话）
  if (formData.value.phone && !/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    errors.value.phone = '请输入有效的手机号码'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    isLoading.value = true
    await authStore.register({
      username: formData.value.username.trim(),
      password: formData.value.password.trim(),
      nickname: formData.value.nickname?.trim(),
      email: formData.value.email.trim(),
      phone: formData.value.phone?.trim(),
      gender: formData.value.gender,
      bio: formData.value.bio?.trim(),
      status: 1
    })
    
    alert('注册成功！请登录')
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
    // 显示具体的错误信息
    if (error.message.includes('用户名已存在')) {
      errors.value.username = '该用户名已被注册'
    } else if (error.message.includes('邮箱已存在')) {
      errors.value.email = '该邮箱已被注册'
    } else {
      alert(error.message || '注册失败，请重试')
    }
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
  max-width: 580px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 60px;
  box-shadow: 0 8px 32px rgba(89, 54, 128, 0.3);
  animation: fadeIn 0.5s ease;
}

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
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
}

/* 表单样式 */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
}

.required {
  color: #ff4466;
  margin-left: 4px;
}

input, select, textarea {
  width: 100%;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #a364ff;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 20px rgba(163, 100, 255, 0.2);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.error-message {
  color: #ff4466;
  font-size: 12px;
  min-height: 16px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.error-message.show {
  opacity: 1;
  transform: translateY(0);
}

/* 协议同意部分 */
.agreement {
  margin: 10px 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
}

.checkbox-wrapper input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-custom {
  position: relative;
  height: 18px;
  width: 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-right: 10px;
  transition: all 0.3s ease;
}

.checkbox-wrapper:hover .checkbox-custom {
  border-color: #a364ff;
}

.checkbox-wrapper input:checked ~ .checkbox-custom {
  background: #a364ff;
  border-color: #a364ff;
}

.checkbox-custom:after {
  content: '';
  position: absolute;
  display: none;
  left: 5px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-wrapper input:checked ~ .checkbox-custom:after {
  display: block;
}

.agreement-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.agreement-text a {
  color: #a364ff;
  text-decoration: none;
  margin: 0 2px;
}

.agreement-text a:hover {
  text-decoration: underline;
}

/* 按钮样式 */
.submit-btn, .login-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: linear-gradient(45deg, #8e44ad, #a364ff);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #9b59b6, #b375ff);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(163, 100, 255, 0.3);
}

.login-btn {
  background: transparent;
  border: 2px solid #a364ff;
  color: #a364ff;
}

.login-btn:hover:not(:disabled) {
  background: rgba(163, 100, 255, 0.1);
  transform: translateY(-1px);
}

/* 分割线样式 */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 16px;
}

/* 动画 */
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

/* 响应式调整 */
@media (max-width: 640px) {
  .register-container {
    padding: 20px;
  }

  .register-content {
    padding: 40px 24px;
  }

  input, .submit-btn, .login-btn {
    padding: 14px;
    font-size: 14px;
  }

  h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .logo {
    width: 80px;
    height: 80px;
  }
}

/* 优化性别选择框样式 */
.gender-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.762L10.825 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 12px;
  padding-right: 40px;
  cursor: pointer;
}

.gender-select option {
  background-color: #2b1b2f;
  color: white;
  padding: 12px;
}

.gender-select:focus {
  border-color: #a364ff;
  box-shadow: 0 0 20px rgba(163, 100, 255, 0.2);
}

/* 禁用状态样式 */
.gender-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 移除原有的 checkbox-label 相关样式 */
.checkbox-label {
  display: none;
}
</style> 