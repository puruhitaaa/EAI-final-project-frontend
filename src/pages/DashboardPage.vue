<script setup lang="ts">
import { ref } from 'vue'

const recentReports = ref([
  { id: '1', title: 'Weekly Report', date: '2024-11-01', totalFlagged: 45 },
  { id: '2', title: 'Monthly Summary', date: '2024-10-31', totalFlagged: 128 },
  { id: '3', title: 'Q3 Analysis', date: '2024-10-15', totalFlagged: 287 },
])

const topCategories = ref([
  { name: 'Profanity', count: 156 },
  { name: 'Hate Speech', count: 89 },
  { name: 'Harassment', count: 67 },
  { name: 'Sexual Content', count: 53 },
])
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Summary Cards -->
      <div class="bg-card rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Key Metrics</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-muted p-4 rounded-md">
            <p class="text-sm text-muted-foreground">Total Flagged Words</p>
            <p class="text-2xl font-bold">1,248</p>
          </div>
          <div class="bg-muted p-4 rounded-md">
            <p class="text-sm text-muted-foreground">Categories</p>
            <p class="text-2xl font-bold">14</p>
          </div>
          <div class="bg-muted p-4 rounded-md">
            <p class="text-sm text-muted-foreground">Reports Generated</p>
            <p class="text-2xl font-bold">24</p>
          </div>
          <div class="bg-muted p-4 rounded-md">
            <p class="text-sm text-muted-foreground">Text Analyses</p>
            <p class="text-2xl font-bold">532</p>
          </div>
        </div>
      </div>

      <!-- Top Categories -->
      <div class="bg-card rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Top Categories</h2>
        <div class="space-y-4">
          <div
            v-for="category in topCategories"
            :key="category.name"
            class="flex items-center justify-between"
          >
            <span>{{ category.name }}</span>
            <div class="flex items-center space-x-2">
              <div
                class="h-2 rounded-full bg-primary"
                :style="{ width: `${category.count / 2}px` }"
              ></div>
              <span class="text-sm font-medium">{{ category.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="bg-card rounded-lg shadow p-6 md:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Recent Reports</h2>
          <router-link to="/reports" class="text-primary text-sm hover:underline">
            View all
          </router-link>
        </div>
        <div class="overflow-x-auto">
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
                <td class="py-2 px-4">{{ report.date }}</td>
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
      </div>
    </div>
  </div>
</template>
