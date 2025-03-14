<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Quản lý người dùng</h1>
    
    <!-- Loading và Error -->
    <div v-if="loading" class="flex justify-center items-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
    </div>
    
    <!-- Bảng người dùng -->
    <div v-else class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên người dùng</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.username }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span 
                :class="user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'" 
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span 
                :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
                class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ user.active ? 'Hoạt động' : 'Bị khóa' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <!-- Nút thay đổi vai trò -->
                <button 
                  @click="changeRole(user)" 
                  class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
                  :disabled="isProcessing"
                >
                  {{ user.role === 'ADMIN' ? 'Hạ quyền' : 'Nâng quyền' }}
                </button>
                
                <!-- Nút thay đổi trạng thái -->
                <button 
                  @click="changeStatus(user)" 
                  class="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded"
                  :disabled="isProcessing"
                >
                  {{ user.active ? 'Khóa' : 'Mở khóa' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Phân trang -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-700">
        Hiển thị <span class="font-medium">{{ users.length }}</span> người dùng
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 0"
          :class="currentPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
          class="px-4 py-2 border rounded-md text-sm font-medium"
        >
          Trước
        </button>
        <span class="px-4 py-2 border rounded-md bg-blue-50 text-blue-600">{{ currentPage + 1 }}</span>
        <button 
          @click="nextPage" 
          :disabled="!hasNextPage"
          :class="!hasNextPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'"
          class="px-4 py-2 border rounded-md text-sm font-medium"
        >
          Sau
        </button>
      </div>
    </div>
    
    <!-- Thông báo -->
    <div v-if="notification.show" :class="`fixed bottom-4 right-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white shadow-lg`">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useApi } from '../composables/useApi';

// State
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);
const isProcessing = ref(false);
const notification = ref({
  show: false,
  message: '',
  type: 'success'
});

// API
const api = useApi();

// Computed
const hasNextPage = computed(() => {
  return currentPage.value < totalPages.value - 1;
});

// Methods
const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await api.fetchUsers(currentPage.value, pageSize.value, 'id');
    users.value = response.data.content;
    totalPages.value = response.data.totalPages;
  } catch (err) {
    error.value = 'Không thể tải danh sách người dùng: ' + (err.message || 'Lỗi không xác định');
    console.error('Lỗi khi tải danh sách người dùng:', err);
  } finally {
    loading.value = false;
  }
};

const changeRole = async (user) => {
  if (isProcessing.value) return;
  
  isProcessing.value = true;
  const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
  
  try {
    await api.updateUserRole(user.id, newRole);
    user.role = newRole;
    showNotification(`Đã thay đổi vai trò người dùng thành ${newRole}`, 'success');
  } catch (err) {
    showNotification('Không thể thay đổi vai trò: ' + (err.message || 'Lỗi không xác định'), 'error');
    console.error('Lỗi khi thay đổi vai trò:', err);
  } finally {
    isProcessing.value = false;
  }
};

const changeStatus = async (user) => {
  if (isProcessing.value) return;
  
  isProcessing.value = true;
  const newStatus = !user.active;
  
  try {
    await api.updateUserStatus(user.id, newStatus);
    user.active = newStatus;
    showNotification(`Đã ${newStatus ? 'mở khóa' : 'khóa'} tài khoản người dùng`, 'success');
  } catch (err) {
    showNotification('Không thể thay đổi trạng thái: ' + (err.message || 'Lỗi không xác định'), 'error');
    console.error('Lỗi khi thay đổi trạng thái:', err);
  } finally {
    isProcessing.value = false;
  }
};

const nextPage = () => {
  if (hasNextPage.value) {
    currentPage.value++;
    fetchUsers();
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchUsers();
  }
};

const showNotification = (message, type = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  };
  
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

// Lifecycle
onMounted(() => {
  fetchUsers();
});
</script> 