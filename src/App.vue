<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b border-border">
      <nav class="container mx-auto p-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">Text Analysis Platform</h1>
        <div class="flex gap-4">
          <router-link to="/" class="hover:text-primary transition-colors">Dashboard</router-link>
          <router-link to="/text-analysis" class="hover:text-primary transition-colors"
            >Text Analysis</router-link
          >
          <router-link to="/reports" class="hover:text-primary transition-colors"
            >Reports</router-link
          >
          <router-link to="/categories" class="hover:text-primary transition-colors"
            >Categories</router-link
          >
        </div>
      </nav>
    </header>
    <main class="container mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>
