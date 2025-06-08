<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReports } from '@/composables/useReports'

const { reports, reportsLoading, generateReport, generateReportLoading } = useReports()

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
    newReport.value = {
      title: '',
      startDate: '',
      endDate: '',
    }
  } catch (error) {
    console.error('Error generating report:', error)
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Reports</h1>
      <button
        @click="showGenerateForm = !showGenerateForm"
        class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        {{ showGenerateForm ? 'Cancel' : 'Generate New Report' }}
      </button>
    </div>

    <!-- Report Generation Form -->
    <div v-if="showGenerateForm" class="bg-card rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Generate New Report</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Title (Optional)</label>
          <input
            type="text"
            v-model="newReport.title"
            class="w-full rounded-md border-border bg-background px-3 py-2 text-sm"
            placeholder="Report title"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Start Date*</label>
          <input
            type="date"
            v-model="newReport.startDate"
            class="w-full rounded-md border-border bg-background px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">End Date*</label>
          <input
            type="date"
            v-model="newReport.endDate"
            class="w-full rounded-md border-border bg-background px-3 py-2 text-sm"
            required
          />
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          @click="handleGenerateReport"
          class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          :disabled="isSubmitDisabled"
        >
          <span v-if="generateReportLoading">Generating...</span>
          <span v-else>Generate Report</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="reportsLoading && !reports.length" class="flex justify-center items-center py-12">
      <div
        class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
      ></div>
    </div>

    <!-- No Reports State -->
    <div v-else-if="!reports.length" class="bg-card rounded-lg shadow p-8 text-center">
      <p class="text-lg text-muted-foreground mb-4">No reports available</p>
      <button
        @click="showGenerateForm = true"
        class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        Generate Your First Report
      </button>
    </div>

    <!-- Reports List -->
    <div v-else class="bg-card rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-3 px-4 font-medium">Title</th>
              <th class="text-left py-3 px-4 font-medium">Date Range</th>
              <th class="text-left py-3 px-4 font-medium">Summary</th>
              <th class="text-left py-3 px-4 font-medium">Flagged</th>
              <th class="text-left py-3 px-4 font-medium">Top Categories</th>
              <th class="text-left py-3 px-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="report in reports"
              :key="report.id"
              class="border-b border-border hover:bg-muted/50"
            >
              <td class="py-3 px-4">
                <div class="font-medium">{{ report.title }}</div>
                <div class="text-xs text-muted-foreground">Created {{ report.createdAt }}</div>
              </td>
              <td class="py-3 px-4">
                <div>{{ report.startDate }}</div>
                <div>to</div>
                <div>{{ report.endDate }}</div>
              </td>
              <td class="py-3 px-4">{{ report.summary }}</td>
              <td class="py-3 px-4">{{ report.totalFlagged }}</td>
              <td class="py-3 px-4">
                <div class="flex flex-col gap-1">
                  <div
                    v-for="(category, i) in report.categories.slice(0, 2)"
                    :key="i"
                    class="text-sm"
                  >
                    {{ category.name }}: {{ category.count }}
                  </div>
                  <div v-if="report.categories.length > 2" class="text-xs text-muted-foreground">
                    +{{ report.categories.length - 2 }} more
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <router-link :to="`/reports/${report.id}`" class="text-primary hover:underline">
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
