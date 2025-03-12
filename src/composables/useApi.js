import axios from 'axios';
import { useAuth } from './useAuth';

const API_URL = 'http://localhost:8080/api';

export const useApi = () => {
  const { getAuthHeaders } = useAuth();

  const fetchCategories = async (page = 0, size = 4, sort = 'name') => {
    try {
      const response = await axios.get(
        `${API_URL}/categories?page=${page}&size=${size}&sort=${sort}`
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          Accept: "*/*"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi xóa danh mục');
      }
      
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      throw error;
    }
  };

  const fetchProducts = async (page = 0, size = 10, sort = 'name') => {
    try {
      const response = await axios.get(
        `${API_URL}/products?page=${page}&size=${size}&sort=${sort}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách:", error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          Accept: "*/*"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi xóa sản phẩm');
      }
      
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa sách:", error);
      throw error;
    }
  };

  const getProductById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        headers: {
          Accept: "*/*"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi lấy thông tin sản phẩm');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      // Format và validate dữ liệu trước khi gửi
      const formattedData = {
        name: productData.name || "",
        description: productData.description || "",
        price: Number(productData.price) || 0,
        stockQuantity: Number(productData.stockQuantity) || 0,
        discount: Number(productData.discount || 0),
        realPrice: Number(productData.price) * (1 - Number(productData.discount || 0) / 100),
        author: productData.author || "",
        publisher: productData.publisher || "",
        publicationYear: Number(productData.publicationYear) || new Date().getFullYear(),
        pageCount: Number(productData.pageCount || 0),
        categoryIds: (productData.categoryIds || []).map(id => Number(id)),
        imageUrls: productData.imageUrls || [],
        isbn: productData.isbn || ""
      };

      console.log('Sending updated product data:', JSON.stringify(formattedData, null, 2));
      
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
          Accept: "*/*"
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi cập nhật sản phẩm');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      if (error.response) {
        console.error('Server response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        throw new Error(`Lỗi server: ${error.response.data.message || JSON.stringify(error.response.data)}`);
      } else {
        throw error;
      }
    }
  };

  const createProduct = async (productData) => {
    try {
      // Format và validate dữ liệu trước khi gửi
      const formattedData = {
        name: productData.name || "",
        description: productData.description || "",
        price: Number(productData.price) || 0,
        stockQuantity: Number(productData.stockQuantity) || 0,
        discount: Number(productData.discount || 0),
        realPrice: Number(productData.price) * (1 - Number(productData.discount || 0) / 100),
        author: productData.author || "",
        publisher: productData.publisher || "",
        publicationYear: Number(productData.publicationYear) || new Date().getFullYear(),
        pageCount: Number(productData.pageCount || 0),
        categoryIds: (productData.categoryIds || []).map(id => Number(id)),
        imageUrls: productData.imageUrls || [],
        averageRating: 0, // Mặc định là 0 cho sản phẩm mới
        reviewCount: 0, // Mặc định là 0 cho sản phẩm mới
        isbn: "" // Để trống vì không yêu cầu từ form
      };

      console.log('Sending product data:', JSON.stringify(formattedData, null, 2));
      
      const response = await axios.post(
        `${API_URL}/products`,
        formattedData,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo sách:", error);
      if (error.response) {
        // Server trả về response với status code nằm ngoài range 2xx
        console.error('Server response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        if (error.response.data && error.response.data.message) {
          throw new Error(`Lỗi server: ${error.response.data.message}`);
        }
        throw new Error(`Lỗi server (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // Request đã được gửi nhưng không nhận được response
        console.error('No response received:', error.request);
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        // Có lỗi khi thiết lập request
        console.error('Request setup error:', error.message);
        throw new Error(`Lỗi khi gửi yêu cầu: ${error.message}`);
      }
    }
  };

  const getProductImages = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}/images`, {
        headers: {
          Accept: "*/*"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi lấy danh sách ảnh sản phẩm');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ảnh sản phẩm:", error);
      throw error;
    }
  };

  const deleteProductImage = async (imageId) => {
    try {
      const response = await fetch(`${API_URL}/products/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          Accept: "*/*"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi xóa ảnh sản phẩm');
      }
      
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa ảnh sản phẩm:", error);
      throw error;
    }
  };

  const deleteAllProductImages = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}/images`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          Accept: "*/*"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi xóa tất cả ảnh sản phẩm');
      }
      
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa tất cả ảnh sản phẩm:", error);
      throw error;
    }
  };

  return {
    fetchCategories,
    deleteCategory,
    fetchProducts,
    deleteProduct,
    getProductById,
    updateProduct,
    createProduct,
    getProductImages,
    deleteProductImage,
    deleteAllProductImages
  };
}; 