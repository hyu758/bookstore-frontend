<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <AdminSideBar></AdminSideBar>
  
      <!-- Main Content -->
      <div class="flex-1 p-6 bg-gray-50">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Thêm sách mới</h2>
          <form @submit.prevent="createProduct" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <!-- Product Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tên sách</label>
                <input
                  v-model="product.name"
                  type="text"
                  class="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Type book name"
                  required
                />
              </div>
  
              <!-- Author -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                <input
                  v-model="product.author"
                  type="text"
                  class="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Author name"
                />
              </div>
  
              <!-- Publisher -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nhà xuất bản</label>
                <input
                  v-model="product.publisher"
                  type="text"
                  class="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Publisher name"
                />
              </div>
  
              <!-- Category -->
              <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
    <div class="relative">
      <!-- Hiển thị danh sách đã chọn hoặc placeholder -->
      <div
        @click="toggleDropdown"
        class="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-pointer"
      >
        <span v-if="selectedCategoryIds.length === 0">Chọn danh mục</span>
        <span v-else>
          {{ selectedCategoryIds.map(id => categories.find(cat => cat.id === id)?.name).join(", ") }}
        </span>
      </div>

      <!-- Dropdown danh sách tùy chọn -->
      <div
        v-if="isOpen"
        class="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          @click="toggleCategory(category.id)"
          class="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
          :class="{ 'bg-blue-100': selectedCategoryIds.includes(category.id) }"
        >
          <input
            type="checkbox"
            :checked="selectedCategoryIds.includes(category.id)"
            class="mr-2"
            @change="toggleCategory(category.id)"
          />
          {{ category.name }}
        </div>
      </div>
    </div>
  </div>
  
              <!-- Publication Year -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Năm xuất bản</label>
                <input
                  v-model.number="product.publicationYear"
                  class="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="2025"
                />
              </div>
  
              <!-- Page Count -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số trang</label>
                <input
                  v-model.number="product.pageCount"
                  type="number"
                  class="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="100"
                />
              </div>
            </div>
  
            <!-- Right Column -->
            <div class="space-y-4">
              <!-- Price -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                <input
                  v-model.number="product.price"
                  class="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="$2999"
                  required
                />
              </div>
  
              <!-- Discount -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Mã giảm giá (%)</label>
                <input
                  v-model.number="product.discount"
                  type="number"
                  min="0"
                  max="100"
                  class="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="0"
                />
              </div>
  
              <!-- Stock Quantity -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng trong kho</label>
                <input
                  v-model.number="product.stockQuantity"
                  type="number"
                  class="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="0"
                  required
                />
              </div>
  
              <!-- Product Images -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ảnh</label>
                <div class="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    @change="handleFileUpload"
                    class="hidden"
                    id="images"
                  />
                  <label for="images" class="cursor-pointer">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12v9m0-9l-3 3m3-3l3 3"></path>
                    </svg>
                    <p class="mt-1 text-sm text-gray-600">Click to upload or drag and drop (Max file size: 30MB)</p>
                  </label>
                </div>
                <div v-if="previewImages.length > 0" class="mt-4 grid grid-cols-3 gap-4">
                  <div v-for="(img, index) in previewImages" :key="index" class="relative">
                    <img :src="img" alt="Preview" class="w-full h-32 object-cover rounded-md" />
                    <button
                      @click="removeImage(index)"
                      class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Description (Full Width) -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                v-model="product.description"
                rows="4"
                class="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write product description here"
              ></textarea>
            </div>
          </form>
  
          <!-- Submit Button -->
          <div class="mt-6">
            <button
              @click="createProduct"
              class="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
            >
              Thêm sách
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";
  import AdminSideBar from "@/components/AdminSideBar.vue";
  
  // Khai báo dữ liệu reactive
  const product = ref({
    productId: 0,
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    discount: 0,
    realPrice: 0,
    author: "",
    publisher: "",
    publicationYear: 0,
    pageCount: 0,
    categoryIds: [],
    imageUrls: [],
  });
  const selectedCategoryIds = ref([]);
  const categories = ref([]);
  const previewImages = ref([]);
  const selectedFiles = ref([]);
  const router = useRouter();
  
  // Lấy danh sách danh mục từ API
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:8080/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      categories.value = response.data.content; // Giả sử response trả về [{id, name}, ...]
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
    }
  };
  const toggleCategory = (id) => {
  if (selectedCategoryIds.value.includes(id)) {
    selectedCategoryIds.value = selectedCategoryIds.value.filter((catId) => catId !== id);
  } else {
    selectedCategoryIds.value.push(id);
  }
};
  const toggleDropdown = () => {
  isOpen.value = !isOpen;
};
  // Xử lý khi chọn file ảnh
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    selectedFiles.value = files;
    previewImages.value = [];
    product.value.imageUrls = [];
  
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        previewImages.value.push(base64String);
        product.value.imageUrls.push(base64String);
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Xóa ảnh khỏi danh sách xem trước
  const removeImage = (index) => {
    previewImages.value.splice(index, 1);
    product.value.imageUrls.splice(index, 1);
    selectedFiles.value.splice(index, 1);
  };
  
  // Tạo sản phẩm mới
  const createProduct = async () => {
    product.value.categoryIds = selectedCategoryIds.value;
    product.value.realPrice = product.value.price * (1 - (product.value.discount || 0) / 100);
  
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post("http://localhost:8080/api/products", product.value, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.data.success) {
        alert("Thêm sản phẩm thành công!");
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert("Thêm sản phẩm thất bại!");
    }
  };
  
  // Kiểm tra quyền admin khi vào trang
  onMounted(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:8080/api/auth/role", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });
      if (response.data.data !== "ADMIN") {
        router.push("/");
      } else {
        fetchCategories(); // Lấy danh mục sau khi xác nhận quyền admin
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra quyền:", error);
      router.push("/login");
    }
  });
  </script>
  
  <style scoped>
  /* Đảm bảo Tailwind CSS được tích hợp */
  .bg-blue-600 {
    background-color: #2563eb; /* Màu xanh sáng */
  }
  .focus:ring-blue-200:focus {
    --tw-ring-color: #bfdbfe; /* Viền xanh nhạt */
  }
  .hover:bg-blue-700:hover {
    background-color: #1d4ed8; /* Màu xanh đậm hơn khi hover */
  }
  </style>