import { useQuery } from '@vue/apollo-composable'
import { ref, computed } from 'vue'
import gql from 'graphql-tag'

// GraphQL documents
const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    getAllCategories {
      id
      name
      description
      severityLevel
    }
  }
`

const GET_CATEGORY_FOR_WORD = gql`
  query GetCategoryForWord($word: String!, $context: String) {
    getCategoryForWord(word: $word, context: $context) {
      word
      category
      description
      severityLevel
      confidence
      explanation
    }
  }
`

// Types based on the GraphQL schema
interface Category {
  id: string
  name: string
  description: string
  severityLevel: string
}

interface WordCategory {
  word: string
  category: string
  description: string
  severityLevel: string
  confidence: number
  explanation: string
}

interface GetAllCategoriesResult {
  getAllCategories: Category[]
}

interface GetCategoryForWordResult {
  getCategoryForWord: WordCategory
}

export function useCategories() {
  // Get all categories
  const {
    result: categoriesResult,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery<GetAllCategoriesResult>(GET_ALL_CATEGORIES)

  const categories = computed(() => categoriesResult.value?.getAllCategories || [])

  // Get category for a word
  const word = ref('')
  const context = ref('')

  const {
    result: wordCategoryResult,
    loading: wordCategoryLoading,
    error: wordCategoryError,
    refetch: refetchWordCategory,
  } = useQuery<GetCategoryForWordResult>(
    GET_CATEGORY_FOR_WORD,
    () => ({ word: word.value, context: context.value }),
    { enabled: false },
  )

  const wordCategory = computed(() => wordCategoryResult.value?.getCategoryForWord)

  const getCategoryForWord = async (wordValue: string, contextValue?: string) => {
    word.value = wordValue
    context.value = contextValue || ''
    await refetchWordCategory()
    return wordCategory.value
  }

  return {
    categories,
    categoriesLoading,
    categoriesError,
    wordCategory,
    wordCategoryLoading,
    wordCategoryError,
    getCategoryForWord,
  }
}
