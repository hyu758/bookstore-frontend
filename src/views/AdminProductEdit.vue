<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h1>
        <RouterLink to="/admin/products" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
          Quay lại
        </RouterLink>
      </div>

      <div v-if="isLoading" class="text-center py-12">
        <span class="material-icons animate-spin text-blue-600 text-4xl">sync</span>
        <p class="mt-4 text-gray-600">Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <p>{{ error }}</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-6">
        <!-- Thông tin cơ bản -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Thông tin cơ bản</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 mb-2" for="name">Tên sách <span class="text-red-500">*</span></label>
              <input
                id="name"
                v-model="product.name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-2" for="author">Tác giả <span class="text-red-500">*</span></label>
              <input
                id="author"
                v-model="product.author"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-2" for="publisher">Nhà xuất bản</label>
              <input
                id="publisher"
                v-model="product.publisher"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-2" for="publicationYear">Năm xuất bản</label>
              <input
                id="publicationYear"
                v-model="product.publicationYear"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-2" for="pageCount">Số trang</label>
              <input
                id="pageCount"
                v-model="product.pageCount"
                type="number"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-2" for="isbn">ISBN</label>
              <input
                id="isbn"
                v-model="product.isbn"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Mô tả -->
        <div class="mb-6">
          <label class="block text-gray-700 mb-2" for="description">Mô tả</label>
          <textarea
            id="description"
            v-model="product.description"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Thông tin giá và kho -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Thông tin giá và kho</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-gray-700 mb-2" for="price">Giá (VNĐ) <span class="text-red-500">*</span></label>
              <input
                id="price"
                v-model="product.price"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-2" for="discount">Giảm giá (%)</label>
              <input
                id="discount"
                v-model="product.discount"
                type="number"
                min="0"
                max="100"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-gray-700 mb-2" for="stockQuantity">Số lượng trong kho <span class="text-red-500">*</span></label>
              <input
                id="stockQuantity"
                v-model="product.stockQuantity"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <!-- Danh mục -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Danh mục</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="category in categories" :key="category.categoryId" class="flex items-center">
              <input
                :id="`category-${category.categoryId}`"
                v-model="product.categoryIds"
                :value="category.categoryId"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label :for="`category-${category.categoryId}`" class="ml-2 text-gray-700">{{ category.name }}</label>
            </div>
          </div>
        </div>

        <!-- Hình ảnh -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Hình ảnh</h2>
          
          <!-- Khu vực kéo thả hình ảnh -->
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors duration-200 ease-in-out hover:border-blue-400 mb-4"
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
                  Hỗ trợ: JPG, PNG, GIF, WEBP (tối đa {{ maxFiles }} ảnh)
                </p>
              </label>
            </div>
          </div>
          
          <!-- Hiển thị ảnh hiện có từ API -->
          <div v-if="existingImages.length > 0" class="mb-4">
            <h3 class="text-lg font-medium text-gray-700 mb-2">Ảnh hiện có</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="(image, index) in existingImages"
                :key="image.productImageId"
                class="relative group"
                v-show="!image.markedForDeletion"
              >
                <img
                  :src="image.imageURL"
                  alt="Product image"
                  class="w-full h-48 object-cover rounded-lg shadow-sm"
                />
                <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    type="button"
                    @click="markImageForDeletion(image.productImageId, index)"
                    class="text-white bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <span class="material-icons">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Hiển thị ảnh đã đánh dấu xóa -->
          <div v-if="imagesToDelete.length > 0" class="mb-4">
            <h3 class="text-lg font-medium text-red-600 mb-2">Ảnh sẽ bị xóa khi lưu</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="(image, index) in existingImages"
                :key="image.productImageId"
                class="relative group"
                v-if="image.markedForDeletion"
              >
                <div class="absolute inset-0 bg-red-100 rounded-lg flex items-center justify-center z-10">
                  <span class="material-icons text-red-500 text-4xl">delete</span>
                </div>
                <img
                  :src="image.imageURL"
                  alt="Product image to delete"
                  class="w-full h-48 object-cover rounded-lg shadow-sm opacity-30"
                />
                <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    type="button"
                    @click="unmarkImageForDeletion(image.productImageId, index)"
                    class="text-white bg-green-600 p-2 rounded-full hover:bg-green-700 transition-colors"
                  >
                    <span class="material-icons">restore</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Hiển thị ảnh mới được thêm vào -->
          <div v-if="newImages.length > 0" class="mb-4">
            <h3 class="text-lg font-medium text-gray-700 mb-2">Ảnh mới thêm</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="(image, index) in newImages"
                :key="index"
                class="relative group"
              >
                <img
                  :src="image"
                  alt="New product image"
                  class="w-full h-48 object-cover rounded-lg shadow-sm"
                />
                <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button
                    type="button"
                    @click="removeNewImage(index)"
                    class="text-white bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <span class="material-icons">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Nút lưu -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="material-icons animate-spin mr-2">sync</span>
            {{ isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi } from '@/composables/useApi';
import { useNotify } from '@/composables/notify';

const route = useRoute();
const router = useRouter();
const api = useApi();
const { success, error: showError } = useNotify();

const productId = computed(() => route.params.id);
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref('');
const categories = ref([]);
const existingImages = ref([]);
const newImages = ref([]);
const imagesToDelete = ref([]); // Mảng lưu ID của các ảnh cần xóa
const product = ref({
  name: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  discount: 0,
  author: '',
  publisher: '',
  publicationYear: new Date().getFullYear(),
  pageCount: 0,
  categoryIds: [],
  imageUrls: [],
  isbn: ''
});

// Cấu hình cho xử lý ảnh
const maxFiles = 5; // Số lượng ảnh tối đa
const maxFileSize = 30 * 1024 * 1024; // 30MB
const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Lấy thông tin sản phẩm
const fetchProduct = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    
    const data = await api.getProductById(productId.value);
    
    // Cập nhật thông tin sản phẩm
    product.value = {
      name: data.name || '',
      description: data.description || '',
      price: data.price || 0,
      stockQuantity: data.stockQuantity || 0,
      discount: data.discount || 0,
      author: data.author || '',
      publisher: data.publisher || '',
      publicationYear: data.publicationYear || new Date().getFullYear(),
      pageCount: data.pageCount || 0,
      categoryIds: data.categories?.map(c => c.categoryId) || [],
      imageUrls: [],
      isbn: data.isbn || ''
    };

    // Lấy danh sách ảnh của sản phẩm
    await fetchProductImages();
  } catch (err) {
    error.value = `Không thể tải thông tin sản phẩm: ${err.message}`;
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// Lấy danh sách ảnh của sản phẩm
const fetchProductImages = async () => {
  try {
    const images = await api.getProductImages(productId.value);
    existingImages.value = images || [];
    // Reset mảng ảnh cần xóa
    imagesToDelete.value = [];
  } catch (err) {
    console.error('Lỗi khi lấy danh sách ảnh sản phẩm:', err);
    showError('Không thể tải danh sách ảnh sản phẩm');
  }
};

// Lấy danh sách danh mục
const fetchCategories = async () => {
  try {
    const response = await api.fetchCategories(0, 100);
    categories.value = response.content || [];
  } catch (err) {
    console.error('Lỗi khi lấy danh sách danh mục:', err);
  }
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
  // Tính tổng số ảnh (ảnh hiện có - ảnh sẽ xóa + ảnh mới)
  const totalImages = existingImages.value.length - imagesToDelete.value.length + newImages.value.length + files.length;
  
  // Kiểm tra số lượng file
  if (totalImages > maxFiles) {
    showError(`Bạn chỉ có thể upload tối đa ${maxFiles} ảnh`);
    return;
  }

  for (const file of files) {
    // Kiểm tra loại file
    if (!acceptedFileTypes.includes(file.type)) {
      showError(`File ${file.name} không phải là ảnh hợp lệ`);
      continue;
    }

    // Kiểm tra kích thước file
    if (file.size > maxFileSize) {
      showError(`File ${file.name} vượt quá kích thước cho phép (30MB)`);
      continue;
    }

    try {
      const base64String = await convertFileToBase64(file);
      newImages.value.push(base64String);
    } catch (error) {
      console.error("Lỗi khi xử lý file:", error);
      showError("Lỗi khi xử lý file: " + error.message);
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

// Đánh dấu ảnh để xóa (không xóa ngay)
const markImageForDeletion = (imageId, index) => {
  // Thêm ID ảnh vào danh sách cần xóa
  imagesToDelete.value.push(imageId);
  
  // Ẩn ảnh khỏi giao diện (không xóa khỏi mảng existingImages)
  const image = existingImages.value[index];
  image.markedForDeletion = true;
  
  // Thông báo
  success('Đã đánh dấu ảnh để xóa. Các thay đổi sẽ được áp dụng khi bạn lưu.');
};

// Hủy đánh dấu xóa ảnh
const unmarkImageForDeletion = (imageId, index) => {
  // Xóa ID ảnh khỏi danh sách cần xóa
  const deleteIndex = imagesToDelete.value.indexOf(imageId);
  if (deleteIndex !== -1) {
    imagesToDelete.value.splice(deleteIndex, 1);
  }
  
  // Hiển thị lại ảnh trên giao diện
  const image = existingImages.value[index];
  image.markedForDeletion = false;
  
  // Thông báo
  success('Đã hủy đánh dấu xóa ảnh.');
};

// Xóa ảnh mới
const removeNewImage = (index) => {
  newImages.value.splice(index, 1);
};

// Xử lý submit form
const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    error.value = '';
    
    // Xóa các ảnh đã đánh dấu
    for (const imageId of imagesToDelete.value) {
      try {
        await api.deleteProductImage(imageId);
      } catch (err) {
        console.error(`Lỗi khi xóa ảnh ${imageId}:`, err);
        // Tiếp tục xóa các ảnh khác ngay cả khi có lỗi
      }
    }
    
    // Cập nhật danh sách ảnh mới vào product
    product.value.imageUrls = newImages.value;
    
    // Cập nhật thông tin sản phẩm
    await api.updateProduct(productId.value, product.value);
    
    success('Cập nhật sản phẩm thành công!');
    router.push('/admin/products');
  } catch (err) {
    error.value = `Không thể cập nhật sản phẩm: ${err.message}`;
    showError(error.value);
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchProduct(), fetchCategories()]);
});
</script>

<style scoped>
.material-icons {
  font-size: 24px;
}

/* Styles cho khu vực kéo thả */
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