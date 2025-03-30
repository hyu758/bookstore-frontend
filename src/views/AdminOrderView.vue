<template>
  <div class="flex min-h-screen bg-gray-100">
    <AdminSideBar></AdminSideBar>

    <div class="flex-1 p-6 bg-gray-100 overflow-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Quản lý đơn hàng</h2>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-10">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-500">Đang tải dữ liệu...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Data table -->
      <div v-else>
        <div class="bg-white rounded-lg shadow overflow-hidden mb-4">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in orders" :key="order.orderId"
                  v-memo="[order.orderId, order.shippingName, order.shippingPhone, order.shippingAddress, order.orderDate, order.totalAmount, order.status]"
                  class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">#{{ order.orderId }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ order.shippingName || 'Không có tên' }}</div>
                    <div class="text-sm text-gray-500">{{ order.shippingPhone }}</div>
                    <div class="text-sm text-gray-500">{{ order.shippingAddress }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatDate(order.orderDate) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatPrice(order.totalAmount) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="{
                      'px-3 py-1 rounded-full text-sm font-medium': true,
                      'bg-yellow-100 text-yellow-800': order.status === 'PENDING',
                      'bg-blue-100 text-blue-800': order.status === 'PROCESSING',
                      'bg-purple-100 text-purple-800': order.status === 'SHIPPING',
                      'bg-green-100 text-green-800': order.status === 'COMPLETED' || order.status === 'PAID' || order.status === 'CONFIRMED',
                      'bg-red-100 text-red-800': order.status === 'CANCELLED' || order.status === 'PAYMENT_FAILED'
                    }">
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button @click="viewOrderDetails(order.orderId)" class="text-blue-600 hover:text-blue-900 mr-3">
                      <span class="material-icons" style="font-size: 20px;">visibility</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow sm:px-6">
          <div class="flex flex-1 justify-between sm:hidden">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0" :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
              currentPage === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]">
              Trước
            </button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1" :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
              currentPage >= totalPages - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]">
              Sau
            </button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Hiển thị từ <span class="font-medium">{{ startItem }}</span>
                đến <span class="font-medium">{{ endItem }}</span>
                trong tổng số <span class="font-medium">{{ totalElements }}</span> đơn hàng
              </p>
            </div>
            <div>
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0"
                  class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  :class="{ 'cursor-not-allowed': currentPage === 0 }">
                  <span class="sr-only">Trang trước</span>
                  <span class="material-icons" style="font-size: 20px;">chevron_left</span>
                </button>
                <button v-for="page in displayedPages" :key="page" @click="changePage(page)" :class="[
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                  page === currentPage
                    ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0',
                  page === '...' ? 'cursor-default' : 'cursor-pointer'
                ]">
                  {{ page + 1 }}
                </button>
                <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1"
                  class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  :class="{ 'cursor-not-allowed': currentPage >= totalPages - 1 }">
                  <span class="sr-only">Trang sau</span>
                  <span class="material-icons" style="font-size: 20px;">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminSideBar from '@/components/AdminSideBar.vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'

const { getToken } = useAuth()
const router = useRouter()
const orders = ref([])
const isLoading = ref(true)
const error = ref(null)

// Pagination
const currentPage = ref(0)
const totalPages = ref(0)
const totalElements = ref(0)
const pageSize = 10

const startItem = computed(() => {
  return currentPage.value * pageSize + 1
})

const endItem = computed(() => {
  return Math.min((currentPage.value + 1) * pageSize, totalElements.value)
})

const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5 // Số trang hiển thị tối đa

  if (totalPages.value <= maxPages) {
    // Nếu tổng số trang ít hơn hoặc bằng maxPages, hiển thị tất cả
    for (let i = 0; i < totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Luôn hiển thị trang đầu
    pages.push(0)

    // Tính toán range xung quanh trang hiện tại
    let start = Math.max(1, currentPage.value - 1)
    let end = Math.min(totalPages.value - 2, currentPage.value + 1)

    // Thêm dấu ... nếu cần
    if (start > 1) {
      pages.push('...')
    }

    // Thêm các trang ở giữa
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Thêm dấu ... nếu cần
    if (end < totalPages.value - 2) {
      pages.push('...')
    }

    // Luôn hiển thị trang cuối
    pages.push(totalPages.value - 1)
  }

  return pages
})

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value && page !== '...') {
    currentPage.value = page
    fetchOrders()
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price || 0)
}

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString('vi-VN', options)
}

const getStatusText = (status) => {
  const statusText = {
    'PENDING': 'Chờ xử lý',
    'PROCESSING': 'Đang xử lý',
    'SHIPPING': 'Đang giao hàng',
    'COMPLETED': 'Hoàn thành',
    'CANCELLED': 'Đã hủy',
    'PAID': 'Đã thanh toán',
    'CONFIRMED': 'Đã xác nhận',
    'PAYMENT_FAILED': 'Thanh toán thất bại'
  }
  return statusText[status] || status
}

const viewOrderDetails = (orderId) => {
  router.push(`/admin/orders/${orderId}`)
}

const fetchOrders = async () => {
  try {
    isLoading.value = true
    error.value = null

    const token = getToken()
    const response = await axios.get('http://localhost:8080/api/orders/admin/all', {
      params: {
        page: currentPage.value,
        size: pageSize
      },
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': '*/*'
      }
    })

    const data = response.data.data
    orders.value = data.content
    totalPages.value = data.totalPages
    totalElements.value = data.totalElements
  } catch (err) {
    error.value = 'Có lỗi xảy ra khi tải dữ liệu đơn hàng'
    console.error('Error fetching orders:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>