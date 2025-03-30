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
          <!-- Chi tiết đơn hàng -->
          <div class="divide-y">
            <!-- Header đơn hàng -->
            <div class="p-4 flex flex-wrap md:flex-nowrap justify-between items-center bg-gray-50">
              <div class="w-full md:w-auto grid grid-cols-2 md:flex gap-4 mb-2 md:mb-0">
                <div>
                  <p class="text-sm text-gray-500">Mã đơn hàng</p>
                  <p class="font-medium text-gray-800">#{{ order.orderId }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Ngày đặt</p>
                  <p class="font-medium text-gray-800">{{ formatDate(order.orderDate) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Phương thức</p>
                  <p class="font-medium text-gray-800">{{ order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'VNPay' }}</p>
                </div>
              </div>
              <div class="w-full md:w-auto flex justify-between md:justify-end items-center gap-4">
                <span :class="{
                  'px-3 py-1 rounded-full text-sm font-medium': true,
                  'bg-yellow-100 text-yellow-800': order.status === 'PENDING',
                  'bg-blue-100 text-blue-800': order.status === 'PROCESSING',
                  'bg-purple-100 text-purple-800': order.status === 'SHIPPING',
                  'bg-green-100 text-green-800': order.status === 'COMPLETED' || order.status === 'PAID' || order.status === 'CONFIRMED',
                  'bg-red-100 text-red-800': order.status === 'CANCELLED' || order.status === 'PAYMENT_FAILED'
                }">
                  {{ translateStatus(order.status) }}
                </span>
              </div>
            </div>

            <!-- Danh sách sản phẩm -->
            <div class="p-4">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th class="p-2">Sản phẩm</th>
                      <th class="p-2 text-center">Số lượng</th>
                      <th class="p-2 text-right">Đơn giá</th>
                      <th class="p-2 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="item in order.orderDetails" :key="item.orderDetailId">
                      <td class="p-2">
                        <div class="flex items-center gap-3">
                          <img 
                            :src="item.productImageUrl" 
                            :alt="item.productName"
                            class="w-16 h-16 object-cover rounded"
                          >
                          <div>
                            <h3 class="font-medium text-gray-800">{{ item.productName }}</h3>
                          </div>
                        </div>
                      </td>
                      <td class="p-2 text-center">{{ item.quantity }}</td>
                      <td class="p-2 text-right">{{ formatPrice(item.price) }}</td>
                      <td class="p-2 text-right font-medium">{{ formatPrice(item.price * item.quantity) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Footer đơn hàng -->
            <div class="p-4 bg-gray-50">
              <div class="flex flex-col md:flex-row justify-between gap-4">
                <!-- Thông tin giao hàng -->
                <div class="md:w-1/2">
                  <h4 class="font-medium text-gray-800 mb-2">Thông tin giao hàng</h4>
                  <div class="text-sm">
                    <p class="font-medium text-gray-800">{{ order.shippingName }}</p>
                    <p class="text-gray-600">{{ order.shippingPhone }}</p>
                    <p class="text-gray-600">{{ order.shippingAddress }}</p>
                  </div>
                </div>
                
                <!-- Tổng tiền -->
                <div class="md:w-1/2 md:max-w-xs">
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Tạm tính:</span>
                      <span class="font-medium">{{ formatPrice(order.totalAmount) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Phí vận chuyển:</span>
                      <span class="font-medium">{{ formatPrice(0) }}</span>
                    </div>
                    <div class="flex justify-between text-base pt-2 border-t">
                      <span class="font-medium text-gray-800">Tổng cộng:</span>
                      <span class="font-bold text-blue-600">{{ formatPrice(order.totalAmount) }}</span>
                    </div>
                  </div>
                </div>
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
    'PAID': 'Đã hoàn thành',
    'CONFIRMED': 'Đã hoàn thành',
    'CANCELLED': 'Đã hủy',
    'PAYMENT_FAILED': 'Thanh toán thất bại'
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