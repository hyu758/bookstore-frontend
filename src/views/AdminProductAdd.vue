<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <AdminSideBar></AdminSideBar>
  
      <!-- Main Content -->
      <div class="flex-1 p-6 bg-gray-50 overflow-auto">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Thêm sách mới</h2>
            <button
              @click="router.go(-1)"
              class="flex items-center text-gray-600 hover:text-gray-800"
            >
              <span class="material-icons mr-1">arrow_back</span>
              Quay lại
            </button>
          </div>
  
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <form @submit.prevent="createProduct" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Left Column -->
              <div class="space-y-4">
                <!-- Product Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tên sách <span class="text-red-500">*</span></label>
                  <input
                    v-model="product.name"
                    type="text"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nhập tên sách"
                    required
                  />
                </div>
  
                <!-- Author -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tác giả <span class="text-red-500">*</span></label>
                  <input
                    v-model="product.author"
                    type="text"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nhập tên tác giả"
                    required
                  />
                </div>
  
                <!-- Publisher -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nhà xuất bản</label>
                  <input
                    v-model="product.publisher"
                    type="text"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nhập tên nhà xuất bản"
                  />
                </div>
  
                <!-- Category -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Danh mục <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <div
                      @click="toggleDropdown"
                      class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-pointer"
                    >
                      <span v-if="selectedCategoryIds.length === 0" class="text-gray-400">Chọn danh mục</span>
                      <span v-else>
                        {{ getSelectedCategoryNames() }}
                      </span>
                    </div>
  
                    <div
                      v-if="isOpen"
                      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      <div
                        v-for="category in categories"
                        :key="category.categoryId"
                        class="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        @click="handleCategoryClick(category.categoryId)"
                        :class="{ 'bg-blue-50': isCategorySelected(category.categoryId) }"
                      >
                        <div class="flex items-center w-full">
                          <input
                            type="checkbox"
                            :id="'category-' + category.categoryId"
                            :checked="isCategorySelected(category.categoryId)"
                            @click.stop="handleCategoryClick(category.categoryId)"
                            class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                          />
                          <label :for="'category-' + category.categoryId" class="w-full cursor-pointer">
                            {{ category.name }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Right Column -->
              <div class="space-y-4">
                <!-- Price -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Giá <span class="text-red-500">*</span></label>
                  <input
                    v-model.number="product.price"
                    type="number"
                    min="0"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nhập giá sách"
                    required
                  />
                </div>
  
                <!-- Discount -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Giảm giá (%)</label>
                  <input
                    v-model.number="product.discount"
                    type="number"
                    min="0"
                    max="100"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nhập % giảm giá"
                  />
                </div>
  
                <!-- Stock Quantity -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số lượng trong kho <span class="text-red-500">*</span></label>
                  <input
                    v-model.number="product.stockQuantity"
                    type="number"
                    min="0"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nhập số lượng"
                    required
                  />
                </div>
  
                <!-- Publication Year -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Năm xuất bản</label>
                  <input
                    v-model.number="product.publicationYear"
                    type="number"
                    :max="new Date().getFullYear()"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nhập năm xuất bản"
                  />
                </div>
  
                <!-- Page Count -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số trang</label>
                  <input
                    v-model.number="product.pageCount"
                    type="number"
                    min="1"
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nhập số trang"
                  />
                </div>
              </div>
  
              <!-- Description (Full Width) -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  v-model="product.description"
                  rows="4"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả sách"
                ></textarea>
              </div>
  
              <!-- Product Images (Full Width) -->
              <div class="md:col-span-2 space-y-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Hình ảnh sản phẩm
                  <span class="text-sm text-gray-500">
                    (Tối đa {{ maxFiles }} ảnh, mỗi ảnh không quá 30MB)
                  </span>
                </label>
                
                <div 
                  class="border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors duration-200 ease-in-out hover:border-blue-400"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop"
                >
                  <div class="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      @change="handleFileUpload"
                      class="hidden"
                      id="images"
                    />
                    <label for="images" class="cursor-pointer block p-4">
                      <span class="material-icons text-6xl text-gray-400 mb-4">cloud_upload</span>
                      <p class="text-base text-gray-600 mb-2">
                        Kéo thả ảnh vào đây hoặc click để chọn
                      </p>
                      <p class="text-sm text-gray-500">
                        Hỗ trợ: JPG, PNG, GIF, WEBP
                      </p>
                    </label>
                  </div>
                </div>
  
                <!-- Image Previews -->
                <div v-if="previewImages.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div
                    v-for="(img, index) in previewImages"
                    :key="index"
                    class="relative group"
                  >
                    <img
                      :src="img.url"
                      :alt="img.name"
                      class="w-full h-48 object-cover rounded-lg shadow-sm"
                    />
                    <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        @click="removeImage(index)"
                        class="text-white bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <span class="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
  
            <!-- Submit Button -->
            <div class="mt-6 flex justify-end">
              <button
                @click="createProduct"
                class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                :disabled="!product.name || !product.author || selectedCategoryIds.length === 0"
              >
                <span class="material-icons">save</span>
                <span>Lưu sách</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useAuth } from "@/composables/useAuth";
  import { useApi } from "@/composables/useApi";
  import AdminSideBar from "@/components/AdminSideBar.vue";
  
  const router = useRouter();
  const { checkAdminRole } = useAuth();
  const api = useApi();
  
  // Khai báo dữ liệu reactive
  const product = ref({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    discount: 0,
    realPrice: 0,
    author: "",
    publisher: "",
    publicationYear: new Date().getFullYear(),
    pageCount: 0,
    categoryIds: [],
    imageUrls: []
  });
  
  const selectedCategoryIds = ref([]);
  const categories = ref([]);
  const isOpen = ref(false);
  
  // State cho xử lý ảnh
  const previewImages = ref([]);
  const selectedFiles = ref([]);
  const maxFileSize = 30 * 1024 * 1024; // 30MB
  const maxFiles = 5; // Số lượng ảnh tối đa
  const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  // Lấy danh sách danh mục từ API
  const fetchCategories = async () => {
    try {
      const response = await api.fetchCategories(0, 100); // Lấy tất cả danh mục
      categories.value = response.content;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
    }
  };
  
  // Theo dõi thay đổi của selectedCategoryIds
  watch(selectedCategoryIds, (newIds) => {
    product.value.categoryIds = [...newIds];
  }, { deep: true });
  
  // Xử lý dropdown danh mục
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  
  // Hàm kiểm tra xem một danh mục có được chọn hay không
  const isCategorySelected = (id) => {
    return selectedCategoryIds.value.includes(id);
  };
  
  // Hàm lấy tên của các danh mục được chọn
  const getSelectedCategoryNames = () => {
    return selectedCategoryIds.value
      .map(id => categories.value.find(cat => cat.categoryId === id)?.name)
      .filter(name => name)
      .join(", ");
  };
  
  // Xử lý click vào danh mục
  const handleCategoryClick = (id) => {
    console.log("Clicking category:", id);
    const index = selectedCategoryIds.value.findIndex(catId => catId === id);
    if (index === -1) {
      // Nếu chưa có trong mảng thì thêm vào
      selectedCategoryIds.value.push(id);
    } else {
      // Nếu đã có trong mảng thì xóa đi
      selectedCategoryIds.value.splice(index, 1);
    }
    // Cập nhật product.categoryIds
    product.value.categoryIds = [...selectedCategoryIds.value];
    console.log("Selected categories after change:", selectedCategoryIds.value);
    // Để đảm bảo sự kiện không nổi bọt lên cha
    event.stopPropagation();
  };
  
  // Thêm hàm xử lý kéo thả
  const handleFileDrop = (event) => {
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
  };
  
  // Cập nhật hàm handleFileUpload để sử dụng hàm chung
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
  };
  
  // Hàm xử lý chung cho cả kéo thả và chọn file
  const processFiles = async (files) => {
    // Kiểm tra số lượng file
    if (previewImages.value.length + files.length > maxFiles) {
      alert(`Bạn chỉ có thể upload tối đa ${maxFiles} ảnh`);
      return;
    }
  
    for (const file of files) {
      // Kiểm tra loại file
      if (!acceptedFileTypes.includes(file.type)) {
        alert(`File ${file.name} không phải là ảnh hợp lệ`);
        continue;
      }
  
      // Kiểm tra kích thước file
      if (file.size > maxFileSize) {
        alert(`File ${file.name} vượt quá kích thước cho phép (30MB)`);
        continue;
      }
  
      try {
        const base64String = await convertFileToBase64(file);
        previewImages.value.push({
          url: base64String,
          name: file.name
        });
        product.value.imageUrls.push(base64String);
      } catch (error) {
        console.error("Lỗi khi xử lý file:", error);
      }
    }
  };
  
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  
  // Xóa ảnh
  const removeImage = (index) => {
    previewImages.value.splice(index, 1);
    product.value.imageUrls.splice(index, 1);
  };
  
  // Tạo sản phẩm mới
  const createProduct = async () => {
    try {
      // Cập nhật categoryIds và tính realPrice
      product.value.categoryIds = selectedCategoryIds.value;
      product.value.realPrice = product.value.price * (1 - (product.value.discount || 0) / 100);
  
      // Gọi API tạo sản phẩm
      await api.createProduct(product.value);
      alert("Thêm sách thành công!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Lỗi khi thêm sách:", error);
      alert("Thêm sách thất bại! " + error.message);
    }
  };
  
  // Kiểm tra quyền admin khi vào trang
  onMounted(async () => {
    const isAdmin = await checkAdminRole();
    if (isAdmin) {
      fetchCategories();
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
  /* Thêm styles cho drag & drop */
  .border-dashed {
    border-style: dashed;
  }
  
  .border-2 {
    border-width: 2px;
  }
  
  /* Hiệu ứng hover cho vùng kéo thả */
  .hover\:border-blue-400:hover {
    border-color: #60a5fa;
  }
  </style>