<script setup lang="ts">
import { ref, computed } from 'vue'

const reports = ref([
  {
    id: '1',
    title: 'Weekly Report - Nov 1',
    startDate: '2024-10-25',
    endDate: '2024-11-01',
    summary: 'Weekly analysis of content monitoring',
    totalFlagged: 45,
    categories: [
      { name: 'Profanity', count: 18 },
      { name: 'Hate Speech', count: 12 },
      { name: 'Harassment', count: 15 },
    ],
    createdAt: '2024-11-01',
  },
  {
    id: '2',
    title: 'Monthly Summary - October',
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    summary: 'Monthly overview of content filtering results',
    totalFlagged: 128,
    categories: [
      { name: 'Profanity', count: 52 },
      { name: 'Hate Speech', count: 31 },
      { name: 'Harassment', count: 27 },
      { name: 'Sexual Content', count: 18 },
    ],
    createdAt: '2024-10-31',
  },
  {
    id: '3',
    title: 'Q3 Analysis Report',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    summary: 'Quarterly analysis of content filtering system',
    totalFlagged: 287,
    categories: [
      { name: 'Profanity', count: 124 },
      { name: 'Hate Speech', count: 83 },
      { name: 'Harassment', count: 46 },
      { name: 'Sexual Content', count: 34 },
    ],
    createdAt: '2024-10-15',
  },
])

const showGenerateForm = ref(false)
const generatingReport = ref(false)
const newReport = ref({
  title: '',
  startDate: '',
  endDate: '',
})

const isSubmitDisabled = computed(() => {
  return !newReport.value.startDate || !newReport.value.endDate || generatingReport.value
})

const handleGenerateReport = () => {
  if (isSubmitDisabled.value) return

  generatingReport.value = true

  // Simulate API call
  setTimeout(() => {
    const reportId = Math.floor(Math.random() * 1000).toString()

    reports.value.unshift({
      id: reportId,
      title: newReport.value.title || `Report ${reportId}`,
      startDate: newReport.value.startDate,
      endDate: newReport.value.endDate,
      summary: 'Generated report',
      totalFlagged: Math.floor(Math.random() * 100),
      categories: [
        { name: 'Profanity', count: Math.floor(Math.random() * 40) },
        { name: 'Hate Speech', count: Math.floor(Math.random() * 20) },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    })

    generatingReport.value = false
    showGenerateForm.value = false
    newReport.value = {
      title: '',
      startDate: '',
      endDate: '',
    }
  }, 1500)
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
          <span v-if="generatingReport">Generating...</span>
          <span v-else>Generate Report</span>
        </button>
      </div>
    </div>

    <!-- Reports List -->
    <div class="bg-card rounded-lg shadow">
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
