import { defineStore } from 'pinia'
import { ref } from 'vue'

const DEFAULT_ANGGOTA = [
  { id: 1, nama: 'Ridwan Kamil', id_login: 2, tgl_aktif_agt: '2024-01-01', alamat: 'Jl. Merdeka No. 1, Bandung', agama: 'Islam', j_kel: 'L', no_hp: '081234567890', saldo: 150000 },
  { id: 2, nama: 'Michael Viktor', id_login: 3, tgl_aktif_agt: '2024-01-05', alamat: 'Jl. Sudirman No. 10, Jakarta', agama: 'Kristen', j_kel: 'L', no_hp: '089876543210', saldo: 200000 },
]

export const useAnggotaStore = defineStore('anggota', () => {
  const anggota = ref(JSON.parse(localStorage.getItem('anggota_data') || JSON.stringify(DEFAULT_ANGGOTA)))

  function save() {
    localStorage.setItem('anggota_data', JSON.stringify(anggota.value))
  }

  function addAnggota(data) {
    const newAnggota = { ...data, id: Date.now() }
    anggota.value.push(newAnggota)
    save()
    return newAnggota
  }

  function updateAnggota(id, data) {
    const idx = anggota.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      anggota.value[idx] = { ...anggota.value[idx], ...data }
      save()
    }
  }

  function deleteAnggota(id) {
    anggota.value = anggota.value.filter(a => a.id !== id)
    save()
  }

  return { anggota, addAnggota, updateAnggota, deleteAnggota }
})
