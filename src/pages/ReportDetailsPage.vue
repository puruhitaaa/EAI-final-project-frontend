<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const reportId = computed(() => route.params.id as string)
const loading = ref(true)

const report = ref({
  id: '',
  title: '',
  startDate: '',
  endDate: '',
  summary: '',
  totalFlagged: 0,
  categoryBreakdown: {},
  insights: [],
  riskAssessment: '',
  entries: [],
})

// Simulated data for the report details
const mockReportData = {
  '1': {
    id: '1',
    title: 'Weekly Report - Nov 1',
    startDate: '2024-10-25',
    endDate: '2024-11-01',
    summary: 'Weekly analysis of content monitoring across all platforms.',
    totalFlagged: 45,
    categoryBreakdown: {
      Profanity: 18,
      'Hate Speech': 12,
      Harassment: 15,
    },
    insights: [
      'Profanity instances increased by 15% compared to last week',
      'New pattern of harassment detected in user comments section',
      'Content moderation appears to be effective for hate speech categories',
    ],
    riskAssessment:
      'Medium risk level identified. Increased monitoring recommended for user comment sections where most instances were detected.',
    entries: [
      {
        id: '101',
        word: 'damn',
        category: 'Profanity',
        context: "This damn product doesn't work!",
        timestamp: '2024-10-26T14:23:45',
        severity: 'Low',
      },
      {
        id: '102',
        word: 'idiot',
        category: 'Harassment',
        context: 'The customer service rep is an idiot.',
        timestamp: '2024-10-27T09:12:33',
        severity: 'Medium',
      },
      {
        id: '103',
        word: 'hate',
        category: 'Hate Speech',
        context: 'I hate people who come from that country.',
        timestamp: '2024-10-28T16:45:22',
        severity: 'High',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Monthly Summary - October',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    summary: 'Monthly overview of content filtering results across all monitored channels.',
    totalFlagged: 128,
    categoryBreakdown: {
      Profanity: 52,
      'Hate Speech': 31,
      Harassment: 27,
      'Sexual Content': 18,
    },
    insights: [
      'Overall decrease in flagged content by 8% compared to September',
      'New automated filters have reduced false positives by 22%',
      'User feedback system has improved response time to flagged content',
    ],
    riskAssessment:
      'Low to medium risk profile. Continued monitoring with current systems appears adequate.',
    entries: [
      {
        id: '201',
        word: 'f***',
        category: 'Profanity',
        context: 'This f*** website is terrible',
        timestamp: '2024-10-05T11:33:21',
        severity: 'High',
      },
      {
        id: '202',
        word: 'stupid',
        category: 'Harassment',
        context: 'All the employees are stupid.',
        timestamp: '2024-10-12T15:27:44',
        severity: 'Low',
      },
      {
        id: '203',
        word: 'explicit term',
        category: 'Sexual Content',
        context: '[content removed for policy violation]',
        timestamp: '2024-10-18T22:01:17',
        severity: 'High',
      },
    ],
  },
  '3': {
    id: '3',
    title: 'Q3 Analysis Report',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    summary: 'Quarterly analysis of content filtering system performance and trends.',
    totalFlagged: 287,
    categoryBreakdown: {
      Profanity: 124,
      'Hate Speech': 83,
      Harassment: 46,
      'Sexual Content': 34,
    },
    insights: [
      'Q3 showed a 12% increase in overall flagged content compared to Q2',
      'New AI detection model improved category accuracy by 17%',
      'Peak detection periods correlate with product launch dates',
    ],
    riskAssessment:
      'Medium risk with specific high-risk areas identified. Recommend increased monitoring during product launches and enhanced AI training for harassment detection.',
    entries: [
      {
        id: '301',
        word: 'sh**',
        category: 'Profanity',
        context: 'This is sh** quality',
        timestamp: '2024-08-15T09:45:12',
        severity: 'Medium',
      },
      {
        id: '302',
        word: 'slur',
        category: 'Hate Speech',
        context: '[content removed]',
        timestamp: '2024-09-03T14:22:37',
        severity: 'High',
      },
      {
        id: '303',
        word: 'threat',
        category: 'Harassment',
        context: 'I will make sure you never work again',
        timestamp: '2024-07-28T17:11:05',
        severity: 'High',
      },
    ],
  },
}

// Fetch report details
onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    if (reportId.value && mockReportData[reportId.value]) {
      report.value = mockReportData[reportId.value]
    } else {
      // Handle not found
    }
    loading.value = false
  }, 800)
})

const getSeverityClass = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'high':
      return 'bg-destructive text-destructive-foreground'
    case 'medium':
      return 'bg-amber-500 text-white'
    case 'low':
      return 'bg-yellow-300 text-yellow-900'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const categoryBreakdownArray = computed(() => {
  if (!report.value.categoryBreakdown) return []

  return Object.entries(report.value.categoryBreakdown).map(([name, count]) => ({
    name,
    count,
  }))
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
      ></div>
    </div>

    <!-- Report Details -->
    <div v-else>
      <div class="mb-6">
        <div class="flex items-center mb-2">
          <router-link to="/reports" class="text-primary hover:underline mr-2"
            >← Reports</router-link
          >
          <h1 class="text-2xl font-bold">{{ report.title }}</h1>
        </div>
        <div class="text-muted-foreground">{{ report.startDate }} to {{ report.endDate }}</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Summary Card -->
        <div class="bg-card rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">Summary</h2>
          <p>{{ report.summary }}</p>
          <div class="mt-4 pt-4 border-t border-border">
            <div class="text-xl font-semibold">{{ report.totalFlagged }}</div>
            <div class="text-sm text-muted-foreground">Total Flagged Items</div>
          </div>
        </div>

        <!-- Categories Breakdown -->
        <div class="bg-card rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">Categories</h2>
          <div class="space-y-3">
            <div
              v-for="(category, index) in categoryBreakdownArray"
              :key="index"
              class="flex justify-between items-center"
            >
              <span>{{ category.name }}</span>
              <span class="bg-muted px-2 py-1 rounded text-sm">{{ category.count }}</span>
            </div>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div class="bg-card rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">Risk Assessment</h2>
          <p>{{ report.riskAssessment }}</p>
        </div>
      </div>

      <!-- Insights -->
      <div class="bg-card rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Insights</h2>
        <ul class="list-disc pl-5 space-y-2">
          <li v-for="(insight, index) in report.insights" :key="index">
            {{ insight }}
          </li>
        </ul>
      </div>

      <!-- Flagged Entries -->
      <div class="bg-card rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Flagged Entries</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left py-2 px-4 font-medium">Word</th>
                <th class="text-left py-2 px-4 font-medium">Category</th>
                <th class="text-left py-2 px-4 font-medium">Context</th>
                <th class="text-left py-2 px-4 font-medium">Timestamp</th>
                <th class="text-left py-2 px-4 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in report.entries" :key="entry.id" class="border-b border-border">
                <td class="py-2 px-4 font-medium">{{ entry.word }}</td>
                <td class="py-2 px-4">{{ entry.category }}</td>
                <td class="py-2 px-4">
                  <div class="max-w-md truncate">{{ entry.context }}</div>
                </td>
                <td class="py-2 px-4 text-sm">{{ new Date(entry.timestamp).toLocaleString() }}</td>
                <td class="py-2 px-4">
                  <span
                    class="text-xs px-2 py-1 rounded-full"
                    :class="getSeverityClass(entry.severity)"
                  >
                    {{ entry.severity }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
