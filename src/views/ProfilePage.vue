<template>
  <div class="profile-overlay" @click.self="handleClose">
    <div class="profile-modal">
      <div class="profile-container">
        <div class="profile-header">
          <h2>个人资料</h2>
          <button class="close-btn" @click="handleClose">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="profile-content">
          <!-- 头像上传部分 -->
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <img 
                :src="formData.avatarUrl || defaultImage" 
                :alt="formData.username"
                class="avatar"
              >
              <button class="upload-btn" @click="triggerFileInput">
                <i class="fas fa-camera"></i>
              </button>
            </div>
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              style="display: none"
              @change="handleAvatarChange"
            >
          </div>

          <!-- 个人信息表单 -->
          <form @submit.prevent="handleSubmit" class="profile-form">
            <!-- 用户名 -->
            <div class="form-group">
              <label>用户名</label>
              <input 
                type="text" 
                v-model="formData.username" 
                disabled
                title="用户名创建后不可修改"
              >
            </div>

            <!-- 昵称 -->
            <div class="form-group">
              <label>昵称</label>
              <input 
                type="text" 
                v-model="formData.nickname"
                placeholder="设置一个昵称"
              >
            </div>

            <!-- 邮箱 -->
            <div class="form-group">
              <label>邮箱</label>
              <input 
                type="email" 
                v-model="formData.email"
                placeholder="example@example.com"
              >
            </div>

            <!-- 手机号 -->
            <div class="form-group">
              <label>手机号</label>
              <input 
                type="tel" 
                v-model="formData.phone"
                placeholder="请输入手机号"
                pattern="[0-9]{11}"
              >
            </div>

            <!-- 性别 -->
            <div class="form-group">
              <label>性别</label>
              <select 
                v-model="formData.gender"
                class="gender-select"
              >
                <option value="0">保密</option>
                <option value="1">男</option>
                <option value="2">女</option>
              </select>
            </div>

            <!-- 账号状态 -->
            <div class="form-group">
              <label>账号状态</label>
              <input 
                type="text" 
                :value="getStatusText(formData.status)" 
                disabled
                :class="{ 'status-normal': formData.status === 1 }"
              >
            </div>

            <!-- 创建时间 -->
            <div class="form-group">
              <label>创建时间</label>
              <input 
                type="text" 
                :value="formatDate(formData.createTime)" 
                disabled
              >
            </div>

            <!-- 最后更新时间 -->
            <div class="form-group">
              <label>最后更新</label>
              <input 
                type="text" 
                :value="formatDate(formData.updateTime)" 
                disabled
              >
            </div>

            <!-- 个人简介 -->
            <div class="form-group">
              <label>个人简介</label>
              <textarea 
                v-model="formData.bio" 
                rows="4"
                placeholder="介绍一下自己吧..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              class="save-btn"
              :class="{ 'save-btn-disabled': !isFormChanged }"
              :disabled="isSaving || !isFormChanged"
            >
              {{ isSaving ? '保存中...' : (isFormChanged ? '保存修改' : '无需保存') }}
            </button>
          </form>

          <!-- 在表单最后添加危险操作区域 -->
          <div class="danger-zone">
            <h3>危险操作</h3>
            <button 
              @click="showDeleteConfirm = true"
              class="delete-account-btn"
            >
              <i class="fas fa-trash-alt"></i>
              注销账号
            </button>
          </div>

          <!-- 添加注销确认弹窗 -->
          <Modal v-if="showDeleteConfirm" title="注销账号确认" @close="closeDeleteModal">
            <div class="delete-modal-content">
              <div class="warning-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              
              <div v-if="!firstConfirmDone">
                <h3>您确定要注销账号吗？</h3>
                <div class="warning-list">
                  <p>注销账号后：</p>
                  <ul>
                    <li>您的账号将被永久删除</li>
                    <li>所有个人数据将被清除</li>
                    <li>无法恢复已删除的数据</li>
                  </ul>
                </div>
                <div class="confirm-input">
                  <p class="input-label">请输入"确认注销"以继续：</p>
                  <input 
                    type="text"
                    v-model="deleteConfirmText"
                    placeholder="确认注销"
                    :disabled="isDeleting"
                    @keyup.enter="handleDeleteConfirm"
                  >
                </div>
              </div>
              
              <div v-if="firstConfirmDone">
                <h3>最后确认</h3>
                <p class="warning-text">
                  为了确保安全，请再次输入"确认注销"完成操作。<br>
                  此操作执行后将无法撤销！
                </p>
                <div class="confirm-input">
                  <p class="input-label">请再次输入"确认注销"：</p>
                  <input 
                    type="text"
                    v-model="deleteConfirmText2"
                    placeholder="确认注销"
                    :disabled="isDeleting"
                    @keyup.enter="handleDeleteConfirm"
                    ref="secondInput"
                  >
                </div>
              </div>

              <div v-if="deleteError" class="error-message">
                {{ deleteError }}
              </div>
            </div>

            <template #footer>
              <div class="modal-footer">
                <button 
                  class="cancel-btn" 
                  @click="closeDeleteModal"
                  :disabled="isDeleting"
                >
                  取消
                </button>
                <button 
                  class="confirm-btn"
                  @click="handleDeleteConfirm"
                  :disabled="isDeleting || (firstConfirmDone ? !isSecondConfirmValid : !isFirstConfirmValid)"
                >
                  {{ getButtonText }}
                </button>
              </div>
            </template>
          </Modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import defaultImage from '@/assets/images/default.jpg'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = ref(null)
