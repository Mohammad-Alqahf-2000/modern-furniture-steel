import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { useShop } from '../context';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useShop();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (name && email && password) {
      try {
        await register(name, email, password);
        navigate('/'); // الذهاب للرئيسية بعد التسجيل
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء التسجيل');
      }
    } else {
      setError('يرجى تعبئة جميع البيانات');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 relative pt-20">
        <div className="absolute inset-0 bg-[url('/img/background.jpeg')] bg-cover bg-center opacity-20"></div>

        <div className="w-full max-w-md bg-neutral-900/90 backdrop-blur-md border border-gold-500/30 p-8 rounded-2xl shadow-[0_0_40px_rgba(234,179,8,0.15)] relative z-10">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">إنشاء حساب جديد</h2>
                <p className="text-gray-400 text-sm">سجل انضمامك لعائلة Modern Furniture</p>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
                <div>
                    <label className="block text-gold-500 text-sm font-medium mb-2">الاسم الكامل</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full pr-10 pl-3 py-3 bg-neutral-950 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-600 transition-all outline-none"
                            placeholder="الاسم"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gold-500 text-sm font-medium mb-2">البريد الإلكتروني</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Mail size={18} className="text-gray-500" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pr-10 pl-3 py-3 bg-neutral-950 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-600 transition-all outline-none"
                            placeholder="example@mail.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gold-500 text-sm font-medium mb-2">كلمة السر</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-500" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pr-10 pl-3 py-3 bg-neutral-950 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent text-white placeholder-gray-600 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-lg shadow-lg hover:shadow-gold-500/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                    تسجيل حساب
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                    لديك حساب بالفعل؟{' '}
                    <Link to="/login" className="text-gold-500 hover:text-gold-400 font-bold transition-colors">
                        سجل دخول هنا
                    </Link>
                </p>
            </div>
        </div>
    </div>
  );
};

export default RegisterPage;