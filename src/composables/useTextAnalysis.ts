import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref, computed } from 'vue'
import type {
  CheckTextQuery,
  CheckTextQueryVariables,
  AnalyzeSentimentQuery,
  AnalyzeSentimentQueryVariables,
} from '@/gql/graphql'
import gql from 'graphql-tag'

// Import our GraphQL documents
const CHECK_TEXT = gql`
  query CheckText($input: String!) {
    checkText(input: $input) {
      word
      severity
      contextDependent
      aiDetectable
      geminiExplanation
      suggestions
      category
    }
  }
`

const ANALYZE_SENTIMENT = gql`
  query AnalyzeSentiment($text: String!) {
    analyzeSentiment(text: $text) {
      id
      sentiment
      appropriatenessScore
      toxicityScore
      professionalismScore
      review
    }
  }
`

export function useTextAnalysis() {
  const text = ref('')

  // Check text for profanity
  const {
    result: checkResult,
    loading: checkLoading,
    error: checkError,
    refetch: refetchCheck,
  } = useQuery<CheckTextQuery, CheckTextQueryVariables>(CHECK_TEXT, () => ({ input: text.value }), {
    enabled: false,
  })

  // Analyze sentiment
  const {
    result: sentimentResult,
    loading: sentimentLoading,
    error: sentimentError,
    refetch: refetchSentiment,
  } = useQuery<AnalyzeSentimentQuery, AnalyzeSentimentQueryVariables>(
    ANALYZE_SENTIMENT,
    () => ({ text: text.value }),
    { enabled: false },
  )

  const flaggedWords = computed(() => checkResult.value?.checkText || [])
  const sentiment = computed(() => sentimentResult.value?.analyzeSentiment)

  const checkText = async (inputText: string) => {
    text.value = inputText
    await refetchCheck()
  }

  const analyzeSentiment = async (inputText: string) => {
    text.value = inputText
    await refetchSentiment()
  }

  return {
    text,
    checkText,
    analyzeSentiment,
    flaggedWords,
    sentiment,
    checkLoading,
    checkError,
    sentimentLoading,
    sentimentError,
  }
}
