<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTextAnalysis } from '@/composables/useTextAnalysis'
import { useReports } from '@/composables/useReports'
import { AlertTriangle, CheckCircle, Info } from 'lucide-vue-next'

const inputText = ref('')
const analysisPerformed = ref(false)

const {
  checkText,
  analyzeSentiment,
  flaggedWords,
  sentiment,
  checkLoading,
  sentimentLoading,
  checkError,
  sentimentError,
} = useTextAnalysis()

const { logReport } = useReports()

const isLoading = computed(() => checkLoading.value || sentimentLoading.value)
const error = computed(() => checkError.value || sentimentError.value)

const filteredFlaggedWords = computed(() =>
  (flaggedWords.value ?? []).filter(
    (word): word is NonNullable<(typeof flaggedWords.value)[number]> => !!word,
  ),
)

const handleAnalyze = async () => {
  if (!inputText.value.trim() || isLoading.value) return
  analysisPerformed.value = false

  // Using Promise.all to run analyses in parallel
  await Promise.all([checkText(inputText.value), analyzeSentiment(inputText.value)])

  // Log each flagged word to reports after analysis is complete
  if (filteredFlaggedWords.value.length > 0) {
    filteredFlaggedWords.value.forEach(async (word) => {
      try {
        await logReport(word.word, inputText.value, word.category || undefined, word.severity || 1)
      } catch (error) {
        console.error('Error logging flagged word:', error)
      }
    })
  }

  analysisPerformed.value = true
}

