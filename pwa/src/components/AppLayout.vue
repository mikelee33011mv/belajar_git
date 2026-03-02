<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(true)

const adminLinks = [
  { to: '/dashboard', icon: '\u{1F3E0}', label: 'Dashboard' },
  { to: '/barang', icon: '\u{1F4E6}', label: 'Barang' },
  { to: '/peminjaman', icon: '\u{1F4CB}', label: 'Peminjaman' },
  { to: '/pengembalian', icon: '\u{21A9}\uFE0F', label: 'Pengembalian' },
  { to: '/anggota', icon: '\u{1F465}', label: 'Anggota' },
  { to: '/topup', icon: '\u{1F4B0}', label: 'Top Up' },
]

const userLinks = [
  { to: '/user/dashboard', icon: '\u{1F3E0}', label: 'Dashboard' },
  { to: '/user/pinjam', icon: '\u{1F4E6}', label: 'Pinjam Barang' },
  { to: '/user/riwayat', icon: '\u{1F4CB}', label: 'Riwayat Pinjam' },
  { to: '/user/topup', icon: '\u{1F4B0}', label: 'Top Up Saldo' },
]

const navLinks = computed(() => authStore.user?.roles === 'admin' ? adminLinks : userLinks)

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-container">
    <aside :class="['sidebar', { open: sidebarOpen }]">
      <div class="sidebar-header">
        <h2 style="font-size:16px; font-weight:700; color:white; margin:0;">&#128230; PinjamBarang</h2>
        <p style="font-size:12px; color:rgba(255,255,255,0.6); margin:4px 0 0 0;">Sistem Peminjaman</p>
      </div>
      <nav class="sidebar-nav">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="{ active: $route.path === link.to }"
        >
          <span>{{ link.icon }}</span>
          <span>{{ link.label }}</span>
        </router-link>
      </nav>
    </aside>
    <div class="main-content">
      <header class="topbar">
        <div style="display:flex; align-items:center; gap:12px;">
          <button class="hamburger" @click="sidebarOpen = !sidebarOpen">&#9776;</button>
          <h1 style="font-size:18px; font-weight:600; margin:0; color:#333;">Sistem Peminjaman Barang</h1>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:14px; color:#666;">&#128100; {{ authStore.user?.nama || authStore.user?.username }}</span>
          <button class="btn btn-danger btn-sm" @click="logout">Keluar</button>
        </div>
      </header>
      <main class="page-content">
        <slot />
      </main>
    </div>
  </div>
</template>
