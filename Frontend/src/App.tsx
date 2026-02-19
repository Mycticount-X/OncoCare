import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Placeholder untuk 5 halaman (Nanti bisa dipisah ke file masing-masing di folder src/pages/)
const Dashboard = () => <div className="p-8 text-2xl font-bold">Halaman Dashboard</div>;
const Scan = () => <div className="p-8 text-2xl font-bold">Halaman Scan AI</div>;
const History = () => <div className="p-8 text-2xl font-bold">Halaman Riwayat Pemeriksaan</div>;
const AboutUs = () => <div className="p-8 text-2xl font-bold">Halaman Tentang Kami</div>;
const Profile = () => <div className="p-8 text-2xl font-bold">Halaman Profil Pengguna</div>;

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar / Navbar di kiri */}
        <Navbar />

        {/* Area Konten Utama di kanan */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;