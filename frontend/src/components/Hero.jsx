import React from 'react';
import { BRAND_INFO } from '../constants';

const Hero = () => {

  // ✅ تم التعديل
  const scrollToProducts = (e) => {
    e.preventDefault();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('/img/background1.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          <span className="text-gold-gradient">{BRAND_INFO.name}</span>
        </h1>
        
        {/* <p className="text-xl md:text-2xl text-gray-200 font-light mb-4">
          {BRAND_INFO.slogan_ar}
        </p> */}
        
        <p className="text-lg md:text-xl text-gold-400 font-serif italic mb-10 tracking-widest border-t border-b border-gold-900/50 py-2">
          "{BRAND_INFO.slogan_en}"
        </p>

        {/* ✅ تم التعديل: تحويل لزر بدلاً من رابط a */}
        <button 
          onClick={scrollToProducts}
          className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold rounded-full hover:from-gold-500 hover:to-gold-400 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
        >
          تصفح منتجاتنا
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-neutral-950 to-transparent"></div>
    </div>
  );
};

export default Hero;