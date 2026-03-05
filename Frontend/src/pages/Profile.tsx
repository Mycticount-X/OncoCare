import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { User, Briefcase, Building, Mail, Loader2, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [fullName, setFullName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [institution, setInstitution] = useState('');
    
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('full_name, specialization, institution')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (data) {
                    setFullName(data.full_name || '');
                    setSpecialization(data.specialization || '');
                    setInstitution(data.institution || '');
                }
            } catch (err: any) {
                console.error('Error fetching profile:', err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id, 
                    full_name: fullName,
                    specialization: specialization,
                    institution: institution,
                    updated_at: new Date()
                });

            if (error) throw error;

            setMessage('Profil berhasil diperbarui!');
            
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            setError(err.message || 'Gagal menyimpan profil.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800">Tentang {fullName || 'User'}</h1>
                <p className="text-gray-500 mt-2">Kelola informasi pribadi dan data profesional Anda di sini.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border animate-in fade-in slide-in-from-bottom-4 duration-500">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-200">
                        <CheckCircle2 size={20} />
                        <span>{message}</span>
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="email" 
                                disabled
                                value={user?.email || ''}
                                className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1 ml-1">Email digunakan untuk login dan tidak dapat diubah di sini.</p>
                    </div>

                    {/* Nama Lengkap */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Cth: Dr. Budi Santoso"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Spesialisasi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Spesialisasi</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Cth: Patologi Anatomi"
                                />
                            </div>
                        </div>

                        {/* Institusi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Institusi / Rumah Sakit</label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    value={institution}
                                    onChange={(e) => setInstitution(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Cth: RS Cipto Mangunkusumo"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t mt-8">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}