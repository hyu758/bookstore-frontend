<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <AdminSideBar></AdminSideBar>

    <!-- Main Content -->
    <div class="flex-1 p-8 overflow-auto">
      <!-- Quản lý danh mục -->
      <div class="mb-10">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Quản lý danh mục</h2>
          <RouterLink to="/admin/products/addCategory"
            class="bg-emerald-600 text-white py-2 px-6 rounded-lg hover:bg-emerald-700 transition duration-200 flex items-center space-x-2">
            <span class="material-icons text-xl">add</span>
            <span>Thêm danh mục</span>
          </RouterLink>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Tên danh
                    mục</th>
                  <th class="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Thao tác
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.categoryId }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button @click="deleteCategory(category.categoryId)"
                      class="text-red-600 hover:text-red-800 transition duration-150 flex items-center space-x-1 ml-auto">
                      <span class="material-icons text-sm">delete</span>
                      <span>Xóa</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Phân trang cho danh mục -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div class="text-sm text-gray-500">
              Hiển thị {{ categories.length }} / {{ categoryPagination.totalElements }} danh mục
            </div>
            <div class="flex items-center space-x-4">
              <button @click="changeCategoryPage(categoryPagination.currentPage - 1)"
                :disabled="categoryPagination.currentPage === 0"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="material-icons text-sm mr-1">chevron_left</span>
                Trước
              </button>
              <span class="text-sm text-gray-700">
                Trang {{ categoryPagination.currentPage + 1 }} / {{ categoryPagination.totalPages }}
              </span>
              <button @click="changeCategoryPage(categoryPagination.currentPage + 1)"
                :disabled="categoryPagination.currentPage === categoryPagination.totalPages - 1"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed">
                Sau
                <span class="material-icons text-sm ml-1">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quản lý sản phẩm -->
      <div>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Quản lý sách</h2>
          <RouterLink to="/admin/products/add"
            class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2">
            <span class="material-icons text-xl">add</span>
            <span>Thêm sách</span>
          </RouterLink>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-gray-50">
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sách</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm giá</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã bán</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Năm XB</th>
                  <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="product in products" :key="product.productId" class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.productId }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img v-if="product.imageUrls && product.imageUrls.length > 0" :src="product.imageUrls[0]" class="h-10 w-10 object-cover rounded-md" :alt="product.name">
                        <div v-else class="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                          <span class="material-icons text-gray-400">image_not_supported</span>
                        </div>
                      </div>
                      <div class="ml-4 max-w-xs truncate">
                        <div class="text-sm font-medium text-gray-900 truncate" :title="product.name">{{ product.name }}</div>
                        <div class="text-xs text-gray-500">ISBN: {{ product.isbn || 'N/A' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.author }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.price.toLocaleString('vi-VN') }}₫</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span v-if="product.discount > 0" class="px-2 py-1 text-xs font-medium rounded-full" :class="product.discount > 20 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'">
                      {{ product.discount }}%
                    </span>
                    <span v-else class="text-gray-500">-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.soldCount }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span :class="product.stockQuantity < 10 ? 'text-red-600 font-medium' : 'text-gray-900'">
                      {{ product.stockQuantity }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.publicationYear }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-3">
                      <button @click="editProduct(product.productId)"
                        class="text-blue-600 hover:text-blue-800 transition duration-150 flex items-center space-x-1">
                        <span class="material-icons text-sm">edit</span>
                        <span>Sửa</span>
                      </button>
                      <button @click="deleteProduct(product.productId)"
                        class="text-red-600 hover:text-red-800 transition duration-150 flex items-center space-x-1">
                        <span class="material-icons text-sm">delete</span>
                        <span>Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Phân trang cho sản phẩm -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div class="text-sm text-gray-500">
              Hiển thị {{ products.length }} / {{ productPagination.totalElements }} sách
            </div>
            <div class="flex items-center space-x-4">
              <button @click="changeProductPage(productPagination.currentPage - 1)"
                :disabled="productPagination.currentPage === 0"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="material-icons text-sm mr-1">chevron_left</span>
                Trước
              </button>
              <span class="text-sm text-gray-700">
                Trang {{ productPagination.currentPage + 1 }} / {{ productPagination.totalPages }}
              </span>
              <button @click="changeProductPage(productPagination.currentPage + 1)"
                :disabled="productPagination.currentPage === productPagination.totalPages - 1"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                Sau
                <span class="material-icons text-sm ml-1">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog :show="showConfirmDialog" :title="confirmDialogConfig.title" :message="confirmDialogConfig.message"
      @confirm="handleConfirm" @cancel="handleCancel" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AdminSideBar from "@/components/AdminSideBar.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { useAuth } from "@/composables/useAuth";
