<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCategories } from '@/composables/useCategories'

const {
  categories,
  categoriesLoading,
  categoriesError,
  wordCategory,
  wordCategoryLoading,
  wordCategoryError,
  getCategoryForWord,
} = useCategories()

const wordToAnalyze = ref('')
const contextToAnalyze = ref('')

const filteredCategories = computed(
  () => categories.value?.filter((cat): cat is NonNullable<typeof cat> => !!cat) ?? [],
)

const handleAnalyzeWord = () => {
  if (!wordToAnalyze.value.trim()) return
  getCategoryForWord(wordToAnalyze.value, contextToAnalyze.value)
}

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
</script>

<template>
  <div class="space-y-8">
    <header>
      <h1 class="text-3xl font-bold tracking-tight">Content Categories</h1>
      <p class="text-muted-foreground mt-1">
        Explore predefined content categories and test how individual words are classified.
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <!-- Left Column: Categories List -->
      <div class="bg-card rounded-xl border shadow-sm">
        <header class="p-6">
          <h2 class="text-lg font-semibold">Available Categories</h2>
          <p class="text-sm text-muted-foreground">
            A list of all categories used for text analysis.
          </p>
        </header>

        <div v-if="categoriesLoading" class="p-16 text-center">
          <div class="animate-pulse text-muted-foreground">Loading categories...</div>
        </div>
        <div v-else-if="categoriesError" class="p-6 text-destructive-foreground bg-destructive/80">
          Error loading categories: {{ categoriesError.message }}
        </div>
        <div v-else-if="!filteredCategories.length" class="text-center p-16 text-muted-foreground">
          <h3 class="text-lg font-semibold">No Categories Found</h3>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="border-b">
              <tr class="text-muted-foreground">
                <th class="p-4 text-left font-medium">Category</th>
                <th class="p-4 text-left font-medium">Description</th>
                <th class="p-4 text-center font-medium">Severity</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="category in filteredCategories"
                :key="category.id"
                class="border-b hover:bg-muted/50"
              >
                <td class="p-4 font-semibold">{{ category.name }}</td>
                <td class="p-4 text-muted-foreground max-w-sm truncate">
                  {{ category.description }}
                </td>
                <td class="p-4 text-center">
                  <span
                    class="px-2 py-1 text-xs rounded-full font-medium"
                    :class="getSeverityClass(category.severityLevel)"
                  >
                    {{ category.severityLevel }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Analyze a Word -->
      <div class="bg-card rounded-xl border shadow-sm space-y-4 p-6 sticky top-4">
        <div>
          <h2 class="text-lg font-semibold">Analyze a Word</h2>
          <p class="text-sm text-muted-foreground">
            Enter a word and optional context to see its category.
          </p>
        </div>

        <div class="space-y-2">
          <input
            v-model="wordToAnalyze"
            placeholder="Enter a word (e.g., 'dangerous')"
            class="w-full rounded-md border-border bg-background p-2"
            @keyup.enter="handleAnalyzeWord"
          />
          <textarea
            v-model="contextToAnalyze"
            placeholder="Provide context (optional)"
            rows="2"
            class="w-full rounded-md border-border bg-background p-2"
          ></textarea>
        </div>

        <button
          @click="handleAnalyzeWord"
          :disabled="!wordToAnalyze.trim() || wordCategoryLoading"
          class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <span v-if="wordCategoryLoading" class="animate-pulse">Analyzing...</span>
          <span v-else>Analyze</span>
        </button>

        <!-- Analysis Results -->
        <div class="pt-4">
          <div v-if="wordCategoryLoading" class="text-center">
            <div class="animate-pulse text-muted-foreground">Fetching category...</div>
          </div>
          <div
            v-else-if="wordCategoryError"
            class="p-4 text-destructive-foreground bg-destructive/80 rounded-md"
          >
            <h4 class="font-semibold">Error</h4>
            <p>{{ wordCategoryError.message }}</p>
          </div>
          <div v-else-if="wordCategory" class="space-y-3">
            <h3 class="font-semibold">Analysis for "{{ wordCategory.word }}"</h3>
            <div class="border rounded-md p-3 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Category:</span>
                <span class="font-medium">{{ wordCategory.category }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Severity:</span>
                <span
                  class="px-2 py-0.5 text-xs rounded-full font-medium"
                  :class="getSeverityClass(wordCategory.severityLevel)"
                  >{{ wordCategory.severityLevel }}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Confidence:</span>
                <span class="font-medium"
                  >{{ wordCategory.confidence ? wordCategory.confidence : 'N/A' }}%</span
                >
              </div>
              <div class="pt-2">
                <p class="text-muted-foreground text-xs">Description:</p>
                <p>{{ wordCategory.description }}</p>
              </div>
              <div v-if="wordCategory.explanation" class="pt-2">
                <p class="text-muted-foreground text-xs">Explanation:</p>
                <p>{{ wordCategory.explanation }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-muted-foreground py-8">
            <p>Results will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
