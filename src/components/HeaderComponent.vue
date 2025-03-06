<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Khai báo biến reactive
const isLoggedIn = ref(!!localStorage.getItem("accessToken"));
const isAdmin = ref(false); // Biến để kiểm tra vai trò admin
const router = useRouter();

// Hàm kiểm tra vai trò qua API
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
    // Nếu token không hợp lệ (ví dụ: 401), chuyển hướng đến login
    if (error.response?.status === 401) {
      router.push("/login");
    }
  }
};

// Theo dõi sự thay đổi của accessToken
watchEffect(() => {
  isLoggedIn.value = !!localStorage.getItem("accessToken");
  if (isLoggedIn.value) {
    checkUserRole(); // Gọi API khi có token
  } else {
    isAdmin.value = false;
  }
});

// Kiểm tra vai trò ngay khi component được mount
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
  <header class="bg-white shadow-md">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <RouterLink to="/">
        <div class="flex items-center">
          <img class="h-10 w-auto mx-4" src="/src/assets/logo.png" alt="Logo" />
          <div class="text-xl font-bold text-gray-800">BookZen</div>
        </div>
      </RouterLink>

      <nav class="space-x-6">
        <!-- Nếu chưa đăng nhập -->
        <template v-if="!isLoggedIn">
          <RouterLink to="/contact" class="text-gray-600 hover:text-blue-600">Liên hệ</RouterLink>
          <RouterLink to="/login" class="text-gray-600 hover:text-blue-600">Đăng nhập</RouterLink>
        </template>

        <!-- Nếu đã đăng nhập -->
        <template v-else>
          <!-- Menu cho Admin -->
          <template v-if="isAdmin">
            <RouterLink to="/admin" class="text-gray-600 hover:text-blue-600">Quản lý</RouterLink>
            <RouterLink to="/profile" class="text-gray-600 hover:text-blue-600">Hồ sơ</RouterLink>
            <button @click="logout" class="text-red-600 hover:text-red-800">Đăng xuất</button>
          </template>

          <!-- Menu cho User thường -->
          <template v-else>
            <RouterLink to="/contact" class="text-gray-600 hover:text-blue-600">Liên hệ</RouterLink>
            <RouterLink to="/cart" class="text-gray-600 hover:text-blue-600">Giỏ hàng</RouterLink>
            <RouterLink to="/profile" class="text-gray-600 hover:text-blue-600">Hồ sơ</RouterLink>
            <button @click="logout" class="text-red-600 hover:text-red-800">Đăng xuất</button>
          </template>
        </template>
      </nav>
    </div>
  </header>
</template>