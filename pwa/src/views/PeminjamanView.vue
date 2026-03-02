<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { usePeminjamanStore } from '../stores/peminjaman'

const peminjamanStore = usePeminjamanStore()
const filter = ref('semua')

const filtered = computed(() => {
  if (filter.value === 'semua') return peminjamanStore.peminjaman
  return peminjamanStore.peminjaman.filter(p => p.status === filter.value)
})

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
    <h2 style="margin-bottom:24px; color:#333;">&#128203; Manajemen Peminjaman</h2>
    <div class="card">
      <div class="card-header">
        <span>Daftar Peminjaman ({{ filtered.length }})</span>
        <div style="display:flex; gap:8px;">
          <button v-for="f in ['semua','pending','disetujui','dikembalikan','ditolak']" :key="f"
            :class="['btn', 'btn-sm', filter === f ? 'btn-primary' : '']"
            :style="filter !== f ? 'background:#e0e0e0;' : ''"
            @click="filter = f">
            {{ f }}
          </button>
        </div>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Anggota</th>
              <th>Barang</th>
              <th>Tgl Pinjam</th>
              <th>Tgl Kembali</th>
              <th>Hari</th>
              <th>Total</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in filtered" :key="p.id">
              <td>{{ i + 1 }}</td>
              <td>{{ p.nama_anggota }}</td>
              <td>{{ p.nama_barang }}</td>
              <td>{{ p.tgl_peminjaman }}</td>
              <td>{{ p.tgal_kembali }}</td>
              <td>{{ p.jmlh_hari_pinjam }}</td>
              <td>{{ formatRupiah(p.total) }}</td>
              <td><span :class="['badge', statusBadge(p.status)]">{{ p.status }}</span></td>
              <td>
                <div v-if="p.status === 'pending'" style="display:flex; gap:4px;">
                  <button class="btn btn-success btn-sm" @click="peminjamanStore.approvePeminjaman(p.id)">&#9989; Setujui</button>
                  <button class="btn btn-danger btn-sm" @click="peminjamanStore.rejectPeminjaman(p.id)">&#10060; Tolak</button>
                </div>
                <span v-else style="color:#aaa; font-size:12px;">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>
