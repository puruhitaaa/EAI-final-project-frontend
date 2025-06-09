<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHealthcareReviews, type Review } from '@/composables/useHealthcareReviews'
import { StarIcon } from 'lucide-vue-next'
import { format } from 'date-fns'

// Get healthcare reviews using the composable
const {
  processedReviews,
  reviewsLoading,
  reviewsError,
  processingComplete,
  processingError,
  refetchReviews,
  processReviews,
} = useHealthcareReviews()

// State for sorting and filtering
const sortBy = ref<keyof Review>('createdAt')
const sortDirection = ref<'asc' | 'desc'>('desc')
const filterRating = ref<number | null>(null)

// Load and process reviews on component mount
onMounted(async () => {
  await processReviews()
})

// Handle manual refresh
const handleRefresh = async () => {
  await refetchReviews()
  await processReviews()
}

// Computed property for sorted and filtered reviews
const sortedAndFilteredReviews = computed(() => {
  let filteredList = [...processedReviews.value]

  // Apply rating filter if active
  if (filterRating.value !== null) {
    filteredList = filteredList.filter((review) => review.rating === filterRating.value)
  }

  // Apply sorting
  return filteredList.sort((a, b) => {
    const valueA = a[sortBy.value]
    const valueB = b[sortBy.value]

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection.value === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA)
    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection.value === 'asc' ? valueA - valueB : valueB - valueA
    }

    return 0
  })
})

// Format date helper
const formatDate = (dateString: string) => {
  try {
    // Try parsing as ISO string first
    let date = new Date(dateString)

    // If the date is invalid or the result is "Invalid Date", try unix timestamp
    if (isNaN(date.getTime())) {
      // Check if it's a unix timestamp (seconds or milliseconds)
      const timestamp = parseInt(dateString)
      if (!isNaN(timestamp)) {
        // If it's in seconds (10 digits), convert to milliseconds
        date = new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp)
      }
    }

    // Format the date
    if (!isNaN(date.getTime())) {
      return format(date, 'MMM d, yyyy h:mm a')
    }

    return dateString
  } catch {
    return dateString
  }
}

// Helper for star ratings
const renderStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, index) => index < rating)
}

// Toggle sort order
const toggleSort = (key: keyof Review) => {
  if (sortBy.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortDirection.value = 'desc'
  }
}

// Toggle rating filter
const toggleRatingFilter = (rating: number) => {
  filterRating.value = filterRating.value === rating ? null : rating
}
</script>

<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Healthcare Reviews</h1>
      <p class="text-muted-foreground">Browse and analyze patient reviews of healthcare services</p>
    </header>

    <!-- Controls -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex gap-2 items-center">
        <span class="text-sm font-medium">Filter by Rating:</span>
        <div class="flex gap-1">
          <button
            v-for="n in 5"
            :key="`filter-${n}`"
            @click="toggleRatingFilter(n)"
            class="h-8 w-8 inline-flex items-center justify-center rounded-md"
            :class="{
              'bg-primary text-primary-foreground': filterRating === n,
              'hover:bg-accent': filterRating !== n,
            }"
          >
            {{ n }}
          </button>
          <button
            v-if="filterRating !== null"
            @click="filterRating = null"
            class="h-8 px-2 inline-flex items-center justify-center rounded-md hover:bg-accent text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      <button
        @click="handleRefresh"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
        :disabled="reviewsLoading"
      >
        <span v-if="reviewsLoading" class="animate-pulse h-5 w-5 mr-2">...</span>
        {{ reviewsLoading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="reviewsLoading && !processingComplete" class="flex justify-center items-center p-16">
      <div class="animate-pulse h-10 w-10 text-primary">...</div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="reviewsError || processingError"
      class="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-6"
    >
      <h3 class="font-semibold">Error</h3>
      <p>{{ reviewsError?.message || processingError?.message }}</p>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="processedReviews.length === 0"
      class="bg-muted rounded-xl border p-16 text-center"
    >
      <h3 class="text-xl font-semibold mb-2">No reviews found</h3>
      <p class="text-muted-foreground">There are no healthcare reviews available at the moment.</p>
    </div>

    <!-- Reviews table -->
    <div v-else class="rounded-xl border shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px] caption-bottom">
          <thead>
            <tr class="border-b bg-card">
              <th
                @click="toggleSort('id')"
                class="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-accent"
              >
                <div class="flex items-center gap-1">
                  ID
                  <span v-if="sortBy === 'id'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th
                @click="toggleSort('comment')"
                class="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-accent"
              >
                <div class="flex items-center gap-1">
                  Comment
                  <span v-if="sortBy === 'comment'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th
                @click="toggleSort('rating')"
                class="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-accent"
              >
                <div class="flex items-center gap-1">
                  Rating
                  <span v-if="sortBy === 'rating'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th
                @click="toggleSort('sentiment')"
                class="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-accent"
              >
                <div class="flex items-center gap-1">
                  Sentiment
                  <span v-if="sortBy === 'sentiment'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th
                @click="toggleSort('createdAt')"
                class="h-12 px-4 text-left align-middle font-medium cursor-pointer hover:bg-accent"
              >
                <div class="flex items-center gap-1">
                  Date
                  <span v-if="sortBy === 'createdAt'">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="review in sortedAndFilteredReviews"
              :key="review.id"
              class="border-b hover:bg-muted transition-colors"
            >
              <td class="p-4">
                <div class="flex flex-col">
                  <span class="font-medium">{{ review.id }}</span>
                  <span class="text-xs text-muted-foreground">
                    Patient: {{ review.patient_id }} / Doctor: {{ review.doctor_id }}
                  </span>
                </div>
              </td>
              <td class="p-4">
                <p>{{ review.comment }}</p>
                <p
                  v-if="review.comment_censored && review.comment_censored !== review.comment"
                  class="text-sm text-muted-foreground mt-1"
                >
                  <strong>Censored:</strong> {{ review.comment_censored }}
                </p>
              </td>
              <td class="p-4">
                <div class="flex text-yellow-500">
                  <span
                    v-for="(isActive, i) in renderStars(review.rating)"
                    :key="`star-${review.id}-${i}`"
                    class="mr-0.5"
                  >
                    <StarIcon :class="[isActive ? 'fill-current' : '', 'h-4 w-4']" />
                  </span>
                </div>
                <span>{{ review.rating }}/5</span>
              </td>
              <td class="p-4">
                <span
                  :class="{
                    'text-green-600': review.sentiment?.toLowerCase() === 'positive',
                    'text-red-600': review.sentiment?.toLowerCase() === 'negative',
                    'text-yellow-600': review.sentiment?.toLowerCase() === 'neutral',
                  }"
                >
                  {{ review.sentiment || 'Unknown' }}
                </span>
              </td>
              <td class="p-4 whitespace-nowrap">
                {{ formatDate(review.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
