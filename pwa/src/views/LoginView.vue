<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const user = authStore.login(username.value, password.value)
    if (user.roles === 'admin') {
      router.push('/dashboard')
    } else {
      router.push('/user/dashboard')
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div style="text-align:center; margin-bottom:32px;">
        <div style="font-size:48px; margin-bottom:12px;">&#128230;</div>
        <h1 style="font-size:24px; font-weight:700; color:#1a237e; margin:0;">Sistem Peminjaman Barang</h1>
        <p style="color:#888; margin-top:8px;">Masuk ke akun Anda</p>
      </div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" class="form-control" placeholder="Masukkan username" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" class="form-control" placeholder="Masukkan password" required />
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; padding:12px;" :disabled="loading">
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>
      <p style="text-align:center; margin-top:16px; font-size:14px; color:#888;">
        Belum punya akun? <router-link to="/register" style="color:#1976D2;">Daftar</router-link>
      </p>
      <div style="margin-top:20px; padding:12px; background:#f5f5f5; border-radius:8px; font-size:12px; color:#666;">
        <strong>Demo:</strong><br/>
        Admin: admin / admin123<br/>
        User: user1 / user123
      </div>
    </div>
  </div>
</template>
