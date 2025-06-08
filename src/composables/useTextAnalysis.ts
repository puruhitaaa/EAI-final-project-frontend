import { useLazyQuery } from '@vue/apollo-composable'
import { ref, computed } from 'vue'
import gql from 'graphql-tag'
import type {
  CheckTextQuery,
  CheckTextQueryVariables,
  AnalyzeSentimentQuery,
  AnalyzeSentimentQueryVariables,
} from '@/gql/graphql'

// GraphQL documents
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

  // Check text for profanity using useLazyQuery
  const {
    result: checkResult,
    loading: checkLoading,
    error: checkError,
    load: loadCheck,
  } = useLazyQuery<CheckTextQuery, CheckTextQueryVariables>(CHECK_TEXT)

  // Analyze sentiment using useLazyQuery
  const {
    result: sentimentResult,
    loading: sentimentLoading,
    error: sentimentError,
    load: loadSentiment,
  } = useLazyQuery<AnalyzeSentimentQuery, AnalyzeSentimentQueryVariables>(ANALYZE_SENTIMENT)

  const flaggedWords = computed(() => checkResult.value?.checkText || [])
  const sentiment = computed(() => sentimentResult.value?.analyzeSentiment)

  const checkText = async (inputText: string) => {
    text.value = inputText
    await loadCheck(undefined, { input: inputText })
  }

  const analyzeSentiment = async (inputText: string) => {
    text.value = inputText
    await loadSentiment(undefined, { text: inputText })
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
