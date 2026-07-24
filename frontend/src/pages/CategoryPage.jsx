// import React, { useEffect, useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { ArrowRight, ShoppingBag, X, Loader, MessageCircle, Ruler, Star, Trash2 } from 'lucide-react';
// import { useShop } from '../context';

// const CategoryPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const { categories, products, loading, addToCart, isAuthenticated, userInfo, addReview, deleteReview } = useShop();
  
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // حالات (States) لنموذج الاستشارة
//   const [roomLength, setRoomLength] = useState('');
//   const [roomWidth, setRoomWidth] = useState('');
//   const [peopleCount, setPeopleCount] = useState('');

//   // حالات (States) لكتابة التقييم
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState('');
//   const [reviewError, setReviewError] = useState('');

//   const category = categories.find(c => c.id === id);
//   const categoryProducts = products.filter(p => p.category === id);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [id]);

//   // تحديث بيانات المنتج المحدد فور إغلاق نافذة أو إضافة تقييم ليعكس أحدث التقييمات
//   useEffect(() => {
//     if (selectedProduct) {
//       const updatedProduct = products.find(p => p._id === selectedProduct._id || p.id === selectedProduct.id);
//       if (updatedProduct) setSelectedProduct(updatedProduct);
//     }
//   }, [products]);

//   const handleOrderClick = (product) => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     } else {
//       addToCart(product);
//     }
//   };

//   const handleConsultationClick = () => {
//     const text = `مرحباً، أحتاج استشارة لاختيار المقاس المناسب.%0a- طول الغرفة: ${roomLength || 'غير محدد'} متر%0a- عرض الغرفة: ${roomWidth || 'غير محدد'} متر%0a- عدد الأشخاص المفضل: ${peopleCount || 'غير محدد'}`;
//     window.open(`https://wa.me/201070661241?text=${text}`, '_blank');
//   };

//   // إرسال التقييم
//   const submitReviewHandler = async (e) => {
//     e.preventDefault();
//     setReviewError('');
//     if (!comment.trim()) {
//         setReviewError('يرجى كتابة نص التقييم');
//         return;
//     }
//     try {
//         const productId = selectedProduct._id || selectedProduct.id;
//         await addReview(productId, { rating, comment });
//         setComment('');
//         setRating(5);
//         alert('شكراً لتقييمك!');
//     } catch (error) {
//         setReviewError(error.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-gold-500">
//         <Loader className="animate-spin" size={40} />
//       </div>
//     );
//   }

//   if (!category) {
//     return (
//       <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
//         <h2 className="text-3xl mb-4">القسم غير موجود</h2>
//         <Link to="/" className="text-gold-500 hover:underline">العودة للرئيسية</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-neutral-950 pt-24 pb-12 relative">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Header */}
//         <div className="mb-8">
//           <Link to="/" className="inline-flex items-center text-gray-400 hover:text-gold-500 mb-6 transition-colors">
//             <ArrowRight size={20} className="ml-2" />
//             العودة للقائمة الرئيسية
//           </Link>
//           <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient mb-4">{category.title}</h1>
//           <p className="text-xl text-gray-400 max-w-2xl">{category.description}</p>
//         </div>

//         {/* بانر الاستشارة الهندسية المخصص */}
//         <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-lg">
//           <div className="flex-1 text-right">
//             <h3 className="text-2xl md:text-3xl font-bold text-gold-500 mb-3 flex items-center gap-2">
//               محتار في المقاس المناسب؟ 🤔
//             </h3>
//             <p className="text-gray-300 leading-relaxed mb-4 text-sm md:text-base">
//               لا تقلق! نحن هنا لمساعدتك. فقط أعطنا أبعاد غرفتك وعدد الأشخاص، وسيقوم فريقنا باقتراح أفضل تصميم ومقاس يناسب مساحتك عبر واتساب.
//             </p>
//             <ul className="text-gray-400 text-sm space-y-2">
//               <li className="flex items-center gap-2"><Ruler size={16} className="text-gold-600"/> استشارة مجانية من الخبراء</li>
//               <li className="flex items-center gap-2"><Ruler size={16} className="text-gold-600"/> اقتراحات تناسب ديكور منزلك</li>
//             </ul>
//           </div>

