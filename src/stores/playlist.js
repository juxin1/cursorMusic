import { defineStore } from 'pinia'
import axios from 'axios'

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlists: []
  }),

  actions: {
    async getUserPlaylists() {
      try {
        const response = await axios.get('/api/playlists')
        this.playlists = response.data.data
        return this.playlists
      } catch (error) {
        console.error('Failed to get playlists:', error)
        return []
      }
    },

    async deletePlaylist(playlistId) {
      try {
        await axios.delete(`/api/playlists/${playlistId}`)
        this.playlists = this.playlists.filter(p => p.id !== playlistId)
      } catch (error) {
        console.error('Failed to delete playlist:', error)
        throw error
      }
    }
  }
}) 