const getSeverityClass = (severity: unknown): string => {
  const severityString = String(severity).toLowerCase()
  switch (severityString) {
    case 'high':
      return 'bg-destructive/80 text-destructive-foreground'
    case 'medium':
      return 'bg-yellow-500/80 text-white'
    case 'low':
      return 'bg-blue-500/80 text-white'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getScoreColor = (score: number | undefined): string => {
  if (score === undefined || score === null) return 'bg-muted'
  if (score > 70) return 'bg-green-500'
  if (score > 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

const highlightedText = computed(() => {
  if (!filteredFlaggedWords.value.length) {
    return inputText.value
  }

  let text = inputText.value
  const uniqueWords = [
    ...new Map(filteredFlaggedWords.value.map((item) => [item.word, item])).values(),
  ]

  uniqueWords.forEach((wordInfo) => {
    const regex = new RegExp(`\\b(${wordInfo.word})\\b`, 'gi')
    text = text.replace(
      regex,
      `<span class="bg-destructive/20 text-destructive-foreground p-0.5 rounded">${wordInfo.word}</span>`,
    )
  })

  return text
})

const overallScore = computed(() => {
  if (!sentiment.value) return 0
  const { appropriatenessScore, toxicityScore, professionalismScore } = sentiment.value
  return (
    (Number(appropriatenessScore) + (100 - Number(toxicityScore)) + Number(professionalismScore)) /
    3
  )
})

const overallFeedback = computed(() => {
  const score = overallScore.value
  if (score > 70) return { text: 'Looks Good!', icon: CheckCircle, class: 'text-green-500' }
  if (score > 40)
    return { text: 'Needs Improvement', icon: AlertTriangle, class: 'text-yellow-500' }
  return { text: 'High Risk', icon: AlertTriangle, class: 'text-destructive' }
})
</script>

<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Text Analysis</h1>
      <p class="text-muted-foreground">
        Enter your text below to check for potentially problematic language and analyze its
        sentiment.
      </p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <!-- Input column -->
      <div class="space-y-6 lg:sticky top-8">
        <div class="bg-card rounded-xl border shadow-sm">
          <div class="p-6">
            <h2 class="text-lg font-semibold mb-4">Your Text</h2>
            <textarea
              v-model="inputText"
              rows="10"
              class="w-full rounded-md border-border bg-background p-3 text-base focus:ring-2 focus:ring-primary"
              placeholder="Paste your text here..."
            ></textarea>
          </div>
          <div class="px-6 pb-6 border-t pt-4 flex justify-end">
            <button
              @click="handleAnalyze"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              :disabled="isLoading || !inputText.trim()"
            >
              <span v-if="isLoading" class="animate-pulse h-5 w-5 mr-3" viewBox="0 0 24 24"
                >...</span
              >
              {{ isLoading ? 'Analyzing...' : 'Analyze Text' }}
            </button>
          </div>
        </div>

        <div v-if="analysisPerformed && sentiment" class="bg-card rounded-xl border shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <component :is="overallFeedback.icon" :class="['h-5 w-5', overallFeedback.class]" />
            Overall Assessment: {{ overallFeedback.text }}
          </h3>
          <div class="w-full bg-muted rounded-full h-2.5">
            <div
              :class="['h-2.5 rounded-full', getScoreColor(overallScore)]"
              :style="{ width: `${overallScore}%` }"
            ></div>
          </div>
          <p v-if="sentiment.review" class="text-sm text-muted-foreground mt-4">
            <strong>AI Review:</strong> {{ sentiment.review }}
          </p>
        </div>
      </div>

      <!-- Results column -->
      <div class="space-y-6">
        <div v-if="isLoading" class="flex justify-center items-center p-16">
          <div class="animate-pulse h-10 w-10 text-primary">...</div>
        </div>

        <div
          v-else-if="error"
          class="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-6"
        >
          <h3 class="font-semibold flex items-center gap-2"><AlertTriangle /> Error</h3>
          <p>{{ error.message }}</p>
        </div>

        <div v-else-if="analysisPerformed" class="space-y-6">
          <!-- Flagged Words -->
          <div class="bg-card rounded-xl border shadow-sm">
            <header class="p-6">
              <h2 class="text-lg font-semibold">Flagged Words</h2>
              <p class="text-sm text-muted-foreground">
                Words that might be considered problematic.
              </p>
            </header>
            <div class="p-6 border-t">
              <div
                v-if="!filteredFlaggedWords.length"
                class="text-center text-muted-foreground py-4"
              >
                <CheckCircle class="mx-auto h-8 w-8 text-green-500" />
                <p class="mt-2">No problematic words found.</p>
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="(word, index) in filteredFlaggedWords"
                  :key="index"
                  class="border p-4 rounded-lg"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-bold text-base">{{ word.word }}</h4>
                      <p v-if="word.geminiExplanation" class="text-sm text-muted-foreground mt-1">
                        {{ word.geminiExplanation }}
                      </p>
                    </div>
                    <span
                      :class="[
                        'text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap',
                        getSeverityClass(word.severity),
                      ]"
                    >
                      {{ word.severity }}
                    </span>
                  </div>
                  <div v-if="word.suggestions && word.suggestions.length > 0" class="mt-3">
                    <h5 class="text-sm font-medium mb-2">Suggestions:</h5>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="suggestion in word.suggestions"
                        :key="suggestion ?? ''"
                        class="px-2 py-1 bg-background border rounded-md text-sm cursor-pointer hover:bg-accent"
                      >
                        {{ suggestion }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sentiment Analysis -->
          <div class="bg-card rounded-xl border shadow-sm">
            <header class="p-6">
              <h2 class="text-lg font-semibold">Sentiment Analysis</h2>
              <p class="text-sm text-muted-foreground">
                Emotional tone and other linguistic attributes.
              </p>
            </header>
            <div class="p-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div v-if="!sentiment" class="text-center text-muted-foreground py-4 col-span-3">
                <Info class="mx-auto h-8 w-8" />
                <p class="mt-2">Sentiment data not available.</p>
              </div>
              <template v-else>
                <div>
                  <div class="flex items-center justify-between text-sm mb-1">
                    <h4 class="font-medium text-muted-foreground">Appropriateness</h4>
                    <span class="font-bold text-foreground">
                      {{ sentiment.appropriatenessScore }}
                    </span>
                  </div>
                  <div class="w-full bg-muted rounded-full h-2">
                    <div
                      :class="[
                        'h-2 rounded-full',
                        getScoreColor(sentiment.appropriatenessScore ?? 0),
                      ]"
                      :style="{ width: `${sentiment.appropriatenessScore}%` }"
                    ></div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between text-sm mb-1">
                    <h4 class="font-medium text-muted-foreground">Toxicity</h4>
                    <span class="font-bold text-foreground">
                      {{ sentiment.toxicityScore }}
                    </span>
                  </div>
                  <div class="w-full bg-muted rounded-full h-2">
                    <div
                      :class="['h-2 rounded-full', getScoreColor(sentiment.toxicityScore ?? 0)]"
                      :style="{ width: `${sentiment.toxicityScore}%` }"
                    ></div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between text-sm mb-1">
                    <h4 class="font-medium text-muted-foreground">Professionalism</h4>
                    <span class="font-bold text-foreground">
                      {{ sentiment.professionalismScore }}
                    </span>
                  </div>
                  <div class="w-full bg-muted rounded-full h-2">
                    <div
                      :class="[
                        'h-2 rounded-full',
                        getScoreColor(sentiment.professionalismScore ?? 0),
                      ]"
                      :style="{ width: `${sentiment.professionalismScore}%` }"
                    ></div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Text Preview -->
          <div class="bg-card rounded-xl border shadow-sm">
            <header class="p-6">
              <h2 class="text-lg font-semibold">Highlighted Text</h2>
              <p class="text-sm text-muted-foreground">
                The original text with flagged words highlighted.
              </p>
            </header>
            <div class="p-6 border-t">
              <div
                class="prose prose-sm max-w-none rounded-lg bg-background p-4 border"
                v-html="highlightedText"
              ></div>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-muted-foreground p-16 bg-card rounded-xl border">
          <Info class="mx-auto h-10 w-10 mb-4" />
          <h2 class="text-lg font-semibold">Awaiting Analysis</h2>
          <p>Your analysis results will appear here.</p>
        </div>
      </div>
    </div>
  </div>
</template>
