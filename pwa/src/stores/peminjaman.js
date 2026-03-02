import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useBarangStore } from './barang'

const DEFAULT_PEMINJAMAN = [
  {
    id: 1, id_login: 2, id_barang: 2, nama_anggota: 'User Pertama', nama_barang: 'Speaker Bluetooth',
    tanggal_ajuan: '2024-01-10', tgl_peminjaman: '2024-01-11', tgal_kembali: '2024-01-15',
    harga_harian: 30000, jmlh_hari_pinjam: 4, total: 120000, status: 'disetujui', denda: 0
  },
  {
    id: 2, id_login: 2, id_barang: 1, nama_anggota: 'User Pertama', nama_barang: 'Gitar Akustik',
    tanggal_ajuan: '2024-01-20', tgl_peminjaman: '2024-01-21', tgal_kembali: '2024-01-25',
    harga_harian: 50000, jmlh_hari_pinjam: 4, total: 200000, status: 'pending', denda: 0
  },
  {
    id: 3, id_login: 2, id_barang: 3, nama_anggota: 'User Pertama', nama_barang: 'Topi Proyek',
    tanggal_ajuan: '2024-01-05', tgl_peminjaman: '2024-01-06', tgal_kembali: '2024-01-08',
    harga_harian: 5000, jmlh_hari_pinjam: 2, total: 10000, status: 'dikembalikan', denda: 0
  },
]

export const usePeminjamanStore = defineStore('peminjaman', () => {
  const peminjaman = ref(JSON.parse(localStorage.getItem('peminjaman_data') || JSON.stringify(DEFAULT_PEMINJAMAN)))

  function save() {
    localStorage.setItem('peminjaman_data', JSON.stringify(peminjaman.value))
  }

  function addPeminjaman(data) {
    const barangStore = useBarangStore()
    const barang = barangStore.barang.find(b => b.id === data.id_barang)
    const harga = barang ? barang.harga_sewa : 0
    const hari = data.jmlh_hari_pinjam || 1
    const newPinjam = {
      ...data,
      id: Date.now(),
      harga_harian: harga,
      total: harga * hari,
      status: 'pending',
      denda: 0,
      tanggal_ajuan: new Date().toISOString().split('T')[0]
    }
    peminjaman.value.push(newPinjam)
    save()
    return newPinjam
  }

  function approvePeminjaman(id) {
    const barangStore = useBarangStore()
    const pinjam = peminjaman.value.find(p => p.id === id)
    if (pinjam) {
      pinjam.status = 'disetujui'
      barangStore.setStatus(pinjam.id_barang, 'dipinjam')
      save()
    }
  }

  function rejectPeminjaman(id) {
    const pinjam = peminjaman.value.find(p => p.id === id)
    if (pinjam) {
      pinjam.status = 'ditolak'
      save()
    }
  }

  function returnBarang(id, tglKembaliAktual) {
    const barangStore = useBarangStore()
    const pinjam = peminjaman.value.find(p => p.id === id)
    if (pinjam) {
      const denda = calculateDenda(pinjam.tgal_kembali, tglKembaliAktual, pinjam.harga_harian)
      pinjam.denda = denda
      pinjam.status = 'dikembalikan'
      pinjam.tgl_kembali_aktual = tglKembaliAktual
      barangStore.setStatus(pinjam.id_barang, 'tersedia')
      save()
    }
  }

  function calculateDenda(tglRencana, tglAktual, hargaHarian) {
    const rencana = new Date(tglRencana)
    const aktual = new Date(tglAktual)
    const diffDays = Math.max(0, Math.ceil((aktual - rencana) / (1000 * 60 * 60 * 24)))
    return diffDays * hargaHarian * 1.5
  }

  return { peminjaman, addPeminjaman, approvePeminjaman, rejectPeminjaman, returnBarang, calculateDenda }
})
