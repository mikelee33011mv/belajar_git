import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
  { path: '/', redirect: '/dashboard' },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/barang',
    name: 'barang',
    component: () => import('../views/BarangView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/peminjaman',
    name: 'peminjaman',
    component: () => import('../views/PeminjamanView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/pengembalian',
    name: 'pengembalian',
    component: () => import('../views/PengembalianView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/anggota',
    name: 'anggota',
    component: () => import('../views/AnggotaView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/topup',
    name: 'topup',
    component: () => import('../views/TopUpView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/user/dashboard',
    name: 'user-dashboard',
    component: () => import('../views/UserDashboardView.vue'),
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/user/pinjam',
    name: 'user-pinjam',
    component: () => import('../views/UserPinjamView.vue'),
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/user/riwayat',
    name: 'user-riwayat',
    component: () => import('../views/UserRiwayatView.vue'),
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/user/topup',
    name: 'user-topup',
    component: () => import('../views/UserTopUpView.vue'),
    meta: { requiresAuth: true, role: 'user' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login')
  } else if (to.path === '/login' && authStore.user) {
    next(authStore.user.roles === 'admin' ? '/dashboard' : '/user/dashboard')
  } else if (to.meta.role && authStore.user && to.meta.role !== authStore.user.roles) {
    next(authStore.user.roles === 'admin' ? '/dashboard' : '/user/dashboard')
  } else {
    next()
  }
})

export default router
