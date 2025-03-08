<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Khai báo biến reactive
const isLoggedIn = ref(!!localStorage.getItem("accessToken"));
const isAdmin = ref(false); // Biến để kiểm tra vai trò admin
const router = useRouter();

const checkUserRole = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    isLoggedIn.value = false;
    isAdmin.value = false;
    return;
  }

  try {
    const response = await axios.get("http://localhost:8080/api/auth/role", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*"
      },
    });
    if (response.data.success) {
      // Giả sử API trả về role trong response.data.role
      console.log(response.data.data);
      isAdmin.value = response.data.data === "ADMIN";
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
      isAdmin.value = false;
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra vai trò:", error);
    isLoggedIn.value = false;
    isAdmin.value = false;
    if (error.response?.status === 401) {
      router.push("/login");
    }
  }
};

watchEffect(() => {
  isLoggedIn.value = !!localStorage.getItem("accessToken");
  if (isLoggedIn.value) {
    checkUserRole();
  } else {
    isAdmin.value = false;
  }
});

onMounted(() => {
  checkUserRole();
});

// Hàm đăng xuất
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  isLoggedIn.value = false;
  isAdmin.value = false;
  router.push("/login");
};
</script>

<template>
  <header class="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo và tên -->
        <RouterLink to="/" class="flex items-center space-x-3">
          <img class="h-10 w-auto" src="/src/assets/logo.png" alt="Logo" />
          <span class="text-xl font-bold text-gray-800">BookZen</span>
        </RouterLink>

        <!-- Thanh tìm kiếm -->
        <div class="hidden md:flex flex-1 max-w-lg mx-8">
          <div class="relative w-full">
            <input
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tìm kiếm sách..."
            />
            <button class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              <span class="material-icons">search</span>
            </button>
          </div>
        </div>

        <!-- Menu điều hướng -->
        <nav class="flex items-center space-x-6">
          <!-- Menu khi chưa đăng nhập -->
          <template v-if="!isLoggedIn">
            <RouterLink 
              to="/contact" 
              class="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <span class="material-icons">contact_support</span>
              <span>Liên hệ</span>
            </RouterLink>
            <RouterLink 
              to="/login" 
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              <span class="material-icons">login</span>
              <span>Đăng nhập</span>
            </RouterLink>
          </template>

          <!-- Menu khi đã đăng nhập -->
          <template v-else>
            <!-- Menu cho Admin -->
            <template v-if="isAdmin">
              <RouterLink 
                to="/admin" 
                class="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
                title="Quản lý"
              >
                <span class="material-icons">dashboard</span>
              </RouterLink>
            </template>

            <!-- Menu chung cho cả Admin và User -->
            <RouterLink 
              to="/contact" 
              class="text-gray-600 hover:text-blue-600"
              title="Liên hệ"
            >
              <span class="material-icons">contact_support</span>
            </RouterLink>

            <!-- Giỏ hàng (chỉ hiện cho user thường) -->
            <RouterLink 
              v-if="!isAdmin"
              to="/cart" 
              class="text-gray-600 hover:text-blue-600 relative"
              title="Giỏ hàng"
            >
              <span class="material-icons">shopping_cart</span>
              <!-- Badge số lượng trong giỏ hàng -->
              <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </RouterLink>

            <!-- Profile -->
            <RouterLink 
              to="/profile" 
              class="text-gray-600 hover:text-blue-600"
              title="Hồ sơ"
            >
              <span class="material-icons">account_circle</span>
            </RouterLink>

            <!-- Đăng xuất -->
            <button 
              @click="logout" 
              class="text-gray-600 hover:text-red-600 transition-colors"
              title="Đăng xuất"
            >
              <span class="material-icons">logout</span>
            </button>
          </template>
        </nav>
      </div>
    </div>
  </header>

  <!-- Spacer để tránh content bị che bởi fixed header -->
  <div class="h-16"></div>
</template>

<style scoped>
.material-icons {
  font-size: 24px;
}

/* Hiệu ứng hover cho các icon */
.text-gray-600:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}
</style>