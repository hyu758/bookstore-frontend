<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <div class="text-center">
        <!-- Icon thất bại -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <span class="material-icons text-3xl text-red-600">error</span>
        </div>

        <!-- Tiêu đề và nội dung -->
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại!</h2>
        <p class="text-gray-600 mb-6">
          Rất tiếc, giao dịch của bạn không thành công.
          <br>
          Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
        </p>

        <!-- Thông tin lỗi -->
        <div class="bg-red-50 rounded-lg p-4 mb-6">
          <div class="text-left space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Mã đơn hàng:</span>
              <span class="font-medium text-gray-900">#{{ $route.query.orderId }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Lý do:</span>
              <span class="font-medium text-red-600">{{ $route.query.reason || 'Giao dịch bị từ chối' }}</span>
            </div>
          </div>
        </div>

        <!-- Các nút thao tác -->
        <div class="space-y-3">
          <router-link 
            :to="'/cart'"
            class="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            <span class="material-icons align-middle mr-1" style="font-size: 20px;">shopping_cart</span>
            Quay lại giỏ hàng
          </router-link>

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
            <span class="material-icons align-middle mr-1" style="font-size: 20px;">home</span>
            Về trang chủ
          </router-link>

          <div class="mt-6 text-sm text-gray-500">
            <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ:</p>
            <p class="font-medium">Hotline: 1900 xxxx</p>
            <p class="font-medium">Email: support@example.com</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const orderId = router.currentRoute.value.query.orderId
  if (!orderId) {
    router.push('/')
    return
  }

  // Kiểm tra xem orderId này đã được xem chưa
  const viewedOrders = JSON.parse(localStorage.getItem('viewedPaymentPages') || '[]')
  if (viewedOrders.includes(orderId)) {
    // Nếu đã xem rồi thì chuyển về trang giỏ hàng
    router.push('/cart')
    return
  }

  // Nếu chưa xem thì thêm vào danh sách đã xem
  viewedOrders.push(orderId)
  localStorage.setItem('viewedPaymentPages', JSON.stringify(viewedOrders))
})
</script> 