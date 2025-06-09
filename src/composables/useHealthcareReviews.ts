import { ref, computed } from 'vue'
import { useTextAnalysis } from './useTextAnalysis'

// Define the review interface based on the GraphQL schema
export interface Review {
  id: string
  patient_id: number
  doctor_id: number
  appointment_id: number
  comment: string
  comment_censored?: string
  rating: number
  sentiment?: string
  createdAt: string
  updatedAt: string
}

// The GraphQL endpoint
const HEALTHCARE_API_URL = 'https://api3.defendercf.online/graphql'

// GraphQL query string
const GET_REVIEWS_QUERY = `
  query GetReviews {
    reviews {
      id
      patient_id
      doctor_id
      appointment_id
      comment
      comment_censored
      rating
      sentiment
      createdAt
      updatedAt
    }
  }
`

export function useHealthcareReviews() {
  const { checkText, flaggedWords, checkLoading, checkError } = useTextAnalysis()
  const reviewsData = ref<Review[]>([])
  const processedReviews = ref<Review[]>([])
  const reviewsLoading = ref(false)
  const reviewsError = ref<Error | null>(null)
  const processingComplete = ref(false)
  const processingError = ref<Error | null>(null)

  // Function to fetch reviews directly using fetch API
  const fetchReviews = async () => {
    reviewsLoading.value = true
    reviewsError.value = null

    try {
      const response = await fetch(HEALTHCARE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: GET_REVIEWS_QUERY,
        }),
      })

      const data = await response.json()

      if (data.errors) {
        throw new Error(data.errors[0].message || 'Error fetching reviews')
      }

      reviewsData.value = data.data.reviews || []
      return reviewsData.value
    } catch (error) {
      reviewsError.value =
        error instanceof Error ? error : new Error('Unknown error occurred fetching reviews')
      console.error('Error fetching reviews:', error)
      return []
    } finally {
      reviewsLoading.value = false
    }
  }

  // Computed property to access the reviews
  const reviews = computed<Review[]>(() => reviewsData.value)

  // Function to process all reviews and check them for profanity
  const processReviews = async () => {
    try {
      processingComplete.value = false

      // First fetch the reviews
      await fetchReviews()

      const reviewsList = reviewsData.value

      if (!reviewsList.length) {
        processedReviews.value = []
        processingComplete.value = true
        return []
      }

      // Extract all comments to check for profanity in a single request
      const comments = reviewsList
        .map((review: Review) => review.comment)
        .filter(Boolean)
        .join(' ')

      // Check all comments at once for profanity using the existing useTextAnalysis
      await checkText(comments)

      // The processed reviews are now available
      processedReviews.value = [...reviewsList]
      processingComplete.value = true
      return processedReviews.value
    } catch (error) {
      processingError.value =
        error instanceof Error
          ? error
          : new Error('Unknown error occurred during review processing')
      console.error('Error processing reviews:', error)
      processingComplete.value = true
      return []
    }
  }

  // Function to manually refetch reviews
  const refetchReviews = async () => {
    return await fetchReviews()
  }

  return {
    reviews,
    processedReviews,
    reviewsLoading,
    reviewsError,
    processingComplete,
    processingError,
    refetchReviews,
    processReviews,
    flaggedWords,
    checkLoading,
    checkError,
  }
}
