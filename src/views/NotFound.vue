<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-blue-600">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mt-4">Không tìm thấy trang</h2>
      <p class="text-gray-500 mt-2">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
      <RouterLink 
        to="/" 
        class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Quay về trang chủ
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script> 