<script setup>
import { computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useBarangStore } from '../stores/barang'
import { usePeminjamanStore } from '../stores/peminjaman'
import { useAnggotaStore } from '../stores/anggota'

const barangStore = useBarangStore()
const peminjamanStore = usePeminjamanStore()
const anggotaStore = useAnggotaStore()

const stats = computed(() => ({
  totalBarang: barangStore.barang.length,
  tersedia: barangStore.barang.filter(b => b.status_brg === 'tersedia').length,
  dipinjam: barangStore.barang.filter(b => b.status_brg === 'dipinjam').length,
  anggota: anggotaStore.anggota.length,
}))

const recentPeminjaman = computed(() => peminjamanStore.peminjaman.slice(-5).reverse())

function statusBadge(status) {
  const map = { pending: 'badge-warning', disetujui: 'badge-info', dikembalikan: 'badge-success', ditolak: 'badge-danger' }
  return map[status] || 'badge-info'
}

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}
</script>

<template>
  <AppLayout>
    <h2 style="margin-bottom:24px; color:#333;">&#127968; Dashboard Admin</h2>
    <div class="stats-grid" style="margin-bottom:24px;">
      <div class="stat-card">
        <div class="stat-icon" style="background:#E3F2FD;">&#128230;</div>
        <div class="stat-info">
          <h3>{{ stats.totalBarang }}</h3>
          <p style="color:#888; margin:0; font-size:14px;">Total Barang</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#E8F5E9;">&#9989;</div>
        <div class="stat-info">
          <h3>{{ stats.tersedia }}</h3>
          <p style="color:#888; margin:0; font-size:14px;">Barang Tersedia</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#FFEBEE;">&#128308;</div>
        <div class="stat-info">
          <h3>{{ stats.dipinjam }}</h3>
          <p style="color:#888; margin:0; font-size:14px;">Sedang Dipinjam</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#F3E5F5;">&#128101;</div>
        <div class="stat-info">
          <h3>{{ stats.anggota }}</h3>
          <p style="color:#888; margin:0; font-size:14px;">Jumlah Anggota</p>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h3 style="margin:0;">&#128203; Peminjaman Terbaru</h3>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Anggota</th>
              <th>Barang</th>
              <th>Tgl Pinjam</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in recentPeminjaman" :key="p.id">
              <td>{{ p.nama_anggota }}</td>
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
