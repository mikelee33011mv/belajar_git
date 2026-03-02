<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useSaldoStore } from '../stores/saldo'

const saldoStore = useSaldoStore()
const filter = ref('semua')

const filtered = computed(() => {
  if (filter.value === 'semua') return saldoStore.topupRequests
  return saldoStore.topupRequests.filter(t => t.status === filter.value)
})

function statusBadge(status) {
  const map = { pending: 'badge-warning', disetujui: 'badge-success', ditolak: 'badge-danger' }
  return map[status] || 'badge-info'
}

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}
</script>

<template>
  <AppLayout>
    <h2 style="margin-bottom:24px; color:#333;">&#128176; Konfirmasi Top Up</h2>
    <div class="card">
      <div class="card-header">
        <span>Permintaan Top Up ({{ filtered.length }})</span>
        <div style="display:flex; gap:8px;">
          <button v-for="f in ['semua','pending','disetujui','ditolak']" :key="f"
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
              <th>Nama</th>
              <th>Nominal</th>
              <th>Metode Bayar</th>
              <th>Kode Bayar</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="8" style="text-align:center; color:#aaa; padding:32px;">Tidak ada data</td>
            </tr>
            <tr v-for="(t, i) in filtered" :key="t.id">
              <td>{{ i + 1 }}</td>
              <td>{{ t.nama }}</td>
              <td>{{ formatRupiah(t.nominal) }}</td>
              <td>{{ t.metode_bayar }}</td>
              <td><code>{{ t.kode_bayar }}</code></td>
              <td>{{ t.tanggal }}</td>
              <td><span :class="['badge', statusBadge(t.status)]">{{ t.status }}</span></td>
              <td>
                <div v-if="t.status === 'pending'" style="display:flex; gap:4px;">
                  <button class="btn btn-success btn-sm" @click="saldoStore.approveTopUp(t.id)">&#9989;</button>
                  <button class="btn btn-danger btn-sm" @click="saldoStore.rejectTopUp(t.id)">&#10060;</button>
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
