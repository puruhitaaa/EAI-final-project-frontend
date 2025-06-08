<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfanity } from '@/composables/useProfanity'
import { PlusCircle } from 'lucide-vue-next'

const {
  profaneWords,
  profaneWordsLoading,
  profaneWordsError,
  addProfaneWord,
  addProfaneWordLoading,
} = useProfanity()

const showAddForm = ref(false)
const newWord = ref({
  word: '',
  severity: 1,
  contextDependent: false,
})

const filteredWords = computed(
  () => profaneWords.value?.filter((word): word is NonNullable<typeof word> => !!word) ?? [],
)

const resetForm = () => {
  newWord.value = { word: '', severity: 1, contextDependent: false }
  showAddForm.value = false
}

const handleAddWord = async () => {
  if (!newWord.value.word.trim()) return
  try {
    await addProfaneWord(newWord.value)
    resetForm()
  } catch (e) {
    console.error('Failed to add word:', e)
  }
}

const getSeverityClass = (severity: unknown): string => {
  const level = Number(severity)
  if (level > 7) return 'bg-destructive text-destructive-foreground'
  if (level > 4) return 'bg-yellow-500 text-white'
  return 'bg-blue-500 text-white'
}
</script>

<template>
  <div class="space-y-8">
    <header class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Profanity Management</h1>
        <p class="text-muted-foreground mt-1">View and manage the list of flagged profane words.</p>
      </div>
      <button
        @click="showAddForm = !showAddForm"
        class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        <PlusCircle class="h-4 w-4" />
        {{ showAddForm ? 'Cancel' : 'Add Word' }}
      </button>
    </header>

    <div v-if="showAddForm" class="bg-card rounded-xl border shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-4">Add New Profane Word</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          v-model="newWord.word"
          placeholder="New word..."
          class="md:col-span-2 w-full rounded-md border-border bg-background p-2"
        />
        <input
          v-model.number="newWord.severity"
          type="number"
          min="1"
          max="10"
          placeholder="Severity (1-10)"
          class="w-full rounded-md border-border bg-background p-2"
        />
      </div>
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="newWord.contextDependent" />
          Context-dependent
        </label>
        <button
          @click="handleAddWord"
          :disabled="!newWord.word.trim() || addProfaneWordLoading"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <span v-if="addProfaneWordLoading" class="animate-pulse">Adding...</span>
          <span v-else>Add Word</span>
        </button>
      </div>
    </div>

    <div class="bg-card rounded-xl border shadow-sm">
      <div v-if="profaneWordsLoading" class="p-16 text-center">
        <div class="animate-pulse text-muted-foreground">Loading profane words...</div>
      </div>
      <div v-else-if="profaneWordsError" class="p-6 text-destructive-foreground bg-destructive/80">
        Error loading data: {{ profaneWordsError.message }}
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b">
            <tr class="text-muted-foreground">
              <th class="p-4 text-left font-medium">Word</th>
              <th class="p-4 text-center font-medium">Severity</th>
              <th class="p-4 text-center font-medium">Context Dependent</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="word in filteredWords" :key="word.word" class="border-b hover:bg-muted/50">
              <td class="p-4 font-semibold">{{ word.word }}</td>
              <td class="p-4 text-center">
                <span
                  class="px-2 py-1 text-xs rounded-full font-medium"
                  :class="getSeverityClass(word.severity)"
                >
                  {{ word.severity }}
                </span>
              </td>
              <td class="p-4 text-center">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="
                    word.contextDependent
                      ? 'bg-blue-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  "
                >
                  {{ word.contextDependent ? 'Yes' : 'No' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
