<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useBarangStore } from '../stores/barang'

const barangStore = useBarangStore()
const search = ref('')
const showModal = ref(false)
const editMode = ref(false)
const deleteConfirm = ref(null)

const form = ref({
  nama_barang: '', kode_barang: '', kategori_brg: '', status_brg: 'tersedia',
  harga_barang: 0, harga_sewa: 0, harga_vip: 0
})

const filtered = computed(() =>
  barangStore.barang.filter(b =>
    b.nama_barang.toLowerCase().includes(search.value.toLowerCase()) ||
    b.kode_barang.toLowerCase().includes(search.value.toLowerCase()) ||
    b.kategori_brg.toLowerCase().includes(search.value.toLowerCase())
  )
)

function openAdd() {
  editMode.value = false
  form.value = { nama_barang: '', kode_barang: '', kategori_brg: '', status_brg: 'tersedia', harga_barang: 0, harga_sewa: 0, harga_vip: 0 }
  showModal.value = true
}

function openEdit(item) {
  editMode.value = true
  form.value = { ...item }
  showModal.value = true
}

function saveBarang() {
  if (editMode.value) {
    barangStore.updateBarang(form.value.id, form.value)
  } else {
    barangStore.addBarang(form.value)
  }
  showModal.value = false
}

function confirmDelete(id) {
  deleteConfirm.value = id
}

function doDelete() {
  barangStore.deleteBarang(deleteConfirm.value)
  deleteConfirm.value = null
}

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}
</script>

<template>
  <AppLayout>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <h2 style="margin:0; color:#333;">&#128230; Manajemen Barang</h2>
      <button class="btn btn-primary" @click="openAdd">+ Tambah Barang</button>
    </div>
    <div class="card">
      <div class="card-header">
        <span>Daftar Barang ({{ filtered.length }})</span>
        <input v-model="search" type="text" class="search-bar" placeholder="&#128269; Cari barang..." />
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Barang</th>
              <th>Kode</th>
              <th>Kategori</th>
              <th>Status</th>
              <th>Harga Sewa/Hari</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(b, i) in filtered" :key="b.id">
              <td>{{ i + 1 }}</td>
              <td><strong>{{ b.nama_barang }}</strong></td>
              <td>{{ b.kode_barang }}</td>
              <td>{{ b.kategori_brg }}</td>
              <td>
                <span :class="['badge', b.status_brg === 'tersedia' ? 'badge-success' : 'badge-danger']">
                  {{ b.status_brg }}
                </span>
              </td>
              <td>{{ formatRupiah(b.harga_sewa) }}</td>
              <td style="display:flex; gap:6px;">
                <button class="btn btn-warning btn-sm" @click="openEdit(b)">&#9999;&#65039; Edit</button>
                <button class="btn btn-danger btn-sm" @click="confirmDelete(b.id)">&#128465;&#65039; Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
      <div class="modal">
        <div class="modal-header">
          <h3 style="margin:0;">{{ editMode ? 'Edit Barang' : 'Tambah Barang' }}</h3>
          <button @click="showModal=false" style="background:none; border:none; font-size:20px; cursor:pointer;">&#x2715;</button>
        </div>
        <form @submit.prevent="saveBarang">
          <div class="form-group">
            <label>Nama Barang</label>
            <input v-model="form.nama_barang" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Kode Barang</label>
            <input v-model="form.kode_barang" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Kategori</label>
            <input v-model="form.kategori_brg" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="form.status_brg" class="form-control">
              <option value="tersedia">Tersedia</option>
              <option value="dipinjam">Dipinjam</option>
            </select>
          </div>
          <div class="form-group">
            <label>Harga Barang (Rp)</label>
            <input v-model.number="form.harga_barang" type="number" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Harga Sewa/Hari (Rp)</label>
            <input v-model.number="form.harga_sewa" type="number" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Harga Sewa VIP/Hari (Rp)</label>
            <input v-model.number="form.harga_vip" type="number" class="form-control" required />
          </div>
          <div style="display:flex; gap:8px; justify-content:flex-end;">
            <button type="button" class="btn" @click="showModal=false" style="background:#e0e0e0;">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="deleteConfirm" class="modal-overlay" @click.self="deleteConfirm=null">
      <div class="modal" style="max-width:400px;">
        <h3 style="margin-top:0;">Konfirmasi Hapus</h3>
        <p>Apakah Anda yakin ingin menghapus barang ini?</p>
        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn" @click="deleteConfirm=null" style="background:#e0e0e0;">Batal</button>
          <button class="btn btn-danger" @click="doDelete">Hapus</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
