import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ تم إضافة التوجيه
import { useShop } from '../context';
import { Trash2, Plus, X, Upload, Loader, Package, ShoppingBag, User, Calendar, Phone, MapPin, CreditCard, Save } from 'lucide-react';
import axios from 'axios';

const AdminPage = () => {
  const { products, categories, deleteProduct, loading, userInfo } = useShop();
  const navigate = useNavigate(); // ✅ التهيئة
  
  // حالات جديدة للتبديل بين المنتجات والطلبات
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // حالات لتحديث الطلبات
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [orderUpdates, setOrderUpdates] = useState({});

  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: '', name: '', price: '', category: '', description: '', imageUrl: ''
  });

  // ✅ حماية الصفحة + جلب الطلبات
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
        navigate('/'); // طرد أي مستخدم عادي أو غير مسجل إلى الرئيسية
    } else {
        fetchOrders();
    }
  }, [userInfo, navigate]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
        const config = {
            headers: { Authorization: `Bearer ${userInfo?.token}` },
        };
        const { data } = await axios.get('/api/orders', config);
        setOrders(data);
        
        // تهيئة حالة التحديثات لكل طلب
        const initialUpdates = {};
        data.forEach((order) => {
          initialUpdates[order._id] = { status: order.status, deliveryTime: order.deliveryTime || '' };
        });
        setOrderUpdates(initialUpdates);

    } catch (error) {
        console.error("Error fetching orders:", error);
    } finally {
        setLoadingOrders(false);
    }
  };

  const handleOrderUpdateChange = (orderId, field, value) => {
    setOrderUpdates(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  const submitOrderUpdate = async (orderId) => {
    setUpdatingOrderId(orderId);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      await axios.put(`/api/orders/${orderId}/status`, orderUpdates[orderId], config);
      alert('تم تحديث حالة الطلب بنجاح');
      fetchOrders(); // إعادة جلب البيانات لتحديث الواجهة
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التحديث');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', formData, config);
      setNewProduct(prev => ({ ...prev, imageUrl: data }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('فشل رفع الصورة');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      
      const productData = {
        ...newProduct,
        id: newProduct.id || `prod-${Date.now()}`
      };

      await axios.post('/api/products', productData, config);
      alert('تم إضافة المنتج بنجاح! 🎉');
      setShowAddForm(false);
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء الإضافة');
    }
  };

  if (loading) return <div className="text-white text-center pt-20">جاري التحميل...</div>;

  // إخفاء المحتوى إذا لم يكن أدمن (لمنع وميض الشاشة قبل التوجيه)
  if (!userInfo || !userInfo.isAdmin) return null; 

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-neutral-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gold-500 mb-2">لوحة التحكم</h1>
            <p className="text-gray-400">إدارة المصنع (عدد المنتجات: {products.length})</p>
          </div>

          {/* أزرار التبديل */}
          <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            <button 
                onClick={() => setActiveTab('products')}
                className={`px-6 py-2 rounded-md transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-gold-600 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                <Package size={18} /> المنتجات
            </button>
            <button 
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-2 rounded-md transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-gold-600 text-black font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                <ShoppingBag size={18} /> الطلبات
                {orders.length > 0 && <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">{orders.length}</span>}
            </button>
          </div>

          {/* زر إضافة منتج (يظهر فقط في تبويب المنتجات) */}
          {activeTab === 'products' && (
            <button 
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
                <Plus size={20} /> إضافة منتج جديد
            </button>
          )}
        </div>

        {/* ==================== TAB 1: PRODUCTS (المنتجات) ==================== */}
        {activeTab === 'products' && (
            <>
                {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-gold-600/30 rounded-xl p-6 w-full max-w-lg shadow-2xl relative">
                    <button onClick={() => setShowAddForm(false)} className="absolute top-4 left-4 text-gray-400 hover:text-red-500"><X size={24} /></button>
                    <h2 className="text-xl font-bold text-white mb-6">إضافة منتج جديد</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">اسم المنتج</label>
                            <input required name="name" onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-gold-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">السعر</label>
                                <input required name="price" onChange={handleChange} placeholder="مثال: 1500 ج.م" className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-gold-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">القسم</label>
                                <select required name="category" onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-gold-500 outline-none">
                                <option value="">اختر القسم...</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">صورة المنتج</label>
                            <div className="flex gap-2 items-center">
                                <input readOnly value={newProduct.imageUrl} placeholder="اختر صورة..." className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-gray-500 focus:border-gold-500 outline-none cursor-not-allowed text-xs" />
                                <label className={`bg-gold-600 hover:bg-gold-500 text-black px-4 py-2 rounded cursor-pointer flex items-center transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {uploading ? <Loader className="animate-spin" size={18} /> : <Upload size={18} />}
                                    <span className="mr-2 text-sm font-bold">{uploading ? 'جاري الرفع...' : 'رفع'}</span>
                                    <input type="file" onChange={uploadFileHandler} className="hidden" disabled={uploading} />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1 text-sm">وصف المنتج</label>
                            <textarea name="description" onChange={handleChange} rows={3} className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-gold-500 outline-none"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-3 rounded-lg mt-4 transition-transform hover:-translate-y-1">حفظ المنتج</button>
                    </form>
                    </div>
                </div>
                )}

                <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                        <thead className="bg-neutral-800 text-gold-500">
                            <tr>
                            <th className="p-4">الصورة</th>
                            <th className="p-4">الاسم</th>
                            <th className="p-4">السعر</th>
                            <th className="p-4">القسم</th>
                            <th className="p-4 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {products.map((product) => (
                            <tr key={product._id || product.id} className="hover:bg-neutral-800/50 transition-colors">
                                <td className="p-4">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-700">
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                </td>
                                <td className="p-4 font-medium text-white">{product.name}</td>
                                <td className="p-4 text-gray-300">{product.price}</td>
                                <td className="p-4">
                                <span className="bg-neutral-800 text-xs px-2 py-1 rounded text-gray-400">
                                    {categories.find(c => c.id === product.category)?.title || product.category}
                                </span>
                                </td>
                                <td className="p-4 text-center">
                                <button 
                                    onClick={() => deleteProduct(product._id || product.id)}
                                    className="text-red-500 hover:text-red-400 bg-red-500/10 p-2 rounded-lg hover:bg-red-500/20 transition-all"
                                    title="حذف المنتج"
                                >
                                    <Trash2 size={18} />
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </>
        )}

        {/* ==================== TAB 2: ORDERS (الطلبات) ==================== */}
        {activeTab === 'orders' && (
            <div className="space-y-6">
                {loadingOrders ? (
                    <div className="text-center text-white py-10">جاري تحميل الطلبات...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center text-gray-500 py-20 bg-neutral-900 rounded-xl border border-neutral-800">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                        <p>لا يوجد طلبات جديدة حتى الآن</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg flex flex-col lg:flex-row">
                            
                            {/* معلومات الطلب والمنتجات (اليمين) */}
                            <div className="flex-grow lg:w-2/3">
                                {/* Order Header */}
                                <div className="bg-neutral-800/50 p-4 flex flex-wrap justify-between items-center border-b border-neutral-800 gap-4">
                                    <div>
                                        <h3 className="text-gold-500 font-bold text-lg flex items-center gap-2">
                                            <User size={18} /> {order.user?.name || 'عميل'}
                                        </h3>
                                        <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                                            <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString('ar-EG')} 
                                            <span className="mx-1">|</span> 
                                            {new Date(order.createdAt).toLocaleTimeString('ar-EG')}
                                        </p>
                                    </div>
                                    <div className="text-left text-sm text-gray-300 space-y-1">
                                        <p className="flex items-center gap-2 justify-end"><Phone size={14} className="text-gold-500"/> {order.shippingAddress.phoneNumber}</p>
                                        <p className="flex items-center gap-2 justify-end"><MapPin size={14} className="text-gold-500"/> {order.shippingAddress.city}، {order.shippingAddress.address}</p>
                                        <p className="flex items-center gap-2 justify-end text-gold-400 font-bold mt-2"><CreditCard size={14} /> {order.paymentMethod}</p>
                                    </div>
                                </div>

                                {/* Order Items Table */}
                                <div className="p-4 border-b lg:border-b-0 border-neutral-800">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-right text-gray-300">
                                            <thead className="text-gray-500 border-b border-neutral-800">
                                                <tr>
                                                    <th className="pb-2">المنتج</th>
                                                    <th className="pb-2">الكمية</th>
                                                    <th className="pb-2">السعر (للقطعة)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-800">
                                                {order.orderItems.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="py-3 flex items-center gap-3">
                                                            <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded object-cover bg-neutral-800" />
                                                            <span>{item.name}</span>
                                                        </td>
                                                        <td className="py-3 font-bold">x {item.quantity}</td>
                                                        <td className="py-3 text-gold-500">{item.price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* تحديث حالة الطلب من الإدارة (اليسار) */}
                            <div className="bg-neutral-950 p-6 lg:w-1/3 flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-neutral-800">
                                <div>
                                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">تحديث حالة الطلب</h4>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-400 text-xs mb-1">الحالة</label>
                                            <select 
                                                value={orderUpdates[order._id]?.status || order.status}
                                                onChange={(e) => handleOrderUpdateChange(order._id, 'status', e.target.value)}
                                                className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                                            >
                                                <option value="قيد المراجعة">قيد المراجعة</option>
                                                <option value="جاري التجهيز">جاري التجهيز</option>
                                                <option value="قيد التوصيل">قيد التوصيل</option>
                                                <option value="تم التسليم">تم التسليم</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-400 text-xs mb-1">وقت التسليم / ملاحظة للزبون</label>
                                            <textarea 
                                                value={orderUpdates[order._id]?.deliveryTime || ''}
                                                onChange={(e) => handleOrderUpdateChange(order._id, 'deliveryTime', e.target.value)}
                                                placeholder="مثال: سيتم التسليم خلال 3 أيام..."
                                                rows={3}
                                                className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:border-gold-500 outline-none text-sm"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => submitOrderUpdate(order._id)}
                                    disabled={updatingOrderId === order._id}
                                    className="w-full mt-4 bg-gold-600 hover:bg-gold-500 text-black font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {updatingOrderId === order._id ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                                    تحديث الطلب
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;