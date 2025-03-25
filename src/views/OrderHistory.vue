<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-8">Lịch sử đơn hàng</h1>

      <!-- Phần tìm kiếm -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mã đơn hàng</label>
            <input 
              type="text" 
              v-model="searchOrderId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mã đơn hàng"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input 
              type="date" 
              v-model="startDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input 
              type="date" 
              v-model="endDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button 
            @click="searchOrders"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <span class="material-icons mr-2">search</span>
            Tìm kiếm
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-12">
        <span class="material-icons animate-spin text-blue-600 text-4xl">sync</span>
        <p class="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>

      <!-- Danh sách đơn hàng -->
      <div v-else-if="orders.length > 0" class="space-y-4">
        <div v-for="order in orders" :key="order.orderId" class="bg-white rounded-lg shadow-sm overflow-hidden">
          <!-- Header đơn hàng -->
          <div class="p-4 bg-gray-50 border-b flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-500">Mã đơn hàng: 
                <span class="font-medium text-gray-800">#{{ order.orderId }}</span>
              </p>
              <p class="text-sm text-gray-500">Ngày đặt: 
                <span class="font-medium text-gray-800">{{ formatDate(order.orderDate) }}</span>
              </p>
            </div>
            <div class="text-right">
              <div class="mb-1">
                <span :class="{
                  'px-3 py-1 rounded-full text-sm font-medium': true,
                  'bg-yellow-100 text-yellow-800': order.status === 'PENDING',
                  'bg-green-100 text-green-800': order.status === 'COMPLETED',
                  'bg-red-100 text-red-800': order.status === 'CANCELLED'
                }">
                  {{ translateStatus(order.status) }}
                </span>
              </div>
              <p class="text-lg font-bold text-blue-600">{{ formatPrice(order.totalAmount) }}</p>
            </div>
          </div>

          <!-- Chi tiết đơn hàng -->
          <div class="divide-y">
            <div v-for="item in order.orderDetails" :key="item.orderDetailId" class="p-4 flex items-center gap-4">
              <img 
                :src="item.productImageUrl" 
                :alt="item.productName"
                class="w-20 h-20 object-cover rounded-md"
              >
              <div class="flex-1">
                <h3 class="font-medium text-gray-800">{{ item.productName }}</h3>
                <p class="text-sm text-gray-500">Số lượng: {{ item.quantity }}</p>
                <p class="text-sm text-gray-500">Đơn giá: {{ formatPrice(item.price) }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-gray-800">{{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
          </div>

          <!-- Footer đơn hàng -->
          <div class="p-4 bg-gray-50 border-t">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-gray-500">Địa chỉ giao hàng:</p>
                <p class="text-sm font-medium text-gray-800">
                  {{ order.shippingName }} - {{ order.shippingPhone }}
                </p>
                <p class="text-sm text-gray-800">{{ order.shippingAddress }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">Tổng tiền:</p>
                <p class="text-xl font-bold text-blue-600">{{ formatPrice(order.totalAmount) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Phân trang -->
        <div class="flex justify-center mt-6" v-if="totalPages > 1">
          <nav class="flex items-center gap-2">
            <button 
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 0"
              class="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50"
            >
              <span class="material-icons">chevron_left</span>
            </button>
            <div class="flex items-center gap-1">
              <button 
                v-for="page in displayedPages" 
                :key="page"
                @click="changePage(page)"
                :class="{
                  'px-4 py-2 rounded-md': true,
                  'bg-blue-600 text-white': currentPage === page,
                  'hover:bg-gray-50': currentPage !== page
                }"
              >
                {{ page + 1 }}
              </button>
            </div>
            <button 
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages - 1"
              class="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50"
            >
              <span class="material-icons">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Không có đơn hàng -->
      <div v-else class="text-center py-12">
        <span class="material-icons text-gray-400 text-6xl mb-4">receipt_long</span>
        <h2 class="text-xl text-gray-600 mb-4">Bạn chưa có đơn hàng nào</h2>
        <router-link 
          to="/" 
          class="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <span class="material-icons mr-2">shopping_bag</span>
          Mua sắm ngay
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useNotify } from '@/composables/notify';

const router = useRouter();
const { getToken, isTokenExpired } = useAuth();
const { error: showError } = useNotify();

// Các biến reactive
const orders = ref([]);
const isLoading = ref(false);
const searchOrderId = ref('');
const startDate = ref('');
const endDate = ref('');
const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);

// Computed properties
const displayedPages = computed(() => {
  const pages = [];
  const maxPages = 5;
  const halfMaxPages = Math.floor(maxPages / 2);
  
  let startPage = Math.max(0, currentPage.value - halfMaxPages);
  let endPage = Math.min(totalPages.value - 1, startPage + maxPages - 1);
  
  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(0, endPage - maxPages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const translateStatus = (status) => {
  const statusMap = {
    'PENDING': 'Chờ xử lý',
    'PROCESSING': 'Đang xử lý',
    'SHIPPING': 'Đang giao hàng',
    'COMPLETED': 'Đã hoàn thành',
    'CANCELLED': 'Đã hủy'
  };
  return statusMap[status] || status;
};

const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const token = getToken();
    if (!token || isTokenExpired()) {
      showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      router.push('/login');
      return;
    }

    // Xây dựng query parameters
    const params = new URLSearchParams({
      page: currentPage.value,
      size: pageSize.value
    });

    if (searchOrderId.value) {
      params.append('orderId', searchOrderId.value);
    }
    if (startDate.value) {
      params.append('startDate', startDate.value);
    }
    if (endDate.value) {
      params.append('endDate', endDate.value);
    }

    const response = await fetch(`http://localhost:8080/api/orders/my-orders?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error('Không thể lấy danh sách đơn hàng');
    }

    const data = await response.json();
    if (data.success) {
      orders.value = data.data.content;
      totalPages.value = data.data.totalPages;
    } else {
      throw new Error(data.message || 'Không thể lấy danh sách đơn hàng');
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    showError('Có lỗi xảy ra: ' + (error.message || 'Vui lòng thử lại sau'));
  } finally {
    isLoading.value = false;
  }
};

const searchOrders = () => {
  currentPage.value = 0;
  fetchOrders();
};

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchOrders();
  }
};

// Mounted hook
onMounted(() => {
  fetchOrders();
});
</script> 