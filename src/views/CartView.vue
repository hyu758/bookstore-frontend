<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

      <!-- Loading state -->
      <div v-if="isLoadingCart" class="text-center py-12">
        <span class="material-icons animate-spin text-blue-600 text-4xl">sync</span>
        <p class="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
      </div>

      <!-- Giỏ hàng trống -->
      <div v-else-if="!cartItems.length" class="text-center py-12">
        <span class="material-icons text-gray-400 text-6xl mb-4">shopping_cart</span>
        <h2 class="text-xl text-gray-600 mb-4">Giỏ hàng của bạn đang trống</h2>
        <router-link 
          to="/" 
          class="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <span class="material-icons mr-2">arrow_back</span>
          Tiếp tục mua sắm
        </router-link>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-8">
        <!-- Danh sách sản phẩm -->
        <div class="lg:w-2/3">
          <div class="bg-white rounded-lg shadow-sm">
            <!-- Header -->
            <div class="p-4 border-b">
              <div class="flex items-center">
                <label class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="ml-2 text-gray-700">Chọn tất cả ({{ cartItems.length }} sản phẩm)</span>
                </label>
              </div>
            </div>

            <!-- Danh sách sản phẩm -->
            <div class="divide-y">
              <div 
                v-for="item in cartItems" 
                :key="item.productId"
                class="p-4 flex items-center gap-4"
              >
                <!-- Checkbox -->
                <input 
                  type="checkbox"
                  v-model="item.selected"
                  class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >

                <!-- Ảnh sản phẩm -->
                <img 
                  :src="item.imageUrls[0]" 
                  :alt="item.name"
                  class="w-20 h-20 object-cover rounded-md"
                >

                <!-- Thông tin sản phẩm -->
                <div class="flex-1">
                  <h3 class="font-medium text-gray-800 mb-1">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">{{ item.author }}</p>
                </div>

                <!-- Giá và số lượng -->
                <div class="text-right">
                  <div class="text-blue-600 font-bold mb-2">
                    {{ formatPrice(item.price * item.quantity) }}
                  </div>
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      @click="updateQuantity(item, -1)"
                      :disabled="item.quantity <= 1"
                    >
                      <span class="material-icons text-sm">remove</span>
                    </button>
                    <input 
                      type="number" 
                      v-model.number="item.quantity"
                      min="1"
                      class="w-16 text-center border-gray-300 rounded-md"
                    >
                    <button 
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      @click="updateQuantity(item, 1)"
                    >
                      <span class="material-icons text-sm">add</span>
                    </button>
                  </div>
                </div>

                <!-- Nút xóa -->
                <button 
                  class="text-gray-400 hover:text-red-500"
                  @click="removeFromCart(item)"
                >
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tổng kết đơn hàng -->
        <div class="lg:w-1/3">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <!-- Địa chỉ nhận hàng -->
            <div class="mb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3">Địa chỉ nhận hàng</h3>
              <div v-if="isLoadingAddress" class="text-gray-500">
                <span class="material-icons animate-spin">sync</span>
                Đang tải...
              </div>
              <div v-else-if="userAddress" class="flex items-start gap-2">
                <span class="material-icons text-blue-600">location_on</span>
                <div>
                  <p class="text-gray-800">{{ userAddress }}</p>
                  <router-link 
                    to="/profile" 
                    class="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center mt-2"
                  >
                    <span class="material-icons text-sm mr-1">edit</span>
                    Thay đổi địa chỉ
                  </router-link>
                </div>
              </div>
              <div v-else class="text-gray-500">
                <p>Bạn chưa có địa chỉ nhận hàng</p>
                <router-link 
                  to="/profile" 
                  class="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center mt-2"
                >
                  <span class="material-icons text-sm mr-1">add</span>
                  Thêm địa chỉ
                </router-link>
              </div>
            </div>

            <!-- Thông tin thanh toán -->
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Tạm tính ({{ selectedItems.length }} sản phẩm)</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Giảm giá</span>
                <span>{{ formatPrice(discount) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>{{ formatPrice(shippingFee) }}</span>
              </div>
              <div class="border-t pt-3 flex justify-between font-bold text-gray-800">
                <span>Tổng cộng</span>
                <span class="text-xl text-blue-600">{{ formatPrice(total) }}</span>
              </div>
            </div>

            <!-- Mã giảm giá -->
            <div class="flex gap-2 mb-6">
              <input 
                type="text" 
                v-model="couponCode"
                placeholder="Nhập mã giảm giá" 
                class="flex-1 border-gray-300 rounded-md"
              >
              <button 
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                :disabled="!couponCode"
                @click="applyCoupon"
              >
                Áp dụng
              </button>
            </div>

            <!-- Nút đặt hàng -->
            <button 
              class="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              :disabled="!selectedItems.length || !userAddress"
              @click="checkout"
            >
              {{ !userAddress ? 'Vui lòng thêm địa chỉ nhận hàng' : 'Tiến hành đặt hàng' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '@/composables/useApi';

const router = useRouter();
const api = useApi();
const couponCode = ref('');
const userAddress = ref('');
const isLoadingAddress = ref(false);
const isLoadingCart = ref(false);
const cartItems = ref([]);

// Thêm ref để theo dõi các thay đổi
const hasChanges = ref(false);
const pendingUpdates = ref(new Map());

// Computed properties
const selectedItems = computed(() => cartItems.value.filter(item => item.selected));

const isAllSelected = computed(() => {
  return cartItems.value.length > 0 && cartItems.value.every(item => item.selected);
});

const subtotal = computed(() => {
  return selectedItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const discount = computed(() => {
  // Logic tính giảm giá ở đây
  return 0;
});

const shippingFee = computed(() => {
  // Logic tính phí vận chuyển ở đây
  return subtotal.value > 300000 ? 0 : 30000;
});

const total = computed(() => {
  return subtotal.value - discount.value + shippingFee.value;
});

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const toggleSelectAll = (event) => {
  const isSelected = event.target.checked;
  cartItems.value.forEach(item => item.selected = isSelected);
};

const updateQuantity = (item, change) => {
  const newQuantity = item.quantity + change;
  if (newQuantity >= 1) {
    item.quantity = newQuantity;
    pendingUpdates.value.set(item.productId, newQuantity);
    hasChanges.value = true;
  }
};

// Hàm để lưu các thay đổi
const saveChanges = async () => {
  if (!hasChanges.value) return;
  
  try {
    const updates = Array.from(pendingUpdates.value.entries()).map(([productId, quantity]) => ({
      productId,
      quantity
    }));
    
    await Promise.all(
      updates.map(update => 
        api.put(`/api/cart/${update.productId}`, { quantity: update.quantity })
      )
    );
    
    hasChanges.value = false;
    pendingUpdates.value.clear();
  } catch (error) {
    console.error('Lỗi khi cập nhật giỏ hàng:', error);
  }
};

onBeforeUnmount(saveChanges);

const removeFromCart = async (item) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
    try {
      await api.delete(`/api/cart/${item.productId}`);
      cartItems.value = cartItems.value.filter(i => i.productId !== item.productId);
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  }
};

const applyCoupon = async () => {
  try {
    const response = await api.post('/api/cart/apply-coupon', {
      code: couponCode.value
    });
    // Cập nhật lại giỏ hàng sau khi áp dụng mã giảm giá
    await fetchCart();
  } catch (error) {
    console.error('Lỗi khi áp dụng mã giảm giá:', error);
    alert('Mã giảm giá không hợp lệ hoặc đã hết hạn');
  }
  couponCode.value = '';
};

const checkout = async () => {
  try {
    const orderData = {
      items: selectedItems.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      address: userAddress.value,
      couponCode: couponCode.value || undefined
    };
    
    await api.post('/api/orders', orderData);
    router.push('/checkout');
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.');
  }
};

// Lấy thông tin địa chỉ từ profile
const fetchUserAddress = async () => {
  try {
    isLoadingAddress.value = true;
    const response = await api.get('/api/users/profile');
    userAddress.value = response.data.address;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin địa chỉ:', error);
  } finally {
    isLoadingAddress.value = false;
  }
};

// Lấy thông tin giỏ hàng từ API
const fetchCart = async () => {
  try {
    isLoadingCart.value = true;
    const response = await api.get('/api/cart');
    cartItems.value = response.data.map(item => ({
      ...item,
      selected: true // Thêm trường selected cho chức năng chọn sản phẩm
    }));
  } catch (error) {
    console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
  } finally {
    isLoadingCart.value = false;
  }
};

// Thêm event listener cho beforeunload
onMounted(() => {
  window.addEventListener('beforeunload', saveChanges);
  fetchCart();
  fetchUserAddress();
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', saveChanges);
});
</script>

<style scoped>
/* Ẩn mũi tên tăng giảm của input number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style> 