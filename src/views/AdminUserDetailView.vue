<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <AdminSideBar></AdminSideBar>

    <!-- Main Content -->
    <div class="flex-1 p-8 overflow-auto">
      <div class="mb-6">
        <button @click="goBack" class="flex items-center text-blue-600 hover:text-blue-800 transition duration-150">
          <span class="material-icons mr-1">arrow_back</span>
          <span>Quay lại danh sách người dùng</span>
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-12">
        <span class="material-icons animate-spin text-blue-600 text-4xl">sync</span>
        <p class="mt-4 text-gray-600">Đang tải thông tin người dùng...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <span class="material-icons text-red-500 text-4xl mb-2">error</span>
        <p class="text-red-600">{{ error }}</p>
        <button @click="fetchUserDetail" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150">
          Thử lại
        </button>
      </div>

      <!-- User detail -->
      <div v-else-if="user" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div class="flex items-center">
            <div class="h-20 w-20 bg-white rounded-full flex items-center justify-center">
              <span class="material-icons text-4xl text-blue-500">person</span>
            </div>
            <div class="ml-6">
              <h1 class="text-2xl font-bold">{{ user.fullName }}</h1>
              <div class="flex items-center mt-1">
                <span class="px-2 py-1 text-xs font-medium rounded-full mr-2" 
                      :class="user.role === 'ADMIN' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'">
                  {{ user.role }}
                </span>
                <span class="px-2 py-1 text-xs font-medium rounded-full" 
                      :class="user.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'">
                  {{ user.active ? 'Hoạt động' : 'Bị khóa' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- User information -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Thông tin cơ bản -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h2>
              
              <div class="space-y-3">
                <div class="flex">
                  <span class="w-1/3 text-gray-500">ID:</span>
                  <span class="w-2/3 font-medium">{{ user.id }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/3 text-gray-500">Tên đăng nhập:</span>
                  <span class="w-2/3 font-medium">{{ user.username }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/3 text-gray-500">Họ tên:</span>
                  <span class="w-2/3 font-medium">{{ user.fullName }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/3 text-gray-500">Email:</span>
                  <span class="w-2/3 font-medium">{{ user.email }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/3 text-gray-500">Số điện thoại:</span>
                  <span class="w-2/3 font-medium">{{ user.phoneNumber || 'Chưa cung cấp' }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/3 text-gray-500">Ngày đăng ký:</span>
                  <span class="w-2/3 font-medium">{{ formatDate(user.createdAt) }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/3 text-gray-500">Cập nhật lần cuối:</span>
                  <span class="w-2/3 font-medium">{{ formatDate(user.updatedAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Địa chỉ -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Địa chỉ</h2>
              
              <div v-if="user.address" class="space-y-3">
                <div class="flex">
                  <span class="w-1/3 text-gray-500">Địa chỉ:</span>
                  <span class="w-2/3 font-medium">{{ user.address }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/3 text-gray-500">Thành phố:</span>
                  <span class="w-2/3 font-medium">{{ user.city || 'Chưa cung cấp' }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/3 text-gray-500">Quốc gia:</span>
                  <span class="w-2/3 font-medium">{{ user.country || 'Việt Nam' }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/3 text-gray-500">Mã bưu điện:</span>
                  <span class="w-2/3 font-medium">{{ user.postalCode || 'Chưa cung cấp' }}</span>
                </div>
              </div>
              
              <div v-else class="text-center py-6 text-gray-500">
                <span class="material-icons text-gray-400 text-3xl mb-2">location_off</span>
                <p>Người dùng chưa cung cấp địa chỉ</p>
              </div>
            </div>
          </div>

          <!-- Thống kê đơn hàng -->
          <div class="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Thống kê đơn hàng</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-500 text-sm">Tổng đơn hàng</p>
                    <p class="text-2xl font-bold text-gray-800">{{ user.orderStats?.totalOrders || 0 }}</p>
                  </div>
                  <span class="material-icons text-blue-500 text-3xl">shopping_bag</span>
                </div>
              </div>
              
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-500 text-sm">Đơn hàng thành công</p>
                    <p class="text-2xl font-bold text-green-600">{{ user.orderStats?.completedOrders || 0 }}</p>
                  </div>
                  <span class="material-icons text-green-500 text-3xl">check_circle</span>
                </div>
              </div>
              
              <div class="bg-white p-4 rounded-lg border border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-500 text-sm">Tổng chi tiêu</p>
                    <p class="text-2xl font-bold text-indigo-600">{{ formatCurrency(user.orderStats?.totalSpent || 0) }}</p>
                  </div>
                  <span class="material-icons text-indigo-500 text-3xl">payments</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Các thao tác -->
          <div class="mt-6 flex justify-end space-x-4">
            <button v-if="user.role !== 'ADMIN' || currentUserIsAdmin"
              @click="toggleUserRole"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-150 flex items-center">
              <span class="material-icons mr-1">manage_accounts</span>
              <span>{{ user.role === 'USER' ? 'Nâng quyền thành Admin' : 'Hạ quyền thành User' }}</span>
            </button>
            
            <button @click="toggleUserStatus"
              :class="user.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
              class="px-4 py-2 text-white rounded-lg transition duration-150 flex items-center">
              <span class="material-icons mr-1">{{ user.active ? 'block' : 'check_circle' }}</span>
              <span>{{ user.active ? 'Khóa tài khoản' : 'Kích hoạt tài khoản' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog :show="showConfirmDialog" :title="confirmDialogConfig.title" :message="confirmDialogConfig.message"
      @confirm="handleConfirm" @cancel="handleCancel" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminSideBar from "@/components/AdminSideBar.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { useAuth } from "@/composables/useAuth";
import { useApi } from "@/composables/useApi";
import { useNotify } from "@/composables/notify";

const route = useRoute();
const router = useRouter();
const { checkAdminRole } = useAuth();
const api = useApi();
const { success, error: showError } = useNotify();

const user = ref(null);
const isLoading = ref(true);
const error = ref(null);
const currentUserIsAdmin = ref(true);

// State cho confirm dialog
const showConfirmDialog = ref(false);
const confirmDialogConfig = ref({
  title: '',
  message: '',
  callback: null
});

// Lấy thông tin chi tiết người dùng
const fetchUserDetail = async () => {
  const userId = route.params.id;
  if (!userId) {
    error.value = "Không tìm thấy ID người dùng";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    user.value = await api.getUserById(userId);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin người dùng:", err);
    error.value = "Không thể tải thông tin người dùng";
  } finally {
    isLoading.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Quay lại trang danh sách
const goBack = () => {
  router.push('/admin/users');
};

// Thay đổi trạng thái người dùng (khóa/mở khóa)
const toggleUserStatus = () => {
  if (!user.value) return;
  
  const newStatus = !user.value.active;
  const action = newStatus ? 'kích hoạt' : 'khóa';
  
  confirmDialogConfig.value = {
    title: `Xác nhận ${action} tài khoản`,
    message: `Bạn có chắc chắn muốn ${action} tài khoản của người dùng "${user.value.fullName}" không?`,
    callback: async () => {
      try {
        await api.updateUserStatus(user.value.id, newStatus);
        user.value.active = newStatus;
        success(`Đã ${action} tài khoản thành công`);
      } catch (err) {
        console.error(`Lỗi khi ${action} tài khoản:`, err);
        showError(`Không thể ${action} tài khoản`);
      }
    }
  };
  
  showConfirmDialog.value = true;
};

// Thay đổi vai trò người dùng
const toggleUserRole = () => {
  if (!user.value) return;
  
  const newRole = user.value.role === 'USER' ? 'ADMIN' : 'USER';
  const action = newRole === 'ADMIN' ? 'nâng cấp lên Admin' : 'hạ xuống User thường';
  
  confirmDialogConfig.value = {
    title: `Xác nhận ${action}`,
    message: `Bạn có chắc chắn muốn ${action} cho người dùng "${user.value.fullName}" không?`,
    callback: async () => {
      try {
        await api.updateUserRole(user.value.id, newRole);
        user.value.role = newRole;
        success(`Đã ${action} thành công`);
      } catch (err) {
        console.error(`Lỗi khi ${action}:`, err);
        showError(`Không thể ${action}`);
      }
    }
  };
  
  showConfirmDialog.value = true;
};

// Xử lý sự kiện từ confirm dialog
const handleConfirm = () => {
  if (confirmDialogConfig.value.callback) {
    confirmDialogConfig.value.callback();
  }
  showConfirmDialog.value = false;
};

const handleCancel = () => {
  showConfirmDialog.value = false;
};

// Kiểm tra quyền admin khi vào trang
onMounted(async () => {
  const isAdmin = await checkAdminRole();
  if (isAdmin) {
    currentUserIsAdmin.value = true;
    fetchUserDetail();
  } else {
    router.push('/');
  }
});
</script> 