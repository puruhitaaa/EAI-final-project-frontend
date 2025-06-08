<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useReports } from '@/composables/useReports'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const reportId = computed(() => route.params.id as string)

const { reportDetail, reportDetailLoading, getReportById } = useReports()

onMounted(() => {
  if (reportId.value) {
    getReportById(reportId.value)
  }
})

const getSeverityClass = (severity: unknown): string => {
  const severityString = String(severity).toLowerCase()
  switch (severityString) {
    case 'high':
      return 'bg-destructive text-destructive-foreground'
    case 'medium':
      return 'bg-yellow-500 text-white'
    case 'low':
      return 'bg-blue-500 text-white'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const formatDate = (dateString: string | number | Date) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

const categoryBreakdownArray = computed(() => {
  if (!reportDetail.value?.categoryBreakdown) return []
  try {
    const breakdown =
      typeof reportDetail.value.categoryBreakdown === 'string'
        ? JSON.parse(reportDetail.value.categoryBreakdown)
        : reportDetail.value.categoryBreakdown
    return Object.entries(breakdown).map(([name, count]) => ({
      name,
      count,
    }))
  } catch (e) {
    console.error('Failed to parse categoryBreakdown', e)
    return []
  }
})

const safeEntries = computed(
  () =>
    reportDetail.value?.entries?.filter(
      (entry): entry is NonNullable<(typeof reportDetail.value.entries)[number]> => Boolean(entry),
    ) ?? [],
)
</script>

<template>
  <div class="space-y-8">
    <div v-if="reportDetailLoading" class="text-center p-16">
      <div class="animate-pulse text-muted-foreground">Loading report details...</div>
    </div>

    <div v-else-if="!reportDetail" class="text-center p-16 bg-card rounded-xl border">
      <h3 class="text-lg font-semibold text-destructive">Report Not Found</h3>
      <p class="mt-1 text-muted-foreground">The requested report could not be found.</p>
      <router-link
        to="/reports"
        class="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
      >
        <ArrowLeft class="h-4 w-4" />
        Back to All Reports
      </router-link>
    </div>

    <div v-else class="space-y-8">
      <header>
        <router-link
          to="/reports"
          class="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-2"
        >
          <ArrowLeft class="h-4 w-4" />
          Back to All Reports
        </router-link>
        <h1 class="text-3xl font-bold tracking-tight">{{ reportDetail.title }}</h1>
        <p class="text-muted-foreground mt-1">
          Report for period: {{ formatDate(reportDetail.startDate) }} to
          {{ formatDate(reportDetail.endDate) }}
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-card rounded-xl border p-6 lg:col-span-2">
          <h2 class="text-lg font-semibold mb-2">Summary</h2>
          <p class="text-muted-foreground">{{ reportDetail.summary }}</p>
        </div>
        <div class="bg-card rounded-xl border p-6 flex flex-col justify-center items-center">
          <div class="text-4xl font-bold">{{ reportDetail.totalFlagged }}</div>
          <div class="text-sm text-muted-foreground mt-1">Total Flagged Items</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-card rounded-xl border p-6">
          <h2 class="text-lg font-semibold mb-4">Category Breakdown</h2>
          <div v-if="categoryBreakdownArray.length" class="space-y-2">
            <div
              v-for="cat in categoryBreakdownArray"
              :key="cat.name"
              class="flex justify-between items-center text-sm"
            >
              <span class="text-muted-foreground">{{ cat.name }}</span>
              <span class="font-semibold">{{ cat.count }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">No category data available.</p>
        </div>
        <div class="bg-card rounded-xl border p-6">
          <h2 class="text-lg font-semibold mb-2">Risk Assessment</h2>
          <p class="text-muted-foreground">{{ reportDetail.riskAssessment }}</p>
        </div>
      </div>

      <div v-if="reportDetail.insights?.length" class="bg-card rounded-xl border p-6">
        <h2 class="text-lg font-semibold mb-4">AI-Generated Insights</h2>
        <ul class="list-disc list-inside space-y-2 text-muted-foreground">
          <li v-for="(insight, i) in reportDetail.insights" :key="i">{{ insight }}</li>
        </ul>
      </div>

      <div class="bg-card rounded-xl border">
        <header class="p-6">
          <h2 class="text-lg font-semibold">Flagged Entries</h2>
          <p class="text-sm text-muted-foreground">
            Specific instances of flagged language from the analyzed texts.
          </p>
        </header>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b">
              <tr class="text-muted-foreground">
                <th class="p-4 text-left font-medium">Word</th>
                <th class="p-4 text-left font-medium">Category</th>
                <th class="p-4 text-left font-medium">Severity</th>
                <th class="p-4 text-left font-medium">Context</th>
                <th class="p-4 text-left font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody v-if="safeEntries.length">
              <tr v-for="entry in safeEntries" :key="entry.id" class="border-b hover:bg-muted/50">
                <td class="p-4 font-semibold">{{ entry.word }}</td>
                <td class="p-4">{{ entry.category }}</td>
                <td class="p-4">
                  <span
                    class="px-2 py-1 text-xs rounded-full font-medium"
                    :class="getSeverityClass(entry.severity)"
                    >{{ entry.severity }}</span
                  >
                </td>
                <td class="p-4 text-muted-foreground max-w-sm truncate">{{ entry.context }}</td>
                <td class="p-4 text-muted-foreground">{{ formatDate(entry.timestamp) }}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" class="p-16 text-center text-muted-foreground">
                  No flagged entries for this report.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
