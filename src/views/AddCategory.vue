<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <AdminSideBar></AdminSideBar>
  
      <!-- Main Content -->
      <div class="flex-1 p-6 bg-gray-100">
        <h2 class="text-2xl font-bold mb-6">Thêm danh mục mới</h2>
  
        <form @submit.prevent="addCategory" class="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <!-- Tên danh mục -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Tên danh mục</label>
            <input
              v-model="newCategoryName"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
  
          <!-- Nút gửi -->
          <div>
            <button
              type="submit"
              class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Thêm danh mục
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  import AdminSideBar from "@/components/AdminSideBar.vue";
  
  const newCategoryName = ref("");
  const router = useRouter();
  
  // Thêm danh mục mới
  const addCategory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:8080/api/categories",
        { name: newCategoryName.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        alert("Thêm danh mục thành công!");
        router.push("/admin/products"); // Quay lại trang quản lý sản phẩm
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      alert("Thêm danh mục thất bại!");
    }
  };
  
  // Kiểm tra quyền admin khi vào trang
  onMounted(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:8080/api/auth/role", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      if (response.data.data !== "ADMIN") {
        router.push("/");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra quyền:", error);
      router.push("/login");
    }
  });
  </script>