import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import BooksView from '../views/BooksView.vue'

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
      component: () => import('../views/AdminProductView.vue'),
    },
    {
      path: '/admin/products/add',
      name: 'adminProductsAdd',
      component: () => import('../views/AdminProductAdd.vue'),
    },
    {
      path: '/admin/products/edit/:id',
      name: 'adminProductsEdit',
      component: () => import('../views/AdminProductEdit.vue'),
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
    }
  ],
})

export default router
