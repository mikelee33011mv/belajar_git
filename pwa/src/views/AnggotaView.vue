<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useAnggotaStore } from '../stores/anggota'

const anggotaStore = useAnggotaStore()
const search = ref('')
const showModal = ref(false)
const editMode = ref(false)
const deleteConfirm = ref(null)

const form = ref({ nama: '', alamat: '', agama: 'Islam', j_kel: 'L', no_hp: '', saldo: 0, tgl_aktif_agt: new Date().toISOString().split('T')[0] })

const filtered = computed(() =>
  anggotaStore.anggota.filter(a =>
    a.nama.toLowerCase().includes(search.value.toLowerCase()) ||
    a.no_hp.includes(search.value)
  )
)

function openAdd() {
  editMode.value = false
  form.value = { nama: '', alamat: '', agama: 'Islam', j_kel: 'L', no_hp: '', saldo: 0, tgl_aktif_agt: new Date().toISOString().split('T')[0] }
  showModal.value = true
}

function openEdit(a) {
  editMode.value = true
  form.value = { ...a }
  showModal.value = true
}

function saveAnggota() {
  if (editMode.value) {
    anggotaStore.updateAnggota(form.value.id, form.value)
  } else {
    anggotaStore.addAnggota(form.value)
  }
  showModal.value = false
}

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}
</script>

<template>
  <AppLayout>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <h2 style="margin:0; color:#333;">&#128101; Manajemen Anggota</h2>
      <button class="btn btn-primary" @click="openAdd">+ Tambah Anggota</button>
    </div>
    <div class="card">
      <div class="card-header">
        <span>Daftar Anggota ({{ filtered.length }})</span>
        <input v-model="search" type="text" class="search-bar" placeholder="&#128269; Cari anggota..." />
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nama</th>
              <th>Jenis Kelamin</th>
              <th>No. HP</th>
              <th>Alamat</th>
              <th>Saldo</th>
              <th>Tgl Aktif</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, i) in filtered" :key="a.id">
              <td>{{ i + 1 }}</td>
              <td><strong>{{ a.nama }}</strong></td>
              <td>{{ a.j_kel === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
              <td>{{ a.no_hp }}</td>
              <td>{{ a.alamat }}</td>
              <td>{{ formatRupiah(a.saldo) }}</td>
              <td>{{ a.tgl_aktif_agt }}</td>
              <td style="display:flex; gap:6px;">
                <button class="btn btn-warning btn-sm" @click="openEdit(a)">&#9999;&#65039; Edit</button>
                <button class="btn btn-danger btn-sm" @click="deleteConfirm = a.id">&#128465;&#65039; Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
      <div class="modal">
        <div class="modal-header">
          <h3 style="margin:0;">{{ editMode ? 'Edit Anggota' : 'Tambah Anggota' }}</h3>
          <button @click="showModal=false" style="background:none; border:none; font-size:20px; cursor:pointer;">&#x2715;</button>
        </div>
        <form @submit.prevent="saveAnggota">
          <div class="form-group">
            <label>Nama Lengkap</label>
            <input v-model="form.nama" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Jenis Kelamin</label>
            <select v-model="form.j_kel" class="form-control">
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div class="form-group">
            <label>Agama</label>
            <select v-model="form.agama" class="form-control">
              <option>Islam</option>
              <option>Kristen</option>
              <option>Katolik</option>
              <option>Hindu</option>
              <option>Buddha</option>
              <option>Konghucu</option>
            </select>
          </div>
          <div class="form-group">
            <label>No. HP</label>
            <input v-model="form.no_hp" class="form-control" required />
          </div>
          <div class="form-group">
            <label>Alamat</label>
            <textarea v-model="form.alamat" class="form-control" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label>Saldo (Rp)</label>
            <input v-model.number="form.saldo" type="number" class="form-control" />
          </div>
          <div class="form-group">
            <label>Tanggal Aktif</label>
            <input v-model="form.tgl_aktif_agt" type="date" class="form-control" />
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
        <p>Apakah Anda yakin ingin menghapus anggota ini?</p>
        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn" @click="deleteConfirm=null" style="background:#e0e0e0;">Batal</button>
          <button class="btn btn-danger" @click="() => { anggotaStore.deleteAnggota(deleteConfirm); deleteConfirm=null }">Hapus</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
