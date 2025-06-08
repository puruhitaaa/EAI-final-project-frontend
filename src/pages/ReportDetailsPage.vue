<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useReports } from '@/composables/useReports'

const route = useRoute()
const reportId = computed(() => route.params.id as string)

const { reportDetail, reportDetailLoading, getReportById } = useReports()

onMounted(async () => {
  if (reportId.value) {
    await getReportById(reportId.value)
  }
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
  if (!reportDetail.value?.categoryBreakdown) return []

  return Object.entries(reportDetail.value.categoryBreakdown).map(([name, count]) => ({
    name,
    count,
  }))
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="reportDetailLoading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
      ></div>
    </div>

    <!-- Report Not Found -->
    <div v-else-if="!reportDetail" class="bg-card rounded-lg shadow p-8 text-center">
      <div class="text-lg text-muted-foreground mb-4">Report not found</div>
      <router-link to="/reports" class="text-primary hover:underline">
        ← Back to Reports
      </router-link>
    </div>

    <!-- Report Details -->
    <div v-else>
      <div class="mb-6">
        <div class="flex items-center mb-2">
          <router-link to="/reports" class="text-primary hover:underline mr-2"
            >← Reports</router-link
          >
          <h1 class="text-2xl font-bold">{{ reportDetail.title }}</h1>
        </div>
        <div class="text-muted-foreground">
          {{ reportDetail.startDate }} to {{ reportDetail.endDate }}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Summary Card -->
        <div class="bg-card rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-4">Summary</h2>
          <p>{{ reportDetail.summary }}</p>
          <div class="mt-4 pt-4 border-t border-border">
            <div class="text-xl font-semibold">{{ reportDetail.totalFlagged }}</div>
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
          <p>{{ reportDetail.riskAssessment }}</p>
        </div>
      </div>

      <!-- Insights -->
      <div v-if="reportDetail.insights?.length" class="bg-card rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Insights</h2>
        <ul class="list-disc pl-5 space-y-2">
          <li v-for="(insight, index) in reportDetail.insights" :key="index">
            {{ insight }}
          </li>
        </ul>
      </div>

      <!-- Flagged Entries -->
      <div class="bg-card rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Flagged Entries</h2>

        <div v-if="!reportDetail.entries?.length" class="text-center py-6 text-muted-foreground">
          No entries available for this report.
        </div>

        <div v-else class="overflow-x-auto">
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
              <tr
                v-for="entry in reportDetail.entries"
                :key="entry.id"
                class="border-b border-border"
              >
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
