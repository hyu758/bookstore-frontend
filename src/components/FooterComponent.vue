<template>
  <footer class="bg-gray-900 text-gray-300">
    <!-- Main Footer -->
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Thông tin về BookZen -->
        <div>
          <h3 class="text-white text-lg font-semibold mb-4">Về BookZen</h3>
          <p class="mb-4 text-sm leading-loose">
            BookZen là nền tảng mua sắm sách trực tuyến hàng đầu, cung cấp hàng nghìn đầu sách chất lượng với giá cả hợp lý và dịch vụ giao hàng nhanh chóng.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <!-- Danh mục -->
        <div>
          <h3 class="text-white text-lg font-semibold mb-4">Danh Mục</h3>
          <ul class="space-y-2">
            <li><a href="#new-books" class="hover:text-white transition-colors">Sách Mới</a></li>
            <li><a href="#best-sellers" class="hover:text-white transition-colors">Sách Bán Chạy</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Sách Giảm Giá</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Sách Nước Ngoài</a></li>
          </ul>
        </div>

        <!-- Hỗ trợ -->
        <div>
          <h3 class="text-white text-lg font-semibold mb-4">Hỗ Trợ</h3>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-white transition-colors">Hướng Dẫn Mua Hàng</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Phương Thức Thanh Toán</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Phương Thức Vận Chuyển</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Chính Sách Đổi Trả</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Chính Sách Bảo Mật</a></li>
          </ul>
        </div>

        <!-- Liên hệ -->
        <div>
          <h3 class="text-white text-lg font-semibold mb-4">Liên Hệ</h3>
          <ul class="space-y-2">
            <li class="flex items-start space-x-3">
              <span class="material-icons text-blue-500">location_on</span>
              <span>666 Nguyên Xuân Yên, Hoàng Mike, Hà Nội</span>
            </li>
            <li class="flex items-center space-x-3">
              <span class="material-icons text-blue-500">phone</span>
              <span>1900 xxxx</span>
            </li>
            <li class="flex items-center space-x-3">
              <span class="material-icons text-blue-500">email</span>
              <span>support@bookzen.vn</span>
            </li>
            <li class="flex items-center space-x-3">
              <span class="material-icons text-blue-500">access_time</span>
              <span>8:00 - 21:00, Thứ 2 - Chủ nhật</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div class="border-t border-gray-800">
      <div class="container mx-auto px-6 py-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm">
            &copy; {{ new Date().getFullYear() }} BookZen. Tất cả quyền được bảo lưu.
          </div>
          <div class="flex items-center space-x-6 mt-4 md:mt-0">
            
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
</style>