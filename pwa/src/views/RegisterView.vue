<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const roles = ref('user')
const error = ref('')
const success = ref('')

function handleRegister() {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Password tidak cocok'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Password minimal 6 karakter'
    return
  }
  try {
    authStore.register(username.value, password.value, roles.value)
    success.value = 'Registrasi berhasil! Silakan login.'
    setTimeout(() => router.push('/login'), 2000)
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div style="text-align:center; margin-bottom:32px;">
        <div style="font-size:48px; margin-bottom:12px;">&#128230;</div>
        <h1 style="font-size:24px; font-weight:700; color:#1a237e; margin:0;">Daftar Akun Baru</h1>
      </div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" class="form-control" placeholder="Masukkan username" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" class="form-control" placeholder="Minimal 6 karakter" required />
        </div>
        <div class="form-group">
          <label>Konfirmasi Password</label>
          <input v-model="confirmPassword" type="password" class="form-control" placeholder="Ulangi password" required />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select v-model="roles" class="form-control">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; padding:12px;">Daftar</button>
      </form>
      <p style="text-align:center; margin-top:16px; font-size:14px; color:#888;">
        Sudah punya akun? <router-link to="/login" style="color:#1976D2;">Masuk</router-link>
      </p>
    </div>
  </div>
</template>
