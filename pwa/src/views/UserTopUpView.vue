<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useSaldoStore } from '../stores/saldo'

const authStore = useAuthStore()
const saldoStore = useSaldoStore()

const nominal = ref(50000)
const metode = ref('Transfer Bank')
const success = ref('')
const error = ref('')

const myTopup = computed(() =>
  saldoStore.topupRequests.filter(t => t.id_login === authStore.user?.id).slice().reverse()
)

function submitTopup() {
  error.value = ''
  if (nominal.value < 10000) {
    error.value = 'Minimal top up Rp 10.000'
    return
  }
  saldoStore.requestTopUp(
    authStore.user.id,
    authStore.user.nama || authStore.user.username,
    nominal.value,
    metode.value
  )
  success.value = 'Permintaan top up ' + formatRupiah(nominal.value) + ' berhasil diajukan!'
  nominal.value = 50000
  setTimeout(() => success.value = '', 3000)
}

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
    <h2 style="margin-bottom:24px; color:#333;">&#128176; Top Up Saldo</h2>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:24px;">
      <div class="card">
        <h3 style="margin-top:0;">Form Top Up</h3>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="success" class="alert alert-success">{{ success }}</div>
        <form @submit.prevent="submitTopup">
          <div class="form-group">
            <label>Nominal (Rp)</label>
            <input v-model.number="nominal" type="number" class="form-control" min="10000" step="10000" required />
          </div>
          <div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap;">
            <button v-for="n in [50000,100000,200000,500000]" :key="n" type="button"
              class="btn btn-sm"
              :style="nominal === n ? 'background:#1976D2;color:white;' : 'background:#e0e0e0;'"
              @click="nominal = n">
              {{ formatRupiah(n) }}
            </button>
          </div>
          <div class="form-group">
            <label>Metode Pembayaran</label>
            <select v-model="metode" class="form-control">
              <option>Transfer Bank</option>
              <option>QRIS</option>
              <option>OVO</option>
              <option>GoPay</option>
              <option>Dana</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;">Ajukan Top Up</button>
        </form>
      </div>
      <div class="card">
        <h3 style="margin-top:0;">Informasi Pembayaran</h3>
        <div style="background:#f5f5f5; border-radius:8px; padding:16px; margin-bottom:16px;">
          <p style="margin:0 0 8px; font-weight:600;">Transfer Bank</p>
          <p style="margin:0 0 4px; font-size:14px;">Bank BCA: 1234567890</p>
          <p style="margin:0 0 4px; font-size:14px;">Bank Mandiri: 0987654321</p>
          <p style="margin:0; font-size:12px; color:#888;">a.n. Sistem Peminjaman Barang</p>
        </div>
        <div style="background:#f5f5f5; border-radius:8px; padding:16px;">
          <p style="margin:0 0 8px; font-weight:600;">QRIS / E-Wallet</p>
          <p style="margin:0; font-size:14px; color:#888;">Scan QR Code di kasir atau hubungi admin</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 style="margin:0;">&#128203; Riwayat Top Up</h3>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr><th>#</th><th>Nominal</th><th>Metode</th><th>Kode Bayar</th><th>Tanggal</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr v-if="myTopup.length === 0">
              <td colspan="6" style="text-align:center; color:#aaa; padding:24px;">Belum ada riwayat top up</td>
            </tr>
            <tr v-for="(t, i) in myTopup" :key="t.id">
              <td>{{ i + 1 }}</td>
              <td><strong>{{ formatRupiah(t.nominal) }}</strong></td>
              <td>{{ t.metode_bayar }}</td>
              <td><code>{{ t.kode_bayar }}</code></td>
              <td>{{ t.tanggal }}</td>
              <td><span :class="['badge', statusBadge(t.status)]">{{ t.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>
