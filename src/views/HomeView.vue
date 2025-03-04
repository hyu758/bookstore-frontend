<template>
  <div class="new-arrival">
    <div class="title-menu">
      <h3 class="text-white">Sách mới về</h3>
    </div>
    <div class = "mt-4">
      <div class="flex gap-4">
        <div v-for="(book, index) in books" :key="index"
        class="w-1/4 bg-white shadow-md p-4 rounded-lg">
        <img :src="book.image" alt="Book Image" class="w-full h-40 object-cover rounded-md" />
        <h4 class="mt-2 font-semibold">{{ book.title }}</h4>
        <p class="text-sm text-gray-600">{{ book.author }}</p>
        <p class = "text-sm text-red-400">{{book.price}}</p>
      </div>
    </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";

const books = ref([
  { title: "Sách 1", author: "Tác giả 1", image: "https://via.placeholder.com/150", price: 300000 },
  { title: "Sách 2", author: "Tác giả 2", image: "https://via.placeholder.com/150" , price: 300000},
  { title: "Sách 3", author: "Tác giả 3", image: "https://via.placeholder.com/150" , price: 300000},
  { title: "Sách 4", author: "Tác giả 4", image: "https://via.placeholder.com/150" , price: 300000}
]);
</script>

<style>
.title-menu h3 {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  text-transform: uppercase;
  display: inline-block;
  height: 45px;
  padding: 15px 30px 15px;
  -ms-align-items: center;
  align-items: center;
  transform: skew(-10deg);
  background-color: #498374;
  display: inline-flex;
  margin-left: -5px;
}
</style>