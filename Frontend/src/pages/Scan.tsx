import { useState, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud, FileImage, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ScanResult {
    prediction: string;
    confidence: number;
    gradcam_image: string;
}

export default function Scan() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Mohon unggah file berupa gambar (JPEG/PNG).');
            return;
        }
        setError(null);
        setResult(null);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleScan = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8000/api/scan', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Terjadi kesalahan pada server.');
            }

            const data = await response.json();
            setResult(data.result);
        } catch (err) {
            setError('Gagal terhubung ke server backend. Pastikan FastAPI berjalan.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Scan Histopatologi</h1>
                <p className="text-gray-500 mt-2">Unggah citra biopsi jaringan payudara untuk dianalisis oleh model AI kami.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FileImage className="text-blue-500" /> Input Citra
                    </h2>

                    <div 
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                            ${previewUrl ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8">
                                <UploadCloud size={48} className="text-gray-400 mb-4" />
                                <p className="text-gray-600 font-medium">Tarik & Lepas gambar di sini</p>
                                <p className="text-gray-400 text-sm mt-1">atau</p>
                                <label className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                                    Pilih File
                                    <input type="file" className="hidden" accept="image/*" onChange={handleChange} />
                                </label>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button
                        onClick={handleScan}
                        disabled={!selectedFile || isLoading}
                        className={`w-full mt-6 py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all
                            ${!selectedFile ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 
                                isLoading ? 'bg-blue-400 text-white cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                    >
                        {isLoading ? <><Loader2 className="animate-spin" /> Menganalisis...</> : 'Mulai Analisis AI'}
                    </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" /> Hasil Analisis (Grad-CAM)
                    </h2>

                    {result ? (
                        <div className="flex-1 flex flex-col animate-in fade-in duration-500">
                            <div className={`p-4 rounded-xl mb-6 border ${result.prediction === 'Malignant' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                <p className="text-sm text-gray-600 font-medium mb-1">Prediksi Kelas:</p>
                                <h3 className={`text-2xl font-bold ${result.prediction === 'Malignant' ? 'text-red-700' : 'text-green-700'}`}>
                                    {result.prediction}
                                </h3>
                                <div className="mt-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Tingkat Keyakinan (Confidence)</span>
                                        <span className="font-semibold">{Math.round(result.confidence * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${result.prediction === 'Malignant' ? 'bg-red-500' : 'bg-green-500'}`} 
                                            style={{ width: `${result.confidence * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-sm text-gray-600 font-medium mb-3">Peta Aktivasi Grad-CAM:</p>
                                <div className="border rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center min-h-[250px]">
                                    <img src={result.gradcam_image} alt="Grad-CAM Result" className="max-h-64 object-contain" />
                                </div>
                                <p className="text-xs text-gray-400 mt-2 italic">*Area berwarna merah/panas menunjukkan bagian citra yang paling mempengaruhi keputusan model ResNet50.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center">
                            <AlertCircle size={48} className="mb-4 text-gray-300" />
                            <p>Belum ada hasil.<br/>Silakan unggah citra dan jalankan analisis.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
