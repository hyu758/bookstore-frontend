<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Danh mục sách</h1>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-12">
        <span class="material-icons animate-spin text-blue-600 text-4xl">sync</span>
        <p class="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar - Bộ lọc -->
        <div class="lg:w-1/4">
          <BookFilter 
            :categories="categories"
            v-model:selectedCategories="selectedCategories"
            v-model:priceRange="priceRange"
            v-model:ratingFilter="ratingFilter"
            @apply-filters="applyFilters"
          />
        </div>
        
        <!-- Danh sách sản phẩm -->
        <div class="lg:w-3/4">
          <!-- Thanh công cụ -->
          <BookSearchSort 
            v-model:sortBy="sortBy"
            @apply-filters="applyFilters"
          />
          
          <!-- Kết quả lọc -->
          <AppliedFilters 
            :appliedFilters="appliedFilters"
            @remove-filter="removeFilter"
            @clear-all-filters="clearAllFilters"
          />
          
          <!-- Danh sách sản phẩm -->
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <BookCard
              v-for="product in filteredProducts"
              :key="product.productId"
              :book="product"
              @add-to-cart="handleAddToCart"
            />
          </div>
          
          <!-- Không có kết quả -->
          <div v-else class="text-center py-12 bg-white rounded-lg shadow-sm">
            <span class="material-icons text-gray-400 text-6xl mb-4">search_off</span>
            <h2 class="text-xl text-gray-600 mb-4">Không tìm thấy sản phẩm phù hợp</h2>
            <button 
              @click="clearAllFilters"
              class="text-blue-600 hover:text-blue-700 inline-flex items-center"
            >
              <span class="material-icons mr-1">refresh</span>
              Xóa bộ lọc
            </button>
          </div>
          
          <!-- Phân trang -->
          <div v-if="filteredProducts.length > 0" class="mt-8 flex justify-center">
            <div class="flex items-center space-x-2">
              <button 
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 0"
                class="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                <span class="material-icons">chevron_left</span>
              </button>
              
              <button 
                v-for="page in displayedPages" 
                :key="page"
                @click="changePage(page)"
                class="px-3 py-1 rounded-md border"
                :class="page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-100'"
              >
                {{ page + 1 }}
              </button>
              
              <button 
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages - 1 || totalPages === 0"
                class="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                <span class="material-icons">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useApi } from '@/composables/useApi';
import BookCard from '@/components/BookCard.vue';
import BookFilter from '@/components/BookFilter.vue';
import BookSearchSort from '@/components/BookSearchSort.vue';
import AppliedFilters from '@/components/AppliedFilters.vue';
import { useNotify } from '@/composables/notify';
import { useRoute } from 'vue-router';

const api = useApi();
const route = useRoute();
const { success: showSuccess, error: showError } = useNotify();

// State
const isLoading = ref(true);
const products = ref([]);
const categories = ref([]);
const totalPages = ref(0);
const totalElements = ref(0);

// Filters
const searchQuery = ref('');
const selectedCategories = ref([]);
const priceRange = ref('all');
const ratingFilter = ref(0);
const sortBy = ref('productId,desc');
const currentPage = ref(0);
const pageSize = ref(12);

// Applied filters for display
const appliedFilters = ref([]);

// Watch route query changes
watch(() => route.query, (newQuery) => {
  if (newQuery.search) {
    searchQuery.value = newQuery.search.toString();
    applyFilters();
  }
}, { deep: true });

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await api.fetchCategories(0, 100);
    categories.value = response.content;
  } catch (error) {
    console.error('Lỗi khi lấy danh mục:', error);
    showError('Không thể tải danh mục sản phẩm');
  }
};

// Fetch products with filters
const fetchProducts = async () => {
  try {
    isLoading.value = true;
    
    // Xây dựng đối tượng tham số tìm kiếm
    const searchParams = {};
    
    // Thêm tìm kiếm theo tên
    if (searchQuery.value) {
      searchParams.name = searchQuery.value;
    }
    
    // Thêm lọc theo danh mục
    if (selectedCategories.value.length === 1) {
      searchParams.categoryId = selectedCategories.value[0];
    } else if (selectedCategories.value.length > 1) {
      // API hiện tại chỉ hỗ trợ một categoryId, nên chúng ta sẽ xử lý trường hợp nhiều danh mục ở client
      // Trong tương lai, API có thể được cập nhật để hỗ trợ nhiều categoryId
    }
    
    // Thêm lọc theo giá
    if (priceRange.value !== 'all') {
      const [min, max] = priceRange.value.split('-');
      if (min) searchParams.minPrice = min;
      if (max) searchParams.maxPrice = max;
    }
    
    // Thêm lọc theo đánh giá (nếu API hỗ trợ)
    if (ratingFilter.value > 0) {
      // Hiện tại API không hỗ trợ lọc theo đánh giá, nên chúng ta sẽ xử lý ở client
      // searchParams.minRating = ratingFilter.value;
    }
    
    console.log('Tìm kiếm nâng cao với tham số:', searchParams);
    
    // Gọi API tìm kiếm nâng cao
    const data = await api.advancedSearch(
      searchParams,
      currentPage.value,
      pageSize.value,
      sortBy.value
    );
    
    // Lọc kết quả theo danh mục (nếu có nhiều danh mục được chọn)
    let filteredData = data.content;
    if (selectedCategories.value.length > 1) {
      filteredData = filteredData.filter(product => {
        // Kiểm tra xem sản phẩm có thuộc một trong các danh mục được chọn không
        return product.categories.some(category => 
          selectedCategories.value.includes(category.categoryId)
        );
      });
    }
    
    // Lọc kết quả theo đánh giá (nếu có)
    if (ratingFilter.value > 0) {
      filteredData = filteredData.filter(product => 
        product.averageRating >= ratingFilter.value
      );
    }
    
    products.value = filteredData;
    totalPages.value = data.totalPages;
    totalElements.value = data.totalElements;
    updateAppliedFilters();
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    showError('Có lỗi xảy ra khi tải sản phẩm');
  } finally {
    isLoading.value = false;
  }
};

