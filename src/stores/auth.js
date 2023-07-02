import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    userName: ''
  }),
  actions: {
    setToken (token) {
      this.token = token
    },
    setUserName (userName) {
      this.userName = userName
    },
    clearAuthData () {
      this.token = ''
      this.userName = ''
    }
  },
  persist: true
})
