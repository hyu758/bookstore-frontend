<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <AdminSideBar></AdminSideBar>
  
      <!-- Main Content -->
      <div class="flex-1 p-6 bg-gray-100 overflow-auto">
        <!-- Date Range Picker -->
        <div class="mb-6 bg-white p-4 rounded-lg shadow">
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
              <input 
                type="date" 
                v-model="startDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
              <input 
                type="date" 
                v-model="endDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div class="flex items-end">
              <button 
                @click="fetchAllData"
                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                :disabled="isLoading"
              >
                <span v-if="isLoading">Đang tải...</span>
                <span v-else>Xem thống kê</span>
              </button>
            </div>
          </div>
        </div>
  
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-gray-600">Tổng doanh thu</h3>
            <p class="text-2xl font-bold">{{ formatCurrency(totalRevenue) }}</p>
            <div class="text-sm text-gray-500">Trong khoảng thời gian đã chọn</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-gray-600">Tổng đơn hàng</h3>
            <p class="text-2xl font-bold">{{ totalOrders }}</p>
            <div class="text-sm text-gray-500">Trong khoảng thời gian đã chọn</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-gray-600">Giá trị đơn trung bình</h3>
            <p class="text-2xl font-bold">{{ formatCurrency(averageOrderValue) }}</p>
            <div class="text-sm text-gray-500">Trong khoảng thời gian đã chọn</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-gray-600">Số đơn hàng/ngày</h3>
            <p class="text-2xl font-bold">{{ ordersPerDay }}</p>
            <div class="text-sm text-gray-500">Trung bình trong khoảng thời gian</div>
          </div>
        </div>
  
        <!-- Revenue Chart -->
        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <h3 class="text-gray-600 mb-4">Biểu đồ doanh thu theo thời gian</h3>
          <div v-if="isLoading" class="h-64 flex items-center justify-center">
            <div class="text-gray-500">Đang tải dữ liệu...</div>
          </div>
          <div v-else-if="!revenueData.length" class="h-64 flex items-center justify-center">
            <div class="text-gray-500">Không có dữ liệu trong khoảng thời gian này</div>
          </div>
          <div v-else class="h-96">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </div>
  
      
        <!-- Top Products -->
        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <h3 class="text-gray-600 mb-4">Top 10 sản phẩm bán chạy</h3>
          <div v-if="isLoadingProducts" class="h-64 flex items-center justify-center">
            <div class="text-gray-500">Đang tải dữ liệu...</div>
          </div>
          <div v-else-if="!topProducts.length" class="h-64 flex items-center justify-center">
            <div class="text-gray-500">Không có dữ liệu trong khoảng thời gian này</div>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng đã bán</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="product in topProducts" :key="product.productId" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img :src="product.imageUrl" :alt="product.productName" class="h-10 w-10 rounded-full object-cover" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ product.productName }}</div>
                        <div class="text-sm text-gray-500">#{{ product.productId }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ product.totalSold }}</div>
                    <div class="text-sm text-gray-500">sản phẩm</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatCurrency(product.totalRevenue) }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useAuth } from "@/composables/useAuth";
  import AdminSideBar from "@/components/AdminSideBar.vue";
  import { useNotify } from "@/composables/notify";
  import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
  import { Line } from 'vue-chartjs';
  
  // Đăng ký các components cần thiết cho Chart.js
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  
  const router = useRouter();
  const { getToken, checkAdminRole } = useAuth();
  const { error: showError } = useNotify();
  
  // State
  const startDate = ref(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]);
  const endDate = ref(new Date().toISOString().split('T')[0]);
  const isLoading = ref(false);
  const revenueData = ref([]);
  
  // State for top products
  const topProducts = ref([]);
  const isLoadingProducts = ref(false);
  
  // State for user stats
  const userStats = ref([]);
  const isLoadingUsers = ref(false);
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Biểu đồ doanh thu theo thời gian'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', { 
              style: 'currency', 
              currency: 'VND',
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(value);
          }
        }
      },
      ordersAxis: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };
  
  // User chart options
  const userChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê người dùng theo thời gian'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  
  // Computed values
  const totalRevenue = computed(() => {
    return revenueData.value.reduce((sum, item) => sum + item.totalRevenue, 0);
  });
  
  const totalOrders = computed(() => {
    return revenueData.value.reduce((sum, item) => sum + item.totalOrders, 0);
  });
  
  const averageOrderValue = computed(() => {
    if (totalOrders.value === 0) return 0;
    return totalRevenue.value / totalOrders.value;
  });
  
  const ordersPerDay = computed(() => {
    if (revenueData.value.length === 0) return 0;
    return (totalOrders.value / revenueData.value.length).toFixed(1);
  });
  
  const chartData = computed(() => {
    // Sắp xếp dữ liệu theo thời gian tăng dần
    const sortedData = [...revenueData.value].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: sortedData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      }),
      datasets: [
        {
          label: 'Doanh thu',
          data: sortedData.map(item => item.totalRevenue),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false
        },
        {
          label: 'Số đơn hàng',
          data: sortedData.map(item => item.totalOrders),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
          fill: false,
          yAxisID: 'ordersAxis'
        }
      ]
    };
  });
  
  // Computed values for user stats
  const totalRegistrations = computed(() => {
    return userStats.value.reduce((sum, item) => sum + item.totalRegistrations, 0);
  });
  
  const totalActiveUsers = computed(() => {
    const lastStat = userStats.value[userStats.value.length - 1];
    return lastStat ? lastStat.activeUsers : 0;
  });
  
  const totalInactiveUsers = computed(() => {
    const lastStat = userStats.value[userStats.value.length - 1];
    return lastStat ? lastStat.inactiveUsers : 0;
  });
  
  const activeRate = computed(() => {
    const total = totalActiveUsers.value + totalInactiveUsers.value;
    if (total === 0) return 0;
    return Math.round((totalActiveUsers.value / total) * 100);
  });
  
  const userChartData = computed(() => {
    // Sắp xếp dữ liệu theo thời gian tăng dần
    const sortedData = [...userStats.value].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: sortedData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      }),
      datasets: [
        {
          label: 'Tổng đăng ký',
          data: sortedData.map(item => item.totalRegistrations),
          borderColor: 'rgb(59, 130, 246)', // blue
          tension: 0.1,
          fill: false
        },
        {
          label: 'Đang hoạt động',
          data: sortedData.map(item => item.activeUsers),
          borderColor: 'rgb(34, 197, 94)', // green
          tension: 0.1,
          fill: false
        },
        {
          label: 'Bị khóa',
          data: sortedData.map(item => item.inactiveUsers),
          borderColor: 'rgb(239, 68, 68)', // red
          tension: 0.1,
          fill: false
        }
      ]
    };
  });
  
  // Methods
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
  
  const fetchRevenueData = async () => {
    try {
      isLoading.value = true;
      const token = getToken();
      
      const response = await fetch(
        `http://localhost:8080/api/statistics/revenue?startDate=${startDate.value}&endDate=${endDate.value}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*'
          }
        }
      );
  
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu thống kê');
      }
  
      const data = await response.json();
      revenueData.value = data;
      
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      showError('Không thể lấy dữ liệu thống kê');
    } finally {
      isLoading.value = false;
    }
  };
  
  const fetchTopProducts = async () => {
    try {
      isLoadingProducts.value = true;
      const token = getToken();
      
      const response = await fetch(
        `http://localhost:8080/api/statistics/top-products?startDate=${startDate.value}&endDate=${endDate.value}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu sản phẩm bán chạy');
      }

      const data = await response.json();
      topProducts.value = data;
      
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm bán chạy:', error);
      showError('Không thể lấy dữ liệu sản phẩm bán chạy');
    } finally {
      isLoadingProducts.value = false;
    }
  };
  
  const fetchUserStats = async () => {
    try {
      isLoadingUsers.value = true;
      const token = getToken();
      
      const response = await fetch(
        `http://localhost:8080/api/statistics/user-registrations?startDate=${startDate.value}&endDate=${endDate.value}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu thống kê người dùng');
      }

      const data = await response.json();
      userStats.value = data;
      
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu thống kê người dùng:', error);
      showError('Không thể lấy dữ liệu thống kê người dùng');
    } finally {
      isLoadingUsers.value = false;
    }
  };
  
  const fetchAllData = async () => {
    await Promise.all([
      fetchRevenueData(),
      fetchTopProducts(),
      fetchUserStats()
    ]);
  };
  
  // Watch changes
  watch([startDate, endDate], () => {
    fetchAllData();
  });
  
  // Kiểm tra quyền admin và khởi tạo dữ liệu
  onMounted(async () => {
    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      router.push('/');
      return;
    }
    
    await fetchAllData();
  });
  </script>
