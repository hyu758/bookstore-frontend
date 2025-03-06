<template>
<div class="w-64 bg-blue-800 text-white">
    <div class="p-6">
      <h1 class="text-2xl font-bold">ADMIN</h1>
    </div>
    <nav class="mt-4">
      <RouterLink
        to="/admin"
        class="flex items-center p-4 hover:bg-blue-700"
        :class="{ 'bg-blue-700': $route.path === '/admin' }"
      >
        <span class="mr-2">📊</span> Dashboard
      </RouterLink>
      <RouterLink
        to="/admin/users"
        class="flex items-center p-4 hover:bg-blue-700"
        :class="{ 'bg-blue-700': $route.path === '/admin/users' }"
      >
        <span class="mr-2">👥</span> Quản lý người dùng
      </RouterLink>
      <RouterLink
        to="/admin/products"
        class="flex items-center p-4 hover:bg-blue-700"
        :class="{ 'bg-blue-700': $route.path === '/admin/products' }"
      >
        <span class="mr-2">📦</span> Quản lý sản phẩm
      </RouterLink>
      <RouterLink
        to="/admin/products"
        class="flex items-center p-4 hover:bg-blue-700"
        :class="{ 'bg-blue-700': $route.path === '/admin/orders' }"
      >
        <span class="mr-2">📦</span> Quản lý đơn hàng
      </RouterLink>
    </nav>
  </div>
</template>