//           <div className="flex-1 bg-neutral-950 p-5 md:p-6 rounded-xl border border-neutral-800 w-full">
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-gold-500 text-xs font-bold mb-1">عرض الغرفة (متر)</label>
//                 <input 
//                   type="number" 
//                   value={roomWidth}
//                   onChange={(e) => setRoomWidth(e.target.value)}
//                   placeholder="مثال: 4" 
//                   className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none text-center"
//                 />
//               </div>
//               <div>
//                 <label className="block text-gold-500 text-xs font-bold mb-1">طول الغرفة (متر)</label>
//                 <input 
//                   type="number" 
//                   value={roomLength}
//                   onChange={(e) => setRoomLength(e.target.value)}
//                   placeholder="مثال: 5" 
//                   className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none text-center"
//                 />
//               </div>
//             </div>
//             <div className="mb-4">
//               <label className="block text-gold-500 text-xs font-bold mb-1">عدد الأشخاص (للسفرة أو الجلسة)</label>
//               <input 
//                 type="number" 
//                 value={peopleCount}
//                 onChange={(e) => setPeopleCount(e.target.value)}
//                 placeholder="مثال: 6" 
//                 className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none text-center"
//               />
//             </div>
//             <button 
//               onClick={handleConsultationClick}
//               className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
//             >
//               <MessageCircle size={20} /> احصل على الاقتراح عبر واتساب
//             </button>
//           </div>
//         </div>

//         {/* Product Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {categoryProducts.length > 0 ? (
//             categoryProducts.map((product) => (
//               <div 
//                 key={product._id || product.id} 
//                 className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-gold-600/50 transition-all duration-300 group flex flex-col"
//               >
//                 <div className="relative aspect-square overflow-hidden bg-neutral-800">
//                   <img 
//                     src={product.imageUrl} 
//                     alt={product.name} 
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   />
//                   <div 
//                     className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
//                     onClick={() => {
//                         setSelectedProduct(product);
//                         setReviewError('');
//                         setComment('');
//                     }}
//                   >
//                     <span className="text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-gold-500/30 hover:bg-gold-600 hover:border-gold-600 transition-colors">
//                       عرض التفاصيل
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-4 flex flex-col flex-grow">
//                   <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
//                   {/* عرض متوسط النجوم في الكارت الخارجي */}
//                   <div className="flex items-center gap-1 mb-2">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} size={14} className={i < (product.rating || 0) ? "fill-gold-500 text-gold-500" : "text-gray-600"} />
//                     ))}
//                     <span className="text-xs text-gray-500 mr-1">({product.numReviews || 0})</span>
//                   </div>
//                   <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-grow">{product.description}</p>
                  
//                   <div className="text-gold-400 font-bold text-sm mb-4">
//                     {product.price}
//                   </div>
                  
//                   <div className="flex gap-2 mt-auto">
//                     <button 
//                       onClick={() => handleOrderClick(product)}
//                       className="flex-grow bg-gold-600 hover:bg-gold-500 text-black p-2 rounded-lg transition-colors flex justify-center items-center gap-1 font-bold text-sm" 
//                     >
//                       <ShoppingBag size={18} />
//                       {isAuthenticated ? 'أضف للسلة' : 'سجل للطلب'}
//                     </button>
                    
//                     <a 
//                       href={`https://wa.me/201070661241?text=مرحباً، أود الاستفسار عن المنتج: ${product.name}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="bg-neutral-800 hover:bg-[#25D366] hover:text-white text-gray-300 p-2 rounded-lg transition-colors flex justify-center items-center border border-neutral-700 hover:border-[#25D366]"
//                       title="استفسر عبر واتساب"
//                     >
//                       <MessageCircle size={20} />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-10 text-gray-500">
//               لا توجد منتجات متاحة حالياً في هذا القسم.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Product Details Modal (النافذة المنبثقة للتفاصيل والتقييمات) */}
//       {selectedProduct && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//           <div 
//             className="absolute inset-0 bg-black/80 backdrop-blur-sm"
//             onClick={() => setSelectedProduct(null)}
//           ></div>
//           <div className="relative bg-neutral-900 border border-gold-600/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 custom-scrollbar">
//             <button 
//               onClick={() => setSelectedProduct(null)}
//               className="absolute top-4 left-4 text-gray-400 hover:text-white bg-black/50 p-2 rounded-full z-10 hover:bg-red-600 transition-colors"
//             >
//               <X size={24} />
//             </button>
            
