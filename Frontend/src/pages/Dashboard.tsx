import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Activity, FileImage, AlertTriangle, ArrowRight, Clock } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [fullName, setFullName] = useState<string>('');

    useEffect(() => {
        const fetchProfileName = async () => {
            if (!user) return;
            
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (data && data.full_name) {
                    setFullName(data.full_name);
                }
            } catch (err: any) {
                console.error('Error fetching profile name:', err.message);
            }
        };

        fetchProfileName();
    }, [user]);

    const stats = [
        { title: 'Total Analisis', value: '124', icon: FileImage, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Terdeteksi Malignant', value: '18', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
        { title: 'Rata-rata Confidence', value: '94.2%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    ];

    const recentScans = [
        { id: 104, date: '13 Mei 2026, 10:30', prediction: 'Malignant', confidence: 96 },
        { id: 103, date: '12 Mei 2026, 14:15', prediction: 'Benign', confidence: 89 },
        { id: 102, date: '10 Mei 2026, 09:00', prediction: 'Normal', confidence: 98 },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
            {/* Header / Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-lg mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        Selamat datang, {fullName || 'Dokter'}!
                    </h1>
                    <p className="text-blue-100">
                        Apa yang ingin Anda analisis hari ini?
                    </p>
                </div>
                <Link 
                    to="/scan" 
                    className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                >
                    Mulai Scan Baru <ArrowRight size={20} />
                </Link>
            </div>

            {/* Statistic */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Aktivitas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Last Activity */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="text-blue-500" size={24} /> Pemindaian Terakhir
                    </h2>
                    <Link to="/history" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                        Lihat Semua
                    </Link>
                </div>
                <div className="divide-y">
                    {recentScans.map((scan) => (
                        <div key={scan.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${
                                    scan.prediction === 'Malignant' ? 'bg-red-500' : 
                                    scan.prediction === 'Benign' ? 'bg-orange-400' : 'bg-green-500'
                                }`}></div>
                                <div>
                                    <p className="font-semibold text-gray-800">Scan #{scan.id}</p>
                                    <p className="text-sm text-gray-500">{scan.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    scan.prediction === 'Malignant' ? 'text-red-700 bg-red-50 border-red-200' : 
                                    scan.prediction === 'Benign' ? 'text-orange-700 bg-orange-50 border-orange-200' : 
                                    'text-green-700 bg-green-50 border-green-200'
                                }`}>
                                    {scan.prediction}
                                </span>
                                <p className="text-sm font-medium text-gray-600 mt-1">
                                    Conf: {scan.confidence}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}