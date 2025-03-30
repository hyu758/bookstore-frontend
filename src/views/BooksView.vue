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
            v-memo="[appliedFilters]"
            :appliedFilters="appliedFilters"
            @remove-filter="removeFilter"
            @clear-all-filters="clearAllFilters"
          />
          
          <!-- Danh sách sản phẩm -->
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <BookCard
              v-for="product in filteredProducts"
              :key="product.productId"
              v-memo="[product.productId, product.price, product.discount, product.stockQuantity]"
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
                v-memo="[page, currentPage]"
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
const sortBy = ref('name,asc');
const currentPage = ref(0);
const pageSize = ref(8);


const appliedFilters = ref([]);


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
    
    const searchParams = {};
    
    // Thêm tìm kiếm theo tên
    if (searchQuery.value) {
      searchParams.name = searchQuery.value;
    }
    
    // Thêm lọc theo danh mục
    if (selectedCategories.value.length > 0) {
      searchParams.categoryId = selectedCategories.value[0];
    }
    
    // Thêm lọc theo giá
    if (priceRange.value !== 'all') {
      const [min, max] = priceRange.value.split('-');
      if (min) searchParams.minPrice = parseInt(min);
      if (max) searchParams.maxPrice = parseInt(max);
    }

    // Xử lý sắp xếp
    let sortByParam = '';
    let sortDirParam = '';
    
    switch (sortBy.value) {
      case 'bestseller':
        sortByParam = 'bestseller';
        break;
      case 'newest':
        sortByParam = 'newest';
        break;
      case 'price,asc':
        sortByParam = 'price';
        sortDirParam = 'asc';
        break;
      case 'price,desc':
        sortByParam = 'price';
        sortDirParam = 'desc';
        break;
      case 'name,asc':
        sortByParam = 'name';
        sortDirParam = 'asc';
        break;
      case 'name,desc':
        sortByParam = 'name';
        sortDirParam = 'desc';
        break;
      default:
        sortByParam = 'name';
        sortDirParam = 'asc';
    }

    // Gọi API tìm kiếm nâng cao
    const data = await api.advancedSearch(
      searchParams,
      currentPage.value,
      pageSize.value,
      sortByParam,
      sortDirParam
    );
    
    products.value = data.content;
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
  
  // Danh mục - chỉ hiển thị nếu có 1 danh mục được chọn
  if (selectedCategories.value.length > 0) {
    const category = categories.value.find(c => c.categoryId === selectedCategories.value[0]);
    if (category) {
      appliedFilters.value.push({
        type: 'category',
        label: `Danh mục: ${category.name}`,
        value: selectedCategories.value[0]
      });
    }
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
      selectedCategories.value = [];
      break;
    case 'price':
      priceRange.value = 'all';
      break;
  }
  
  applyFilters();
};

const clearAllFilters = () => {
  searchQuery.value = '';
  selectedCategories.value = [];
  priceRange.value = 'all';
  sortBy.value = 'name,asc';
  
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
