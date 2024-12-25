<template>
  <div class="home-layout">
    <header class="header">
      <h1 class="header-title">首页</h1>
      <button class="settings-btn" @click="showSettings = !showSettings" title="设置">
        <i class="fas fa-cog"></i>
      </button>
      
      <div v-if="showSettings" class="settings-menu">
        <div class="menu-item" @click="navigateToProfile">
          <i class="fas fa-user"></i>
          个人资料
        </div>
        <div class="menu-item" @click="navigateToSettings">
          <i class="fas fa-cog"></i>
          设置
        </div>
        <div class="menu-divider"></div>
        <div class="menu-item" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          退出登录
        </div>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 欢迎区域 -->
      <div class="welcome-section">
        <h2>欢迎回来，{{ user?.nickname || '用户' }}</h2>
        <p class="welcome-text">今天想听点什么？</p>
      </div>

      <!-- 快捷操作区域 -->
      <div class="quick-actions">
        <div class="action-card" @click="navigateToProfile">
          <div class="action-icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="action-text">个人资料</div>
        </div>
        <div class="action-card">
          <div class="action-icon">
            <i class="fas fa-heart"></i>
          </div>
          <div class="action-text">我喜欢的音乐</div>
        </div>
        <div class="action-card">
          <div class="action-icon">
            <i class="fas fa-history"></i>
          </div>
          <div class="action-text">最近播放</div>
        </div>
      </div>

      <!-- 推荐歌单 -->
      <section class="section">
        <h3 class="section-title">推荐歌单</h3>
        <div class="playlist-grid">
          <div v-for="i in 6" :key="i" class="playlist-card">
            <div class="playlist-cover">
              <img :src="defaultImage" alt="歌单封面">
              <div class="playlist-play">
                <i class="fas fa-play"></i>
              </div>
            </div>
            <div class="playlist-info">
              <div class="playlist-name">推荐歌单 {{ i }}</div>
              <div class="playlist-desc">这是一个很棒的歌单</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import defaultImage from '@/assets/images/default.jpg'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const user = ref(null)
const showSettings = ref(false)

onMounted(async () => {
  try {
    user.value = await userStore.getCurrentUser()
  } catch (error) {
    console.error('Failed to load user data:', error)
  }
})

const navigateToProfile = () => {
  showSettings.value = false
  router.push('/profile')
}

const navigateToSettings = () => {
  showSettings.value = false
  router.push('/settings')
}

const handleLogout = async () => {
  try {
    if (!confirm('确定要退出登录吗？')) {
      return
    }
    await authStore.logout()
    router.replace('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
    alert('退出登录失败，请重试')
  }
}

const closeSettings = (e) => {
  if (!e.target.closest('.settings-btn') && !e.target.closest('.settings-menu')) {
    showSettings.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeSettings)
})

onUnmounted(() => {
  document.removeEventListener('click', closeSettings)
})
</script>

<style scoped>
.home-layout {
  min-height: 100vh;
  background-color: #121212;
  color: #ffffff;
}

.main-content {
  padding: 6rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 3rem;
}

.welcome-text {
  color: #b3b3b3;
  margin-top: 0.5rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

.action-card {
  background-color: #282828;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-card:hover {
  background-color: #383838;
}

.action-icon {
  font-size: 2rem;
  color: #1db954;
  margin-bottom: 1rem;
}

.action-text {
  font-size: 0.9rem;
}

.section {
  margin-bottom: 3rem;
}

.section-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.playlist-card {
  cursor: pointer;
}

.playlist-cover {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.playlist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-play {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  width: 40px;
  height: 40px;
  background-color: #1db954;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s;
}

.playlist-card:hover .playlist-play {
  opacity: 1;
  transform: translateY(0);
}

.playlist-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.playlist-desc {
  font-size: 0.875rem;
  color: #b3b3b3;
}

@media (max-width: 768px) {
  .main-content {
    padding: 5rem 1rem 1rem;
  }

  .playlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
}

.header-title {
  margin: 0;
  font-size: 1.5rem;
}

.settings-btn {
  background: transparent;
  border: none;
  color: #fff;
  padding: 8px;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
}

.settings-btn:hover {
  opacity: 0.8;
}

.settings-menu {
  position: absolute;
  top: 100%;
  right: 2rem;
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
  color: #fff;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #383838;
}

.menu-item i {
  width: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }
  
  .settings-menu {
    right: 1rem;
    min-width: 180px;
  }
  
  .header-title {
    font-size: 1.2rem;
  }
}

.menu-divider {
  height: 1px;
  background-color: #404040;
  margin: 0.5rem 0;
}
</style> 