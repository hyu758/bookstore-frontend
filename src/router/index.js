import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import BooksView from '../views/BooksView.vue'
import AdminProductView from '../views/AdminProductView.vue'
import AdminProductAdd from '../views/AdminProductAdd.vue'
import AdminProductEdit from '../views/AdminProductEdit.vue'
import AdminUserView from '../views/AdminUserView.vue'
import AdminUserDetailView from '../views/AdminUserDetailView.vue'

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
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminDashboard.vue'),
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
      component: () => import('../views/CartView.vue')
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
      meta: { requiresAuth: true }
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
    }
  ],
})

export default router