//             {/* ✅ تم التعديل هنا: استخدام relative وحاوية sticky مع object-contain */}
//             <div className="grid md:grid-cols-2 relative">
//               <div className="h-72 md:h-[100vh] md:max-h-[80vh] bg-neutral-900/50 md:sticky top-0 flex items-center justify-center p-4 md:p-8 border-b md:border-b-0 md:border-l border-neutral-800">
//                 <img 
//                   src={selectedProduct.imageUrl} 
//                   alt={selectedProduct.name} 
//                   className="max-w-full max-h-full object-contain rounded-xl drop-shadow-2xl"
//                 />
//               </div>
              
//               <div className="p-6 md:p-8">
//                 <h3 className="text-2xl font-bold text-gold-500 mb-1">{selectedProduct.name}</h3>
//                 <div className="flex items-center gap-1 mb-4">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} size={16} className={i < (selectedProduct.rating || 0) ? "fill-gold-500 text-gold-500" : "text-gray-600"} />
//                     ))}
//                     <span className="text-sm text-gray-400 mr-2">{selectedProduct.numReviews || 0} تقييمات</span>
//                 </div>

//                 <p className="text-xl font-bold text-white mb-6 border-b border-neutral-800 pb-4">
//                   {selectedProduct.price}
//                 </p>
                
//                 <div className="space-y-4 mb-8">
//                   <div>
//                     <h4 className="text-gray-400 text-sm font-bold mb-1">الوصف المختصر:</h4>
//                     <p className="text-gray-300">{selectedProduct.description}</p>
//                   </div>
                  
//                   {selectedProduct.details && (
//                     <div className="bg-neutral-950/50 p-4 rounded-lg border border-neutral-800">
//                       <h4 className="text-gold-500 text-sm font-bold mb-2">تفاصيل المنتج:</h4>
//                       <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
//                         {selectedProduct.details}
//                       </p>
//                     </div>
//                   )}

//                   <div className="pt-4 space-y-2">
//                     <button 
//                       onClick={() => {
//                         handleOrderClick(selectedProduct);
//                         setSelectedProduct(null);
//                       }}
//                       className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
//                     >
//                       <ShoppingBag size={20} />
//                       {isAuthenticated ? 'أضف للسلة' : 'سجل دخول واطلب الآن'}
//                     </button>

//                     <a 
//                       href={`https://wa.me/201070661241?text=مرحباً، أود الاستفسار عن هذا المنتج وتفاصيله: ${selectedProduct.name}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full bg-neutral-800 hover:bg-[#25D366] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 border border-neutral-700 transition-colors"
//                     >
//                       <MessageCircle size={20} />
//                       استفسار سريع عبر واتساب
//                     </a>
//                   </div>
//                 </div>

//                 {/* قسم التقييمات */}
//                 <div className="border-t border-neutral-800 pt-8 mt-8">
//                     <h3 className="text-xl font-bold text-white mb-6">تقييمات العملاء</h3>
                    
//                     {/* عرض التقييمات السابقة */}
//                     {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
//                         <div className="space-y-4 mb-8">
//                             {selectedProduct.reviews.map((review) => (
//                                 <div key={review._id} className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 relative">
//                                     <div className="flex items-center justify-between mb-2">
//                                         <div className="flex items-center gap-2">
//                                             <span className="font-bold text-gold-400">{review.name}</span>
//                                             <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('ar-EG')}</span>
//                                         </div>
//                                         {/* زر الحذف للأدمن فقط */}
//                                         {userInfo?.isAdmin && (
//                                             <button 
//                                                 onClick={() => deleteReview(selectedProduct._id || selectedProduct.id, review._id)}
//                                                 className="text-red-500 hover:text-red-400 bg-red-500/10 p-1.5 rounded transition-colors"
//                                                 title="حذف هذا التقييم"
//                                             >
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         )}
//                                     </div>
//                                     <div className="flex mb-2">
//                                         {[...Array(5)].map((_, i) => (
//                                             <Star key={i} size={12} className={i < review.rating ? "fill-gold-500 text-gold-500" : "text-gray-600"} />
//                                         ))}
//                                     </div>
//                                     <p className="text-gray-300 text-sm">{review.comment}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-gray-500 mb-8 text-sm">لا توجد تقييمات لهذا المنتج حتى الآن. كن أول من يقيّم!</p>
//                     )}

