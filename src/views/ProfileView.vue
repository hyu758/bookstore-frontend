<template>
    <div class="flex h-screen">
      <!-- Main Content -->
      <div class="flex-1 p-6 bg-gray-50">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Hồ sơ người dùng</h2>
  
          <!-- Thông báo -->
          <div v-if="successMessage" class="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {{ errorMessage }}
          </div>
  
          <!-- Form thông tin -->
          <form @submit.prevent="updateProfile" class="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <!-- Tên đầy đủ -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên đầy đủ</label>
              <input
                v-model="profile.fullName"
                type="text"
                class="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Nhập tên đầy đủ"
                required
              />
            </div>
  
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                :value="profile.email"
                type="email"
                disabled
                class="bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg block w-full p-2.5"
                placeholder="Email"
              />
            </div>
  
            <!-- Số điện thoại -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                :value="profile.phoneNumber"
                type="text"
                disabled
                class="bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded-lg block w-full p-2.5"
                placeholder="Số điện thoại"
              />
            </div>
  
            <!-- Địa chỉ -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <input
                v-model="profile.address"
                type="text"
                class="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Nhập địa chỉ"
              />
            </div>
  
            <!-- Nút lưu -->
            <div>
              <button
                type="submit"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  
  // Khai báo dữ liệu reactive
  const profile = ref({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    currentPassword: "",
    newPassword: "",
  });
  const successMessage = ref("");
  const errorMessage = ref("");
  const router = useRouter();
  
  // Lấy thông tin hồ sơ từ API
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }
  
      const response = await axios.get("http://localhost:8080/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response.data);
      if (response.data.success) {
        profile.value = response.data.data;
      } else {
        errorMessage.value = "Không thể lấy thông tin hồ sơ.";
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin hồ sơ:", error);
      errorMessage.value = "Đã xảy ra lỗi. Vui lòng thử lại.";
      if (error.response?.status === 401) {
        router.push("/login");
      }
    }
  };
  
  // Cập nhật thông tin hồ sơ
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const updateData = {
        fullName: profile.value.fullName,
        address: profile.value.address,
      };
  
      const response = await axios.put("http://localhost:8080/api/users/profile", updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.data.success) {
        successMessage.value = "Cập nhật hồ sơ thành công!";
        errorMessage.value = "";
        // Làm mới dữ liệu sau khi cập nhật
        await fetchProfile();
      } else {
        errorMessage.value = "Cập nhật hồ sơ thất bại.";
        successMessage.value = "";
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      errorMessage.value = "Đã xảy ra lỗi. Vui lòng thử lại.";
      successMessage.value = "";
    }
  };
  
  // Kiểm tra quyền truy cập khi component được mount
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
      if (!response.data.success) {
        router.push("/login");
      } else {
        fetchProfile(); // Lấy thông tin hồ sơ sau khi xác nhận quyền
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra quyền:", error);
      router.push("/login");
    }
  });
  </script>
  
  <style scoped>
  /* Đảm bảo Tailwind CSS được tích hợp */
  .bg-blue-600 {
    background-color: #2563eb; /* Màu xanh sáng */
  }
  .focus:ring-blue-200:focus {
    --tw-ring-color: #bfdbfe; /* Viền xanh nhạt */
  }
  .hover:bg-blue-700:hover {
    background-color: #1d4ed8; /* Màu xanh đậm hơn khi hover */
  }
  </style>