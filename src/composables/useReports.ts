import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref, computed } from 'vue'
import gql from 'graphql-tag'

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

// Types based on the GraphQL schema
interface ReportCategory {
  name: string
  count: number
}

interface ReportEntry {
  id: string
  word: string
  category: string
  context: string
  timestamp: string
  severity: string
}

interface Report {
  id: string
  title: string
  startDate: string
  endDate: string
  summary: string
  totalFlagged: number
  categories: ReportCategory[]
  insights: string[]
  riskAssessment: string
  createdAt: string
}

interface ReportDetail extends Omit<Report, 'categories' | 'createdAt'> {
  categoryBreakdown: Record<string, number>
  entries: ReportEntry[]
}

interface GetReportsResult {
  getReports: Report[]
}

interface GetReportByIdResult {
  getReportById: ReportDetail
}

interface GenerateReportResult {
  generateReport: {
    id: string
    title: string
    summary: string
  }
}

export function useReports() {
  const limit = ref(10)
  const offset = ref(0)

  // Get all reports
  const {
    result: reportsResult,
    loading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery<GetReportsResult>(GET_REPORTS, () => ({ limit: limit.value, offset: offset.value }))

  const reports = computed(() => reportsResult.value?.getReports || [])

  // Get report by ID
  const reportId = ref<string | null>(null)
  const {
    result: reportDetailResult,
    loading: reportDetailLoading,
    error: reportDetailError,
    refetch: refetchReportDetail,
  } = useQuery<GetReportByIdResult>(GET_REPORT_BY_ID, () => ({ id: reportId.value }), {
    enabled: computed(() => !!reportId.value),
  })

  const reportDetail = computed(() => reportDetailResult.value?.getReportById)

  // Generate a new report
  const {
    mutate: generateReportMutation,
    loading: generateReportLoading,
    error: generateReportError,
  } = useMutation<GenerateReportResult, { startDate: string; endDate: string; title?: string }>(
    GENERATE_REPORT,
  )

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

  const getReportById = (id: string) => {
    reportId.value = id
    return refetchReportDetail()
  }

  const loadMoreReports = () => {
    offset.value += limit.value
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
    setLimit: (newLimit: number) => {
      limit.value = newLimit
      return refetchReports()
    },
  }
}
