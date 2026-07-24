import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Home, Grid, Info, User, ShoppingCart, Trash2, LogOut, Shield, Package } from 'lucide-react';
import { useShop } from '../context';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, removeFromCart, isCartOpen, setIsCartOpen, isAuthenticated, userInfo, logout } = useShop();

  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  if (location.pathname === '/login' || location.pathname === '/register') return null;

  const navLinks = [
    { name: 'Home', targetId: '', icon: <Home size={18} /> },
    { name:'Products', targetId: 'products', icon: <Grid size={18} /> },
    { name: 'Abaut us', targetId: 'about', icon: <Info size={18} /> },
    { name: 'Contact', targetId: 'contact', icon: <Phone size={18} /> },
  ];

  // ✅ تم التعديل: التمرير البرمجي بدون تغيير مسار الـ Router
  const handleNavClick = (targetId) => {
    if (!targetId) {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsOpen(false);
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      // نعطي المتصفح 300 جزء من الثانية ليحمل الرئيسية ثم ينزل للقسم
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const fetchMyOrders = async () => {
    if (!userInfo) return;
    setLoadingOrders(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/orders/myorders', config);
      setMyOrders(data);
    } catch (error) {
      console.error("Error fetching my orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleOpenMyOrders = () => {
    setIsMyOrdersOpen(true);
    fetchMyOrders();
  };

  return (
    <>
      <nav dir="ltr" className="fixed w-full z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <Link to="/" onClick={() => window.scrollTo(0,0)} className="flex-shrink-0 flex items-center gap-3">
               <img src="/img/logo.jpg" alt="Logo" className="h-12 w-auto rounded-md border border-gold-600/30" />
               <span className="font-bold text-xl hidden sm:block text-gold-gradient tracking-wider">
                 MODERN FURNITURE
               </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-baseline space-x-4 space-x-reverse">
                {navLinks.map((link) => (
                  // ✅ تم التعديل: استخدام زر بدلاً من رابط a
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.targetId)}
                    className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer bg-transparent border-none outline-none"
                  >
                    {link.icon}
                    {link.name}
                  </button>
                ))}
                
                {userInfo?.isAdmin && (
                   <Link to="/admin" className="text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                     <Shield size={18} /> الإدارة
                   </Link>
                )}
              </div>
              
              {isAuthenticated && (
                <button 
                  onClick={handleOpenMyOrders}
                  className="relative p-2 text-gray-300 hover:text-gold-500 transition-colors"
                  title="طلباتي السابقة"
                >
                  <Package size={22} />
                </button>
              )}

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-300 hover:text-gold-500 transition-colors"
                title="السلة"
              >
                <ShoppingCart size={22} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gold-500 hidden lg:block font-bold truncate max-w-[100px]">
                        {userInfo?.name}
                    </span>
                    <button 
                        onClick={logout}
                        className="bg-neutral-800 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                        title="تسجيل خروج"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
              ) : (
                <Link 
                    to="/login"
                    className="bg-neutral-800 hover:bg-gold-600 hover:text-black text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border border-neutral-700"
                >
                    <User size={16} />
                    تسجيل دخول
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center gap-4">
              {isAuthenticated && (
                <button onClick={handleOpenMyOrders} className="relative p-2 text-gray-300 hover:text-gold-500">
                  <Package size={22} />
                </button>
              )}

              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-300 hover:text-gold-500">
                <ShoppingCart size={22} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gold-500 hover:text-white hover:bg-neutral-800 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-neutral-900 border-b border-gold-900/30">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                // ✅ تم التعديل هنا أيضاً
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.targetId)}
                  className="w-full text-right text-gray-300 hover:text-gold-400 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 cursor-pointer bg-transparent border-none outline-none"
                >
                   {link.icon}
                   {link.name}
                </button>
              ))}
              
              {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="text-red-500 hover:text-red-400 w-full text-right px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 border-t border-neutral-800 mt-2"
                  >
                     <LogOut size={18} />
                     تسجيل خروج ({userInfo?.name})
                  </button>
              ) : (
                <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-gold-500 hover:text-gold-400 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 border-t border-neutral-800 mt-2"
                >
                    <User size={18} />
                    تسجيل دخول
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-full max-w-md bg-neutral-900 border-r border-neutral-800 shadow-2xl transform transition-transform duration-300 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
              <h2 className="text-2xl font-bold text-gold-500 flex items-center gap-2">
                <ShoppingCart /> سلة المشتريات
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-4 custom-scrollbar pr-2">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <p>السلة فارغة حالياً</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-4 text-gold-500 hover:underline">تصفح المنتجات</button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={`${item._id || item.id}-${index}`} className="flex gap-4 bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-grow">
                      <h3 className="font-bold text-white text-sm">{item.name}</h3>
                      <p className="text-gold-500 text-sm mt-1">{item.price}</p>
                      <span className="text-xs text-gray-500 block mt-1">الكمية: {item.quantity}</span>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item._id || item.id)}
                      className="text-red-500 hover:text-red-400 self-start p-2"
                      title="حذف من السلة"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="mt-6 border-t border-neutral-800 pt-4">
                <Link 
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-3 rounded-lg transition-colors block text-center"
                >
                  إتمام الطلب
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Orders Sidebar */}
      {isMyOrdersOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMyOrdersOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-full max-w-md bg-neutral-900 border-r border-neutral-800 shadow-2xl transform transition-transform duration-300 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
              <h2 className="text-2xl font-bold text-gold-500 flex items-center gap-2">
                <Package /> طلباتي السابقة
              </h2>
              <button onClick={() => setIsMyOrdersOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-4 custom-scrollbar pr-2">
              {loadingOrders ? (
                <div className="text-center text-gray-500 mt-10 animate-pulse">جاري تحميل الطلبات...</div>
              ) : myOrders.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <Package size={48} className="mx-auto opacity-30 mb-4" />
                  <p>لا يوجد لديك طلبات سابقة</p>
                </div>
              ) : (
                myOrders.map((order) => (
                  <div key={order._id} className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                    <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
                      <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span>
                      <span className={`text-xs px-2 py-1 rounded font-bold ${
                        order.status === 'تم التسليم' ? 'bg-green-900/50 text-green-400' :
                        order.status === 'قيد المراجعة' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-blue-900/50 text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover border border-neutral-800" />
                          <div>
                            <p className="text-white text-sm">{item.name}</p>
                            <p className="text-gray-500 text-xs mt-1">الكمية: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-neutral-900 p-3 rounded-lg border border-gold-600/20">
                      <p className="text-xs text-gold-400 font-bold mb-1">وقت التسليم / ملاحظة الإدارة:</p>
                      <p className="text-sm text-gray-200">{order.deliveryTime}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;