import { useQuery, useMutation } from '@vue/apollo-composable'
import { computed } from 'vue'
import gql from 'graphql-tag'
import type {
  GetAllProfaneWordsQuery,
  AddProfaneWordMutation,
  AddProfaneWordMutationVariables,
} from '@/gql/graphql'

const GET_ALL_PROFANE_WORDS = gql`
  query GetAllProfaneWords {
    getAllProfaneWords {
      word
      severity
      contextDependent
    }
  }
`

const ADD_PROFANE_WORD = gql`
  mutation AddProfaneWord($word: String!, $severity: Int, $contextDependent: Boolean) {
    addProfaneWord(word: $word, severity: $severity, contextDependent: $contextDependent) {
      word
      severity
    }
  }
`

export function useProfanity() {
  const {
    result: profaneWordsResult,
    loading: profaneWordsLoading,
    error: profaneWordsError,
    refetch: refetchProfaneWords,
  } = useQuery<GetAllProfaneWordsQuery>(GET_ALL_PROFANE_WORDS)

  const profaneWords = computed(() => profaneWordsResult.value?.getAllProfaneWords ?? [])

  const {
    mutate: addProfaneWordMutation,
    loading: addProfaneWordLoading,
    error: addProfaneWordError,
  } = useMutation<AddProfaneWordMutation, AddProfaneWordMutationVariables>(ADD_PROFANE_WORD, {
    update: (cache, { data }) => {
      if (!data?.addProfaneWord) return

      const existingData = cache.readQuery<GetAllProfaneWordsQuery>({
        query: GET_ALL_PROFANE_WORDS,
      })
      if (existingData?.getAllProfaneWords) {
        cache.writeQuery({
          query: GET_ALL_PROFANE_WORDS,
          data: {
            ...existingData,
            getAllProfaneWords: [...existingData.getAllProfaneWords, data.addProfaneWord],
          },
        })
      }
    },
  })

  return {
    profaneWords,
    profaneWordsLoading,
    profaneWordsError,
    refetchProfaneWords,
    addProfaneWord: addProfaneWordMutation,
    addProfaneWordLoading,
    addProfaneWordError,
  }
}
