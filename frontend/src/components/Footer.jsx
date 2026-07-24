import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BRAND_INFO } from '../constants';
import { Facebook, Instagram, Phone, MapPin, Truck, CheckCircle } from 'lucide-react';
import { Grid, Info, Home } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (targetId) => {
    if (!targetId) {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' }), 300);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-neutral-900 border-t border-neutral-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 border-b border-neutral-800 pb-12">
           <div className="flex flex-col items-center text-center p-4">
              <div className="bg-gold-500/10 p-4 rounded-full mb-4">
                <Truck className="text-gold-500 w-8 h-8" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">شحن لجميع البلدان</h3>
              <p className="text-gray-400 text-sm">تجهيز وتغليف آمن</p>
           </div>
           <div className="flex flex-col items-center text-center p-4">
              <div className="bg-gold-500/10 p-4 rounded-full mb-4">
                <CheckCircle className="text-gold-500 w-8 h-8" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">جودة لا تضاهى</h3>
              <p className="text-gray-400 text-sm">ستانلس ستيل مقاوم للصدأ والخدوش بتشطيب لامع وفاخر</p>
           </div>
           <div className="flex flex-col items-center text-center p-4">
              <div className="bg-gold-500/10 p-4 rounded-full mb-4">
                <MapPin className="text-gold-500 w-8 h-8" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">زوروا مصنعنا</h3>
              <p className="text-gray-400 text-sm">نستقبل العملاء للاطلاع على المنتجات </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-gold-500 mb-4">MODERN FURNITURE</h2>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              {BRAND_INFO.description}
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-neutral-800 p-3 rounded-full hover:bg-gold-600 hover:text-black transition-colors text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-neutral-800 p-3 rounded-full hover:bg-gold-600 hover:text-black transition-colors text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-neutral-800 p-3 rounded-full hover:bg-gold-600 hover:text-black transition-colors text-white font-bold text-xs flex items-center justify-center w-[44px]">
                 TikTok
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-r-4 border-gold-500 pr-3">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => handleNavClick('')} className="flex items-center justify-start gap-3 text-gray-400 hover:text-gold-400 transition-colors cursor-pointer bg-transparent border-none p-0 outline-none">
                  <Home size={18} className="text-gold-500" />
                  <span dir="ltr">Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('products')} className="flex items-center justify-start gap-3 text-gray-400 hover:text-gold-400 transition-colors cursor-pointer bg-transparent border-none p-0 outline-none">
                  <Grid size={18} className="text-gold-500" />
                  <span dir="ltr">Products</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className="flex items-center justify-start gap-3 text-gray-400 hover:text-gold-400 transition-colors cursor-pointer bg-transparent border-none p-0 outline-none">
                  <Info size={18} className="text-gold-500" />
                  <span dir="ltr">About us</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('contact')} className="flex items-center justify-start gap-3 text-gray-400 hover:text-gold-400 transition-colors cursor-pointer bg-transparent border-none p-0 outline-none">
                  <Phone size={18} className="text-gold-500" />
                  <span dir="ltr">Contact</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-r-4 border-gold-500 pr-3">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="text-gold-500 flex-shrink-0 mt-1" size={18} />
                <span>{BRAND_INFO.location}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="text-gold-500 flex-shrink-0" size={18} />
                <span dir="ltr">{BRAND_INFO.phone}</span>
              </li>
              <li>
                <a 
                   href={`https://wa.me/${BRAND_INFO.phone.replace(/[^0-9]/g, '')}`} 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center justify-center w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mt-2"
                >
                  تواصل عبر واتساب
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} {BRAND_INFO.name}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;