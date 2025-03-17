<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <AdminSideBar></AdminSideBar>

    <!-- Main Content -->
    <div class="flex-1 p-8 overflow-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <div class="flex space-x-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm người dùng..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="searchUsers"
            />
            <span class="material-icons absolute left-3 top-2.5 text-gray-400">search</span>
          </div>
          <select
            v-model="filterRole"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">Tất cả vai trò</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
          <select
            v-model="filterStatus"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Bị khóa</option>
          </select>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-12">
        <span class="material-icons animate-spin text-blue-600 text-4xl">sync</span>
        <p class="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>

      <!-- Bảng người dùng -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng ký</th>
                <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span class="material-icons text-gray-500">person</span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.fullName }}</div>
                      <div class="text-sm text-gray-500">{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.phoneNumber || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" 
                        :class="user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" 
                        :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ user.active ? 'Hoạt động' : 'Bị khóa' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-3">
                    <button @click="viewUserDetail(user.id)"
                      class="text-indigo-600 hover:text-indigo-800 transition duration-150 flex items-center space-x-1">
                      <span class="material-icons text-sm">visibility</span>
                      <span>Chi tiết</span>
                    </button>
                    <button v-if="user.role !== 'ADMIN' || currentUserIsAdmin"
                      @click="toggleUserRole(user)"
                      class="text-purple-600 hover:text-purple-800 transition duration-150 flex items-center space-x-1">
                      <span class="material-icons text-sm">manage_accounts</span>
                      <span>{{ user.role === 'USER' ? 'Nâng quyền' : 'Hạ quyền' }}</span>
                    </button>
                    <button @click="toggleUserStatus(user)"
                      :class="user.active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'"
                      class="transition duration-150 flex items-center space-x-1">
                      <span class="material-icons text-sm">{{ user.active ? 'block' : 'check_circle' }}</span>
                      <span>{{ user.active ? 'Khóa' : 'Kích hoạt' }}</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Không có dữ liệu -->
              <tr v-if="users.length === 0">
                <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                  <span class="material-icons text-gray-400 text-4xl mb-2">person_off</span>
                  <p>Không tìm thấy người dùng nào</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Phân trang -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div class="text-sm text-gray-500">
            Hiển thị {{ users.length }} / {{ pagination.totalElements }} người dùng
          </div>
          <div class="flex items-center space-x-4">
            <button @click="changePage(pagination.currentPage - 1)"
              :disabled="pagination.currentPage === 0"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-icons text-sm mr-1">chevron_left</span>
              Trước
            </button>
            <span class="text-sm text-gray-700">
              Trang {{ pagination.currentPage + 1 }} / {{ pagination.totalPages || 1 }}
            </span>
            <button @click="changePage(pagination.currentPage + 1)"
              :disabled="pagination.currentPage >= pagination.totalPages - 1"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              Sau
              <span class="material-icons text-sm ml-1">chevron_right</span>
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import AdminSideBar from "@/components/AdminSideBar.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { useAuth } from "@/composables/useAuth";
import { useApi } from "@/composables/useApi";
import { useNotify } from "@/composables/notify";

const router = useRouter();
const { checkAdminRole } = useAuth();
const api = useApi();
const { success, error: showError } = useNotify();

const users = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const filterRole = ref('');
const filterStatus = ref('');
const currentUserIsAdmin = ref(true); // Mặc định là true, sẽ được cập nhật trong onMounted

// State cho confirm dialog
const showConfirmDialog = ref(false);
const confirmDialogConfig = ref({
  title: '',
  message: '',
  callback: null
});

// State quản lý phân trang
const pagination = ref({
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 10
});

// Lấy danh sách người dùng từ API với phân trang và lọc
const fetchUsers = async () => {
  try {
    isLoading.value = true;
    let queryParams = '';
    
    if (searchQuery.value) {
      queryParams += `search=${encodeURIComponent(searchQuery.value)}`;
    }
    
    if (filterRole.value) {
      queryParams += queryParams ? '&' : '';
      queryParams += `role=${filterRole.value}`;
    }
    
    if (filterStatus.value) {
      queryParams += queryParams ? '&' : '';
      queryParams += `active=${filterStatus.value}`;
    }
    
    const data = await api.fetchUsers(
      pagination.value.currentPage,
      pagination.value.size,
      'id,desc',
      queryParams
    );
    
    users.value = data.content || [];
    pagination.value.totalPages = data.totalPages || 0;
    pagination.value.totalElements = data.totalElements || 0;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    showError("Không thể tải danh sách người dùng");
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

// Tìm kiếm người dùng
const searchUsers = () => {
  pagination.value.currentPage = 0;
  fetchUsers();
};

// Áp dụng bộ lọc
const applyFilters = () => {
  pagination.value.currentPage = 0;
  fetchUsers();
};

// Xem chi tiết người dùng
const viewUserDetail = (userId) => {
  router.push(`/admin/users/detail/${userId}`);
};

// Thay đổi trạng thái người dùng (khóa/mở khóa)
const toggleUserStatus = (user) => {
  const newStatus = !user.active;
  const action = newStatus ? 'kích hoạt' : 'khóa';
  
  confirmDialogConfig.value = {
    title: `Xác nhận ${action} tài khoản`,
    message: `Bạn có chắc chắn muốn ${action} tài khoản của người dùng "${user.fullName}" không?`,
    callback: async () => {
      try {
        await api.updateUserStatus(user.id, newStatus);
        user.active = newStatus;
        success(`Đã ${action} tài khoản thành công`);
      } catch (error) {
        console.error(`Lỗi khi ${action} tài khoản:`, error);
        showError(`Không thể ${action} tài khoản`);
      }
    }
  };
  
  showConfirmDialog.value = true;
};

// Thay đổi vai trò người dùng
const toggleUserRole = (user) => {
  const newRole = user.role === 'USER' ? 'ADMIN' : 'USER';
  const action = newRole === 'ADMIN' ? 'nâng cấp lên Admin' : 'hạ xuống User thường';
  
  confirmDialogConfig.value = {
    title: `Xác nhận ${action}`,
    message: `Bạn có chắc chắn muốn ${action} cho người dùng "${user.fullName}" không?`,
    callback: async () => {
      try {
        await api.updateUserRole(user.id, newRole);
        user.role = newRole;
        success(`Đã ${action} thành công`);
      } catch (error) {
        console.error(`Lỗi khi ${action}:`, error);
        showError(`Không thể ${action}`);
      }
    }
  };
  
  showConfirmDialog.value = true;
};

// Hàm điều hướng trang
const changePage = (page) => {
  if (page >= 0 && page < pagination.value.totalPages) {
    pagination.value.currentPage = page;
    fetchUsers();
  }
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
    fetchUsers();
  } else {
    router.push('/');
  }
});
</script> 