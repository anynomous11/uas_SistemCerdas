import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '../utils/mockApi';
import WeeklyChart from '../components/WeeklyChart';
import { Award, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getDashboardSummary();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="loader"></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Memuat data dashboard...</p>
            </div>
        );
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-success';
        if (score >= 50) return 'text-warning';
        return 'text-danger'; // Need to define text-colors in CSS or use inline
    };

    // Inline styles for colors since I normalized classes in index.css but maybe not text colors
    // actually index.css has badge-success etc colors, I can reuse or define text classes.
    // I will just use inline color logic to be safe or add classes later.

    const scoreColor = data.todayScore >= 80 ? '#166534' : data.todayScore >= 50 ? '#854d0e' : '#991b1b';
    const categoryBg = data.todayScore >= 80 ? '#dcfce7' : data.todayScore >= 50 ? '#fef9c3' : '#fee2e2';

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Dashboard Produktivitas</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Halo, selamat datang kembali di sistem evaluasi belajarmu.</p>
                </div>
                <Link to="/input" className="btn btn-primary">
                    <TrendingUp size={18} /> Evaluasi Hari Ini
                </Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Score Card */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <Award size={48} color={scoreColor} />
                    </div>
                    <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Skor Hari Ini</h2>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: scoreColor, margin: '0.5rem 0' }}>
                        {data.todayScore}
                    </div>
                    <span className="badge" style={{ backgroundColor: categoryBg, color: scoreColor }}>
                        {data.todayCategory}
                    </span>
                </div>

                {/* Quick Stats or Message */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Status Belajar</h3>
                    <p style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>
                        Performa belajarmu minggu ini menunjukkan tren <strong style={{ color: scoreColor }}>{data.todayScore >= 70 ? 'positif' : 'perlu peningkatan'}</strong>.
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Tren Produktivitas Mingguan</h3>
                    <Calendar size={20} color="var(--text-muted)" />
                </div>
                <WeeklyChart data={data.weeklyData} />
            </div>
        </div>
    );
};

export default Dashboard;
