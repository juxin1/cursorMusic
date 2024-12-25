<template>
  <header class="header">
    <div class="header-left">
      <button class="back-btn" @click="$router.back()" v-if="showBackButton">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1 class="page-title">{{ title }}</h1>
    </div>

    <div class="user-info">
      <img :src="user?.avatarUrl || defaultImage" :alt="user?.nickname" class="avatar">
      <span class="username">{{ user?.nickname || '未设置昵称' }}</span>
      <button class="settings-btn" @click="showSettings = !showSettings">
        <i class="fas fa-cog"></i>
      </button>
      
      <!-- 设置菜单 -->
      <div v-if="showSettings" class="settings-menu" @click.stop>
        <div class="menu-item" @click="navigateToProfile">
          <i class="fas fa-user"></i>
          个人资料
        </div>
        <div class="menu-item" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          退出登录
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import defaultImage from '@/assets/images/default.jpg'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBackButton: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const userStore = useUserStore()
const user = ref(null)
const showSettings = ref(false)

// 点击外部关闭设置菜单
const handleClickOutside = (event) => {
  if (showSettings.value) {
    showSettings.value = false
  }
}

onMounted(async () => {
  user.value = await userStore.getCurrentUser()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const navigateToProfile = () => {
  router.push('/profile')
  showSettings.value = false
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-size: 0.9rem;
}

.settings-btn {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0.5rem;
}

.settings-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #282828;
  border-radius: 4px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  min-width: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.menu-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu-item:hover {
  background-color: #383838;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .username {
    display: none;
  }
}
</style> 