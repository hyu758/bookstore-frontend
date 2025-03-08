<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
    <!-- Ảnh sách và badge (nếu có) -->
    <div class="relative">
      <img :src="book.imageUrls[0]" :alt="book.name" 
           class="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300" />
      
      <!-- Badge giảm giá -->
      <div v-if="book.discount > 0" 
           class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
        -{{ book.discount }}%
      </div>

      <!-- Badge sách mới -->
      <div v-if="isNewBook" 
           class="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
        Mới
      </div>
    </div>

    <!-- Thông tin sách -->
    <div class="p-4">
      <!-- Tên sách -->
      <h3 class="font-medium text-gray-800 mb-1 line-clamp-2 min-h-[48px] group-hover:text-blue-600 transition-colors">
        {{ book.name }}
      </h3>

      <!-- Tác giả -->
      <p class="text-sm text-gray-600 mb-2">{{ book.author }}</p>

      <!-- Đánh giá và số lượng đã bán -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center">
          <div class="flex items-center" v-if="book.reviewCount > 0">
            <span class="material-icons text-yellow-400 text-sm">star</span>
            <span class="text-sm ml-1 text-gray-700">{{ book.averageRating.toFixed(1) }}</span>
            <span class="text-sm text-gray-500 ml-1">({{ formatNumber(book.reviewCount) }})</span>
          </div>
          <div class="text-sm text-gray-500" v-else>
            Chưa có đánh giá
          </div>
          <span class="mx-2 text-gray-300">|</span>
          <span class="text-sm text-gray-500">Đã bán {{ formatNumber(book.soldCount) }}</span>
        </div>
      </div>

      <!-- Giá và nút thêm vào giỏ -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg font-bold text-blue-600">{{ formatPrice(book.price) }}</span>
          <span v-if="book.discount > 0" 
                class="text-sm text-gray-400 line-through">
            {{ formatPrice(book.originalPrice) }}
          </span>
        </div>
        <button class="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                @click="$emit('addToCart', book)">
          <span class="material-icons">add_shopping_cart</span>
        </button>
      </div>

      <!-- Voucher nếu có -->
      <div v-if="book.voucher" 
           class="mt-3 text-sm bg-orange-50 text-orange-600 p-2 rounded-md flex items-center">
        <span class="material-icons text-sm mr-1">local_offer</span>
        {{ book.voucher }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});

// Định dạng số
const formatNumber = (number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

// Định dạng giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Kiểm tra sách mới (trong vòng 7 ngày)
const isNewBook = computed(() => {
  const bookDate = new Date(props.book.createdAt);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return bookDate >= sevenDaysAgo;
});

// Emit event khi click nút thêm vào giỏ
defineEmits(['addToCart']);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 