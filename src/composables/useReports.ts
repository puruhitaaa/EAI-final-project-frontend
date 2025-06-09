import { useQuery, useMutation, useLazyQuery } from '@vue/apollo-composable'
import { ref, computed } from 'vue'
import gql from 'graphql-tag'
import type {
  GetReportsQuery,
  GetReportsQueryVariables,
  GetReportByIdQuery,
  GetReportByIdQueryVariables,
  GenerateReportMutation,
  GenerateReportMutationVariables,
  LogReportMutation,
  LogReportMutationVariables,
} from '@/gql/graphql'

// GraphQL documents
const GET_REPORTS = gql`
  query GetReports($limit: Int, $offset: Int) {
    getReports(limit: $limit, offset: $offset) {
      id
      title
      startDate
      endDate
      summary
      totalFlagged
      categories {
        name
        count
      }
      insights
      riskAssessment
      createdAt
    }
  }
`

const GET_REPORT_BY_ID = gql`
  query GetReportById($id: ID!) {
    getReportById(id: $id) {
      id
      title
      startDate
      endDate
      summary
      totalFlagged
      categoryBreakdown
      insights
      riskAssessment
      entries(limit: 50, offset: 0) {
        id
        word
        category
        context
        timestamp
        severity
      }
    }
  }
`

const GENERATE_REPORT = gql`
  mutation GenerateReport($startDate: String!, $endDate: String!, $title: String) {
    generateReport(startDate: $startDate, endDate: $endDate, title: $title) {
      id
      title
      summary
    }
  }
`

const LOG_REPORT = gql`
  mutation LogReport($word: String!, $context: String, $category: String, $severity: Int) {
    logReport(word: $word, context: $context, category: $category, severity: $severity) {
      id
      word
      category
      context
      timestamp
      severity
    }
  }
`

export function useReports() {
  const limit = ref(10)
  const offset = ref(0)

  // Get all reports
  const {
    result: reportsResult,
    loading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery<GetReportsQuery, GetReportsQueryVariables>(GET_REPORTS, () => ({
    limit: limit.value,
    offset: offset.value,
  }))

  const reports = computed(() => reportsResult.value?.getReports ?? [])

  // Get report by ID
  const {
    result: reportDetailResult,
    loading: reportDetailLoading,
    error: reportDetailError,
    load: loadReportDetail,
  } = useLazyQuery<GetReportByIdQuery, GetReportByIdQueryVariables>(GET_REPORT_BY_ID)

  const reportDetail = computed(() => reportDetailResult.value?.getReportById)

  // Generate a new report
  const {
    mutate: generateReportMutation,
    loading: generateReportLoading,
    error: generateReportError,
  } = useMutation<GenerateReportMutation, GenerateReportMutationVariables>(GENERATE_REPORT)

  // Log report entry
  const {
    mutate: logReportMutation,
    loading: logReportLoading,
    error: logReportError,
  } = useMutation<LogReportMutation, LogReportMutationVariables>(LOG_REPORT)

  const generateReport = async (startDate: string, endDate: string, title?: string) => {
    try {
      const result = await generateReportMutation({ startDate, endDate, title })
      await refetchReports()
      return result?.data?.generateReport
    } catch (error) {
      console.error('Error generating report:', error)
      throw error
    }
  }

  const logReport = async (
    word: string,
    context?: string,
    category?: string,
    severity?: number,
  ) => {
    try {
      const result = await logReportMutation({
        word,
        context,
        category,
        severity,
      })
      return result?.data?.logReport
    } catch (error) {
      console.error('Error logging report:', error)
      throw error
    }
  }

  const getReportById = (id: string) => {
    if (loadReportDetail) {
      return loadReportDetail(undefined, { id })
    }
  }

  const loadMoreReports = () => {
    offset.value += limit.value
    // Note: This refetches the whole list with a new offset.
    // For true pagination/infinite scroll, you would use 'fetchMore'.
    // But for this project's scope, refetching is simpler.
    return refetchReports()
  }

  return {
    reports,
    reportsLoading,
    reportsError,
    reportDetail,
    reportDetailLoading,
    reportDetailError,
    generateReport,
    generateReportLoading,
    generateReportError,
    getReportById,
    loadMoreReports,
    logReport,
    logReportLoading,
    logReportError,
    setLimit: (newLimit: number) => {
      limit.value = newLimit
      return refetchReports()
    },
  }
}
