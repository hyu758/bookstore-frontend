<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-blue-600 text-white py-12">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <h1 class="text-4xl font-bold mb-4">Chào mừng đến với BookZen</h1>
            <p class="text-lg mb-6">Khám phá kho tàng sách phong phú với hàng nghìn đầu sách đa dạng.</p>
            <a href="/books">
              <button class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Khám phá ngay
            </button>
            </a>
          </div>
          <div class="md:w-1/2">
            <img src="/src/assets/slider_1.webp" alt="Hero" class="rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- Danh mục sách -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Danh mục sách</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="category in categories" :key="category.categoryId" 
               @click="goToCategoryPage(category.categoryId)"
               class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div class="flex flex-col items-center text-center">
              <span class="material-icons text-4xl text-blue-600 mb-2">{{ getCategoryIcon(category.name) }}</span>
              <h3 class="font-medium text-gray-800">{{ category.name }}</h3>
            </div>
          </div>
        </div>
      </section>

      <!-- Sách bán chạy -->
      <section class="mb-12" id="best-sellers">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Sách bán chạy</h2>
          <button 
            @click="router.push('/books')" 
            class="text-blue-600 hover:text-blue-700 flex items-center"
          >
            Xem tất cả
            <span class="material-icons ml-1">arrow_forward</span>
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <BookCard
            v-for="product in topProducts"
            :key="product.productId"
            :book="product"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </section>

      <!-- Sách mới -->
      <section class="mb-12" id="new-books">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Sách mới</h2>
          <button 
            @click="router.push('/books')" 
            class="text-blue-600 hover:text-blue-700 flex items-center"
          >
            Xem tất cả
            <span class="material-icons ml-1">arrow_forward</span>
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <BookCard
            v-for="product in newProducts"
            :key="product.productId"
            :book="product"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApi } from '@/composables/useApi';
import { useNotify } from '@/composables/notify';
import BookCard from '@/components/BookCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const api = useApi();
const { success: showSuccess, error: showError } = useNotify();
const categories = ref([]);
const topProducts = ref([]);
const newProducts = ref([]);

// Chuyển hướng đến trang danh mục
const goToCategoryPage = (categoryId) => {
  router.push(`/books/category/${categoryId}`);
};

// Lấy danh sách danh mục
const fetchCategories = async () => {
  try {
    const response = await api.fetchCategories(0, 100);
    categories.value = response.content;
  } catch (error) {
    console.error('Lỗi khi lấy danh mục:', error);
  }
};

// Lấy sách bán chạy
const fetchTopProducts = async () => {
  try {
    const response = await api.fetchProducts(0, 5, 'soldCount,desc');
    topProducts.value = response.data.content;
  } catch (error) {
    console.error('Lỗi khi lấy sách bán chạy:', error);
  }
};

// Lấy sách mới
const fetchNewProducts = async () => {
  try {
    const response = await api.fetchProducts(0, 5, 'productId,desc');
    newProducts.value = response.data.content;
  } catch (error) {
    console.error('Lỗi khi lấy sách mới:', error);
  }
};


// Lấy icon cho danh mục
const getCategoryIcon = (categoryName) => {
  const icons = {
    'Sách văn học': 'auto_stories',
    'Sách kinh tế': 'trending_up',
    'Sách tâm lý': 'psychology',
    'Sách thiếu nhi': 'child_care',
    'Sách giáo dục': 'school',
    'Sách khoa học': 'science',
    'Sách lịch sử': 'history_edu',
    'Sách kỹ năng sống': 'self_improvement',
    'Triết học': 'psychology_alt',
    'Tâm lý học': 'psychology',
    'Sách tiếng việt': 'language',
    'default': 'menu_book'
  };
  return icons[categoryName] || icons.default;
};

// Xử lý thêm vào giỏ hàng
const handleAddToCart = async (book) => {
  if (!sessionStorage.getItem('accessToken')) {
    showError('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:8080/api/cart/items/${book.productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quantity: 1
      })
    });

    const data = await response.json();
    if (data.success) {
      showSuccess('Thêm vào giỏ hàng thành công!');
      // Kích hoạt sự kiện để cập nhật giỏ hàng trong header
      window.dispatchEvent(new Event('cart-updated'));
    } else {
      showError(data.error || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  } catch (error) {
    showError('Có lỗi xảy ra khi thêm vào giỏ hàng');
  }
};

onMounted(() => {
  fetchCategories();
  fetchTopProducts();
  fetchNewProducts();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>