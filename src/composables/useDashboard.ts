import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'
import gql from 'graphql-tag'
import type {
  GetDashboardCategoriesQuery,
  GetRecentAnalysesQuery,
  GetRecentAnalysesQueryVariables,
  GetRecentReportsQuery,
  GetRecentReportsQueryVariables,
  GetTopCategoriesQuery,
  GetTopCategoriesQueryVariables,
} from '@/gql/graphql'

// GraphQL documents
const GET_DASHBOARD_CATEGORIES = gql`
  query GetDashboardCategories {
    getAllCategories {
      id
      name
      severityLevel
    }
  }
`

const GET_RECENT_ANALYSES = gql`
  query GetRecentAnalyses($limit: Int) {
    getRecentAnalyses(limit: $limit) {
      id
    }
  }
`

const GET_RECENT_REPORTS = gql`
  query GetRecentReports($limit: Int) {
    getReports(limit: $limit) {
      id
      title
      startDate
      endDate
      createdAt
      totalFlagged
    }
  }
`

const GET_TOP_CATEGORIES = gql`
  query GetTopCategories($limit: Int) {
    getReports(limit: $limit) {
      categories {
        name
        count
      }
    }
  }
`

export function useDashboard() {
  // Get categories
  const {
    result: categoriesResult,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery<GetDashboardCategoriesQuery>(GET_DASHBOARD_CATEGORIES)

  // Get recent analyses
  const {
    result: analysesResult,
    loading: analysesLoading,
    error: analysesError,
  } = useQuery<GetRecentAnalysesQuery, GetRecentAnalysesQueryVariables>(GET_RECENT_ANALYSES, {
    limit: 5,
  })

  // Get recent reports
  const {
    result: recentReportsResult,
    loading: recentReportsLoading,
    error: recentReportsError,
    refetch: refetchReports,
  } = useQuery<GetRecentReportsQuery, GetRecentReportsQueryVariables>(GET_RECENT_REPORTS, {
    limit: 3,
  })

  // Get top categories
  const {
    result: topCategoriesResult,
    loading: topCategoriesLoading,
    error: topCategoriesError,
  } = useQuery<GetTopCategoriesQuery, GetTopCategoriesQueryVariables>(GET_TOP_CATEGORIES, {
    limit: 10,
  })

  // Computed values
  const categories = computed(() => categoriesResult.value?.getAllCategories ?? [])
  const recentAnalyses = computed(() => analysesResult.value?.getRecentAnalyses ?? [])
  const recentReports = computed(() => recentReportsResult.value?.getReports ?? [])

  // Calculate metrics
  const totalFlagged = computed(() => {
    return recentReports.value.reduce((sum: number, report) => {
      return sum + (report?.totalFlagged ?? 0)
    }, 0)
  })

  // Process top categories from multiple reports
  const topCategories = computed(() => {
    if (!topCategoriesResult.value?.getReports) return []

    // Collect all categories across reports
    const categoryMap = new Map<string, number>()
    topCategoriesResult.value.getReports.forEach((report) => {
      if (!report?.categories) return

      report.categories.forEach((category) => {
        if (!category) return
        const { name, count } = category
        if (!name) return

        const current = categoryMap.get(name) || 0
        categoryMap.set(name, current + (count || 0))
      })
    })

    // Convert to array and sort by count
    const result = Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))
    return result.sort((a, b) => (b.count as number) - (a.count as number)).slice(0, 4)
  })

  return {
    // Raw data
    categories,
    recentAnalyses,
    recentReports,

    // Metrics
    totalFlagged,
    categoriesCount: computed(() => categories.value.length),
    reportsCount: computed(() => recentReports.value.length),
    analysesCount: computed(() => recentAnalyses.value.length),

    // Processed data
    topCategories,

    // Loading states
    loading: computed(
      () =>
        categoriesLoading.value ||
        analysesLoading.value ||
        recentReportsLoading.value ||
        topCategoriesLoading.value,
    ),
    error: computed(
      () =>
        categoriesError.value ||
        analysesError.value ||
        recentReportsError.value ||
        topCategoriesError.value,
    ),

    // Actions
    refetch: refetchReports,
  }
}
