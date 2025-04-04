<script setup>
import { ref, watchEffect, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { useAuth } from '@/composables/useAuth';

const isLoggedIn = ref(!!sessionStorage.getItem("accessToken"));
const isAdmin = ref(false);
const router = useRouter();
const route = useRoute();
const searchQuery = ref('');
const cartItems = ref([]);
const showCartDropdown = ref(false);
const isCartLoaded = ref(false);
const { logout: authLogout } = useAuth();
const token = sessionStorage.getItem("accessToken");

const checkUserRole = async () => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    isLoggedIn.value = false;
    isAdmin.value = false;
    return;
  }

  try {
    const response = await axios.get("http://localhost:8080/api/auth/role", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*"
      },
    });
    if (response.data.success) {
      isAdmin.value = response.data.data === "ADMIN";
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
      isAdmin.value = false;
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra vai trò:", error);
    isLoggedIn.value = false;
    isAdmin.value = false;
    if (error.response?.status === 401) {
      router.push("/login");
    }
  }
};

// Lấy thông tin giỏ hàng
const fetchCartItems = async () => {
  if (!isLoggedIn.value || isAdmin.value || isCartLoaded.value) return;
  
  try {
    const response = await axios.get("http://localhost:8080/api/cart", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        Accept: "*/*"
      }
    });
    const result = response.data;

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
      isCartLoaded.value = true; // Đánh dấu giỏ hàng đã được tải
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin giỏ hàng:", error);
  }
};

// Tính tổng số lượng sản phẩm trong giỏ hàng
const cartItemCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

// Xử lý tìm kiếm
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/books',
      query: { search: searchQuery.value }
    });
  }
};


const handleCartMouseEnter = () => {
  showCartDropdown.value = true;
  if (isLoggedIn.value && !isAdmin.value && !isCartLoaded.value) {
    fetchCartItems();
  }
};

watch(route, (newRoute, oldRoute) => {
  const cartRelatedRoutes = ['/cart', '/checkout'];
  const isFromCartRelated = oldRoute.path && cartRelatedRoutes.some(route => oldRoute.path.includes(route));
  const isToCartRelated = newRoute.path && cartRelatedRoutes.some(route => newRoute.path.includes(route));
  
  if (isLoggedIn.value && !isAdmin.value && isFromCartRelated && !isToCartRelated) {
    isCartLoaded.value = false; // Reset trạng thái để tải lại giỏ hàng khi cần
    fetchCartItems();
  }
});

const listenToCartEvents = () => {
  window.addEventListener('cart-updated', () => {
    isCartLoaded.value = false;
    fetchCartItems();
  });
};

watchEffect(() => {
  const newLoginState = !!sessionStorage.getItem("accessToken");
  if (newLoginState !== isLoggedIn.value) {
    isLoggedIn.value = newLoginState;
    if (isLoggedIn.value) {
      checkUserRole();
      isCartLoaded.value = false;
    } else {
      isAdmin.value = false;
      cartItems.value = [];
      isCartLoaded.value = false;
    }
  }
});

onMounted(() => {
  checkUserRole();
  listenToCartEvents();
});

const logout = () => {
  authLogout();
  isLoggedIn.value = false;
  isAdmin.value = false;
};
</script>

