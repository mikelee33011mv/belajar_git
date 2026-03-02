import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const MOCK_USERS = [
  { id: 1, username: 'admin', password: 'admin123', roles: 'admin', nama: 'Administrator', saldo: 0 },
  { id: 2, username: 'user1', password: 'user123', roles: 'user', nama: 'User Pertama', saldo: 150000 },
]

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const token = ref(localStorage.getItem('auth_token') || null)

  const isAuthenticated = computed(() => !!user.value)

  function login(username, password) {
    const found = MOCK_USERS.find(u => u.username === username && u.password === password)
    if (!found) throw new Error('Username atau password salah')
    const { password: _, ...safeUser } = found
    user.value = safeUser
    token.value = 'mock-token-' + Date.now()
    localStorage.setItem('auth_user', JSON.stringify(safeUser))
    localStorage.setItem('auth_token', token.value)
    return safeUser
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  function register(username, password, roles) {
    const exists = MOCK_USERS.find(u => u.username === username)
    if (exists) throw new Error('Username sudah digunakan')
    const newUser = { id: Date.now(), username, password, roles, nama: username, saldo: 0 }
    MOCK_USERS.push(newUser)
    return true
  }

  return { user, token, isAuthenticated, login, logout, register }
})
