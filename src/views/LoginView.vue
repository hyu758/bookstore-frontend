<script setup>
import { onMounted, ref } from "vue";
import { useNotify } from '@/composables/notify';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const username = ref("");
const password = ref("");
const router = useRouter();
const { error: showError, success } = useNotify();

const login = async () => {
    try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
            }),
        });

        const data = await response.json();
        console.log(data);
        if (data.error) {
            showError(data.error);
            return;
        }

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        success('Đăng nhập thành công!');
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.href = '/';

    } catch (error) {
        showError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!');
    }
};

onMounted(() => {
    const {setToken} = useAuth();
})
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto"
                src="/src/assets/logo.png" alt="BookZen" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Đăng nhập</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form @submit.prevent="login" class="space-y-6">
                <div>
                    <label for="username" class="block text-sm/6 font-medium text-gray-900">Tên đăng nhập</label>
                    <div class="mt-2">
                        <input v-model="username" type="username" autocomplete="username" required=""
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium text-gray-900">Mật khẩu</label>
                        <div class="text-sm">
                            <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Quên mật khẩu</a>
                        </div>
                    </div>
                    <div class="mt-2">
                        <input v-model="password" type="password" autocomplete="current-password" required=""
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                </div>

                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                        in</button>
                </div>
            </form>

            <p class="mt-10 text-center text-sm/6 text-gray-500">
                Bạn chưa có tài khoản?
                {{ ' ' }}
                <a href="register" class="font-semibold text-indigo-600 hover:text-indigo-500">Đăng ký tại đây</a>
            </p>
        </div>
    </div>
</template>
