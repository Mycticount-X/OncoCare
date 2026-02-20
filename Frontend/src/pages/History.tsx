import { useState, useEffect } from 'react';
import { Clock, Activity, AlertCircle, Loader2, Database } from 'lucide-react';

interface HistoryItem {
    id: number;
    timestamp: string;
    prediction: string;
    confidence: number;
    gradcam_image: string; 
}

export default function History() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/history');
            if (!response.ok) throw new Error('Gagal mengambil data riwayat');
            
            const result = await response.json();
            setHistory(result.data); 
        } catch (err) {
            setError('Tidak dapat terhubung ke server backend.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Database className="text-blue-600" size={32} />
                    Riwayat Pemeriksaan
                </h1>
                <p className="text-gray-500 mt-2">Daftar analisis histopatologi yang telah diproses dan disimpan ke dalam database.</p>
            </div>

            {/* State 1: Sedang Loading */
            isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                </div>
            ) 
            
            /* State 2: Terjadi Error (Backend mati/gagal fetch) */
            : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 border border-red-200">
                    <AlertCircle size={20} /> {error}
                </div>
            ) 
            
            /* State 3: Database Kosong */
            : history.length === 0 ? (
                <div className="bg-white p-16 rounded-2xl border border-dashed border-gray-300 text-center text-gray-400">
                    <Clock size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-xl font-medium text-gray-500 mb-2">Belum ada riwayat pemeriksaan.</p>
                    <p className="text-sm">Silakan lakukan unggah citra pada menu Scan terlebih dahulu. Data akan otomatis tersimpan di sini.</p>
                </div>
            ) 
            
            /* State 4: Menampilkan Data dari SQLite */
            : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 group">
                            
                            <div className="h-56 bg-gray-50 border-b relative overflow-hidden flex items-center justify-center p-2">
                                <img 
                                    src={item.gradcam_image} 
                                    alt={`Scan ${item.id}`} 
                                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm backdrop-blur-md bg-white/90
                                    ${item.prediction === 'Malignant' ? 'text-red-600 border-red-200' : 'text-green-600 border-green-200'}`}>
                                    {item.prediction}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg w-fit">
                                    <Clock size={16} />
                                    <span>{item.timestamp}</span>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                                            <Activity size={16} className="text-blue-500" /> Confidence Level
                                        </span>
                                        <span className={`font-bold ${item.prediction === 'Malignant' ? 'text-red-700' : 'text-green-700'}`}>
                                            {Math.round(item.confidence * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-1000 ${item.prediction === 'Malignant' ? 'bg-red-500' : 'bg-green-500'}`} 
                                            style={{ width: `${item.confidence * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}