<template>
  <div class="w-64 bg-gray-900 text-gray-100 min-h-screen">
    <!-- Header -->
    <div class="px-6 py-8 border-b border-gray-800">
      <div class="flex items-center space-x-3">
        <span class="material-icons text-3xl text-blue-500">admin_panel_settings</span>
        <h1 class="text-xl font-bold tracking-wider">ADMIN PANEL</h1>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="px-4 py-6">
      <RouterLink
        to="/admin"
        class="flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200"
        :class="[$route.path === '/admin' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white']"
      >
        <span class="material-icons mr-3">dashboard</span>
        <span class="font-medium">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/admin/users"
        class="flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200"
        :class="[$route.path === '/admin/users' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white']"
      >
        <span class="material-icons mr-3">group</span>
        <span class="font-medium">Quản lý người dùng</span>
      </RouterLink>

      <RouterLink
        to="/admin/products"
        class="flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200"
        :class="[$route.path === '/admin/products' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white']"
      >
        <span class="material-icons mr-3">menu_book</span>
        <span class="font-medium">Quản lý sách</span>
      </RouterLink>

      <RouterLink
        to="/admin/orders"
        class="flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200"
        :class="[$route.path === '/admin/orders' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white']"
      >
        <span class="material-icons mr-3">shopping_cart</span>
        <span class="font-medium">Quản lý đơn hàng</span>
      </RouterLink>
    </nav>

    <!-- User Profile -->
    <div class="absolute bottom-0 w-64 border-t border-gray-800">
      <div class="px-6 py-4">
        <button 
          @click="handleLogout"
          class="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
        >
          <span class="material-icons mr-3">logout</span>
          <span class="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { setToken } = useAuth();

const handleLogout = () => {
  setToken(null);
  router.push('/login');
};
</script>