<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';


</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Header></Header>
    <main class="flex-1 container mx-auto px-6 py-4">
      <RouterView />
    </main>
    <FooterComponent></FooterComponent>
  </div>
</template>

<style scoped>
</style>
