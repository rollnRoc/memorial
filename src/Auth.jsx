import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { User, Mail, Lock, AlertCircle, LogOut } from 'lucide-react';

export const AuthPage = ({ language }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError(language === 'tr' ? 'Şifreler eşleşmiyor!' : 'Passwords do not match!');
                    setLoading(false);
                    return;
                }
                if (formData.password.length < 6) {
                    setError(language === 'tr' ? 'Şifre en az 6 karakter olmalı!' : 'Password must be at least 6 characters!');
                    setLoading(false);
                    return;
                }
                
                // Kullanıcıyı kaydet
                await signup(formData.email, formData.password, formData.displayName);
                
                // Email sistemi geçici olarak devre dışı - daha sonra eklenecek
                console.log('📧 Kullanıcı Firebase\'e kaydedildi, email sistemi daha sonra eklenecek');
            }
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                setError(language === 'tr' ? 'Bu email zaten kullanılıyor!' : 'Email already in use!');
            } else if (error.code === 'auth/invalid-email') {
                setError(language === 'tr' ? 'Geçersiz email adresi!' : 'Invalid email address!');
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                setError(language === 'tr' ? 'Email veya şifre hatalı!' : 'Invalid email or password!');
            } else {
                setError(language === 'tr' ? 'Bir hata oluştu!' : 'An error occurred!');
            }
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 flex items-center justify-center py-20 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="flex items-center justify-center mb-8">
                        <User size={60} className="text-slate-600" />
                    </div>

                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
                        {isLogin
                            ? (language === 'tr' ? 'Giriş Yap' : 'Login')
                            : (language === 'tr' ? 'Kayıt Ol' : 'Sign Up')}
                    </h2>

                    <p className="text-center text-gray-600 mb-8">
                        {isLogin
                            ? (language === 'tr' ? 'Hesabınıza giriş yapın' : 'Sign in to your account')
                            : (language === 'tr' ? 'Yeni hesap oluşturun' : 'Create a new account')}
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center gap-3">
                            <AlertCircle size={20} className="text-red-600" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    {language === 'tr' ? 'İsim Soyisim' : 'Full Name'}
                                </label>
                                <div className="relative">
                                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none"
                                        placeholder={language === 'tr' ? 'Adınız Soyadınız' : 'Your Full Name'}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none"
                                    placeholder="ornek@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                {language === 'tr' ? 'Şifre' : 'Password'}
                            </label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    {language === 'tr' ? 'Şifre Tekrar' : 'Confirm Password'}
                                </label>
                                <div className="relative">
                                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-slate-500 focus:outline-none"
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? (language === 'tr' ? 'Yükleniyor...' : 'Loading...')
                                : isLogin
                                    ? (language === 'tr' ? 'Giriş Yap' : 'Login')
                                    : (language === 'tr' ? 'Kayıt Ol' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-slate-600 hover:text-slate-800 font-semibold"
                        >
                            {isLogin
                                ? (language === 'tr' ? 'Hesabınız yok mu? Kayıt olun' : "Don't have an account? Sign up")
                                : (language === 'tr' ? 'Zaten hesabınız var mı? Giriş yapın' : 'Already have an account? Login')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PendingApproval = ({ language }) => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        if (window.confirm(language === 'tr' 
            ? 'Çıkış yapmak istediğinize emin misiniz?' 
            : 'Are you sure you want to logout?'
        )) {
            try {
                await logout();
                window.location.reload(); // Sayfayı yenile
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="flex items-center justify-center mb-6">
                    <AlertCircle size={80} className="text-yellow-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                    {language === 'tr' ? 'Onay Bekleniyor' : 'Pending Approval'}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                    {language === 'tr'
                        ? 'Üyeliğiniz admin tarafından onaylanmayı bekliyor. Onaylandığında email ile bilgilendirileceksiniz.'
                        : 'Your membership is pending admin approval. You will be notified by email once approved.'}
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <p className="text-blue-800 text-sm font-medium">
                        {language === 'tr' 
                            ? '💡 Başvurunuz admin\'e iletildi. Onaylandığında siteye giriş yaparak erişebilirsiniz.'
                            : '💡 Your application has been sent to admin. Once approved, you can login to access the site.'
                        }
                    </p>
                </div>
                
                {/* Çıkış Yap ve Durumu Kontrol Et Butonları */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg"
                    >
                        <LogOut size={18} />
                        {language === 'tr' ? 'Çıkış Yap' : 'Logout'}
                    </button>
                    
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
                    >
                        {language === 'tr' ? 'Durumu Kontrol Et' : 'Check Status'}
                    </button>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        {language === 'tr' 
                            ? 'Onaylandığınızda "Durumu Kontrol Et" ile siteye erişebilirsiniz. Ana sayfayı görmek için çıkış yapın.'
                            : 'Once approved, use "Check Status" to access the site. Logout to view the homepage.'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};