import { useLazyQuery } from '@vue/apollo-composable'
import { ref, computed } from 'vue'
import gql from 'graphql-tag'

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

// Define types based on the GraphQL schema
interface FlaggedWord {
  word: string
  severity: number
  contextDependent: boolean
  aiDetectable: boolean
  geminiExplanation?: string
  suggestions?: string[]
  category?: string
}

interface SentimentAnalysis {
  id: string
  sentiment: string
  appropriatenessScore: number
  toxicityScore: number
  professionalismScore: number
  review?: string
}

interface CheckTextResult {
  checkText: FlaggedWord[]
}

interface AnalyzeSentimentResult {
  analyzeSentiment: SentimentAnalysis
}

export function useTextAnalysis() {
  const text = ref('')

  // Check text for profanity using useLazyQuery
  const {
    result: checkResult,
    loading: checkLoading,
    error: checkError,
    load: loadCheck,
  } = useLazyQuery<CheckTextResult>(CHECK_TEXT)

  // Analyze sentiment using useLazyQuery
  const {
    result: sentimentResult,
    loading: sentimentLoading,
    error: sentimentError,
    load: loadSentiment,
  } = useLazyQuery<AnalyzeSentimentResult>(ANALYZE_SENTIMENT)

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
