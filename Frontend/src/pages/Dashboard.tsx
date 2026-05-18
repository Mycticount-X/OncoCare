import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
    Activity, FileImage, AlertTriangle, ArrowRight,
    Clock, Loader2, TrendingUp, TrendingDown, Minus,
    Scan, ChevronRight, BarChart2, Shield
} from 'lucide-react';

interface HistoryItem {
    id: number;
    timestamp: string;
    prediction: string;
    confidence: number;
    gradcam_image: string;
}

function StatCard({
    title,
    value,
    icon: Icon,
    accent,
    trend,
    trendLabel,
    isLoading,
}: {
    title: string;
    value: string;
    icon: React.ElementType;
    accent: { bg: string; text: string; ring: string; bar: string };
    trend?: 'up' | 'down' | 'neutral';
    trendLabel?: string;
    isLoading: boolean;
}) {
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor =
        trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-slate-400';

    return (
        <div className={`relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group`}>
            {/* Accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${accent.bar} rounded-t-2xl`} />

            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${accent.bg}`}>
                    <Icon size={22} className={accent.text} />
                </div>
                {trend && trendLabel && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                        <TrendIcon size={13} />
                        <span>{trendLabel}</span>
                    </div>
                )}
            </div>

            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                {isLoading ? (
                    <Loader2 className="animate-spin text-slate-300" size={28} />
                ) : (
                    value
                )}
            </h3>

            {/* Subtle hover glow */}
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${accent.ring}`} />
        </div>
    );
}

function PredictionBadge({ prediction }: { prediction: string }) {
    const config: Record<string, { label: string; dot: string; bg: string; text: string; border: string }> = {
        Malignant: {
            label: 'Malignant',
            dot: 'bg-rose-500',
            bg: 'bg-rose-50',
            text: 'text-rose-700',
            border: 'border-rose-200',
        },
        Benign: {
            label: 'Benign',
            dot: 'bg-amber-400',
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-200',
        },
        Normal: {
            label: 'Normal',
            dot: 'bg-emerald-500',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200',
        },
    };
    const c = config[prediction] ?? config['Normal'];
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
}

function ConfidenceBar({ value }: { value: number }) {
    const pct = Math.round(value * 100);
    const color =
        pct >= 85 ? 'bg-emerald-400' : pct >= 65 ? 'bg-amber-400' : 'bg-rose-400';
    return (
        <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs font-semibold text-slate-600">{pct}%</span>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const [fullName, setFullName] = useState<string>('');
    const [scanHistory, setScanHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!user) return;
        supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()
            .then(({ data }) => {
                if (data?.full_name) setFullName(data.full_name);
            });
    }, [user]);

    useEffect(() => {
        fetch('http://localhost:8000/api/history')
            .then((r) => r.json())
            .then((result) => setScanHistory(result.data))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const totalScans = scanHistory.length;
    const malignantCount = scanHistory.filter((s) => s.prediction === 'Malignant').length;
    const avgConfidence =
        totalScans > 0
            ? (scanHistory.reduce((a, c) => a + c.confidence, 0) / totalScans) * 100
            : 0;

    const recentScans = scanHistory.slice(0, 5);

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-slate-50/70 p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
                            Oncocare · Dashboard
                        </p>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Selamat datang,{' '}
                            <span className="text-blue-600">{fullName || 'Dokter'}</span>
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">{today}</p>
                    </div>
                    <Link
                        to="/scan"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-blue-200 transition-all duration-200 whitespace-nowrap"
                    >
                        <Scan size={18} />
                        Mulai Scan Baru
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/*  Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <StatCard
                        title="Total Analisis"
                        value={totalScans.toString()}
                        icon={FileImage}
                        accent={{
                            bg: 'bg-blue-50',
                            text: 'text-blue-600',
                            ring: 'ring-1 ring-blue-100',
                            bar: 'bg-blue-500',
                        }}
                        trendLabel="Semua waktu"
                        trend="neutral"
                        isLoading={isLoading}
                    />
                    <StatCard
                        title="Terdeteksi Malignant"
                        value={malignantCount.toString()}
                        icon={AlertTriangle}
                        accent={{
                            bg: 'bg-rose-50',
                            text: 'text-rose-600',
                            ring: 'ring-1 ring-rose-100',
                            bar: 'bg-rose-500',
                        }}
                        trendLabel={totalScans > 0 ? `${Math.round((malignantCount / totalScans) * 100)}% dari total` : '—'}
                        trend={malignantCount > 0 ? 'up' : 'neutral'}
                        isLoading={isLoading}
                    />
                    <StatCard
                        title="Rata-rata Confidence"
                        value={`${avgConfidence.toFixed(1)}%`}
                        icon={Activity}
                        accent={{
                            bg: 'bg-emerald-50',
                            text: 'text-emerald-600',
                            ring: 'ring-1 ring-emerald-100',
                            bar: 'bg-emerald-500',
                        }}
                        trendLabel="Akurasi model"
                        trend="up"
                        isLoading={isLoading}
                    />
                </div>

                {/*  Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Recent Scans */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-blue-500" />
                                <h2 className="text-base font-bold text-slate-800">Pemindaian Terakhir</h2>
                            </div>
                            <Link
                                to="/history"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Lihat Semua <ChevronRight size={14} />
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-16">
                                <Loader2 className="animate-spin text-blue-400" size={32} />
                            </div>
                        ) : recentScans.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-8">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                    <FileImage size={28} className="text-slate-400" />
                                </div>
                                <p className="font-semibold text-slate-600 mb-1">Belum ada pemindaian</p>
                                <p className="text-sm text-slate-400">Mulai analisis baru untuk melihat riwayat di sini.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {recentScans.map((scan, i) => (
                                    <div
                                        key={scan.id}
                                        className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors group"
                                        style={{ animationDelay: `${i * 60}ms` }}
                                    >
                                        {/* Left */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                #{scan.id}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800 mb-0.5">
                                                    Scan #{scan.id}
                                                </p>
                                                <p className="text-xs text-slate-400">{scan.timestamp}</p>
                                            </div>
                                        </div>

                                        {/* Right */}
                                        <div className="flex items-center gap-4">
                                            <ConfidenceBar value={scan.confidence} />
                                            <PredictionBadge prediction={scan.prediction} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Side panel */}
                    <div className="flex flex-col gap-5">

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <BarChart2 size={16} className="text-blue-500" /> Aksi Cepat
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { to: '/scan', label: 'Analisis Gambar Baru', icon: Scan, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100' },
                                    { to: '/history', label: 'Riwayat Pemindaian', icon: Clock, color: 'text-slate-600', bg: 'bg-slate-50 hover:bg-slate-100' },
                                ].map(({ to, label, icon: Icon, color, bg }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${bg} transition-colors group`}
                                    >
                                        <Icon size={16} className={color} />
                                        <span className="text-sm font-medium text-slate-700">{label}</span>
                                        <ChevronRight size={14} className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Distribution */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-1">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Shield size={16} className="text-emerald-500" /> Distribusi Hasil
                            </h3>
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin text-slate-300" size={24} />
                                </div>
                            ) : totalScans === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-6">Tidak ada data.</p>
                            ) : (
                                <div className="space-y-3">
                                    {[
                                        { label: 'Normal', color: 'bg-emerald-400', textColor: 'text-emerald-700', count: scanHistory.filter(s => s.prediction === 'Normal').length },
                                        { label: 'Benign', color: 'bg-amber-400', textColor: 'text-amber-700', count: scanHistory.filter(s => s.prediction === 'Benign').length },
                                        { label: 'Malignant', color: 'bg-rose-500', textColor: 'text-rose-700', count: malignantCount },
                                    ].map(({ label, color, textColor, count }) => {
                                        const pct = totalScans > 0 ? Math.round((count / totalScans) * 100) : 0;
                                        return (
                                            <div key={label}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-xs font-semibold ${textColor}`}>{label}</span>
                                                    <span className="text-xs text-slate-500">{count} ({pct}%)</span>
                                                </div>
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${color} transition-all duration-700`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}