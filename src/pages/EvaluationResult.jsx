import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, RefreshCw, BarChart2 } from 'lucide-react';

const EvaluationResult = () => {
    const location = useLocation();
    const { result, input } = location.state || {}; // Get data passed from navigation

    if (!result) {
        return <Navigate to="/input" replace />;
    }

    const { score, category, recommendation } = result;

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Optimal': return { color: '#166534', bg: '#dcfce7', border: '#bbf7d0' };
            case 'Cukup': return { color: '#854d0e', bg: '#fef9c3', border: '#fde047' };
            default: return { color: '#991b1b', bg: '#fee2e2', border: '#fecaca' };
        }
    };

    const theme = getCategoryColor(category);

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title">Hasil Evaluasi</h1>
                <p style={{ color: 'var(--text-muted)' }}>Berdasarkan data belajar harian kamu</p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', borderTop: `6px solid ${theme.color}`, marginBottom: '2rem' }}>

                <div style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: theme.bg }}>
                    <BarChart2 size={48} color={theme.color} />
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Skor Produktivitas</h2>
                <div style={{ fontSize: '4rem', fontWeight: 800, color: theme.color, lineHeight: 1 }}>
                    {score}
                    <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 400 }}>/100</span>
                </div>

                <div style={{ margin: '1.5rem 0' }}>
                    <span style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: theme.bg,
                        color: theme.color,
                        borderRadius: '2rem',
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        border: `1px solid ${theme.border}`
                    }}>
                        {category}
                    </span>
                </div>

                <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left', backgroundColor: 'var(--background)', padding: '1.5rem', borderRadius: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={18} color="#2563eb" /> Rekomendasi
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{recommendation}</p>
                </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Link to="/" className="btn btn-outline" style={{ width: '100%' }}>
                    Kembali ke Dashboard
                </Link>
                <Link to="/input" className="btn btn-primary" style={{ width: '100%' }}>
                    <RefreshCw size={18} /> Evaluasi Lagi
                </Link>
            </div>

        </div>
    );
};

export default EvaluationResult;
