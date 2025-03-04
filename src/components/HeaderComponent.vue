<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const isLoggedIn = ref(!!localStorage.getItem("accessToken"));
const router = useRouter();

watchEffect(() => {
  isLoggedIn.value = !!localStorage.getItem("accessToken");
});

// Hàm đăng xuất
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  isLoggedIn.value = false;
  router.push("/login");
};
</script>

<template>
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <RouterLink to="/">
        <div class="flex items-center">
          <img class="h-10 w-auto mx-4" src="/src/assets/logo.png" alt="Logo" />
          <div class="text-xl font-bold text-gray-800">BookZen</div>
        </div>
      </RouterLink>

      <nav class="space-x-6">
        <RouterLink to="/contact" class="text-gray-600 hover:text-blue-600">Liên hệ</RouterLink>
        
        <!-- Nếu đã đăng nhập -->
        <template v-if="isLoggedIn">
          <RouterLink to="/cart" class="text-gray-600 hover:text-blue-600">Giỏ hàng</RouterLink>
          <button @click="logout" class="text-red-600 hover:text-red-800">Đăng xuất</button>
        </template>

        <RouterLink v-else to="/login" class="text-gray-600 hover:text-blue-600">Đăng nhập</RouterLink>
      </nav>
    </div>
  </header>
</template>
