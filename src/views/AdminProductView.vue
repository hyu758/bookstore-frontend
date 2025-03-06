<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <AdminSideBar></AdminSideBar>

    <!-- Main Content -->
    <div class="flex-1 p-6 bg-gray-100">
      <!-- Quản lý danh mục -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Quản lý danh mục</h2>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="mb-4">
            <RouterLink
              to="/admin/products/addCategory"
              class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Thêm danh mục
            </RouterLink>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
              <thead>
                <tr class="bg-gray-800 text-white">
                  <th class="py-2 px-4 border-b">ID</th>
                  <th class="py-2 px-4 border-b">Tên danh mục</th>
                  <th class="py-2 px-4 border-b"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
                  <td class="py-2 px-4 border-b">{{ category.id }}</td>
                  <td class="py-2 px-4 border-b">{{ category.name }}</td>
                  <td class="py-2 px-4 border-b">
                    <button
                      @click="deleteCategory(category.id)"
                      class="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Quản lý sản phẩm -->
      <div>
        <h2 class="text-2xl font-bold mb-4">Quản lý sách</h2>
        <div class="mb-4">
          <RouterLink
            to="/admin/products/add"
            class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Thêm sách
          </RouterLink>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-gray-800 text-white">
                <th class="py-2 px-4 border-b">ID</th>
                <th class="py-2 px-4 border-b">TÊN SÁCH</th>
                <th class="py-2 px-4 border-b">GIÁ</th>
                <th class="py-2 px-4 border-b">GIẢM GIÁ</th>
                <th class="py-2 px-4 border-b">SỐ LƯỢNG ĐÃ BÁN</th>
                <th class="py-2 px-4 border-b">SỐ LƯỢNG TỒN KHO</th>
                <th class="py-2 px-4 border-b">DANH MỤC</th>
                <th class="py-2 px-4 border-b">TÁC GIẢ</th>
                <th class="py-2 px-4 border-b">CẬP NHẬT LÚC</th>
                <th class="py-2 px-4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
                <td class="py-2 px-4 border-b">{{ product.id }}</td>
                <td class="py-2 px-4 border-b">{{ product.name }}</td>
                <td class="py-2 px-4 border-b">{{ product.price }}</td>
                <td class="py-2 px-4 border-b">{{ product.discount }}</td>
                <td class="py-2 px-4 border-b">{{ product.soldQuantity }}</td>
                <td class="py-2 px-4 border-b">{{ product.stockQuantity }}</td>
                <td class="py-2 px-4 border-b">{{ product.category }}</td>
                <td class="py-2 px-4 border-b">{{ product.author }}</td>
                <td class="py-2 px-4 border-b">{{ product.updatedAt }}</td>
                <td class="py-2 px-4 border-b flex space-x-2">
                  <button
                    @click="editProduct(product.id)"
                    class="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                  >
                    Sửa
                  </button>
                  <button
                    @click="deleteProduct(product.id)"
                    class="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Phân trang -->
        <div class="mt-4 flex justify-center space-x-2">
          <button class="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600">Trước</button>
          <span>Trang 1</span>
          <button class="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600">Sau</button>
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

const products = ref([]);
const categories = ref([]);
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
    categories.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error);
  }
};

// Xóa danh mục
const deleteCategory = async (id) => {
  if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:8080/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCategories(); // Làm mới danh sách danh mục
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  }
};

// Lấy danh sách sản phẩm từ API
const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get("http://localhost:8080/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    products.value = response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
  }
};

// Chuyển đến trang chỉnh sửa
const editProduct = (id) => {
  router.push(`/admin/products/edit/${id}`);
};

// Xóa sản phẩm
const deleteProduct = async (id) => {
  if (confirm("Bạn có chắc muốn xóa sách này?")) {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts(); // Làm mới danh sách
    } catch (error) {
      console.error("Lỗi khi xóa sách:", error);
    }
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
      alert("Bạn không có quyền truy cập!");
      router.push("/");
    } else {
      fetchCategories();
      fetchProducts();
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền:", error);
    router.push("/login");
  }
});
</script>