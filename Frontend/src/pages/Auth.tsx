import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { HeartPulse, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                navigate('/');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName
                        }
                    }
                });

                if (error) throw error;

                setMessage('Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.');
                setIsLogin(true);
                setPassword('');
            }
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat autentikasi.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        setMessage(null);
        setPassword('');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-lg border max-w-md w-full animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <HeartPulse size={40} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun OncoCare'}
                </h1>
                <p className="text-center text-gray-500 mb-8 text-sm">
                    {isLogin ? 'Masuk untuk melanjutkan analisis Anda.' : 'Daftar untuk mulai menggunakan AI kami.'}
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                        <AlertCircle size={18} className="flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm border border-green-200">
                        {message}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    required={!isLogin}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Dr. Budi Santoso"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="doktor@klinik.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Minimal 6 karakter"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 mt-6"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Masuk' : 'Daftar Sekarang')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
                    </button>
                </div>
            </div>
        </div>
    );
}
