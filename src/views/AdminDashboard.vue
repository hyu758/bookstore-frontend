<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <AdminSideBar></AdminSideBar>
  
      <!-- Main Content -->
      <div class="flex-1 p-6 bg-gray-100">
        <!-- Stats Cards -->
        <div class="grid grid-cols-4 gap-6 mb-6">
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-gray-600">Users</h3>
            <p class="text-2xl font-bold">16</p>
            <div class="h-2 bg-gray-200 rounded">
              <div class="h-2 bg-black w-1/4 rounded"></div>
            </div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-gray-600">Total Sold Quantity</h3>
            <p class="text-2xl font-bold">4,505</p>
            <div class="h-2 bg-gray-200 rounded">
              <div class="h-2 bg-black w-1/2 rounded"></div>
            </div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-gray-600">Total Stock Quantity</h3>
            <p class="text-2xl font-bold">8,196</p>
            <div class="h-2 bg-gray-200 rounded">
              <div class="h-2 bg-black w-3/4 rounded"></div>
            </div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-gray-600">Sales</h3>
            <p class="text-2xl font-bold">85,371,358,000 đ</p>
            <div class="h-2 bg-gray-200 rounded">
              <div class="h-2 bg-black w-4/5 rounded"></div>
            </div>
          </div>
        </div>
  
        <!-- Charts -->
        <div class="grid grid-cols-2 gap-6">
          <!-- Chart 1 -->
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-gray-600 mb-4">Customers with highest total spend</h3>
            <div class="h-64 bg-blue-200 rounded"></div> <!-- Placeholder cho biểu đồ -->
          </div>
          <!-- Chart 2 -->
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-gray-600 mb-4">Customers with most purchases</h3>
            <div class="h-64 bg-red-200 rounded"></div> <!-- Placeholder cho biểu đồ -->
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
import AdminSideBar from "@/components/AdminSideBar.vue";
  
  const router = useRouter();
  
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
        router.push("/"); // Nếu không phải admin, quay về trang chính
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra quyền:", error);
      router.push("/login");
    }
  });
  </script>