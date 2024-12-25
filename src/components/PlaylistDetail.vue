<template>
  <div class="playlist-detail">
    <div class="playlist-header">
      <img :src="playlist.coverUrl" :alt="playlist.name" class="playlist-cover">
      <div class="playlist-info">
        <h2>{{ playlist.name }}</h2>
        <p class="description">{{ playlist.description }}</p>
        <div class="stats">
          <span>{{ playlist.songCount }}首歌曲</span>
          <span>播放{{ playlist.playCount }}次</span>
        </div>
      </div>
    </div>

    <div class="playlist-actions">
      <button class="play-all" @click="playAll">
        <i class="fas fa-play"></i>
        播放全部
      </button>
      <button class="add-to-favorite" @click="toggleFavorite">
        <i :class="['fas', isFavorite ? 'fa-heart' : 'fa-heart-o']"></i>
        {{ isFavorite ? '已收藏' : '收藏' }}
      </button>
    </div>

    <div class="song-list">
      <table>
        <thead>
          <tr>
            <th class="index">#</th>
            <th class="title">歌曲</th>
            <th class="artist">歌手</th>
            <th class="album">专辑</th>
            <th class="duration">时长</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(song, index) in playlist.songs" 
            :key="song.id"
            @dblclick="playSong(song)"
            :class="{ active: currentSong?.id === song.id }"
          >
            <td class="index">{{ index + 1 }}</td>
            <td class="title">
              <div class="song-info">
                <img :src="song.coverUrl" :alt="song.name" class="song-cover">
                <span>{{ song.name }}</span>
              </div>
            </td>
            <td class="artist">{{ song.artist }}</td>
            <td class="album">{{ song.album }}</td>
            <td class="duration">{{ formatDuration(song.duration) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  },
  currentSong: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['play-song'])

const isFavorite = ref(false)

const playAll = () => {
  if (props.playlist.songs?.length) {
    emit('play-song', props.playlist.songs[0])
  }
}

const playSong = (song) => {
  emit('play-song', song)
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.playlist-detail {
  padding: 20px;
}

.playlist-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.playlist-cover {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.playlist-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.playlist-info h2 {
  margin-bottom: 10px;
  font-size: 24px;
}

.description {
  color: #b3b3b3;
  margin-bottom: 10px;
}

.stats {
  display: flex;
  gap: 20px;
  color: #b3b3b3;
  font-size: 14px;
}

.playlist-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.play-all,
.add-to-favorite {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 20px;
  font-weight: 500;
}

.play-all {
  background-color: #1db954;
  color: white;
}

.add-to-favorite {
  background-color: transparent;
  border: 1px solid #b3b3b3;
  color: #b3b3b3;
}

.song-list {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 10px;
  border-bottom: 1px solid #404040;
  color: #b3b3b3;
  font-weight: normal;
}

td {
  padding: 10px;
  border-bottom: 1px solid #282828;
}

tr:hover {
  background-color: #282828;
}

tr.active {
  background-color: #333333;
}

.song-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.song-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.index {
  width: 50px;
  color: #b3b3b3;
}

.title {
  min-width: 300px;
}

.artist,
.album {
  min-width: 150px;
  color: #b3b3b3;
}

.duration {
  width: 80px;
  color: #b3b3b3;
}

@media (max-width: 768px) {
  .playlist-header {
    flex-direction: column;
  }

  .playlist-cover {
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }

  .playlist-info {
    text-align: center;
  }

  .stats {
    justify-content: center;
  }

  .playlist-actions {
    justify-content: center;
  }
}
</style> 