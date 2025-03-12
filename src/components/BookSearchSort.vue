<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-end gap-4">
    <!-- Sắp xếp -->
    <div class="flex items-center">
      <label class="text-gray-700 mr-2">Sắp xếp theo:</label>
      <select 
        v-model="sortByLocal"
        class="border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500"
        @change="applyFilters"
      >
        <option value="name,asc">Tên A-Z</option>
        <option value="name,desc">Tên Z-A</option>
        <option value="realPrice,asc">Giá thấp đến cao</option>
        <option value="realPrice,desc">Giá cao đến thấp</option>
        <option value="soldCount,desc">Bán chạy nhất</option>
        <option value="averageRating,desc">Đánh giá cao nhất</option>
        <option value="productId,desc">Mới nhất</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  sortBy: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:sortBy', 'apply-filters']);

// Tạo biến local để theo dõi thay đổi
const sortByLocal = ref(props.sortBy);

// Theo dõi thay đổi từ props
watch(() => props.sortBy, (newVal) => {
  sortByLocal.value = newVal;
});

// Theo dõi thay đổi từ local và emit sự kiện
watch(sortByLocal, (newVal) => {
  emit('update:sortBy', newVal);
});

// Methods
const applyFilters = () => {
  emit('apply-filters');
};
</script>

<style scoped>
.material-icons {
  font-size: 24px;
}
</style> 