<script setup lang="ts">
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b border-border sticky top-0 z-50 bg-background">
      <nav class="container mx-auto p-4">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold">Text Analysis Platform</h1>

          <!-- Mobile menu button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-md hover:bg-accent focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu v-if="!isMobileMenuOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>

          <!-- Desktop navigation -->
          <div class="hidden md:flex gap-4">
            <router-link
              to="/"
              class="hover:text-primary transition-colors py-1"
              @click="closeMobileMenu"
            >
              Dashboard
            </router-link>
            <router-link
              to="/text-analysis"
              class="hover:text-primary transition-colors py-1"
              @click="closeMobileMenu"
            >
              Text Analysis
            </router-link>
            <router-link
              to="/reports"
              class="hover:text-primary transition-colors py-1"
              @click="closeMobileMenu"
            >
              Reports
            </router-link>
            <router-link
              to="/categories"
              class="hover:text-primary transition-colors py-1"
              @click="closeMobileMenu"
            >
              Categories
            </router-link>
            <router-link
              to="/profanity"
              class="hover:text-primary transition-colors py-1"
              @click="closeMobileMenu"
            >
              Profanity
            </router-link>
            <router-link
              to="/synonyms"
              class="hover:text-primary transition-colors py-1"
              @click="closeMobileMenu"
            >
              Synonyms
            </router-link>
            <router-link
              to="/healthcare-reviews"
              class="hover:text-primary transition-colors py-1"
              @click="closeMobileMenu"
            >
              Healthcare Reviews
            </router-link>
          </div>
        </div>

        <!-- Mobile navigation -->
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden pt-4 pb-2 space-y-3 border-t mt-4 animate-in slide-in-from-top duration-200"
        >
          <router-link
            to="/"
            class="block px-2 py-2 hover:bg-accent rounded-md transition-colors"
            @click="closeMobileMenu"
          >
            Dashboard
          </router-link>
          <router-link
            to="/text-analysis"
            class="block px-2 py-2 hover:bg-accent rounded-md transition-colors"
            @click="closeMobileMenu"
          >
            Text Analysis
          </router-link>
          <router-link
            to="/reports"
            class="block px-2 py-2 hover:bg-accent rounded-md transition-colors"
            @click="closeMobileMenu"
          >
            Reports
          </router-link>
          <router-link
            to="/categories"
            class="block px-2 py-2 hover:bg-accent rounded-md transition-colors"
            @click="closeMobileMenu"
          >
            Categories
          </router-link>
          <router-link
            to="/profanity"
            class="block px-2 py-2 hover:bg-accent rounded-md transition-colors"
            @click="closeMobileMenu"
          >
            Profanity
          </router-link>
          <router-link
            to="/synonyms"
            class="block px-2 py-2 hover:bg-accent rounded-md transition-colors"
            @click="closeMobileMenu"
          >
            Synonyms
          </router-link>
          <router-link
            to="/healthcare-reviews"
            class="block px-2 py-2 hover:bg-accent rounded-md transition-colors"
            @click="closeMobileMenu"
          >
            Healthcare Reviews
          </router-link>
        </div>
      </nav>
    </header>
    <main class="container mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>
