<template>
  <div class="playlist-sidebar">
    <div class="sidebar-header">
      <h2>我的歌单</h2>
      <button class="add-playlist-btn" @click="showAddPlaylistModal = true">
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <div class="search-box">
      <input 
        type="text"
        v-model="searchQuery"
        placeholder="搜索歌单..."
        @input="filterPlaylists"
      >
    </div>

    <div class="playlists-container">
      <div 
        v-for="playlist in filteredPlaylists"
        :key="playlist.id"
        class="playlist-item"
        :class="{ active: selectedPlaylistId === playlist.id }"
        @click="selectPlaylist(playlist)"
      >
        <img :src="playlist.coverUrl" :alt="playlist.name" class="playlist-cover">
        <div class="playlist-info">
          <h3>{{ playlist.name }}</h3>
          <p>{{ playlist.songCount }}首歌曲</p>
        </div>
        <button 
          class="delete-btn"
          @click.stop="confirmDelete(playlist)"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <!-- 添加歌单弹窗 -->
    <modal v-if="showAddPlaylistModal" @close="showAddPlaylistModal = false">
      <template #header>
        <h3>创建新歌单</h3>
      </template>
      <template #body>
        <form @submit.prevent="handleAddPlaylist" class="add-playlist-form">
          <div class="form-group">
            <label for="playlistName">歌单名称</label>
            <input
              id="playlistName"
              v-model="newPlaylist.name"
              type="text"
              required
            >
          </div>
          <div class="form-group">
            <label for="playlistCover">封面图片</label>
            <input
              id="playlistCover"
              type="file"
              accept="image/*"
              @change="handleCoverUpload"
            >
          </div>
          <div class="form-group">
            <label for="playlistDesc">描述</label>
            <textarea
              id="playlistDesc"
              v-model="newPlaylist.description"
              rows="3"
            ></textarea>
          </div>
        </form>
      </template>
      <template #footer>
        <button @click="showAddPlaylistModal = false">取消</button>
        <button @click="handleAddPlaylist" class="primary">创建</button>
      </template>
    </modal>

    <!-- 删除确认弹窗 -->
    <modal v-if="showDeleteModal" @close="showDeleteModal = false">
      <template #header>
        <h3>删除歌单</h3>
      </template>
      <template #body>
        <p>确定要删除歌单"{{ playlistToDelete?.name }}"吗？</p>
      </template>
      <template #footer>
        <button @click="showDeleteModal = false">取消</button>
        <button @click="handleDeletePlaylist" class="danger">删除</button>
      </template>
    </modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Modal from './Modal.vue'

const props = defineProps({
  playlists: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select-playlist', 'delete-playlist'])

// 状态
const searchQuery = ref('')
const selectedPlaylistId = ref(null)
const showAddPlaylistModal = ref(false)
const showDeleteModal = ref(false)
const playlistToDelete = ref(null)
const newPlaylist = ref({
  name: '',
  description: '',
  coverFile: null
})

// 计算属性
const filteredPlaylists = computed(() => {
  if (!searchQuery.value) return props.playlists
  const query = searchQuery.value.toLowerCase()
  return props.playlists.filter(playlist => 
    playlist.name.toLowerCase().includes(query)
  )
})

// ��法
const selectPlaylist = (playlist) => {
  selectedPlaylistId.value = playlist.id
  emit('select-playlist', playlist)
}

const confirmDelete = (playlist) => {
  playlistToDelete.value = playlist
  showDeleteModal.value = true
}

const handleDeletePlaylist = () => {
  emit('delete-playlist', playlistToDelete.value.id)
  showDeleteModal.value = false
  playlistToDelete.value = null
}

const handleCoverUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newPlaylist.value.coverFile = file
  }
}

const handleAddPlaylist = async () => {
  // 这里实现添加歌单的逻辑
  showAddPlaylistModal.value = false
  newPlaylist.value = {
    name: '',
    description: '',
    coverFile: null
  }
}
</script>

<style scoped>
.playlist-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  color: #ffffff;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #282828;
}

.add-playlist-btn {
  background: none;
  border: none;
  color: #1db954;
  cursor: pointer;
  font-size: 1.5rem;
}

.search-box {
  padding: 15px;
}

.search-box input {
  width: 100%;
  padding: 8px;
  background-color: #282828;
  border: none;
  border-radius: 4px;
  color: #ffffff;
}

.playlists-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  background-color: #282828;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.playlist-item:hover {
  background-color: #333333;
}

.playlist-item.active {
  background-color: #333333;
  border-left: 4px solid #1db954;
}

.playlist-cover {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
}

.playlist-info {
  flex: 1;
}

.playlist-info h3 {
  margin: 0;
  font-size: 14px;
}

.playlist-info p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #b3b3b3;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4444;
  opacity: 0;
  transition: opacity 0.3s;
}

.playlist-item:hover .delete-btn {
  opacity: 1;
}

.add-playlist-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  background-color: #282828;
  border: 1px solid #404040;
  border-radius: 4px;
  color: #ffffff;
}
</style> 