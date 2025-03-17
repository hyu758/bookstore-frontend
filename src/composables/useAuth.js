import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useNotify } from './notify';

export const useAuth = () => {
  const token = ref(sessionStorage.getItem('accessToken'));
  const refreshToken = ref(sessionStorage.getItem('refreshToken'));
  const role = ref(sessionStorage.getItem('userRole'));
  const accessTokenExpiration = ref(sessionStorage.getItem('accessTokenExpiration') ? new Date(sessionStorage.getItem('accessTokenExpiration')) : null);
  const refreshTokenExpiration = ref(sessionStorage.getItem('refreshTokenExpiration') ? new Date(sessionStorage.getItem('refreshTokenExpiration')) : null);
  const router = useRouter();
  const { error: showError } = useNotify();
  let tokenCheckInterval = null;

  const getToken = () => {
    return token.value;
  };

  const setToken = (newToken, newRefreshToken, newRole, newAccessTokenExpiration, newRefreshTokenExpiration) => {
    token.value = newToken;
    refreshToken.value = newRefreshToken;
    role.value = newRole;
    
    if (newAccessTokenExpiration) {
      accessTokenExpiration.value = new Date(newAccessTokenExpiration);
      sessionStorage.setItem('accessTokenExpiration', newAccessTokenExpiration);
    } else {
      accessTokenExpiration.value = null;
      sessionStorage.removeItem('accessTokenExpiration');
    }
    
    if (newRefreshTokenExpiration) {
      refreshTokenExpiration.value = new Date(newRefreshTokenExpiration);
      sessionStorage.setItem('refreshTokenExpiration', newRefreshTokenExpiration);
    } else {
      refreshTokenExpiration.value = null;
      sessionStorage.removeItem('refreshTokenExpiration');
    }
    
    if (newToken) {
      sessionStorage.setItem('accessToken', newToken);
    } else {
      sessionStorage.removeItem('accessToken');
    }
    
    if (newRefreshToken) {
      sessionStorage.setItem('refreshToken', newRefreshToken);
    } else {
      sessionStorage.removeItem('refreshToken');
    }
    
    if (newRole) {
      sessionStorage.setItem('userRole', newRole);
    } else {
      sessionStorage.removeItem('userRole');
    }
    
    // Thiết lập kiểm tra token hết hạn
    setupTokenExpirationCheck();
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
        showError("Bạn không có quyền truy cập!");
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

  const removeToken = () => {
    token.value = null;
    refreshToken.value = null;
    role.value = null;
    accessTokenExpiration.value = null;
    refreshTokenExpiration.value = null;
    
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("accessTokenExpiration");
    sessionStorage.removeItem("refreshTokenExpiration");
    
    if (tokenCheckInterval) {
      clearInterval(tokenCheckInterval);
      tokenCheckInterval = null;
    }
  };

  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token.value}`,
    };
  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error('Không có refresh token');
      }
      
      const response = await axios.post("http://localhost:8080/api/auth/refresh", {
        refreshToken: refreshToken.value
      });
      
      const data = response.data.data;
      setToken(
        data.accessToken, 
        data.refreshToken, 
        data.role, 
        data.accessTokenExpirationDate, 
        data.refreshTokenExpirationDate
      );
      
      return true;
    } catch (error) {
      console.error("Lỗi khi làm mới token:", error);
      logout();
      return false;
    }
  };

  const isTokenExpired = () => {
    if (!accessTokenExpiration.value) return true;
    return new Date() >= accessTokenExpiration.value;
  };

  const isRefreshTokenExpired = () => {
    if (!refreshTokenExpiration.value) return true;
    return new Date() >= refreshTokenExpiration.value;
  };

  const setupTokenExpirationCheck = () => {
    // Xóa interval cũ nếu có
    if (tokenCheckInterval) {
      clearInterval(tokenCheckInterval);
    }
    
    // Thiết lập interval mới nếu có token
    if (token.value) {
      tokenCheckInterval = setInterval(async () => {
        // Nếu access token hết hạn
        if (isTokenExpired()) {
          // Nếu refresh token còn hạn, thử làm mới token
          if (!isRefreshTokenExpired()) {
            const success = await refreshAccessToken();
            if (!success) {
              logout();
            }
          } else {
            // Nếu refresh token hết hạn, đăng xuất
            logout();
          }
        }
      }, 600000); // Kiểm tra mỗi 10 phút
    }
  };

  const logout = () => {
    removeToken();
    router.push('/login');
  };

  // Thiết lập kiểm tra token khi component được mount
  onMounted(() => {
    setupTokenExpirationCheck();
  });

  return {
    token,
    refreshToken,
    role,
    getToken,
    setToken,
    checkAdminRole,
    getAuthHeaders,
    removeToken,
    refreshAccessToken,
    isTokenExpired,
    isRefreshTokenExpired,
    logout
  };
}; 