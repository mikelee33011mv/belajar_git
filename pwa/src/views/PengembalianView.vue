<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { usePeminjamanStore } from '../stores/peminjaman'

const peminjamanStore = usePeminjamanStore()
const returnModal = ref(null)
const tglKembali = ref(new Date().toISOString().split('T')[0])

const activeLoans = computed(() =>
  peminjamanStore.peminjaman.filter(p => p.status === 'disetujui')
)

function openReturn(p) {
  returnModal.value = p
  tglKembali.value = new Date().toISOString().split('T')[0]
}

function doReturn() {
  if (returnModal.value) {
    peminjamanStore.returnBarang(returnModal.value.id, tglKembali.value)
    returnModal.value = null
  }
}

function previewDenda(p) {
  if (!p || !tglKembali.value) return 0
  return peminjamanStore.calculateDenda(p.tgal_kembali, tglKembali.value, p.harga_harian)
}

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}
</script>

<template>
  <AppLayout>
    <h2 style="margin-bottom:24px; color:#333;">&#8617;&#65039; Pengembalian Barang</h2>
    <div class="card">
      <div class="card-header">
        <span>Barang Yang Sedang Dipinjam ({{ activeLoans.length }})</span>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Anggota</th>
              <th>Barang</th>
              <th>Tgl Pinjam</th>
              <th>Tgl Kembali (Rencana)</th>
              <th>Total</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="activeLoans.length === 0">
              <td colspan="7" style="text-align:center; color:#aaa; padding:32px;">Tidak ada barang yang sedang dipinjam</td>
            </tr>
            <tr v-for="(p, i) in activeLoans" :key="p.id">
              <td>{{ i + 1 }}</td>
              <td>{{ p.nama_anggota }}</td>
              <td>{{ p.nama_barang }}</td>
              <td>{{ p.tgl_peminjaman }}</td>
              <td>{{ p.tgal_kembali }}</td>
              <td>{{ formatRupiah(p.total) }}</td>
              <td>
                <button class="btn btn-success btn-sm" @click="openReturn(p)">&#8617;&#65039; Kembalikan</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="returnModal" class="modal-overlay" @click.self="returnModal=null">
      <div class="modal" style="max-width:420px;">
        <div class="modal-header">
          <h3 style="margin:0;">Proses Pengembalian</h3>
          <button @click="returnModal=null" style="background:none; border:none; font-size:20px; cursor:pointer;">&#x2715;</button>
        </div>
        <p><strong>Barang:</strong> {{ returnModal.nama_barang }}</p>
        <p><strong>Peminjam:</strong> {{ returnModal.nama_anggota }}</p>
        <p><strong>Tgl Kembali Rencana:</strong> {{ returnModal.tgal_kembali }}</p>
        <div class="form-group">
          <label>Tanggal Kembali Aktual</label>
          <input v-model="tglKembali" type="date" class="form-control" />
        </div>
        <div v-if="previewDenda(returnModal) > 0" class="alert alert-danger">
          &#9888;&#65039; Denda keterlambatan: {{ formatRupiah(previewDenda(returnModal)) }}
        </div>
        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn" @click="returnModal=null" style="background:#e0e0e0;">Batal</button>
          <button class="btn btn-success" @click="doReturn">Konfirmasi Kembali</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
