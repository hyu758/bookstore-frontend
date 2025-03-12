<template>
  <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
    <h2 class="text-xl font-bold text-gray-800 mb-6">Bộ lọc</h2>
    
    <!-- Danh mục -->
    <div class="mb-6">
      <h3 class="font-semibold text-gray-700 mb-3">Danh mục</h3>
      <div class="space-y-2">
        <label class="flex items-center">
          <input 
            type="checkbox" 
            :checked="selectedCategories.length === 0"
            @change="toggleAllCategories"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-gray-700">Tất cả</span>
        </label>
        <label 
          v-for="category in categories" 
          :key="category.categoryId"
          class="flex items-center"
        >
          <input 
            type="checkbox" 
            :value="category.categoryId"
            v-model="selectedCategoriesLocal"
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-gray-700">{{ category.name }}</span>
        </label>
      </div>
    </div>
    
    <!-- Khoảng giá -->
    <div class="mb-6">
      <h3 class="font-semibold text-gray-700 mb-3">Khoảng giá</h3>
      <div class="space-y-2">
        <label class="flex items-center">
          <input 
            type="radio" 
            v-model="priceRangeLocal" 
            value="all"
            class="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-gray-700">Tất cả</span>
        </label>
        <label class="flex items-center">
          <input 
            type="radio" 
            v-model="priceRangeLocal" 
            value="0-100000"
            class="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-gray-700">Dưới 100.000đ</span>
        </label>
        <label class="flex items-center">
          <input 
            type="radio" 
            v-model="priceRangeLocal" 
            value="100000-200000"
            class="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-gray-700">100.000đ - 200.000đ</span>
        </label>
        <label class="flex items-center">
          <input 
            type="radio" 
            v-model="priceRangeLocal" 
            value="200000-300000"
            class="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-gray-700">200.000đ - 300.000đ</span>
        </label>
        <label class="flex items-center">
          <input 
            type="radio" 
            v-model="priceRangeLocal" 
            value="300000-"
            class="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-gray-700">Trên 300.000đ</span>
        </label>
      </div>
    </div>
    
    <!-- Đánh giá -->
    <div class="mb-6">
      <h3 class="font-semibold text-gray-700 mb-3">Đánh giá</h3>
      <div class="space-y-2">
        <label class="flex items-center">
          <input 
            type="radio" 
            v-model="ratingFilterLocal" 
            value="0"
            class="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-gray-700">Tất cả</span>
        </label>
        <label 
          v-for="rating in [4, 3, 2, 1]" 
          :key="rating"
          class="flex items-center"
        >
          <input 
            type="radio" 
            v-model="ratingFilterLocal" 
            :value="rating"
            class="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <div class="ml-2 flex items-center">
            <div class="flex">
              <span 
                v-for="i in 5" 
                :key="i"
                class="material-icons text-sm"
                :class="i <= rating ? 'text-yellow-400' : 'text-gray-300'"
              >
                star
              </span>
            </div>
            <span class="ml-1 text-gray-700">{{ rating }}+ sao</span>
          </div>
        </label>
      </div>
    </div>
    
    <!-- Nút áp dụng bộ lọc -->
    <button 
      @click="applyFilters"
      class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Áp dụng
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  selectedCategories: {
    type: Array,
    required: true
  },
  priceRange: {
    type: String,
    required: true
  },
  ratingFilter: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:selectedCategories', 'update:priceRange', 'update:ratingFilter', 'apply-filters']);

// Tạo các biến local để theo dõi thay đổi
const selectedCategoriesLocal = ref([...props.selectedCategories]);
const priceRangeLocal = ref(props.priceRange);
const ratingFilterLocal = ref(props.ratingFilter);

// Theo dõi thay đổi từ props
watch(() => props.selectedCategories, (newVal) => {
  selectedCategoriesLocal.value = [...newVal];
}, { deep: true });

watch(() => props.priceRange, (newVal) => {
  priceRangeLocal.value = newVal;
});

watch(() => props.ratingFilter, (newVal) => {
  ratingFilterLocal.value = newVal;
});

// Theo dõi thay đổi từ local và emit sự kiện
watch(selectedCategoriesLocal, (newVal) => {
  emit('update:selectedCategories', newVal);
}, { deep: true });

watch(priceRangeLocal, (newVal) => {
  emit('update:priceRange', newVal);
});

watch(ratingFilterLocal, (newVal) => {
  emit('update:ratingFilter', newVal);
});

// Methods
const toggleAllCategories = (event) => {
  if (event.target.checked) {
    selectedCategoriesLocal.value = [];
  }
};

const applyFilters = () => {
  emit('apply-filters');
};
</script>

<style scoped>
.material-icons {
  font-size: 24px;
}

/* Custom styles for checkboxes and radio buttons */
input[type="checkbox"], input[type="radio"] {
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .sticky {
    position: static;
  }
}
</style> 