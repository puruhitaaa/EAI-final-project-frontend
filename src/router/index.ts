import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/pages/DashboardPage.vue'),
    },
    {
      path: '/text-analysis',
      name: 'text-analysis',
      component: () => import('@/pages/TextAnalysisPage.vue'),
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/pages/ReportsPage.vue'),
    },
    {
      path: '/reports/:id',
      name: 'report-details',
      component: () => import('@/pages/ReportDetailsPage.vue'),
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/pages/CategoriesPage.vue'),
    },
  ],
})

export default router
