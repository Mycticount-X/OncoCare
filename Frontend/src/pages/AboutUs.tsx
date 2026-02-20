import { HeartPulse, Microscope, BrainCircuit, ShieldCheck } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Tentang OncoCare</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Menjembatani keahlian medis dan kecerdasan buatan untuk masa depan diagnosis histopatologi yang lebih cepat, transparan, dan akurat.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border mb-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl text-blue-600 mb-6">
            <HeartPulse size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Filosofi Kami</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Nama <span className="font-semibold text-blue-600">OncoCare</span> berakar dari kata 
            <span className="font-semibold italic"> Oncology</span>—cabang ilmu kedokteran yang berfokus pada studi, diagnosis, pencegahan, dan pengobatan kanker. 
          </p>
          <p className="text-gray-600 leading-relaxed">
            Dipadukan dengan kata <span className="font-semibold italic">Care</span>, aplikasi ini hadir sebagai bentuk kepedulian untuk mendampingi para patologis. Kami menyadari bahwa di balik setiap sampel jaringan biopsi, terdapat nyawa pasien yang menanti kepastian diagnosis.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pilar Teknologi Kami</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
            <Microscope className="text-blue-500 mb-4" size={28} />
            <h4 className="text-xl font-semibold mb-2">Analisis Histopatologi</h4>
            <p className="text-gray-600 text-sm">
              Berfokus pada analisis citra mikroskopis jaringan payudara untuk membedakan antara sel malignan (ganas) dan benign (jinak) secara presisi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
            <BrainCircuit className="text-purple-500 mb-4" size={28} />
            <h4 className="text-xl font-semibold mb-2">Deep Learning (ResNet50)</h4>
            <p className="text-gray-600 text-sm">
              Ditenagai oleh arsitektur Convolutional Neural Network (CNN) tingkat lanjut yang mampu mengekstraksi pola visual kompleks dari citra medis.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
            <ShieldCheck className="text-green-500 mb-4" size={28} />
            <h4 className="text-xl font-semibold mb-2">Explainable AI (XAI)</h4>
            <p className="text-gray-600 text-sm">
              Menggunakan metode Grad-CAM untuk membuka "Black Box" AI, memvisualisasikan area sel yang menjadi dasar keputusan model demi transparansi klinis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}