//                     {/* نموذج إضافة تقييم */}
//                     {isAuthenticated ? (
//                         <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-700">
//                             <h4 className="font-bold text-white mb-4">أضف تقييمك</h4>
//                             {reviewError && <p className="text-red-400 text-xs mb-3">{reviewError}</p>}
//                             <form onSubmit={submitReviewHandler}>
//                                 <div className="mb-4">
//                                     <label className="block text-gray-400 text-sm mb-2">التقييم بالنجوم</label>
//                                     <select 
//                                         value={rating} 
//                                         onChange={(e) => setRating(Number(e.target.value))}
//                                         className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white outline-none focus:border-gold-500"
//                                     >
//                                         <option value="5">5 - ممتاز</option>
//                                         <option value="4">4 - جيد جداً</option>
//                                         <option value="3">3 - جيد</option>
//                                         <option value="2">2 - مقبول</option>
//                                         <option value="1">1 - سيء</option>
//                                     </select>
//                                 </div>
//                                 <div className="mb-4">
//                                     <label className="block text-gray-400 text-sm mb-2">تعليقك</label>
//                                     <textarea 
//                                         value={comment}
//                                         onChange={(e) => setComment(e.target.value)}
//                                         rows={3} 
//                                         placeholder="ما رأيك في هذا المنتج؟"
//                                         className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white outline-none focus:border-gold-500 text-sm"
//                                     ></textarea>
//                                 </div>
//                                 <button type="submit" className="bg-gold-600 hover:bg-gold-500 text-black font-bold py-2 px-6 rounded-lg transition-colors">
//                                     إرسال التقييم
//                                 </button>
//                             </form>
//                         </div>
//                     ) : (
//                         <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 text-center">
//                             <p className="text-gray-400 text-sm mb-3">يجب عليك تسجيل الدخول لتتمكن من كتابة تقييم.</p>
//                             <Link to="/login" className="inline-block bg-neutral-800 hover:bg-gold-600 hover:text-black text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors">
//                                 تسجيل الدخول
//                             </Link>
//                         </div>
//                     )}
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryPage;

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, X, Loader, MessageCircle, Ruler, Star, Trash2 } from 'lucide-react';
import { useShop } from '../context';

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { categories, products, loading, addToCart, isAuthenticated, userInfo, addReview, deleteReview } = useShop();
  
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [peopleCount, setPeopleCount] = useState('');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  const category = categories.find(c => c.id === id);
  const categoryProducts = products.filter(p => p.category === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (selectedProduct) {
      const updatedProduct = products.find(p => p._id === selectedProduct._id || p.id === selectedProduct.id);
      if (updatedProduct) setSelectedProduct(updatedProduct);
    }
  }, [products]);

  const handleOrderClick = (product) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      addToCart(product);
    }
  };

  const handleConsultationClick = () => {
    const text = `مرحباً، أحتاج استشارة لاختيار المقاس المناسب.%0a- طول الغرفة: ${roomLength || 'غير محدد'} متر%0a- عرض الغرفة: ${roomWidth || 'غير محدد'} متر%0a- عدد الأشخاص المفضل: ${peopleCount || 'غير محدد'}`;
    window.open(`https://wa.me/201070661241?text=${text}`, '_blank');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!comment.trim()) {
        setReviewError('يرجى كتابة نص التقييم');
        return;
    }
    try {
        const productId = selectedProduct._id || selectedProduct.id;
        await addReview(productId, { rating, comment });
        setComment('');
        setRating(5);
        alert('شكراً لتقييمك!');
    } catch (error) {
        setReviewError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-gold-500">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl mb-4">القسم غير موجود</h2>
        <Link to="/" className="text-gold-500 hover:underline">العودة للرئيسية</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-gold-500 mb-6 transition-colors">
            <ArrowRight size={20} className="ml-2" />
            العودة للقائمة الرئيسية
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient mb-4">{category.title}</h1>
          <p className="text-xl text-gray-400 max-w-2xl">{category.description}</p>
        </div>

        {/* Consultation Banner */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center gap-8 shadow-lg">
          <div className="flex-1 text-right">
            <h3 className="text-2xl md:text-3xl font-bold text-gold-500 mb-3 flex items-center gap-2">
              محتار في المقاس المناسب؟ 🤔
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4 text-sm md:text-base">
              لا تقلق! نحن هنا لمساعدتك. فقط أعطنا أبعاد غرفتك وعدد الأشخاص، وسيقوم فريقنا باقتراح أفضل تصميم ومقاس يناسب مساحتك عبر واتساب.
            </p>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-center gap-2"><Ruler size={16} className="text-gold-600"/> استشارة مجانية من الخبراء</li>
              <li className="flex items-center gap-2"><Ruler size={16} className="text-gold-600"/> اقتراحات تناسب ديكور منزلك</li>
            </ul>
          </div>

          <div className="flex-1 bg-neutral-950 p-5 md:p-6 rounded-xl border border-neutral-800 w-full">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gold-500 text-xs font-bold mb-1">عرض الغرفة (متر)</label>
                <input 
                  type="number" 
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(e.target.value)}
                  placeholder="مثال: 4" 
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none text-center"
                />
              </div>
              <div>
                <label className="block text-gold-500 text-xs font-bold mb-1">طول الغرفة (متر)</label>
                <input 
                  type="number" 
                  value={roomLength}
                  onChange={(e) => setRoomLength(e.target.value)}
                  placeholder="مثال: 5" 
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none text-center"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gold-500 text-xs font-bold mb-1">عدد الأشخاص (للسفرة أو الجلسة)</label>
              <input 
                type="number" 
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                placeholder="مثال: 6" 
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none text-center"
              />
            </div>
            <button 
              onClick={handleConsultationClick}
              className="w-full bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle size={20} /> احصل على الاقتراح عبر واتساب
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.length > 0 ? (
            categoryProducts.map((product) => (
              <div 
                key={product._id || product.id} 
                className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 hover:border-gold-600/50 transition-all duration-300 group flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-800">
                  <img 
                    src={product.imageUrl?.startsWith('/uploads') ? `https://modern-furniture-steel.onrender.com${product.imageUrl}` : product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div 
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={() => {
                        setSelectedProduct(product);
                        setReviewError('');
                        setComment('');
                    }}
                  >
                    <span className="text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-gold-500/30 hover:bg-gold-600 hover:border-gold-600 transition-colors">
                      عرض التفاصيل
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < (product.rating || 0) ? "fill-gold-500 text-gold-500" : "text-gray-600"} />
                    ))}
                    <span className="text-xs text-gray-500 mr-1">({product.numReviews || 0})</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-grow">{product.description}</p>
                  
                  <div className="text-gold-400 font-bold text-sm mb-4">
                    {product.price}
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => handleOrderClick(product)}
                      className="flex-grow bg-gold-600 hover:bg-gold-500 text-black p-2 rounded-lg transition-colors flex justify-center items-center gap-1 font-bold text-sm" 
                    >
                      <ShoppingBag size={18} />
                      {isAuthenticated ? 'أضف للسلة' : 'سجل للطلب'}
                    </button>
                    
                    <a 
                      href={`https://wa.me/201070661241?text=مرحباً، أود الاستفسار عن المنتج: ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-800 hover:bg-[#25D366] hover:text-white text-gray-300 p-2 rounded-lg transition-colors flex justify-center items-center border border-neutral-700 hover:border-[#25D366]"
                      title="استفسر عبر واتساب"
                    >
                      <MessageCircle size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              لا توجد منتجات متاحة حالياً في هذا القسم.
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          ></div>
          <div className="relative bg-neutral-900 border border-gold-600/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 custom-scrollbar">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 left-4 text-gray-400 hover:text-white bg-black/50 p-2 rounded-full z-10 hover:bg-red-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="grid md:grid-cols-2 relative">
              <div className="h-72 md:h-[100vh] md:max-h-[80vh] bg-neutral-900/50 md:sticky top-0 flex items-center justify-center p-4 md:p-8 border-b md:border-b-0 md:border-l border-neutral-800">
                <img 
                  src={selectedProduct.imageUrl?.startsWith('/uploads') ? `https://modern-furniture-steel.onrender.com${selectedProduct.imageUrl}` : selectedProduct.imageUrl} 
                  alt={selectedProduct.name} 
                  className="max-w-full max-h-full object-contain rounded-xl drop-shadow-2xl"
                />
              </div>
              
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-gold-500 mb-1">{selectedProduct.name}</h3>
                <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < (selectedProduct.rating || 0) ? "fill-gold-500 text-gold-500" : "text-gray-600"} />
                    ))}
                    <span className="text-sm text-gray-400 mr-2">{selectedProduct.numReviews || 0} تقييمات</span>
                </div>

                <p className="text-xl font-bold text-white mb-6 border-b border-neutral-800 pb-4">
                  {selectedProduct.price}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="text-gray-400 text-sm font-bold mb-1">الوصف المختصر:</h4>
                    <p className="text-gray-300">{selectedProduct.description}</p>
                  </div>
                  
                  {selectedProduct.details && (
                    <div className="bg-neutral-950/50 p-4 rounded-lg border border-neutral-800">
                      <h4 className="text-gold-500 text-sm font-bold mb-2">تفاصيل المنتج:</h4>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {selectedProduct.details}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
                    <button 
                      onClick={() => {
                        handleOrderClick(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShoppingBag size={20} />
                      {isAuthenticated ? 'أضف للسلة' : 'سجل دخول واطلب الآن'}
                    </button>

                    <a 
                      href={`https://wa.me/201070661241?text=مرحباً، أود الاستفسار عن هذا المنتج وتفاصيله: ${selectedProduct.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-neutral-800 hover:bg-[#25D366] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 border border-neutral-700 transition-colors"
                    >
                      <MessageCircle size={20} />
                      استفسار سريع عبر واتساب
                    </a>
                  </div>
                </div>

                {/* قسم التقييمات */}
                <div className="border-t border-neutral-800 pt-8 mt-8">
                    <h3 className="text-xl font-bold text-white mb-6">تقييمات العملاء</h3>
                    
                    {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                        <div className="space-y-4 mb-8">
                            {selectedProduct.reviews.map((review) => (
                                <div key={review._id} className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gold-400">{review.name}</span>
                                            <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('ar-EG')}</span>
                                        </div>
                                        {userInfo?.isAdmin && (
                                            <button 
                                                onClick={() => deleteReview(selectedProduct._id || selectedProduct.id, review._id)}
                                                className="text-red-500 hover:text-red-400 bg-red-500/10 p-1.5 rounded transition-colors"
                                                title="حذف هذا التقييم"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} className={i < review.rating ? "fill-gold-500 text-gold-500" : "text-gray-600"} />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 text-sm">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 mb-8 text-sm">لا توجد تقييمات لهذا المنتج حتى الآن. كن أول من يقيّم!</p>
                    )}

                    {isAuthenticated ? (
                        <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-700">
                            <h4 className="font-bold text-white mb-4">أضف تقييمك</h4>
                            {reviewError && <p className="text-red-400 text-xs mb-3">{reviewError}</p>}
                            <form onSubmit={submitReviewHandler}>
                                <div className="mb-4">
                                    <label className="block text-gray-400 text-sm mb-2">التقييم بالنجوم</label>
                                    <select 
                                        value={rating} 
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white outline-none focus:border-gold-500"
                                    >
                                        <option value="5">5 - ممتاز</option>
                                        <option value="4">4 - جيد جداً</option>
                                        <option value="3">3 - جيد</option>
                                        <option value="2">2 - مقبول</option>
                                        <option value="1">1 - سيء</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-400 text-sm mb-2">تعليقك</label>
                                    <textarea 
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={3} 
                                        placeholder="ما رأيك في هذا المنتج؟"
                                        className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white outline-none focus:border-gold-500 text-sm"
                                    ></textarea>
                                </div>
                                <button type="submit" className="bg-gold-600 hover:bg-gold-500 text-black font-bold py-2 px-6 rounded-lg transition-colors">
                                    إرسال التقييم
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 text-center">
                            <p className="text-gray-400 text-sm mb-3">يجب عليك تسجيل الدخول لتتمكن من كتابة تقييم.</p>
                            <Link to="/login" className="inline-block bg-neutral-800 hover:bg-gold-600 hover:text-black text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors">
                                تسجيل الدخول
                            </Link>
                        </div>
                    )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;