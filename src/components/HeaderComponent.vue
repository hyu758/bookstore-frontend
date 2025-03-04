<template>
<header class="bg-white shadow-md">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <RouterLink to="/">
        <div class = " flex items-center">
          <img class = "h-10 w-auto mx-4" src="./assets/logo.png" alt="">
          <div class="text-xl font-bold text-gray-800">
          BookZen
        </div>
        </div>
        
        
      </RouterLink>

      <nav class="space-x-6">
        <RouterLink to="/" class="text-gray-600 hover:text-blue-600">Trang chủ</RouterLink>
        <RouterLink to="/login" class="text-gray-600 hover:text-blue-600">Đăng nhập</RouterLink>
      </nav>
    </div>
</header>
</template>