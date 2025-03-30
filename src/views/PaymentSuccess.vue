<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <div class="text-center">
        <!-- Icon thành công -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <span class="material-icons text-3xl text-green-600">check_circle</span>
        </div>

        <!-- Tiêu đề và nội dung -->
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h2>
        <p class="text-gray-600 mb-6">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.</p>

        <!-- Thông tin đơn hàng -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="text-left space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Mã đơn hàng:</span>
              <span class="font-medium text-gray-900">#{{ $route.query.orderId }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tổng tiền:</span>
              <span class="font-medium text-gray-900">{{ formatPrice($route.query.amount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Phương thức:</span>
              <span class="font-medium text-gray-900">VNPay</span>
            </div>
          </div>
        </div>

        <!-- Các nút thao tác -->
        <div class="space-y-3">
          
          <router-link 
            to="/orders/history"
            class="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            <span class="material-icons align-middle mr-1" style="font-size: 20px;">history</span>
            Xem lịch sử đơn hàng
          </router-link>

          <router-link 
            to="/"
            class="block w-full bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors border border-blue-600"
          >
            <span class="material-icons align-middle mr-1" style="font-size: 20px;">shopping_bag</span>
            Tiếp tục mua sắm
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price || 0);
};

onMounted(() => {
  const orderId = router.currentRoute.value.query.orderId
  if (!orderId) {
    router.push('/')
    return
  }

  // Kiểm tra xem orderId này đã được xem chưa
  const viewedOrders = JSON.parse(localStorage.getItem('viewedPaymentPages') || '[]')
  if (viewedOrders.includes(orderId)) {
    // Nếu đã xem rồi thì chuyển đến trang chi tiết đơn hàng
    router.push(`/orders/history`)
    return
  }

  // Nếu chưa xem thì thêm vào danh sách đã xem
  viewedOrders.push(orderId)
  localStorage.setItem('viewedPaymentPages', JSON.stringify(viewedOrders))
})
</script> 