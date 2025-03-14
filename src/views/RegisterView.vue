<script setup>
import { ref } from "vue";
import { useNotify } from '@/composables/notify';
import { useRouter } from 'vue-router';

const userName = ref("");
const email = ref("");
const password = ref("");
const fullName = ref("");
const errorMessage = ref("");
const { error: showError, success } = useNotify();
const router = useRouter();

const register = async () => {
    errorMessage.value = "";
    try {
        const response = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userName.value,
                password: password.value,
                email: email.value,        
                fullName: fullName.value,
            }),
        });
        console.log(response);
        const data = await response.json();
        if (!response.ok){
            throw new Error(data.message || "Đăng ký thất bại, vui lòng thử lại.");
        }
        
        success("Đăng ký thành công!");
        // Đợi 1 giây để hiển thị thông báo trước khi chuyển trang
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/login");
    } catch (error) {
        errorMessage.value = error.message;
        showError(error.message);
    }
};
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto"
            src="/src/assets/logo.png" alt="BookZen"/>
            <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Đăng ký</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="register" class="space-y-6">
                <div>
                    <label for="userName" class="block text-sm font-medium text-gray-900">Tên đăng nhập</label>
                    <div class="mt-2">
                        <input v-model="userName" type="text" autocomplete="username" required
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm" />
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-900">Email</label>
                    <div class="mt-2">
                        <input v-model="email" type="email" autocomplete="email" required
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm" />
                    </div>
                </div>
                <div>
                    <label for="fullName" class="block text-sm font-medium text-gray-900">Họ và tên</label>
                    <div class="mt-2">
                        <input v-model="fullName" type="text" required
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm" />
                    </div>
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-900">Mật khẩu</label>
                    <div class="mt-2">
                        <input v-model="password" type="password" autocomplete="new-password" required
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm" />
                    </div>
                </div>

                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline focus:outline-indigo-600">
                        Đăng ký
                    </button>
                </div>
            </form>

            <p class="mt-10 text-center text-sm text-gray-500">
                Bạn đã có tài khoản?
                <RouterLink to="/login" class="font-semibold text-indigo-600 hover:text-indigo-500">Đăng nhập</RouterLink>
            </p>
        </div>
    </div>
</template>
