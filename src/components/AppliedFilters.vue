<template>
  <div v-if="appliedFilters.length > 0" class="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-gray-700">Bộ lọc đã chọn:</span>
      <div 
        v-for="(filter, index) in appliedFilters" 
        :key="index"
        class="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
      >
        {{ filter.label }}
        <button @click="removeFilter(filter)" class="ml-1 focus:outline-none">
          <span class="material-icons text-sm">close</span>
        </button>
      </div>
      <button 
        v-if="appliedFilters.length > 0"
        @click="clearAllFilters"
        class="text-blue-600 hover:text-blue-800 text-sm ml-2"
      >
        Xóa tất cả
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  appliedFilters: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['remove-filter', 'clear-all-filters']);

// Methods
const removeFilter = (filter) => {
  emit('remove-filter', filter);
};

const clearAllFilters = () => {
  emit('clear-all-filters');
};
</script>

<style scoped>
.material-icons {
  font-size: 18px;
}
</style> 