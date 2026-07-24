import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  );
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // دالة تسجيل الخروج (نقلناها للأعلى لتكون متاحة للمراقب)
  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cart');
    setUserInfo(null);
    setCart([]);
    // توجيه المستخدم لصفحة تسجيل الدخول بدلاً من الرئيسية ليعرف ماذا يفعل
    window.location.href = '#/login'; 
  };

  // ✅ الإضافة الجديدة: مراقب الطلبات (Axios Interceptor)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, // إذا كان الرد ناجحاً، يمر الطلب بسلام
      (error) => {
        if (error.response && error.response.status === 401) {
          // معرفة الرابط الذي تسبب في الخطأ
          const requestUrl = error.config?.url;
          
          // إذا كان الخطأ 401، والرابط "ليس" رابط تسجيل الدخول، قم بتسجيل الخروج
          if (requestUrl && !requestUrl.includes('/login')) {
            alert("انتهت الجلسة أو غير مصرح لك. يرجى تسجيل الدخول مجدداً.");
            logout(); 
          }
        }
        return Promise.reject(error);
      }
    );

    // تنظيف المراقب عند تفكيك المكون لتجنب تكراره في الذاكرة
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteProduct = async (id) => {
    if (!userInfo || !userInfo.isAdmin) {
      alert("عذراً، يجب أن تكون مديراً لحذف المنتجات");
      return;
    }
    try {
      if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        fetchData(); 
      }
    } catch (error) {
      alert(error.response?.data?.message || "حدث خطأ أثناء الحذف");
    }
  };

  const addReview = async (productId, review) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` } };
      await axios.post(`/api/products/${productId}/reviews`, review, config);
      fetchData(); 
    } catch (error) {
      throw new Error(error.response?.data?.message || 'فشل إضافة التقييم');
    }
  };

  const deleteReview = async (productId, reviewId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      await axios.delete(`/api/products/${productId}/reviews/${reviewId}`, config);
      fetchData(); 
    } catch (error) {
      alert(error.response?.data?.message || 'فشل حذف التقييم');
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => (item._id || item.id) === (product._id || product.id));
      if (existing) {
        return prev.map(item => 
          (item._id || item.id) === (product._id || product.id) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => (item._id || item.id) !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const login = async (email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/login', { email, password }, config);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'فشل تسجيل الدخول');
    }
  };

  const register = async (name, email, password) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('/api/users/register', { name, email, password }, config);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'فشل إنشاء الحساب');
    }
  };

  return (
    <ShopContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart,
      isAuthenticated: !!userInfo,
      userInfo,
      login, register, logout,
      isCartOpen, setIsCartOpen,
      products, categories, loading,
      deleteProduct,
      addReview, deleteReview 
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};