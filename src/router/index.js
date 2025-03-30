import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import BooksView from '../views/BooksView.vue'
import AdminProductView from '../views/AdminProductView.vue'
import AdminProductAdd from '../views/AdminProductAdd.vue'
import AdminProductEdit from '../views/AdminProductEdit.vue'
import AdminUserView from '../views/AdminUserView.vue'
import AdminUserDetailView from '../views/AdminUserDetailView.vue'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/products',
      name: 'adminProducts',
      component: AdminProductView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/products/add',
      name: 'adminProductsAdd',
      component: AdminProductAdd,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/products/edit/:id',
      name: 'adminProductsEdit',
      component: AdminProductEdit,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/users',
      name: 'adminUsers',
      component: AdminUserView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/users/detail/:id',
      name: 'adminUsersDetail',
      component: AdminUserDetailView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/admin/products/addCategory",
      name: "AddCategory",
      component: () => import('../views/AddCategory.vue'),
    },
    {
      path: "/contact",
      name: "Contact",
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
      meta: { requiresAuth: true, requiresAdmin: false }
    },
    {
      path: '/book/:id',
      name: 'product-detail',
      component: ProductDetailView
    },
    {
      path: '/books',
      name: 'books',
      component: BooksView
    },
    {
      path: '/books/category/:categoryId',
      name: 'books-by-category',
      component: BooksView
    },
    {
      path: '/orders/history',
      name: 'orderHistory',
      component: () => import('@/views/OrderHistory.vue'),
      meta: { requiresAuth: true, requiresAdmin: false }
    },
    {
      path: '/payment-success',
      name: 'PaymentSuccess',
      component: () => import('../views/PaymentSuccess.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/payment-failed', 
      name: 'PaymentFailed',
      component: () => import('../views/PaymentFailed.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/orders',
      name: 'AdminOrders',
      component: () => import('../views/AdminOrderView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue')
    }
  ],
})

// Thêm navigation guard
router.beforeEach(async (to, from, next) => {
  const { getToken, checkAdminRole } = useAuth();
  const token = getToken();

  // Kiểm tra requiresAuth
  if (to.meta.requiresAuth && !token) {
    next('/login');
    return;
  }

  // Kiểm tra requiresAdmin
  if (to.meta.requiresAdmin) {
    const isAdmin = await checkAdminRole();
    if (!isAdmin) {
      next('/');
      return;
    }
  }

  // Chặn admin truy cập các trang user
  if (to.meta.requiresAdmin === false) {
    const isAdmin = await checkAdminRole();
    if (isAdmin) {
      next('/admin');
      return;
    }
  }
  if (to.meta.requiresAuth === false) {
    if (token) {
      next('/');
      return;
    }
  }

  next();
});

export default router
