<template>
  <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
    <h2 class="text-xl font-bold text-gray-800 mb-6">Bộ lọc</h2>
    
    <!-- Danh mục -->
    <div class="mb-6">
      <h3 class="font-semibold text-gray-700 mb-3">Danh mục</h3>
      <div class="space-y-2">
        <label class="flex items-center">
          <input 
            type="radio" 
            :checked="selectedCategories.length === 0"
            @change="clearCategory"
            class="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-gray-700">Tất cả</span>
        </label>
        <label 
          v-for="category in categories" 
          :key="category.categoryId"
          class="flex items-center"
        >
          <input 
            type="radio" 
            :value="category.categoryId"
            :checked="selectedCategories[0] === category.categoryId"
            @change="selectCategory(category.categoryId)"
            class="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
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


// Methods
const clearCategory = () => {
  selectedCategoriesLocal.value = [];
};

const selectCategory = (categoryId) => {
  selectedCategoriesLocal.value = [categoryId];
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