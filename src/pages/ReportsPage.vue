<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReports } from '@/composables/useReports'
import { PlusCircle } from 'lucide-vue-next'

const { reports, reportsLoading, generateReport, generateReportLoading } = useReports()

const filteredReports = computed(() =>
  (reports.value ?? []).filter((report): report is NonNullable<(typeof reports.value)[number]> =>
    Boolean(report),
  ),
)

const showGenerateForm = ref(false)
const newReport = ref({
  title: '',
  startDate: '',
  endDate: '',
})

const isSubmitDisabled = computed(() => {
  return !newReport.value.startDate || !newReport.value.endDate || generateReportLoading.value
})

const handleGenerateReport = async () => {
  if (isSubmitDisabled.value) return
  try {
    await generateReport(
      newReport.value.startDate,
      newReport.value.endDate,
      newReport.value.title || undefined,
    )
    showGenerateForm.value = false
    newReport.value = { title: '', startDate: '', endDate: '' }
  } catch (error) {
    console.error('Error generating report:', error)
    // You could add user-facing error feedback here
  }
}

const formatDate = (dateString: string | number | Date) => {
  // Handle Unix timestamps (both as strings and numbers)
  if (dateString) {
    const date = new Date(typeof dateString === 'string' ? parseInt(dateString, 10) : dateString)

    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }
  }

  return 'Invalid date'
}
</script>

<template>
  <div class="space-y-8">
    <header class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Reports</h1>
        <p class="text-muted-foreground mt-1">
          View and generate reports based on text analysis data.
        </p>
      </div>
      <button
        @click="showGenerateForm = !showGenerateForm"
        class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        <PlusCircle class="h-4 w-4" />
        {{ showGenerateForm ? 'Cancel' : 'New Report' }}
      </button>
    </header>

    <!-- Report Generation Form Card -->
    <div v-if="showGenerateForm" class="bg-card rounded-xl border shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-4">Generate New Report</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-2">Title (Optional)</label>
          <input
            v-model="newReport.title"
            type="text"
            placeholder="e.g., Q3 Content Review"
            class="w-full rounded-md border-border bg-background p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Start Date</label>
          <input
            v-model="newReport.startDate"
            type="date"
            class="w-full rounded-md border-border bg-background p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">End Date</label>
          <input
            v-model="newReport.endDate"
            type="date"
            class="w-full rounded-md border-border bg-background p-2"
          />
        </div>
      </div>
      <div class="flex justify-end">
        <button
          @click="handleGenerateReport"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          :disabled="isSubmitDisabled"
        >
          <span v-if="generateReportLoading" class="animate-pulse">Generating...</span>
          <span v-else>Generate Report</span>
        </button>
      </div>
    </div>

    <!-- Reports List Card -->
    <div class="bg-card rounded-xl border shadow-sm">
      <div v-if="reportsLoading && reports.length === 0" class="p-16 text-center">
        <div class="animate-pulse text-muted-foreground">Loading reports...</div>
      </div>

      <div v-else-if="reports.length === 0" class="text-center p-16 text-muted-foreground">
        <h3 class="text-lg font-semibold">No Reports Found</h3>
        <p class="mt-1">Generate a new report to get started.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b">
            <tr class="text-muted-foreground">
              <th class="text-left font-medium p-4">Report</th>
              <th class="text-left font-medium p-4">Date Range</th>
              <th class="text-left font-medium p-4">Summary</th>
              <th class="text-center font-medium p-4">Flagged</th>
              <th class="text-left font-medium p-4"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="report in filteredReports"
              :key="report.id"
              class="border-b hover:bg-muted/50"
            >
              <td class="p-4">
                <div class="font-semibold">{{ report.title }}</div>
                <div class="text-xs text-muted-foreground">
                  Created on {{ formatDate(report.createdAt) }}
                </div>
              </td>
              <td class="p-4 text-muted-foreground">
                {{ formatDate(report.startDate) }} - {{ formatDate(report.endDate) }}
              </td>
              <td class="p-4 text-muted-foreground max-w-xs truncate">
                {{ report.summary }}
              </td>
              <td class="p-4 font-semibold text-center">{{ report.totalFlagged }}</td>
              <td class="p-4 text-right">
                <router-link
                  :to="`/reports/${report.id}`"
                  class="font-medium text-primary hover:underline"
                >
                  View Details
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
