<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="avatar-section">
        <img :src="user?.avatarUrl || '/default-avatar.png'" :alt="user?.nickname" class="avatar">
        <button class="edit-avatar" @click="triggerFileInput">
          <i class="fas fa-camera"></i>
        </button>
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          style="display: none"
          @change="handleAvatarChange"
        >
      </div>
      <div class="user-info">
        <h2>{{ user?.nickname || '未设置昵称' }}</h2>
        <p class="username">@{{ user?.username }}</p>
      </div>
    </div>

    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-value">{{ user?.playlistCount || 0 }}</div>
        <div class="stat-label">创建的歌单</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ user?.followingCount || 0 }}</div>
        <div class="stat-label">关注</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ user?.followerCount || 0 }}</div>
        <div class="stat-label">粉丝</div>
      </div>
    </div>

    <div class="bio-section">
      <h3>个人简介</h3>
      <p>{{ user?.bio || '这个人很懒，什么都没写~' }}</p>
    </div>

    <div class="action-buttons">
      <button class="edit-profile" @click="$router.push('/profile')">
        <i class="fas fa-edit"></i>
        编辑资料
      </button>
      <button class="settings" @click="$router.push('/settings')">
        <i class="fas fa-cog"></i>
        设置
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      // 这里添加上传头像的逻辑
      emit('update', { avatarUrl: 'new-avatar-url' })
    } catch (error) {
      console.error('Failed to upload avatar:', error)
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
}

.avatar-section {
  position: relative;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1db954;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid #121212;
}

.user-info h2 {
  margin-bottom: 8px;
  font-size: 28px;
}

.username {
  color: #b3b3b3;
  font-size: 16px;
}

.stats-section {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  padding: 20px;
  background: #282828;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  color: #b3b3b3;
  font-size: 14px;
}

.bio-section {
  margin-bottom: 40px;
  padding: 20px;
  background: #282828;
  border-radius: 8px;
}

.bio-section h3 {
  margin-bottom: 10px;
  color: #b3b3b3;
}

.action-buttons {
  display: flex;
  gap: 20px;
}

.edit-profile,
.settings {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 500;
}

.edit-profile {
  background: #1db954;
  color: white;
}

.settings {
  background: transparent;
  border: 1px solid #b3b3b3;
  color: #b3b3b3;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .stats-section {
    flex-direction: column;
    gap: 20px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style> 