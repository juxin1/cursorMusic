<template>
  <div class="audio-player">
    <!-- 左侧：当前播放歌曲信息 -->
    <div class="now-playing">
      <img 
        :src="currentSong?.coverUrl || defaultImage" 
        :alt="currentSong?.name"
        class="song-cover"
      >
      <div class="song-info">
        <div class="song-name">{{ currentSong?.name || '未播放' }}</div>
        <div class="artist-name">{{ currentSong?.artist || '-' }}</div>
      </div>
      <button class="like-btn" @click="toggleLike">
        <i :class="['fas', isLiked ? 'fa-heart' : 'fa-heart-o']"></i>
      </button>
    </div>

    <!-- 中间：播放控制 -->
    <div class="player-controls">
      <div class="control-buttons">
        <button class="control-btn" @click="handleShuffle">
          <i :class="['fas fa-random', { active: isShuffled }]"></i>
        </button>
        <button class="control-btn" @click="handlePrev">
          <i class="fas fa-step-backward"></i>
        </button>
        <button class="play-btn" @click="togglePlay">
          <i :class="['fas', isPlaying ? 'fa-pause' : 'fa-play']"></i>
        </button>
        <button class="control-btn" @click="handleNext">
          <i class="fas fa-step-forward"></i>
        </button>
        <button class="control-btn" @click="handleRepeat">
          <i :class="['fas fa-repeat', { active: repeatMode }]"></i>
        </button>
      </div>

      <div class="progress-bar">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <div 
          class="progress-wrapper"
          ref="progressBar"
          @click="handleProgressClick"
        >
          <div 
            class="progress"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        <span class="time">{{ formatTime(duration) }}</span>
      </div>
    </div>

    <!-- 右侧：音量控制 -->
    <div class="volume-controls">
      <button class="volume-btn" @click="toggleMute">
        <i :class="['fas', volumeIcon]"></i>
      </button>
      <div 
        class="volume-slider"
        ref="volumeBar"
        @click="handleVolumeClick"
      >
        <div 
          class="volume-progress"
          :style="{ width: `${volume * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- 音频元素 -->
    <audio
      ref="audioElement"
      :src="currentSong?.url"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @ended="handleEnded"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import defaultImage from '@/assets/images/default.jpg'

const props = defineProps({
  currentSong: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:isPlaying', 'prev', 'next'])

// refs
const audioElement = ref(null)
const progressBar = ref(null)
const volumeBar = ref(null)

// 状态
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const isLiked = ref(false)
const isShuffled = ref(false)
const repeatMode = ref(0) // 0: 不重复, 1: 单曲循环, 2: 列表循环

// 计算属性
const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'fa-volume-off'
  if (volume.value < 0.5) return 'fa-volume-down'
  return 'fa-volume-up'
})

// 方法
const togglePlay = () => {
  if (!props.currentSong) return
  
  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
  isPlaying.value = !isPlaying.value
  emit('update:isPlaying', isPlaying.value)
}

const handleTimeUpdate = () => {
  currentTime.value = audioElement.value.currentTime
}

const handleLoadedMetadata = () => {
  duration.value = audioElement.value.duration
}

const handleEnded = () => {
  if (repeatMode.value === 1) {
    audioElement.value.currentTime = 0
    audioElement.value.play()
  } else {
    emit('next')
  }
}

const handleProgressClick = (event) => {
  const rect = progressBar.value.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  currentTime.value = percent * duration.value
  audioElement.value.currentTime = currentTime.value
}

const handleVolumeClick = (event) => {
  const rect = volumeBar.value.getBoundingClientRect()
  volume.value = (event.clientX - rect.left) / rect.width
  audioElement.value.volume = volume.value
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  audioElement.value.muted = isMuted.value
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
}

const handleShuffle = () => {
  isShuffled.value = !isShuffled.value
}

const handleRepeat = () => {
  repeatMode.value = (repeatMode.value + 1) % 3
}

const handlePrev = () => {
  emit('prev')
}

const handleNext = () => {
  emit('next')
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 监听器
watch(() => props.currentSong, (newSong) => {
  if (newSong && isPlaying.value) {
    audioElement.value?.play()
  }
})
</script>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: #282828;
  border-top: 1px solid #404040;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
}

.now-playing {
  flex: 1;
  min-width: 180px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.song-cover {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
}

.song-info {
  flex: 1;
}

.song-name {
  font-size: 14px;
  margin-bottom: 4px;
}

.artist-name {
  font-size: 12px;
  color: #b3b3b3;
}

.like-btn {
  color: #1db954;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.player-controls {
  flex: 2;
  max-width: 722px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn {
  color: #b3b3b3;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.control-btn:hover {
  color: #ffffff;
}

.control-btn .active {
  color: #1db954;
}

.play-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  color: black;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.play-btn:hover {
  transform: scale(1.1);
}

.progress-bar {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.time {
  font-size: 12px;
  color: #b3b3b3;
  min-width: 40px;
  text-align: center;
}

.progress-wrapper {
  flex: 1;
  height: 4px;
  background: #404040;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-wrapper:hover .progress {
  background: #1ed760;
}

.progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #1db954;
  border-radius: 2px;
  transition: background-color 0.3s;
}

.volume-controls {
  flex: 1;
  min-width: 180px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.volume-btn {
  color: #b3b3b3;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.volume-slider {
  width: 100px;
  height: 4px;
  background: #404040;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.volume-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #b3b3b3;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .audio-player {
    height: 60px;
    padding: 0 8px;
  }

  .song-cover {
    width: 40px;
    height: 40px;
  }

  .volume-controls {
    display: none;
  }

  .progress-bar {
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    padding: 0;
  }

  .time {
    display: none;
  }

  .progress-wrapper {
    border-radius: 0;
  }

  .control-buttons {
    gap: 8px;
  }

  .control-btn {
    padding: 4px;
  }

  .play-btn {
    width: 28px;
    height: 28px;
  }
}
</style> 