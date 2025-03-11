<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNotify } from '@/composables/notify';

const route = useRoute();
const { success, error: showError } = useNotify();

const product = ref(null);
const quantity = ref(1);
const isLoading = ref(true);
const currentImageIndex = ref(0);
const isAddingToCart = ref(false);

const nextImage = () => {
  if (product.value && currentImageIndex.value < product.value.imageUrls.length - 1) {
    currentImageIndex.value++;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const selectImage = (index) => {
  currentImageIndex.value = index;
};

const fetchProduct = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/products/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        Accept: "*/*"
      }
    });
    const data = await response.json();
    if (data.success) {
      product.value = data.data;
    } else {
      showError('Không thể tải thông tin sản phẩm');
    }
  } catch (error) {
    showError('Có lỗi xảy ra khi tải thông tin sản phẩm');
  } finally {
    isLoading.value = false;
  }
};

const addToCart = async () => {
  if (!product.value || isAddingToCart.value) return;
  
  isAddingToCart.value = true;
  try {
    const response = await fetch(`http://localhost:8080/api/cart/items/${product.value.productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quantity: quantity.value
      })
    });

    const data = await response.json();
    if (data.success) {
      success('Thêm vào giỏ hàng thành công!');
    } else {
      showError(data.error || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  } catch (error) {
    showError('Có lỗi xảy ra khi thêm vào giỏ hàng');
  } finally {
    isAddingToCart.value = false;
  }
};

onMounted(() => {
  fetchProduct();
});
</script>

<template>
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
  </div>

  <div v-else-if="product" class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Hình ảnh sản phẩm -->
        <div class="relative p-6 bg-gray-50">
          <!-- Ảnh chính -->
          <div class="relative aspect-[4/5] rounded-xl overflow-hidden bg-white shadow-md">
            <img 
              :src="product.imageUrls[currentImageIndex]" 
              :alt="product.name"
              class="w-full h-full object-contain"
            />
            <!-- Nút điều hướng -->
            <button 
              v-if="currentImageIndex > 0"
              @click="prevImage" 
              class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white shadow-lg transition-all"
            >
              <span class="material-icons">chevron_left</span>
            </button>
            <button 
              v-if="currentImageIndex < product.imageUrls.length - 1"
              @click="nextImage" 
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-white shadow-lg transition-all"
            >
              <span class="material-icons">chevron_right</span>
            </button>
          </div>
          
          <!-- Thumbnail ảnh -->
          <div v-if="product.imageUrls.length > 1" class="flex gap-3 mt-6 overflow-x-auto pb-2">
            <button 
              v-for="(image, index) in product.imageUrls" 
              :key="index"
              @click="selectImage(index)"
              class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white shadow-md transition-all hover:scale-105"
              :class="{'ring-2 ring-blue-600 scale-105': currentImageIndex === index}"
            >
              <img 
                :src="image" 
                :alt="`${product.name} - ${index + 1}`"
                class="w-full h-full object-contain"
              />
            </button>
          </div>
        </div>

        <!-- Thông tin sản phẩm -->
        <div class="p-8 space-y-6">
          <div class="pb-6 border-b border-gray-100">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
            
            <div class="flex items-center space-x-4 mb-4">
              <span class="text-3xl font-bold text-blue-600">{{ product.realPrice.toLocaleString('vi-VN') }}đ</span>
              <span v-if="product.discount > 0" 
                    class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                -{{ product.discount }}%
              </span>
            </div>

            <!-- Đánh giá và số lượng đã bán -->
            <div class="flex items-center space-x-6 text-sm">
              <div class="flex items-center" v-if="product.reviewCount > 0">
                <div class="flex items-center text-yellow-400">
                  <span class="material-icons">star</span>
                  <span class="ml-1 font-medium">{{ product.averageRating.toFixed(1) }}</span>
                </div>
                <span class="text-gray-500 ml-1">({{ product.reviewCount }} đánh giá)</span>
              </div>
              <div v-else class="text-gray-500">
                Chưa có đánh giá
              </div>
              <div class="flex items-center text-gray-500">
                <span class="material-icons text-gray-400 mr-1">shopping_bag</span>
                Đã bán {{ product.soldCount }}
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-3">Mô tả sản phẩm</h2>
              <p class="text-gray-600 leading-relaxed">{{ product.description }}</p>
            </div>

            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-3">Thông tin chi tiết</h2>
              <div class="bg-gray-50 rounded-xl p-4">
                <ul class="divide-y divide-gray-200">
                  <li class="py-3 flex justify-between">
                    <span class="text-gray-600">Tác giả</span>
                    <span class="font-medium text-gray-900">{{ product.author }}</span>
                  </li>
                  <li class="py-3 flex justify-between">
                    <span class="text-gray-600">Nhà xuất bản</span>
                    <span class="font-medium text-gray-900">{{ product.publisher }}</span>
                  </li>
                  <li class="py-3 flex justify-between">
                    <span class="text-gray-600">Năm xuất bản</span>
                    <span class="font-medium text-gray-900">{{ product.publicationYear }}</span>
                  </li>
                  <li class="py-3 flex justify-between">
                    <span class="text-gray-600">Số trang</span>
                    <span class="font-medium text-gray-900">{{ product.pageCount }}</span>
                  </li>
                  <li class="py-3 flex justify-between">
                    <span class="text-gray-600">ISBN</span>
                    <span class="font-medium text-gray-900">{{ product.isbn || 'Chưa cập nhật' }}</span>
                  </li>
                  <li class="py-3 flex justify-between">
                    <span class="text-gray-600">Tình trạng</span>
                    <span class="font-medium" :class="product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'">
                      {{ product.stockQuantity > 0 ? `Còn ${product.stockQuantity} cuốn` : 'Hết hàng' }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="pt-6 border-t border-gray-100">
              <div class="flex items-center space-x-4">
                <div class="flex items-center border border-gray-200 rounded-lg bg-white">
                  <button 
                    @click="quantity > 1 && quantity--"
                    class="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                    :disabled="quantity <= 1"
                    :class="{'opacity-50 cursor-not-allowed': quantity <= 1}"
                  >
                    <span class="material-icons">remove</span>
                  </button>
                  <input 
                    type="number" 
                    v-model="quantity"
                    min="1"
                    :max="product.stockQuantity"
                    class="w-16 text-center border-x border-gray-200 py-2 focus:outline-none"
                  />
                  <button 
                    @click="quantity < product.stockQuantity && quantity++"
                    class="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                    :disabled="quantity >= product.stockQuantity"
                    :class="{'opacity-50 cursor-not-allowed': quantity >= product.stockQuantity}"
                  >
                    <span class="material-icons">add</span>
                  </button>
                </div>
                <button 
                  @click="addToCart"
                  class="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  :disabled="product.stockQuantity === 0 || isAddingToCart"
                  :class="{'opacity-50 cursor-not-allowed': product.stockQuantity === 0 || isAddingToCart}"
                >
                  <span class="material-icons">shopping_cart</span>
                  <span>{{ isAddingToCart ? 'Đang thêm...' : (product.stockQuantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="container mx-auto px-4 py-8 text-center">
    <p class="text-xl text-gray-600">Không tìm thấy sản phẩm</p>
  </div>
</template>

<style scoped>
.material-icons {
  font-size: 24px;
}

/* Custom scrollbar cho phần thumbnail */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #93C5FD transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #93C5FD;
  border-radius: 20px;
}
</style>