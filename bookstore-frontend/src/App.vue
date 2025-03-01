<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <RouterLink to="/" class="text-xl font-bold text-gray-800">
          MyApp
        </RouterLink>

        <nav class="space-x-6">
          <RouterLink to="/" class="text-gray-600 hover:text-blue-600">Trang chủ</RouterLink>
          <RouterLink to="/login" class="text-gray-600 hover:text-blue-600">Đăng nhập</RouterLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-6 py-4">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
</style>
