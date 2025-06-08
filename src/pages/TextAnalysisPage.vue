<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTextAnalysis } from '@/composables/useTextAnalysis'

const { checkText, flaggedWords, checkLoading, analyzeSentiment, sentiment, sentimentLoading } =
  useTextAnalysis()

const inputText = ref('')
const showResults = ref(false)
const activeTab = ref('flagged')

const handleAnalyzeText = async () => {
  if (!inputText.value.trim()) return

  try {
    await checkText(inputText.value)
    await analyzeSentiment(inputText.value)
    showResults.value = true
  } catch (error) {
    console.error('Error analyzing text:', error)
  }
}

const getSeverityClass = (severity: string): string => {
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

const getSentimentClass = (score?: number): string => {
  if (score === undefined || score === null) return 'bg-muted text-muted-foreground'

  if (score > 0.7) return 'bg-green-500 text-white'
  if (score > 0.5) return 'bg-green-300 text-green-900'
  if (score > 0.3) return 'bg-yellow-300 text-yellow-900'
  return 'bg-destructive text-destructive-foreground'
}

const formattedText = computed(() => {
  if (!inputText.value || !flaggedWords.value?.length) return inputText.value

  let highlighted = inputText.value
  flaggedWords.value.forEach((word) => {
    if (!word || !word.word) return
    const regex = new RegExp(`\\b${word.word}\\b`, 'gi')
    highlighted = highlighted.replace(
      regex,
      `<span class="text-destructive font-medium">${word.word}</span>`,
    )
  })
  return highlighted
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Text Analysis</h1>

    <div class="grid grid-cols-1 gap-6">
      <!-- Text Input Area -->
      <div class="bg-card rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Analyze Text</h2>
        <div class="space-y-4">
          <div>
            <label for="text-input" class="block text-sm font-medium mb-2"
              >Enter text to analyze:</label
            >
            <textarea
              id="text-input"
              v-model="inputText"
              rows="6"
              class="w-full rounded-md border-border bg-background px-3 py-2 text-sm"
              placeholder="Type or paste your text here..."
            ></textarea>
          </div>
          <div class="flex justify-end">
            <button
              @click="handleAnalyzeText"
              class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              :disabled="!inputText.trim() || checkLoading || sentimentLoading"
            >
              <span v-if="checkLoading || sentimentLoading">Analyzing...</span>
              <span v-else>Analyze Text</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Results Area -->
      <div v-if="showResults" class="bg-card rounded-lg shadow p-6">
        <div class="border-b border-border mb-4">
          <div class="flex space-x-4">
            <button
              @click="activeTab = 'flagged'"
              class="px-4 py-2 -mb-px"
              :class="
                activeTab === 'flagged'
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground'
              "
            >
              Flagged Words
            </button>
            <button
              @click="activeTab = 'sentiment'"
              class="px-4 py-2 -mb-px"
              :class="
                activeTab === 'sentiment'
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground'
              "
            >
              Sentiment Analysis
            </button>
            <button
              @click="activeTab = 'preview'"
              class="px-4 py-2 -mb-px"
              :class="
                activeTab === 'preview'
                  ? 'border-b-2 border-primary font-medium'
                  : 'text-muted-foreground'
              "
            >
              Text Preview
            </button>
          </div>
        </div>

        <!-- Flagged Words Tab -->
        <div v-if="activeTab === 'flagged'" class="space-y-6">
          <div v-if="!flaggedWords?.length" class="text-center py-8">
            <p class="text-lg text-muted-foreground">No issues found in the text.</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="(word, index) in flaggedWords" :key="index" class="bg-muted p-4 rounded-md">
              <div class="flex flex-wrap gap-2 mb-2 items-center">
                <h3 class="font-medium">{{ word.word }}</h3>
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  :class="getSeverityClass(word.severity)"
                >
                  {{ word.severity }}
                </span>
                <span class="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">
                  {{ word.category }}
                </span>
              </div>

              <p v-if="word.geminiExplanation" class="text-sm text-muted-foreground mb-3">
                {{ word.geminiExplanation }}
              </p>

              <div v-if="word.suggestions?.length" class="mt-2">
                <h4 class="text-sm font-medium mb-1">Suggestions:</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(suggestion, i) in word.suggestions"
                    :key="i"
                    class="text-sm px-2 py-1 bg-background rounded-md border border-border hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    {{ suggestion }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sentiment Analysis Tab -->
        <div v-if="activeTab === 'sentiment'" class="space-y-6">
          <div v-if="!sentiment" class="text-center py-8 text-muted-foreground">
            <p>Sentiment analysis not available.</p>
          </div>

          <div v-else class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 rounded-md border border-border">
                <h3 class="text-sm text-muted-foreground mb-1">Appropriateness</h3>
                <div class="flex items-center gap-2">
                  <div class="text-xl font-medium">
                    {{ (sentiment.appropriatenessScore * 100).toFixed(0) }}%
                  </div>
                  <div
                    class="px-2 py-1 text-xs rounded-full"
                    :class="getSentimentClass(sentiment.appropriatenessScore)"
                  >
                    {{
                      sentiment.appropriatenessScore > 0.7
                        ? 'Good'
                        : sentiment.appropriatenessScore > 0.4
                          ? 'Medium'
                          : 'Poor'
                    }}
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-md border border-border">
                <h3 class="text-sm text-muted-foreground mb-1">Toxicity</h3>
                <div class="flex items-center gap-2">
                  <div class="text-xl font-medium">
                    {{ (sentiment.toxicityScore * 100).toFixed(0) }}%
                  </div>
                  <div
                    class="px-2 py-1 text-xs rounded-full"
                    :class="getSentimentClass(1 - sentiment.toxicityScore)"
                  >
                    {{
                      sentiment.toxicityScore < 0.3
                        ? 'Low'
                        : sentiment.toxicityScore < 0.6
                          ? 'Medium'
                          : 'High'
                    }}
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-md border border-border">
                <h3 class="text-sm text-muted-foreground mb-1">Professionalism</h3>
                <div class="flex items-center gap-2">
                  <div class="text-xl font-medium">
                    {{ (sentiment.professionalismScore * 100).toFixed(0) }}%
                  </div>
                  <div
                    class="px-2 py-1 text-xs rounded-full"
                    :class="getSentimentClass(sentiment.professionalismScore)"
                  >
                    {{
                      sentiment.professionalismScore > 0.7
                        ? 'Professional'
                        : sentiment.professionalismScore > 0.4
                          ? 'Average'
                          : 'Casual'
                    }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="sentiment.review" class="bg-muted p-4 rounded-md">
              <h3 class="font-medium mb-2">AI Review</h3>
              <p class="text-sm">{{ sentiment.review }}</p>
            </div>
          </div>
        </div>

        <!-- Text Preview Tab -->
        <div v-if="activeTab === 'preview'" class="space-y-4">
          <div class="bg-muted p-4 rounded-md">
            <h3 class="font-medium mb-2">Text with Highlighted Issues</h3>
            <p class="text-sm leading-relaxed" v-html="formattedText"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
