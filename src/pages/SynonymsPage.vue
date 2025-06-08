<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSynonyms } from '@/composables/useSynonyms'
import { PlusCircle } from 'lucide-vue-next'

const { synonyms, synonymsLoading, synonymsError, saveSynonyms, saveSynonymsLoading } =
  useSynonyms()

const showForm = ref(false)
const newSynonym = ref({
  word: '',
  suggestions: '',
  appropriatenessScore: 5,
})

const filteredSynonyms = computed(
  () => synonyms.value?.filter((s): s is NonNullable<typeof s> => !!s) ?? [],
)

const resetForm = () => {
  newSynonym.value = { word: '', suggestions: '', appropriatenessScore: 5 }
  showForm.value = false
}

const handleSave = async () => {
  const { word, suggestions, appropriatenessScore } = newSynonym.value
  if (!word.trim() || !suggestions.trim()) return
  try {
    const synonymsArray = suggestions.split(',').map((s) => s.trim())
    await saveSynonyms({ word, synonyms: synonymsArray, appropriatenessScore })
    resetForm()
  } catch (e) {
    console.error('Failed to save synonyms:', e)
  }
}
</script>

<template>
  <div class="space-y-8">
    <header class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Synonym Management</h1>
        <p class="text-muted-foreground mt-1">
          Define and manage synonyms for improved text analysis.
        </p>
      </div>
      <button
        @click="showForm = !showForm"
        class="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        <PlusCircle class="h-4 w-4" />
        {{ showForm ? 'Cancel' : 'Add Synonyms' }}
      </button>
    </header>

    <div v-if="showForm" class="bg-card rounded-xl border shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-4">Add or Update Synonyms</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          v-model="newSynonym.word"
          placeholder="Word (e.g., 'run')"
          class="w-full rounded-md border-border bg-background p-2"
        />
        <input
          v-model="newSynonym.suggestions"
          placeholder="Synonyms (comma-separated, e.g., 'sprint, dash')"
          class="w-full rounded-md border-border bg-background p-2"
        />
      </div>
      <div class="flex items-center justify-between">
        <label class="flex flex-col gap-2 text-sm">
          Appropriateness Score: {{ newSynonym.appropriatenessScore }}
          <input
            v-model.number="newSynonym.appropriatenessScore"
            type="range"
            min="1"
            max="10"
            class="w-48"
          />
        </label>
        <button
          @click="handleSave"
          :disabled="!newSynonym.word.trim() || saveSynonymsLoading"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <span v-if="saveSynonymsLoading" class="animate-pulse">Saving...</span>
          <span v-else>Save</span>
        </button>
      </div>
    </div>

    <div class="bg-card rounded-xl border shadow-sm">
      <div v-if="synonymsLoading" class="p-16 text-center">
        <div class="animate-pulse text-muted-foreground">Loading synonyms...</div>
      </div>
      <div v-else-if="synonymsError" class="p-6 text-destructive-foreground bg-destructive/80">
        Error loading data: {{ synonymsError.message }}
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b">
            <tr class="text-muted-foreground">
              <th class="p-4 text-left font-medium">Word</th>
              <th class="p-4 text-left font-medium">Suggestions</th>
              <th class="p-4 text-center font-medium">Appropriateness</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="syn in filteredSynonyms" :key="syn.word" class="border-b hover:bg-muted/50">
              <td class="p-4 font-semibold">{{ syn.word }}</td>
              <td class="p-4 text-muted-foreground">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(s, i) in syn.suggestions"
                    :key="i"
                    class="bg-muted px-2 py-1 rounded"
                    >{{ s }}</span
                  >
                </div>
              </td>
              <td class="p-4 text-center font-medium">
                {{ syn.appropriatenessScore }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