<template>
  <header class="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <RouterLink to="/" class="flex items-center space-x-3">
          <img class="h-10 w-auto" src="/src/assets/logo.png" alt="Logo" />
          <span class="text-xl font-bold text-gray-800">BookZen</span>
        </RouterLink>

        <!-- Thanh tìm kiếm -->
        <div class="hidden md:flex flex-1 max-w-lg mx-8">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tìm kiếm sách..."
              @keyup.enter="handleSearch"
            />
            <button 
              @click="handleSearch"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <span class="material-icons">search</span>
            </button>
          </div>
        </div>

        <!-- Menu điều hướng -->
        <nav class="flex items-center space-x-6">
          <!-- Menu chung cho tất cả người dùng -->
          <RouterLink 
            to="/books" 
            class="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
          >
            <span class="material-icons">menu_book</span>
          </RouterLink>

          <!-- Menu khi chưa đăng nhập -->
          <template v-if="!isLoggedIn">
            <RouterLink 
              to="/contact" 
              class="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <span class="material-icons">contact_support</span>
              <span class="hidden md:inline">Liên hệ</span>
            </RouterLink>
            <RouterLink 
              to="/login" 
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              <span class="material-icons">login</span>
              <span>Đăng nhập</span>
            </RouterLink>
          </template>

          <!-- Menu khi đã đăng nhập -->
          <template v-else>
            <!-- Menu cho Admin -->
            <template v-if="isAdmin">
              <RouterLink 
                to="/admin" 
                class="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
                title="Quản lý"
              >
                <span class="material-icons">dashboard</span>
              </RouterLink>
            </template>

            <!-- Menu chung cho cả Admin và User -->
            <RouterLink 
              to="/contact" 
              class="text-gray-600 hover:text-blue-600"
              title="Liên hệ"
            >
              <span class="material-icons">contact_support</span>
            </RouterLink>

            <!-- Menu chỉ dành cho user thường -->
            <template v-if="!isAdmin">
              <!-- Order History -->
              <RouterLink 
                to="/orders/history" 
                class="text-gray-600 hover:text-blue-600"
                title="Lịch sử đơn hàng"
              >
                <span class="material-icons">history</span>
              </RouterLink>

              <!-- Giỏ hàng -->
              <div class="text-gray-600 hover:text-blue-600 relative cart-dropdown">
                <RouterLink 
                  to="/cart" 
                  title="Giỏ hàng"
                  @mouseenter="handleCartMouseEnter"
                >
                  <span class="material-icons">shopping_cart</span>
                  <span 
                    v-if="cartItemCount > 0"
                    class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {{ cartItemCount }}
                  </span>
                </RouterLink>
                
                <!-- Dropdown giỏ hàng mini -->
                <div 
                  v-if="showCartDropdown" 
                  class="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 py-2 cart-dropdown-menu"
                  @mouseenter="showCartDropdown = true"
                  @mouseleave="showCartDropdown = false"
                >
                  <div class="px-4 py-2 border-b border-gray-200">
                    <h3 class="font-medium text-gray-800">Giỏ hàng của bạn</h3>
                  </div>
                  
                  <!-- Loading state -->
                  <div v-if="!isCartLoaded" class="px-4 py-3 text-center">
                    <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p class="text-sm text-gray-500">Đang tải giỏ hàng...</p>
                  </div>
                  
                  <!-- Empty cart -->
                  <div v-else-if="cartItems.length === 0" class="px-4 py-3 text-gray-500 text-center">
                    Giỏ hàng trống
                  </div>
                  
                  <!-- Cart items -->
                  <div v-else class="max-h-64 overflow-y-auto">
                    <div 
                      v-for="item in cartItems" 
                      :key="item.cartDetailId"
                      class="px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <img 
                        :src="item.imageUrl" 
                        :alt="item.name"
                        class="w-10 h-10 object-cover rounded"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</p>
                        <p class="text-xs text-gray-500">{{ item.quantity }} x {{ formatPrice(item.price) }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Cart total and checkout button -->
                  <div v-if="isCartLoaded && cartItems.length > 0" class="px-4 py-2 border-t border-gray-200">
                    <div class="flex justify-between items-center mb-2">
                      <span class="font-medium text-gray-800">Tổng cộng:</span>
                      <span class="font-bold text-blue-600">{{ formatPrice(cartTotal) }}</span>
                    </div>
                    <RouterLink 
                      to="/cart" 
                      class="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Xem giỏ hàng
                    </RouterLink>
                  </div>
                </div>
              </div>
            </template>

            <!-- Profile -->
            <RouterLink 
              to="/profile" 
              class="text-gray-600 hover:text-blue-600"
              title="Hồ sơ"
            >
              <span class="material-icons">account_circle</span>
            </RouterLink>

            <!-- Đăng xuất -->
            <button 
              @click="logout" 
              class="text-gray-600 hover:text-red-600 transition-colors"
              title="Đăng xuất"
            >
              <span class="material-icons">logout</span>
            </button>
          </template>
        </nav>
      </div>
    </div>
  </header>

  <div class="h-16"></div>
</template>

<style scoped>
.material-icons {
  font-size: 24px;
}

.text-gray-600:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

.cart-dropdown {
  position: relative;
}

.cart-dropdown .max-h-64 {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.cart-dropdown .max-h-64::-webkit-scrollbar {
  width: 6px;
}

.cart-dropdown .max-h-64::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.cart-dropdown .max-h-64::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.cart-dropdown-menu {
  display: block;
}
</style>