import { useApi } from "@/composables/useApi";
import { useToast } from "vue-toastification";

const router = useRouter();
const { checkAdminRole } = useAuth();
const api = useApi();
const toast = useToast();

const products = ref([]);
const categories = ref([]);

// State cho confirm dialog
const showConfirmDialog = ref(false);
const confirmDialogConfig = ref({
  title: '',
  message: '',
  callback: null,
  type: ''
});

// State quản lý phân trang
const categoryPagination = ref({
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 4
});

const productPagination = ref({
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  size: 10
});

// Hàm hiển thị thông báo thành công
const showSuccess = (message) => {
  toast.success(message, {
    timeout: 2000
  });
};

// Hàm hiển thị thông báo lỗi
const showError = (message) => {
  toast.error(message, {
    timeout: 3000
  });
};

// Lấy danh sách danh mục từ API với phân trang
const fetchCategories = async () => {
  try {
    const data = await api.fetchCategories(
      categoryPagination.value.currentPage,
      categoryPagination.value.size,
    );
    categories.value = data.content;
    categoryPagination.value.totalPages = data.totalPages;
    categoryPagination.value.totalElements = data.totalElements;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
  }
};

// Xóa danh mục
const deleteCategory = async (id) => {
  confirmDialogConfig.value = {
    title: 'Xác nhận xóa danh mục',
    message: 'Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác.',
    callback: async () => {
      try {
        console.log(id);
        await api.deleteCategory(id);
        showSuccess('Xóa danh mục thành công!');
        fetchCategories();
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        showError('Xóa danh mục thất bại: ' + error.message);
      }
    },
    type: 'category'
  };
  showConfirmDialog.value = true;
};

// Lấy danh sách sản phẩm từ API với phân trang
const fetchProducts = async () => {
  try {
    const data = await api.fetchProducts(
      productPagination.value.currentPage,
      productPagination.value.size
    );

    products.value = data.data.content;
    productPagination.value.totalPages = data.data.totalPages;
    productPagination.value.totalElements = data.data.totalElements;

  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
    products.value = [];
    productPagination.value.totalPages = 0;
    productPagination.value.totalElements = 0;
  }
};

// Hàm điều hướng trang cho danh mục
const changeCategoryPage = (page) => {
  if (page >= 0 && page < categoryPagination.value.totalPages) {
    categoryPagination.value.currentPage = page;
    fetchCategories();
  }
};

// Hàm điều hướng trang cho sản phẩm
const changeProductPage = (page) => {
  if (page >= 0 && page < productPagination.value.totalPages) {
    productPagination.value.currentPage = page;
    fetchProducts();
  }
};

// Chuyển đến trang chỉnh sửa
const editProduct = (id) => {
  router.push(`/admin/products/edit/${id}`);
};

// Xóa sản phẩm
const deleteProduct = async (id) => {
  confirmDialogConfig.value = {
    title: 'Xác nhận xóa sách',
    message: 'Bạn có chắc chắn muốn xóa sách này không? Hành động này không thể hoàn tác.',
    callback: async () => {
      try {
        await api.deleteProduct(id);
        showSuccess('Xóa sách thành công!');
        fetchProducts();
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
        showError('Xóa sách thất bại: ' + error.message);
      }
    },
    type: 'product'
  };
  showConfirmDialog.value = true;
};

// Xử lý sự kiện từ confirm dialog
const handleConfirm = () => {
  if (confirmDialogConfig.value.callback) {
    confirmDialogConfig.value.callback();
  }
  showConfirmDialog.value = false;
};

const handleCancel = () => {
  showConfirmDialog.value = false;
};

// Kiểm tra quyền admin khi vào trang
onMounted(async () => {
  const isAdmin = await checkAdminRole();
  if (isAdmin) {
    fetchCategories();
    fetchProducts();
  }
});
</script>