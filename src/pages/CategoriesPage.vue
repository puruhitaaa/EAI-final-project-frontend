<script setup lang="ts">
import { ref } from 'vue'

const categories = ref([
  {
    id: '1',
    name: 'Profanity',
    description: 'Offensive language and swear words',
    severityLevel: 'Medium',
  },
  {
    id: '2',
    name: 'Hate Speech',
    description: 'Content that promotes hate or violence against groups',
    severityLevel: 'High',
  },
  {
    id: '3',
    name: 'Harassment',
    description: 'Content targeting individuals in a harmful way',
    severityLevel: 'High',
  },
  {
    id: '4',
    name: 'Sexual Content',
    description: 'Explicit sexual references or innuendo',
    severityLevel: 'Medium',
  },
  {
    id: '5',
    name: 'Discrimination',
    description: 'Prejudicial statements based on protected characteristics',
    severityLevel: 'High',
  },
  {
    id: '6',
    name: 'Threats',
    description: 'Statements indicating intent to harm',
    severityLevel: 'High',
  },
  {
    id: '7',
    name: 'Mild Language',
    description: 'Mildly inappropriate language',
    severityLevel: 'Low',
  },
])

const showAddForm = ref(false)
const newCategory = ref({
  name: '',
  description: '',
  severityLevel: 'Medium',
})
const editingCategory = ref(null)

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

const handleAddCategory = () => {
  if (!newCategory.value.name || !newCategory.value.description) return

  if (editingCategory.value) {
    // Edit existing category
    const index = categories.value.findIndex((c) => c.id === editingCategory.value)
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index],
        name: newCategory.value.name,
        description: newCategory.value.description,
        severityLevel: newCategory.value.severityLevel,
      }
    }
  } else {
    // Add new category
    categories.value.push({
      id: Math.floor(Math.random() * 10000).toString(),
      name: newCategory.value.name,
      description: newCategory.value.description,
      severityLevel: newCategory.value.severityLevel,
    })
  }

  showAddForm.value = false
  resetForm()
}

const handleEditCategory = (category) => {
  editingCategory.value = category.id
  newCategory.value = {
    name: category.name,
    description: category.description,
    severityLevel: category.severityLevel,
  }
  showAddForm.value = true
}

const handleDeleteCategory = (categoryId) => {
  if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
    categories.value = categories.value.filter((c) => c.id !== categoryId)
  }
}

const getSeverityClass = (severity) => {
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

    <!-- Categories List -->
    <div class="bg-card rounded-lg shadow">
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
