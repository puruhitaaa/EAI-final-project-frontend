import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref, computed } from 'vue'
import gql from 'graphql-tag'
import type {
  GetAllSynonymsQuery,
  SaveSynonymsMutation,
  SaveSynonymsMutationVariables,
} from '@/gql/graphql'

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

const SAVE_SYNONYMS = gql`
  mutation SaveSynonyms($word: String!, $synonyms: [String!]!, $appropriatenessScore: Int) {
    saveSynonyms(word: $word, synonyms: $synonyms, appropriatenessScore: $appropriatenessScore) {
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
    result: synonymsResult,
    loading: synonymsLoading,
    error: synonymsError,
    refetch: refetchSynonyms,
  } = useQuery<GetAllSynonymsQuery>(GET_ALL_SYNONYMS)

  const synonyms = computed(() => synonymsResult.value?.getAllSynonyms ?? [])

  const getSuggestions = async (wordValue: string, contextValue?: string) => {
    word.value = wordValue
    context.value = contextValue || ''
    await refetchSuggestions()
    return suggestions.value
  }

  const {
    mutate: saveSynonymsMutation,
    loading: saveSynonymsLoading,
    error: saveSynonymsError,
  } = useMutation<SaveSynonymsMutation, SaveSynonymsMutationVariables>(SAVE_SYNONYMS)

  return {
    suggestions,
    suggestionsLoading,
    suggestionsError,
    synonyms,
    synonymsLoading,
    synonymsError,
    getSuggestions,
    refetchSynonyms,
    saveSynonyms: saveSynonymsMutation,
    saveSynonymsLoading,
    saveSynonymsError,
  }
}
