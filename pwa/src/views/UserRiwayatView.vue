<script setup>
import { computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { usePeminjamanStore } from '../stores/peminjaman'

const authStore = useAuthStore()
const peminjamanStore = usePeminjamanStore()

const myPeminjaman = computed(() =>
  peminjamanStore.peminjaman
    .filter(p => p.id_login === authStore.user?.id)
    .slice().reverse()
)

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
    <h2 style="margin-bottom:24px; color:#333;">&#128203; Riwayat Peminjaman</h2>
    <div class="card">
      <div class="card-header">
        <span>Riwayat Anda ({{ myPeminjaman.length }} transaksi)</span>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Barang</th>
              <th>Tgl Ajuan</th>
              <th>Tgl Pinjam</th>
              <th>Tgl Kembali</th>
              <th>Hari</th>
              <th>Total</th>
              <th>Denda</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="myPeminjaman.length === 0">
              <td colspan="9" style="text-align:center; color:#aaa; padding:32px;">Belum ada riwayat peminjaman</td>
            </tr>
            <tr v-for="(p, i) in myPeminjaman" :key="p.id">
              <td>{{ i + 1 }}</td>
              <td><strong>{{ p.nama_barang }}</strong></td>
              <td>{{ p.tanggal_ajuan }}</td>
              <td>{{ p.tgl_peminjaman }}</td>
              <td>{{ p.tgal_kembali }}</td>
              <td>{{ p.jmlh_hari_pinjam }}</td>
              <td>{{ formatRupiah(p.total) }}</td>
              <td>
                <span v-if="p.denda > 0" style="color:#f44336;">{{ formatRupiah(p.denda) }}</span>
                <span v-else style="color:#aaa;">-</span>
              </td>
              <td><span :class="['badge', statusBadge(p.status)]">{{ p.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>