// Update applied filters for display
const updateAppliedFilters = () => {
  appliedFilters.value = [];
  
  // Tìm kiếm
  if (searchQuery.value) {
    appliedFilters.value.push({
      type: 'search',
      label: `Tìm kiếm: ${searchQuery.value}`,
      value: searchQuery.value
    });
  }
  
  // Danh mục
  if (selectedCategories.value.length > 0) {
    selectedCategories.value.forEach(categoryId => {
      const category = categories.value.find(c => c.categoryId === categoryId);
      if (category) {
        appliedFilters.value.push({
          type: 'category',
          label: `Danh mục: ${category.name}`,
          value: categoryId
        });
      }
    });
  }
  
  // Khoảng giá
  if (priceRange.value !== 'all') {
    let priceLabel = '';
    switch (priceRange.value) {
      case '0-100000':
        priceLabel = 'Dưới 100.000đ';
        break;
      case '100000-200000':
        priceLabel = '100.000đ - 200.000đ';
        break;
      case '200000-300000':
        priceLabel = '200.000đ - 300.000đ';
        break;
      case '300000-':
        priceLabel = 'Trên 300.000đ';
        break;
    }
    
    appliedFilters.value.push({
      type: 'price',
      label: `Giá: ${priceLabel}`,
      value: priceRange.value
    });
  }
  
  // Đánh giá
  if (ratingFilter.value > 0) {
    appliedFilters.value.push({
      type: 'rating',
      label: `Đánh giá: ${ratingFilter.value}+ sao`,
      value: ratingFilter.value
    });
  }
};

// Computed
const filteredProducts = computed(() => {
  return products.value;
});

const displayedPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  
  if (totalPages.value <= maxVisiblePages) {
    // Hiển thị tất cả các trang nếu tổng số trang ít hơn hoặc bằng maxVisiblePages
    for (let i = 0; i < totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Luôn hiển thị trang hiện tại
    pages.push(currentPage.value);
    
    // Thêm các trang trước trang hiện tại
    for (let i = 1; i <= 2; i++) {
      if (currentPage.value - i >= 0) {
        pages.unshift(currentPage.value - i);
      }
    }
    
    // Thêm các trang sau trang hiện tại
    for (let i = 1; i <= 2; i++) {
      if (currentPage.value + i < totalPages.value) {
        pages.push(currentPage.value + i);
      }
    }
    
    // Nếu không đủ 5 trang, thêm các trang ở đầu hoặc cuối
    while (pages.length < maxVisiblePages && pages[0] > 0) {
      pages.unshift(pages[0] - 1);
    }
    
    while (pages.length < maxVisiblePages && pages[pages.length - 1] < totalPages.value - 1) {
      pages.push(pages[pages.length - 1] + 1);
    }
  }
  
  return pages;
});

// Methods
const applyFilters = () => {
  currentPage.value = 0;
  fetchProducts();
};

const removeFilter = (filter) => {
  switch (filter.type) {
    case 'search':
      searchQuery.value = '';
      break;
    case 'category':
      selectedCategories.value = selectedCategories.value.filter(id => id !== filter.value);
      break;
    case 'price':
      priceRange.value = 'all';
      break;
    case 'rating':
      ratingFilter.value = 0;
      break;
  }
  
  applyFilters();
};

const clearAllFilters = () => {
  searchQuery.value = '';
  selectedCategories.value = [];
  priceRange.value = 'all';
  ratingFilter.value = 0;
  sortBy.value = 'productId,desc';
  
  applyFilters();
};

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page;
    fetchProducts();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleAddToCart = async (book) => {
  if (!localStorage.getItem('accessToken')) {
    showError('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:8080/api/cart/items/${book.productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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

// Lifecycle
onMounted(async () => {
  await fetchCategories();
  
  // Kiểm tra xem có categoryId trong URL không
  if (route.params.categoryId) {
    const categoryId = parseInt(route.params.categoryId);
    if (!isNaN(categoryId)) {
      selectedCategories.value = [categoryId];
    }
  }
  
  // Kiểm tra xem có tham số tìm kiếm trong URL không
  if (route.query.search) {
    searchQuery.value = route.query.search.toString();
  }
  
  await fetchProducts();
});
</script>

<style scoped>
.material-icons {
  font-size: 24px;
}
</style> 