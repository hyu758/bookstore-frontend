<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/HeaderComponent.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Header></Header>
    <main class="flex-1 container mx-auto px-6 py-4">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
</style>
