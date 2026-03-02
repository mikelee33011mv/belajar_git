<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useBarangStore } from '../stores/barang'
import { usePeminjamanStore } from '../stores/peminjaman'
import { useAuthStore } from '../stores/auth'

const barangStore = useBarangStore()
const peminjamanStore = usePeminjamanStore()
const authStore = useAuthStore()

const search = ref('')
const showModal = ref(false)
const selectedBarang = ref(null)
const success = ref('')

const form = ref({ tgl_peminjaman: '', tgal_kembali: '', jmlh_hari_pinjam: 1 })

const availableBarang = computed(() =>
  barangStore.barang.filter(b =>
    b.status_brg === 'tersedia' &&
    (b.nama_barang.toLowerCase().includes(search.value.toLowerCase()) ||
     b.kategori_brg.toLowerCase().includes(search.value.toLowerCase()))
  )
)

function openPinjam(barang) {
  selectedBarang.value = barang
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  form.value = { tgl_peminjaman: today, tgal_kembali: tomorrow, jmlh_hari_pinjam: 1 }
  showModal.value = true
}

function updateHari() {
  if (form.value.tgl_peminjaman && form.value.tgal_kembali) {
    const d1 = new Date(form.value.tgl_peminjaman)
    const d2 = new Date(form.value.tgal_kembali)
    form.value.jmlh_hari_pinjam = Math.max(1, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)))
  }
}

function submitPinjam() {
  peminjamanStore.addPeminjaman({
    id_login: authStore.user.id,
    id_barang: selectedBarang.value.id,
    nama_anggota: authStore.user.nama || authStore.user.username,
    nama_barang: selectedBarang.value.nama_barang,
    tgl_peminjaman: form.value.tgl_peminjaman,
    tgal_kembali: form.value.tgal_kembali,
    jmlh_hari_pinjam: form.value.jmlh_hari_pinjam,
  })
  showModal.value = false
  success.value = 'Permintaan peminjaman "' + selectedBarang.value.nama_barang + '" berhasil diajukan!'
  setTimeout(() => success.value = '', 3000)
}

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}

const estimasiTotal = computed(() => {
  if (!selectedBarang.value) return 0
  return selectedBarang.value.harga_sewa * form.value.jmlh_hari_pinjam
})
</script>

<template>
  <AppLayout>
    <h2 style="margin-bottom:24px; color:#333;">&#128230; Pinjam Barang</h2>
    <div v-if="success" class="alert alert-success">{{ success }}</div>
    <div class="card">
      <div class="card-header">
        <span>Barang Tersedia ({{ availableBarang.length }})</span>
        <input v-model="search" type="text" class="search-bar" placeholder="&#128269; Cari barang..." />
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px; margin-top:16px;">
        <div v-if="availableBarang.length === 0" style="grid-column:1/-1; text-align:center; color:#aaa; padding:32px;">
          Tidak ada barang tersedia
        </div>
        <div v-for="b in availableBarang" :key="b.id"
          style="border:1px solid #e0e0e0; border-radius:12px; padding:20px; background:white;">
          <div style="font-size:32px; margin-bottom:12px; text-align:center;">&#128230;</div>
          <h4 style="margin:0 0 8px; font-size:15px;">{{ b.nama_barang }}</h4>
          <p style="margin:0 0 4px; color:#888; font-size:13px;">{{ b.kategori_brg }}</p>
          <p style="margin:0 0 4px; font-size:13px;"><strong>Kode:</strong> {{ b.kode_barang }}</p>
          <p style="margin:0 0 12px; color:#1976D2; font-weight:600;">{{ formatRupiah(b.harga_sewa) }}/hari</p>
          <span class="badge badge-success" style="margin-bottom:12px; display:inline-block;">tersedia</span>
          <br/>
          <button class="btn btn-primary" style="width:100%; margin-top:8px;" @click="openPinjam(b)">
            Pinjam Sekarang
          </button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
      <div class="modal" style="max-width:460px;">
        <div class="modal-header">
          <h3 style="margin:0;">Form Peminjaman</h3>
          <button @click="showModal=false" style="background:none; border:none; font-size:20px; cursor:pointer;">&#x2715;</button>
        </div>
        <div style="background:#f5f5f5; border-radius:8px; padding:12px; margin-bottom:16px;">
          <p style="margin:0; font-weight:600;">{{ selectedBarang?.nama_barang }}</p>
          <p style="margin:4px 0 0; color:#888; font-size:13px;">{{ formatRupiah(selectedBarang?.harga_sewa) }}/hari</p>
        </div>
        <form @submit.prevent="submitPinjam">
          <div class="form-group">
            <label>Tanggal Pinjam</label>
            <input v-model="form.tgl_peminjaman" type="date" class="form-control" @change="updateHari" required />
          </div>
          <div class="form-group">
            <label>Tanggal Kembali (Rencana)</label>
            <input v-model="form.tgal_kembali" type="date" class="form-control" @change="updateHari" required />
          </div>
          <div class="form-group">
            <label>Jumlah Hari: <strong>{{ form.jmlh_hari_pinjam }} hari</strong></label>
          </div>
          <div style="background:#E3F2FD; border-radius:8px; padding:12px; margin-bottom:16px;">
            <p style="margin:0; font-size:14px;">Estimasi Total: <strong style="color:#1976D2;">{{ formatRupiah(estimasiTotal) }}</strong></p>
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end;">
            <button type="button" class="btn" @click="showModal=false" style="background:#e0e0e0;">Batal</button>
            <button type="submit" class="btn btn-primary">Ajukan Peminjaman</button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>
