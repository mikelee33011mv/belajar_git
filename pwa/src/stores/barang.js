import { defineStore } from 'pinia'
import { ref } from 'vue'

const DEFAULT_BARANG = [
  { id: 1, nama_barang: 'Gitar Akustik', kode_barang: 'BRG001', kategori_brg: 'Alat Musik', status_brg: 'tersedia', harga_barang: 1500000, harga_sewa: 50000, harga_vip: 40000, foto: '' },
  { id: 2, nama_barang: 'Speaker Bluetooth', kode_barang: 'BRG002', kategori_brg: 'Elektronik', status_brg: 'dipinjam', harga_barang: 800000, harga_sewa: 30000, harga_vip: 25000, foto: '' },
  { id: 3, nama_barang: 'Topi Proyek', kode_barang: 'BRG003', kategori_brg: 'Perlengkapan', status_brg: 'tersedia', harga_barang: 150000, harga_sewa: 5000, harga_vip: 4000, foto: '' },
  { id: 4, nama_barang: 'Cajon', kode_barang: 'BRG004', kategori_brg: 'Alat Musik', status_brg: 'tersedia', harga_barang: 2000000, harga_sewa: 75000, harga_vip: 60000, foto: '' },
  { id: 5, nama_barang: 'Kabel Audio', kode_barang: 'BRG005', kategori_brg: 'Elektronik', status_brg: 'tersedia', harga_barang: 100000, harga_sewa: 10000, harga_vip: 8000, foto: '' },
  { id: 6, nama_barang: 'Laptop Asus', kode_barang: 'BRG006', kategori_brg: 'Elektronik', status_brg: 'tersedia', harga_barang: 12000000, harga_sewa: 150000, harga_vip: 120000, foto: '' },
]

export const useBarangStore = defineStore('barang', () => {
  const barang = ref(JSON.parse(localStorage.getItem('barang_data') || JSON.stringify(DEFAULT_BARANG)))

  function save() {
    localStorage.setItem('barang_data', JSON.stringify(barang.value))
  }

  function addBarang(data) {
    const newItem = { ...data, id: Date.now() }
    barang.value.push(newItem)
    save()
    return newItem
  }

  function updateBarang(id, data) {
    const idx = barang.value.findIndex(b => b.id === id)
    if (idx !== -1) {
      barang.value[idx] = { ...barang.value[idx], ...data }
      save()
    }
  }

  function deleteBarang(id) {
    barang.value = barang.value.filter(b => b.id !== id)
    save()
  }

  function setStatus(id, status) {
    updateBarang(id, { status_brg: status })
  }

  const tersedia = () => barang.value.filter(b => b.status_brg === 'tersedia')

  return { barang, addBarang, updateBarang, deleteBarang, setStatus, tersedia }
})
