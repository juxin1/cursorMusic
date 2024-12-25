<template>
  <header class="user-header">
    <div class="left-section">
      <button class="menu-btn" @click="toggleSidebar" v-if="isMobile">
        <i class="fas fa-bars"></i>
      </button>
      <div class="navigation">
        <button @click="$router.go(-1)" class="nav-btn">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button @click="$router.go(1)" class="nav-btn">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <div class="user-section" @click="showUserMenu = !showUserMenu">
      <img 
        :src="user?.avatarUrl || '/default-avatar.png'" 
        :alt="user?.nickname || '用户头像'"
        class="user-avatar"
      >
      <span class="user-name">{{ user?.nickname || '未登录' }}</span>
      <i class="fas fa-chevron-down"></i>

      <!-- 用户菜单 -->
      <div class="user-menu" v-if="showUserMenu" @click.stop>
        <div class="menu-item" @click="navigateToProfile">
          <i class="fas fa-user"></i>
          个人资料
        </div>
        <div class="menu-item" @click="navigateToSettings">
          <i class="fas fa-cog"></i>
          设置
        </div>
        <div class="divider"></div>
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

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['logout'])
const router = useRouter()
const showUserMenu = ref(false)
const isMobile = ref(window.innerWidth <= 768)

// 处理窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 点击外部关闭用户菜单
  document.addEventListener('click', () => {
    showUserMenu.value = false
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const toggleSidebar = () => {
  document.querySelector('.sidebar').classList.toggle('active')
}

const navigateToProfile = () => {
  router.push('/profile')
  showUserMenu.value = false
}

const navigateToSettings = () => {
  router.push('/settings')
  showUserMenu.value = false
}

const handleLogout = () => {
  emit('logout')
  showUserMenu.value = false
}
</script>

<style scoped>
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn,
.nav-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.menu-btn:hover,
.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navigation {
  display: flex;
  gap: 8px;
}

.user-section {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-section:hover {
  background-color: rgba(0, 0, 0, 0.9);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: #282828;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  min-width: 200px;
  z-index: 1000;
}

.menu-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #333333;
}

.divider {
  height: 1px;
  background-color: #404040;
  margin: 4px 0;
}

@media (max-width: 768px) {
  .user-header {
    padding: 12px 16px;
  }

  .navigation {
    display: none;
  }
}
</style> 