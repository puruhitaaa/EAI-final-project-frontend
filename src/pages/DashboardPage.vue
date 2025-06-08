<script setup lang="ts">
import { useDashboard } from '@/composables/useDashboard'
import { formatDate } from '@/utils/dateFormat'
import { computed } from 'vue'

const {
  recentReports: rawRecentReports,
  topCategories,
  categoriesCount,
  analysesCount,
  reportsCount,
  totalFlagged,
  loading,
  error,
} = useDashboard()

// Filter out null values from recentReports
const recentReports = computed(() => rawRecentReports.value.filter((report) => report !== null))
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-pulse text-center">
        <div class="h-4 w-32 bg-muted rounded mx-auto mb-4"></div>
        <p class="text-muted-foreground">Loading dashboard data...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-destructive/10 text-destructive p-4 rounded-md my-8">
      <p class="font-medium">Failed to load dashboard data</p>
      <p class="text-sm">
        Please try refreshing the page or contact support if the issue persists.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Summary Cards -->
      <div class="bg-card rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Key Metrics</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-muted p-4 rounded-md">
            <p class="text-sm text-muted-foreground">Total Flagged Words</p>
            <p class="text-2xl font-bold">{{ totalFlagged }}</p>
          </div>
          <div class="bg-muted p-4 rounded-md">
            <p class="text-sm text-muted-foreground">Categories</p>
            <p class="text-2xl font-bold">{{ categoriesCount }}</p>
          </div>
          <div class="bg-muted p-4 rounded-md">
            <p class="text-sm text-muted-foreground">Reports Generated</p>
            <p class="text-2xl font-bold">{{ reportsCount }}</p>
          </div>
          <div class="bg-muted p-4 rounded-md">
            <p class="text-sm text-muted-foreground">Text Analyses</p>
            <p class="text-2xl font-bold">{{ analysesCount }}</p>
          </div>
        </div>
      </div>

      <!-- Top Categories -->
      <div class="bg-card rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Top Categories</h2>
        <div v-if="topCategories.length > 0" class="space-y-4">
          <div
            v-for="category in topCategories"
            :key="category.name"
            class="flex items-center justify-between"
          >
            <span>{{ category.name }}</span>
            <div class="flex items-center space-x-2">
              <div
                class="h-2 rounded-full bg-primary"
                :style="{ width: `${Math.min(category.count * 2, 150)}px` }"
              ></div>
              <span class="text-sm font-medium">{{ category.count }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-muted-foreground text-center p-4">No category data available</div>
      </div>

      <!-- Recent Reports -->
      <div class="bg-card rounded-lg shadow p-6 md:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Recent Reports</h2>
          <router-link to="/reports" class="text-primary text-sm hover:underline">
            View all
          </router-link>
        </div>
        <div v-if="recentReports.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left py-2 px-4 font-medium">Title</th>
                <th class="text-left py-2 px-4 font-medium">Date</th>
                <th class="text-right py-2 px-4 font-medium">Flagged</th>
                <th class="text-right py-2 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in recentReports" :key="report.id" class="border-b border-border">
                <td class="py-2 px-4">{{ report.title }}</td>
                <td class="py-2 px-4">{{ formatDate(report.startDate) }}</td>
                <td class="py-2 px-4 text-right">{{ report.totalFlagged }}</td>
                <td class="py-2 px-4 text-right">
                  <router-link :to="`/reports/${report.id}`" class="text-primary hover:underline">
                    Details
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-muted-foreground text-center p-4">No reports available</div>
      </div>
    </div>
  </div>
</template>
