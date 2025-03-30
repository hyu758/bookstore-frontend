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
              <div class="flex items-center justify-between">
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
                  :src="item.imageUrl" 
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
              <div class="space-y-4">
                <!-- Chọn địa chỉ -->
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="useUserAddress" 
                    v-model="useUserAddress"
                    class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  >
                  <label for="useUserAddress" class="ml-2 text-gray-700">
                    Sử dụng thông tin từ tài khoản
                  </label>
                </div>

                <!-- Form nhập thông tin mới -->
                <div v-if="!useUserAddress" class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Họ tên người nhận</label>
                    <input 
                      type="text" 
                      v-model="shippingName"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập họ tên người nhận"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input 
                      type="tel" 
                      v-model="shippingPhone"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập số điện thoại"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <textarea 
                      v-model="shippingAddress"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Nhập địa chỉ chi tiết"
                    ></textarea>
                  </div>
                </div>

                <!-- Hiển thị địa chỉ từ tài khoản -->
                <div v-else>
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
              </div>
            </div>

            <!-- Phương thức thanh toán -->
            <div class="mb-6">
              <h3 class="text-lg font-bold text-gray-800 mb-3">Phương thức thanh toán</h3>
              <div class="space-y-3">
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition" :class="{ 'border-blue-500 bg-blue-50': paymentMethod === 'COD' }">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="COD" 
                    v-model="paymentMethod"
                    class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="material-icons ml-3 text-gray-700">local_shipping</span>
                  <div class="ml-3">
                    <p class="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</p>
                    <p class="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                  </div>
                </label>
                
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition" :class="{ 'border-blue-500 bg-blue-50': paymentMethod === 'VNPAY' }">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="VNPAY" 
                    v-model="paymentMethod"
                    class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  >
                  <span class="material-icons ml-3 text-gray-700">credit_card</span>
                  <div class="ml-3">
                    <p class="font-medium text-gray-800">Thanh toán qua VNPay</p>
                    <p class="text-sm text-gray-500">Thanh toán an toàn với VNPay</p>
                  </div>
                </label>
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

            <!-- Nút đặt hàng -->
            <button 
              class="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              :disabled="!selectedItems.length || (!useUserAddress && (!shippingName || !shippingPhone || !shippingAddress)) || !paymentMethod"
              @click="checkout"
            >
              {{ !selectedItems.length ? 'Vui lòng chọn sản phẩm' : 
                 !useUserAddress && !shippingName ? 'Vui lòng nhập họ tên người nhận' :
                 !useUserAddress && !shippingPhone ? 'Vui lòng nhập số điện thoại' :
                 !useUserAddress && !shippingAddress ? 'Vui lòng nhập địa chỉ nhận hàng' :
                 !paymentMethod ? 'Vui lòng chọn phương thức thanh toán' :
                 'Tiến hành đặt hàng' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '@/composables/useApi';
import { useNotify } from '@/composables/notify';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const api = useApi();
const { success, error: showError, confirm } = useNotify();
const { getToken, isTokenExpired } = useAuth();
const couponCode = ref('');
const userAddress = ref('');
const isLoadingAddress = ref(false);
const isLoadingCart = ref(false);
const cartItems = ref([]);
const paymentMethod = ref('COD'); // Mặc định là thanh toán COD

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

// Thêm các ref mới
const useUserAddress = ref(true);
const shippingName = ref('');
const shippingPhone = ref('');
const shippingAddress = ref('');

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
    
    const token = getToken();
    if (!token || isTokenExpired()) {
      showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      router.push('/login');
      return;
    }
    
    await Promise.all(
      updates.map(update => 
        fetch(`http://localhost:8080/api/cart/items/${update.productId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity : update.quantity })
        })
      )
    );
    
    hasChanges.value = false;
    pendingUpdates.value.clear();
    
    // Kích hoạt sự kiện để cập nhật giỏ hàng ở header
    window.dispatchEvent(new CustomEvent('cart-updated'));
    
    // Tải lại giỏ hàng sau khi cập nhật
    await fetchCart();
  } catch (error) {
    console.error('Lỗi khi cập nhật giỏ hàng:', error);
    showError('Lỗi khi cập nhật giỏ hàng: ' + (error.message || 'Vui lòng thử lại sau'));
  }
};

const removeFromCart = async (item) => {
  try {
    const confirmed = await confirm('Xóa sản phẩm', 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?');
    if (!confirmed) return;
    
    const token = getToken();
    if (!token || isTokenExpired()) {
      showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      router.push('/login');
      return;
    }
    
    // Sử dụng productId thay vì cartDetailId để xóa sản phẩm
    const response = await fetch(`http://localhost:8080/api/cart/items/${item.productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
        'Content-Type': 'application/json'
      }
    });
    

    
    if (response.ok) {
      // Xóa sản phẩm khỏi danh sách hiện tại
      cartItems.value = cartItems.value.filter(i => i.productId !== item.productId);
      
      // Xóa khỏi pendingUpdates nếu có
      if (pendingUpdates.value.has(item.productId)) {
        pendingUpdates.value.delete(item.productId);
      }
      
      success('Đã xóa sản phẩm khỏi giỏ hàng');
      
      // Kích hoạt sự kiện để cập nhật giỏ hàng ở header
      window.dispatchEvent(new CustomEvent('cart-updated'));
      
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể xóa sản phẩm');
    }
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    showError('Lỗi khi xóa sản phẩm: ' + (error.message || 'Vui lòng thử lại sau'));
  }
};

