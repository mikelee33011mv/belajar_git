<script setup>
import { computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { usePeminjamanStore } from '../stores/peminjaman'

const authStore = useAuthStore()
const peminjamanStore = usePeminjamanStore()

const myPeminjaman = computed(() =>
  peminjamanStore.peminjaman.filter(p => p.id_login === authStore.user?.id)
)

const stats = computed(() => ({
  aktif: myPeminjaman.value.filter(p => p.status === 'disetujui').length,
  pending: myPeminjaman.value.filter(p => p.status === 'pending').length,
  selesai: myPeminjaman.value.filter(p => p.status === 'dikembalikan').length,
  total: myPeminjaman.value.reduce((s, p) => s + (p.total || 0), 0),
}))

function statusBadge(status) {
  const map = { pending: 'badge-warning', disetujui: 'badge-info', dikembalikan: 'badge-success', ditolak: 'badge-danger' }
  return map[status] || 'badge-info'
}

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}

const recentHistory = computed(() => myPeminjaman.value.slice(-3).reverse())
</script>

<template>
  <AppLayout>
    <h2 style="margin-bottom:8px; color:#333;">&#127968; Dashboard</h2>
    <p style="color:#888; margin-bottom:24px;">Selamat datang, <strong>{{ authStore.user?.nama || authStore.user?.username }}</strong>!</p>

    <div class="stats-grid" style="margin-bottom:24px;">
      <div class="stat-card">
        <div class="stat-icon" style="background:#E3F2FD;">&#128203;</div>
        <div class="stat-info">
          <h3>{{ stats.aktif }}</h3>
          <p style="color:#888; margin:0; font-size:14px;">Sedang Dipinjam</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#FFF8E1;">&#9203;</div>
        <div class="stat-info">
          <h3>{{ stats.pending }}</h3>
          <p style="color:#888; margin:0; font-size:14px;">Menunggu Persetujuan</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#E8F5E9;">&#9989;</div>
        <div class="stat-info">
          <h3>{{ stats.selesai }}</h3>
          <p style="color:#888; margin:0; font-size:14px;">Selesai Dikembalikan</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#F3E5F5;">&#128176;</div>
        <div class="stat-info">
          <h3 style="font-size:18px;">{{ formatRupiah(stats.total) }}</h3>
          <p style="color:#888; margin:0; font-size:14px;">Total Peminjaman</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 style="margin:0;">&#128203; Riwayat Terakhir</h3>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr><th>Barang</th><th>Tgl Pinjam</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr v-if="recentHistory.length === 0">
              <td colspan="4" style="text-align:center; color:#aaa; padding:24px;">Belum ada riwayat peminjaman</td>
            </tr>
            <tr v-for="p in recentHistory" :key="p.id">
              <td>{{ p.nama_barang }}</td>
              <td>{{ p.tgl_peminjaman }}</td>
              <td>{{ formatRupiah(p.total) }}</td>
              <td><span :class="['badge', statusBadge(p.status)]">{{ p.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>
