import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useAuth = () => {
  const token = ref(localStorage.getItem('accessToken'));
  const router = useRouter();

  const getToken = () => {
    return token.value;
  };

  const setToken = (newToken) => {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('accessToken', newToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  };

  const checkAdminRole = async () => {
    if (!token.value) {
      router.push('/login');
      return false;
    }

    try {
      const response = await axios.get("http://localhost:8080/api/auth/role", {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "*/*",
        },
      });
      
      if (response.data.data !== "ADMIN") {
        alert("Bạn không có quyền truy cập!");
        router.push("/");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Lỗi khi kiểm tra quyền:", error);
      router.push("/login");
      return false;
    }
  };

  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token.value}`,
    };
  };

  return {
    token,
    getToken,
    setToken,
    checkAdminRole,
    getAuthHeaders
  };
}; 