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
  import { useNotify } from '@/composables/notify';
  import { useAuth } from '@/composables/useAuth';
  
  const newCategoryName = ref("");
  const router = useRouter();
  const { success, error: showError } = useNotify();
  const { checkAdminRole } = useAuth();
  
  // Thêm danh mục mới
  const addCategory = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
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
        success("Thêm danh mục thành công!");
        // Đợi 1 giây để hiển thị thông báo trước khi chuyển trang
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/admin/products"); // Quay lại trang quản lý sản phẩm
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      showError("Thêm danh mục thất bại: " + (error.response?.data?.message || error.message));
    }
  };
  
  // Kiểm tra quyền admin khi vào trang
  onMounted(async () => {
    await checkAdminRole();
  });
  </script>