<script setup>
import { ref, computed } from "vue";
import { useNotify } from '@/composables/notify';
import { useRouter } from 'vue-router';

const {getToken} = useAuth();
const userName = ref("");
const email = ref("");
const password = ref("");
const fullName = ref("");
const errorMessage = ref("");
const { error: showError, success } = useNotify();
const router = useRouter();

// Validation rules
const usernameRules = computed(() => {
    if (!userName.value) return "Tên đăng nhập không được để trống";
    if (userName.value.length < 3) return "Tên đăng nhập phải có ít nhất 3 ký tự";
    if (!/^[a-zA-Z0-9]+$/.test(userName.value)) return "Tên đăng nhập chỉ được chứa chữ cái và số";
    return "";
});

const emailRules = computed(() => {
    if (!email.value) return "Email không được để trống";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return "Email không hợp lệ";
    return "";
});

const fullNameRules = computed(() => {
    if (!fullName.value) return "Họ và tên không được để trống";
    if (fullName.value.trim().split(/\s+/).length < 2) return "Họ và tên phải có ít nhất 2 từ";
    return "";
});

const passwordRules = computed(() => {
    if (!password.value) return "Mật khẩu không được để trống";
    if (password.value.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
    return "";
});

const isFormValid = computed(() => {
    return !usernameRules.value && !emailRules.value && !fullNameRules.value && !passwordRules.value;
});

const register = async () => {
    errorMessage.value = "";
    
    if (!isFormValid.value) {
        const errors = [
            usernameRules.value,
            emailRules.value,
            fullNameRules.value,
            passwordRules.value
        ].filter(error => error);
        
        showError(errors[0]);
        return;
    }

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
                        <p v-if="usernameRules" class="mt-1 text-sm text-red-600">{{ usernameRules }}</p>
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-900">Email</label>
                    <div class="mt-2">
                        <input v-model="email" type="email" autocomplete="email" required
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm" />
                        <p v-if="emailRules" class="mt-1 text-sm text-red-600">{{ emailRules }}</p>
                    </div>
                </div>
                <div>
                    <label for="fullName" class="block text-sm font-medium text-gray-900">Họ và tên</label>
                    <div class="mt-2">
                        <input v-model="fullName" type="text" required
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm" />
                        <p v-if="fullNameRules" class="mt-1 text-sm text-red-600">{{ fullNameRules }}</p>
                    </div>
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-900">Mật khẩu</label>
                    <div class="mt-2">
                        <input v-model="password" type="password" autocomplete="new-password" required
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600 sm:text-sm" />
                        <p v-if="passwordRules" class="mt-1 text-sm text-red-600">{{ passwordRules }}</p>
                    </div>
                </div>

                <div>
                    <button type="submit"
                        :disabled="!isFormValid"
                        :class="[
                            'flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow focus:outline focus:outline-indigo-600',
                            isFormValid ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-400 cursor-not-allowed'
                        ]">
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
