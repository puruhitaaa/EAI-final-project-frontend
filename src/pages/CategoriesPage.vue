<script setup lang="ts">
import { ref } from 'vue'
import { useCategories } from '@/composables/useCategories'

interface CategoryForm {
  name: string
  description: string
  severityLevel: string
}

interface Category {
  id: string
  name: string
  description: string
  severityLevel: string
}

const { categories, categoriesLoading } = useCategories()

const showAddForm = ref(false)
const newCategory = ref<CategoryForm>({
  name: '',
  description: '',
  severityLevel: 'Medium',
})
const editingCategory = ref<string | null>(null)

const severityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
]

const resetForm = () => {
  newCategory.value = {
    name: '',
    description: '',
    severityLevel: 'Medium',
  }
  editingCategory.value = null
}

// In a real application, these would be mutations to the GraphQL API
const handleAddCategory = () => {
  if (!newCategory.value.name || !newCategory.value.description) return

  // For now, we'll just show an alert as we don't have the mutation for category management
  if (editingCategory.value) {
    alert(`Editing category: ${JSON.stringify(newCategory.value)}`)
  } else {
    alert(`Adding new category: ${JSON.stringify(newCategory.value)}`)
  }

  showAddForm.value = false
  resetForm()
}

const handleEditCategory = (category: Category) => {
  editingCategory.value = category.id
  newCategory.value = {
    name: category.name,
    description: category.description,
    severityLevel: category.severityLevel,
  }
  showAddForm.value = true
}

const handleDeleteCategory = (categoryId: string) => {
  if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
    // In a real application, this would be a mutation to the GraphQL API
    alert(`Deleting category with ID: ${categoryId}`)
  }
}

const getSeverityClass = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'high':
      return 'bg-destructive text-destructive-foreground'
    case 'medium':
      return 'bg-amber-500 text-white'
    case 'low':
      return 'bg-yellow-300 text-yellow-900'
    default:
      return 'bg-muted text-muted-foreground'
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Categories</h1>
      <button
        @click="
          () => {
            showAddForm = !showAddForm
            resetForm()
          }
        "
        class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        {{ showAddForm ? 'Cancel' : 'Add Category' }}
      </button>
    </div>

    <!-- Add/Edit Category Form -->
    <div v-if="showAddForm" class="bg-card rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">
        {{ editingCategory ? 'Edit Category' : 'Add New Category' }}
      </h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            v-model="newCategory.name"
            class="w-full rounded-md border-border bg-background px-3 py-2 text-sm"
            placeholder="Category name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea
            v-model="newCategory.description"
            rows="3"
            class="w-full rounded-md border-border bg-background px-3 py-2 text-sm"
            placeholder="Category description"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Severity Level</label>
          <select
            v-model="newCategory.severityLevel"
            class="w-full rounded-md border-border bg-background px-3 py-2 text-sm"
          >
            <option v-for="option in severityOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="flex justify-end">
          <button
            @click="handleAddCategory"
            class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            :disabled="!newCategory.name || !newCategory.description"
          >
            {{ editingCategory ? 'Update Category' : 'Add Category' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="categoriesLoading && !categories.length"
      class="flex justify-center items-center py-12"
    >
      <div
        class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
      ></div>
    </div>

    <!-- No Categories State -->
    <div v-else-if="!categories.length" class="bg-card rounded-lg shadow p-8 text-center">
      <p class="text-lg text-muted-foreground mb-4">No categories available</p>
      <button
        @click="showAddForm = true"
        class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        Add Your First Category
      </button>
    </div>

    <!-- Categories List -->
    <div v-else class="bg-card rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left py-3 px-4 font-medium">Name</th>
              <th class="text-left py-3 px-4 font-medium">Description</th>
              <th class="text-left py-3 px-4 font-medium">Severity</th>
              <th class="text-right py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in categories"
              :key="category.id"
              class="border-b border-border hover:bg-muted/50"
            >
              <td class="py-3 px-4 font-medium">{{ category.name }}</td>
              <td class="py-3 px-4">{{ category.description }}</td>
              <td class="py-3 px-4">
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  :class="getSeverityClass(category.severityLevel)"
                >
                  {{ category.severityLevel }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="() => handleEditCategory(category)"
                    class="text-sm bg-accent text-accent-foreground px-2 py-1 rounded hover:bg-accent/80 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    @click="() => handleDeleteCategory(category.id)"
                    class="text-sm bg-destructive text-destructive-foreground px-2 py-1 rounded hover:bg-destructive/80 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
