import { defineStore } from 'pinia'
import { ref } from 'vue'

const DEFAULT_TOPUP = [
  { id: 1, id_login: 2, nama: 'User Pertama', nominal: 100000, metode_bayar: 'Transfer Bank', kode_bayar: 'TF001', status: 'pending', tanggal: '2024-01-10' },
  { id: 2, id_login: 2, nama: 'User Pertama', nominal: 50000, metode_bayar: 'QRIS', kode_bayar: 'QR001', status: 'disetujui', tanggal: '2024-01-05' },
]

export const useSaldoStore = defineStore('saldo', () => {
  const topupRequests = ref(JSON.parse(localStorage.getItem('topup_data') || JSON.stringify(DEFAULT_TOPUP)))

  function save() {
    localStorage.setItem('topup_data', JSON.stringify(topupRequests.value))
  }

  function requestTopUp(id_login, nama, nominal, metode_bayar) {
    const kode = 'PAY' + Date.now()
    const newReq = {
      id: Date.now(), id_login, nama, nominal, metode_bayar,
      kode_bayar: kode, status: 'pending',
      tanggal: new Date().toISOString().split('T')[0]
    }
    topupRequests.value.push(newReq)
    save()
    return newReq
  }

  function approveTopUp(id) {
    const req = topupRequests.value.find(t => t.id === id)
    if (req) { req.status = 'disetujui'; save() }
  }

  function rejectTopUp(id) {
    const req = topupRequests.value.find(t => t.id === id)
    if (req) { req.status = 'ditolak'; save() }
  }

  return { topupRequests, requestTopUp, approveTopUp, rejectTopUp }
})