const showSettings = ref(false)
const fileInput = ref(null)
const isSaving = ref(false)
const isLoading = ref(true)

const formData = ref({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  gender: '0',
  avatarUrl: '',
  bio: '',
  status: 1,
  createTime: '',
  updateTime: ''
})

// 原始数据（用于比较是否有修改）
const originalData = ref(null)

// 检查表单是否有修改
const isFormChanged = computed(() => {
  if (!originalData.value) return false
  return (
    formData.value.nickname !== originalData.value.nickname ||
    formData.value.email !== originalData.value.email ||
    formData.value.phone !== originalData.value.phone ||
    formData.value.gender !== originalData.value.gender ||
    formData.value.bio !== originalData.value.bio
  )
})

// 添加路由守卫
onBeforeMount(async () => {
  if (!authStore.isAuthenticated) {
    alert('请先登录')
    router.replace({
      path: '/login',
      query: { redirect: '/profile' }
    })
    return
  }
})

// 修改加载用户数据的逻辑
const loadUserData = async () => {
  try {
    isLoading.value = true
    if (!authStore.token) {
      throw new Error('未登录状态')
    }

    const userData = await authStore.getUserInfo()
    if (!userData) {
      throw new Error('获取用户信息失败')
    }

    // 更新表单数据
    formData.value = {
      username: userData.username || '',
      nickname: userData.nickname || '',
      email: userData.email || '',
      phone: userData.phone || '',
      gender: userData.gender?.toString() || '0',
      avatarUrl: userData.avatarUrl || defaultImage,
      bio: userData.bio || '',
      status: userData.status || 1,
      createTime: userData.createTime || '',
      updateTime: userData.updateTime || ''
    }
    // 保存原始数据
    originalData.value = { ...formData.value }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    router.replace({
      path: '/login',
      query: { redirect: '/profile' }
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUserData()
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// 修改表单提交处理
const handleSubmit = async () => {
  if (!isFormChanged.value) return
  
  try {
    isSaving.value = true
    await authStore.updateProfile({
      nickname: formData.value.nickname,
      email: formData.value.email,
      phone: formData.value.phone,
      gender: parseInt(formData.value.gender),
      bio: formData.value.bio
    })
    
    // 更新原始数据
    originalData.value = { ...formData.value }
    user.value = await authStore.getUserInfo()
    alert('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    alert(error.message || '保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}

// 处理头像上传
const triggerFileInput = () => {
  fileInput.value.click()
}

const handleAvatarChange = async (event) => {
  const files = event.target.files
  if (!files || !files[0]) return
  
  const file = files[0]

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  // 验证文件大小（2MB）
  if (file.size > 2 * 1024 * 1024) {
    alert('图片大小不能超过 2MB')
    return
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    await authStore.uploadAvatar(formData)
    await loadUserData() // 重新加载用户数据以更新头像
  } catch (error) {
    console.error('上传头像失败:', error)
    alert(error.message || '上传失败，请重试')
  } finally {
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await authStore.logout()
    router.replace('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
    alert('退出登录失败，请重试')
  }
}

// 处理关闭
const handleClose = () => {
  // 如果正在保存，不允许关闭
  if (isSaving.value) return
  
  router.back()
}

// 添加修改密码相关的响应式变量
const showPasswordModal = ref(false)
const isChangingPassword = ref(false)
const passwordError = ref('')
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 验证密码表单
const isPasswordFormValid = computed(() => {
  return (
    passwordForm.value.oldPassword &&
    passwordForm.value.newPassword &&
    passwordForm.value.confirmPassword &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword
  )
})

// 处理修改密码
const handleChangePassword = async () => {
  if (!isPasswordFormValid.value) {
    passwordError.value = '请确保两次输入的新密码一致'
    return
  }

  try {
    isChangingPassword.value = true
    await authStore.updatePassword({
      user: {
        username: formData.value.username,
        // 其他需要的用户信息...
      },
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    
    alert('密码修改成功')
    closePasswordModal()
  } catch (error) {
    console.error('修改密码失败:', error)
    passwordError.value = error.message || '修改密码失败，请重试'
  } finally {
    isChangingPassword.value = false
  }
}

// 关闭密码修改弹窗
const closePasswordModal = () => {
  showPasswordModal.value = false
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordError.value = ''
}

// 添加 ESC 键返回功能
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && !isSaving.value) {
    handleClose()
  }
}

// 添加日期格式化函数
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 添加注销相关的响应式变量
const showDeleteConfirm = ref(false)
const deleteConfirmText = ref('')
const deleteConfirmText2 = ref('')
const firstConfirmDone = ref(false)
const isDeleting = ref(false)
const deleteError = ref('')

// 分别验证第一次和第二次确认
const isFirstConfirmValid = computed(() => {
  return deleteConfirmText.value === '确认注销'
})

const isSecondConfirmValid = computed(() => {
  return deleteConfirmText2.value === '确认注销'
})

// 按钮文本计算属性
const getButtonText = computed(() => {
  if (isDeleting.value) return '注销中...'
  if (!firstConfirmDone.value) return '下一步'
  return '确认注销'
})

// 修改处理注销确认的方法
const handleDeleteConfirm = async () => {
  deleteError.value = ''
  
  // 第一次确认
  if (!firstConfirmDone.value) {
    if (deleteConfirmText.value === '确认注销') {
      firstConfirmDone.value = true
      deleteConfirmText.value = '' // 清空第一次的输入
      // 自动聚焦第二个输入框
      nextTick(() => {
        if (secondInput.value) {
          secondInput.value.focus()
        }
      })
      return
    } else {
      deleteError.value = '请正确输入"确认注销"'
      return
    }
  }
  
  // 第二次确认
  if (deleteConfirmText2.value !== '确认注销') {
    deleteError.value = '请正确输入"确认注销"'
    return
  }

  try {
    isDeleting.value = true
    
    // 确保用户已登录且有 token
    if (!authStore.token) {
      throw new Error('未登录状态')
    }

    await authStore.deleteAccount()
    alert('账号已成功注销')
    router.replace('/login')
  } catch (error) {
    console.error('注销失败:', error)
    deleteError.value = error.message || '注销失败，请重试'
  } finally {
    isDeleting.value = false
    if (!deleteError.value) {
      closeDeleteModal()
    }
  }
}

// 关闭弹窗时重置所有状态
const closeDeleteModal = () => {
  showDeleteConfirm.value = false
  deleteConfirmText.value = ''
  deleteConfirmText2.value = ''
  firstConfirmDone.value = false
  deleteError.value = ''
  isDeleting.value = false
}

// 在其他 ref 声明的地方添加
const secondInput = ref(null)

// 添加状态文本获取函数
const getStatusText = (status) => {
  const statusMap = {
    0: '已禁用',
    1: '正常',
    2: '已锁定'
  }
  return statusMap[status] || '未知状态'
}
</script>

<style scoped>
.profile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.profile-modal {
  background: #1a1a1a;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
}

.profile-container {
  background: #1a1a1a;
  color: white;
  padding: 20px;
  border-radius: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
}

.avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #1db954;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
}

.form-group input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status-normal {
  color: #1db954 !important;
}

.save-btn {
  width: 100%;
  padding: 14px;
  background: #1db954;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background: #1ed760;
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .profile-container {
    margin: 0;
    border-radius: 0;
  }
}

/* 添加注销相关样式 */
.danger-zone {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.danger-zone h3 {
  color: #ff4466;
  margin-bottom: 16px;
}

.delete-account-btn {
  width: 100%;
  padding: 14px;
  background: rgba(255, 68, 102, 0.1);
  color: #ff4466;
  border: 1px solid #ff4466;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.delete-account-btn:hover {
  background: rgba(255, 68, 102, 0.2);
  transform: translateY(-2px);
}

.delete-account-btn i {
  font-size: 18px;
}

/* 注销确认弹窗样式 */
.delete-modal-content {
  padding: 20px;
  text-align: center;
  color: white;
}

.warning-icon {
  font-size: 48px;
  color: #ff4466;
  margin-bottom: 20px;
}

.warning-icon i {
  animation: shake 0.5s ease-in-out;
}

.delete-modal-content h3 {
  color: #ff4466;
  margin-bottom: 16px;
  font-size: 20px;
}

.warning-list {
  text-align: left;
  background: rgba(255, 68, 102, 0.1);
  padding: 16px 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.warning-list p {
  margin: 0 0 8px;
  color: #ff4466;
  font-weight: 500;
}

.warning-list ul {
  margin: 0;
  padding-left: 20px;
  color: rgba(255, 255, 255, 0.8);
}

.warning-list li {
  margin: 8px 0;
}

.warning-text {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 16px 0;
}

.confirm-input {
  margin-top: 24px;
}

.input-label {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  font-size: 14px;
}

.confirm-input input {
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 68, 102, 0.3);
  border-radius: 8px;
  color: white;
  text-align: center;
  font-size: 16px;
  transition: all 0.3s ease;
}

.confirm-input input:focus {
  border-color: #ff4466;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 68, 102, 0.2);
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
  background: #ff4466;
  border: none;
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  background: #ff5577;
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

.error-message {
  color: #ff4466;
  margin-top: 16px;
  font-size: 14px;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* 性别选择框美化 */
.gender-select {
  width: 100%;
  padding: 12px;
  background: rgba(40, 40, 40, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px;
}

.gender-select:focus {
  border-color: #1db954;
  outline: none;
  box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.2);
}

.gender-select option {
  background: #282828;
  color: white;
  padding: 12px;
}

/* 保存按钮状态样式 */
.save-btn {
  width: 100%;
  padding: 14px;
  background: #1db954;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn-disabled {
  background: #404040;
  cursor: not-allowed;
  transform: none !important;
}

.save-btn:not(.save-btn-disabled):hover {
  background: #1ed760;
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.7;
}
</style> 