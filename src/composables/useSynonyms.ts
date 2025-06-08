import { useQuery } from '@vue/apollo-composable'
import { ref, computed } from 'vue'
import gql from 'graphql-tag'

// GraphQL documents
const GET_SUGGESTIONS = gql`
  query GetSuggestions($word: String!, $context: String) {
    getSuggestions(word: $word, context: $context)
  }
`

const GET_ALL_SYNONYMS = gql`
  query GetAllSynonyms {
    getAllSynonyms {
      word
      suggestions
      appropriatenessScore
    }
  }
`

// Types based on the GraphQL schema
interface Synonym {
  word: string
  suggestions: string[]
  appropriatenessScore: number
}

interface GetSuggestionsResult {
  getSuggestions: string[]
}

interface GetAllSynonymsResult {
  getAllSynonyms: Synonym[]
}

export function useSynonyms() {
  // Get suggestions for a word
  const word = ref('')
  const context = ref('')

  const {
    result: suggestionsResult,
    loading: suggestionsLoading,
    error: suggestionsError,
    refetch: refetchSuggestions,
  } = useQuery<GetSuggestionsResult>(
    GET_SUGGESTIONS,
    () => ({ word: word.value, context: context.value }),
    { enabled: false },
  )

  const suggestions = computed(() => suggestionsResult.value?.getSuggestions || [])

  // Get all synonyms
  const {
    result: allSynonymsResult,
    loading: allSynonymsLoading,
    error: allSynonymsError,
  } = useQuery<GetAllSynonymsResult>(GET_ALL_SYNONYMS)

  const allSynonyms = computed(() => allSynonymsResult.value?.getAllSynonyms || [])

  const getSuggestions = async (wordValue: string, contextValue?: string) => {
    word.value = wordValue
    context.value = contextValue || ''
    await refetchSuggestions()
    return suggestions.value
  }

  return {
    suggestions,
    suggestionsLoading,
    suggestionsError,
    allSynonyms,
    allSynonymsLoading,
    allSynonymsError,
    getSuggestions,
  }
}
