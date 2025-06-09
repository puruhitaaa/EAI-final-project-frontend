import { createRouter, createWebHistory } from 'vue-router'
import TextAnalysisPage from '@/pages/TextAnalysisPage.vue'
import ReportsPage from '@/pages/ReportsPage.vue'
import ReportDetailsPage from '@/pages/ReportDetailsPage.vue'
import CategoriesPage from '@/pages/CategoriesPage.vue'
import ProfanityPage from '@/pages/ProfanityPage.vue'
import SynonymsPage from '@/pages/SynonymsPage.vue'
import HealthcareReviewsPage from '@/pages/HealthcareReviewsPage.vue'

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
      component: TextAnalysisPage,
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsPage,
    },
    {
      path: '/reports/:id',
      name: 'report-details',
      component: ReportDetailsPage,
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesPage,
    },
    {
      path: '/profanity',
      name: 'profanity',
      component: ProfanityPage,
    },
    {
      path: '/synonyms',
      name: 'synonyms',
      component: SynonymsPage,
    },
    {
      path: '/healthcare-reviews',
      name: 'healthcare-reviews',
      component: HealthcareReviewsPage,
    },
  ],
})

export default router