const applyCoupon = async () => {
  try {
    const response = await api.post('/api/cart/apply-coupon', {
      code: couponCode.value
    });
    // Cập nhật lại giỏ hàng sau khi áp dụng mã giảm giá
    await fetchCart();
    success('Đã áp dụng mã giảm giá thành công');
  } catch (error) {
    console.error('Lỗi khi áp dụng mã giảm giá:', error);
    showError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
  }
  couponCode.value = '';
};

const redirectToPayment = (url) => {
  success('Bạn sẽ được chuyển đến trang thanh toán VNPay trong giây lát...');
  setTimeout(() => {
    window.location.href = url;
  }, 2000);
};

const removeSelectedItems = async () => {
  try {
    const token = getToken();
    if (!token || isTokenExpired()) {
      return;
    }
    
    // Xóa từng sản phẩm đã chọn khỏi giỏ hàng
    await Promise.all(
      selectedItems.value.map(item => 
        fetch(`http://localhost:8080/api/cart/items/${item.productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*'
          }
        })
      )
    );
    
    // Cập nhật lại danh sách sản phẩm trong giỏ hàng
    cartItems.value = cartItems.value.filter(item => !item.selected);
    
    // Kích hoạt sự kiện để cập nhật giỏ hàng ở header
    window.dispatchEvent(new CustomEvent('cart-updated'));
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
  }
};

const checkout = async () => {
  if (hasChanges.value) {
    await saveChanges();
  }
  
  try {
    const token = getToken();
    if (!token || isTokenExpired()) {
      showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      router.push('/login');
      return;
    }
    
    // 1. Tạo đơn hàng trước
    const orderData = {
      orderDetails: selectedItems.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      useUserAddress: useUserAddress.value,
      ...(useUserAddress.value ? {} : {
        shippingName: shippingName.value,
        shippingPhone: shippingPhone.value,
        shippingAddress: shippingAddress.value
      })
    };
    
    const orderResponse = await fetch('http://localhost:8080/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      throw new Error(errorData.message || 'Lỗi khi tạo đơn hàng');
    }

    const orderResult = await orderResponse.json();
    if (orderResult.success) {
      const orderId = orderResult.data.orderId;

      // 2. Gọi API payment với orderId và paymentMethod
      if (paymentMethod.value === 'VNPAY') {
        const paymentData = {
          orderId: orderId,
          paymentMethod: 'VNPAY'
        };

        const paymentResponse = await fetch('http://localhost:8080/api/payment/order', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentData)
        });

        if (paymentResponse.ok) {
          const paymentResult = await paymentResponse.json();
          
          // Xóa các sản phẩm đã chọn khỏi giỏ hàng
          await removeSelectedItems();
          
          if (paymentResult.paymentUrl) {
            redirectToPayment(paymentResult.paymentUrl);
          } else {
            throw new Error('Không nhận được URL thanh toán');
          }
        } else {
          const errorData = await paymentResponse.json();
          throw new Error(errorData.message || 'Lỗi khi tạo thanh toán');
        }
      } else {
        // Nếu là COD thì vẫn gọi API payment nhưng với method là COD
        const paymentData = {
          orderId: orderId,
          paymentMethod: 'COD'
        };

        await fetch('http://localhost:8080/api/payment/order', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentData)
        });

        // Xóa các sản phẩm đã chọn khỏi giỏ hàng
        await removeSelectedItems();

        // Chuyển đến trang xác nhận đơn hàng
        success('Đặt hàng thành công!');
        router.push('/orders/' + orderId);
      }
    } else {
      throw new Error(orderResult.message || 'Đặt hàng không thành công');
    }
  } catch (error) {
    console.error('Lỗi khi xử lý đơn hàng:', error);
    showError('Có lỗi xảy ra: ' + (error.message || 'Vui lòng thử lại sau'));
  }
};

const processVNPayPayment = async (orderId) => {
  try {
    const token = getToken();
    if (!token || isTokenExpired()) {
      showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      router.push('/login');
      return false;
    }
    
    const paymentData = {
      orderId: orderId,
      paymentMethod: 'VNPAY'
    };

    const response = await fetch('http://localhost:8080/api/payment/order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.paymentUrl) {
        redirectToPayment(data.paymentUrl);
        return true;
      } else {
        throw new Error('Không nhận được URL thanh toán');
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Không thể tạo thanh toán VNPay');
    }
  } catch (error) {
    console.error('Lỗi khi tạo thanh toán VNPay:', error);
    showError('Lỗi khi tạo thanh toán VNPay: ' + (error.message || 'Vui lòng thử lại sau'));
    return false;
  }
};

// Lấy thông tin địa chỉ từ profile
const fetchUserAddress = async () => {
  try {
    isLoadingAddress.value = true;
    
    const token = getToken();
    if (!token || isTokenExpired()) {
      showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      router.push('/login');
      return;
    }
    
    const response = await fetch('http://localhost:8080/api/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error('Không thể lấy thông tin người dùng');
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {

      userAddress.value = data.data.address || '';
    } else {
      console.error('Không tìm thấy dữ liệu địa chỉ trong response');
    }
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
    const token = getToken();
    if (!token || isTokenExpired()) {
      showError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      router.push('/login');
      return;
    }
    
    const response = await fetch('http://localhost:8080/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*"
      }
    });
    const result = await response.json();
    if (result.success) {
      cartItems.value = result.data.cartDetails.map(item => ({
        cartDetailId: item.cartDetailId,
        productId: item.productId,
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        imageUrl: item.productImageUrl || "",
        author: item.author || '',
        selected: true
      }));
    }

  } catch (error) {
    console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
  } finally {
    isLoadingCart.value = false;
  }
};

// Thêm event listener cho beforeunload
onMounted(() => {
  window.addEventListener('beforeunload', (event) => {
    if (hasChanges.value) {
      saveChanges();
    }
  });
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