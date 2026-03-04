import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Scan from './pages/Scan';
import AboutUs from './pages/AboutUs';
import History from './pages/History';
import Auth from './pages/Auth';
import { Loader2 } from 'lucide-react';

const Dashboard = () => <div className="p-8 text-2xl font-bold">Halaman Dashboard</div>;
const Profile = () => <div className="p-8 text-2xl font-bold">Halaman Profil Pengguna</div>;

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  
  return <Outlet />
};

const PublicRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  if (user) return <Navigate to="/" replace />;
  
  return <Outlet />;
};

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

function AppContent() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/auth" element={<Auth />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}