import { createRouter, createWebHistory } from 'vue-router'
import AccountDetailView from '@/views/AccountDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/checking', // Default landing page redirects to Chequing
    },
    {
      path: '/checking',
      name: 'checking',
      component: AccountDetailView,
      props: { accountType: 'chequing' },
    },
    {
      path: '/savings',
      name: 'savings',
      component: AccountDetailView,
      props: { accountType: 'savings' },
    },
  ],
})

export default router
