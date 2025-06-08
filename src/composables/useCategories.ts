import { useQuery, useLazyQuery } from '@vue/apollo-composable'
import { computed } from 'vue'
import gql from 'graphql-tag'
import type {
  GetAllCategoriesQuery,
  GetCategoryForWordQuery,
  GetCategoryForWordQueryVariables,
} from '@/gql/graphql'

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

export function useCategories() {
  // Get all categories
  const {
    result: categoriesResult,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery<GetAllCategoriesQuery>(GET_ALL_CATEGORIES)

  const categories = computed(() => categoriesResult.value?.getAllCategories ?? [])

  // Get category for a word (lazily)
  const {
    result: wordCategoryResult,
    loading: wordCategoryLoading,
    error: wordCategoryError,
    load: loadWordCategory,
  } = useLazyQuery<GetCategoryForWordQuery, GetCategoryForWordQueryVariables>(GET_CATEGORY_FOR_WORD)

  const wordCategory = computed(() => wordCategoryResult.value?.getCategoryForWord)

  const getCategoryForWord = async (word: string, context?: string) => {
    // The 'load' function from useLazyQuery returns a promise.
    // It can be called without checking if it's defined.
    await loadWordCategory(undefined, { word, context: context ?? '' })
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
