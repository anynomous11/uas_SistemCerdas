import React, { useEffect, useState } from 'react';
import { getHistory, deleteHistory } from '../utils/mockApi';
import { Calendar, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');
    const navigate = useNavigate();

    const fetchHistory = async () => {
        try {
            const data = await getHistory();
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            const success = await deleteHistory(id);
            if (success) {
                fetchHistory(); // Refresh list
            }
        }
    };

    // Correct handle edit using item.raw which we populated in mockApi
    const handleEdit = (item) => {
        navigate('/input', {
            state: {
                editMode: true,
                id: item.id,
                initialData: {
                    duration: item.raw?.durasi_belajar || item.duration,
                    interruptions: item.raw?.tingkat_gangguan || 'rendah',
                    target: item.raw?.target_belajar || 'tidak_tercapai',
                    tasks: item.raw?.tugas_selesai || 0,
                    mainTime: item.raw?.waktu_belajar || 'pagi'
                }
            }
        });
    };

    const filteredHistory = history.filter(item => {
        if (!filterDate) return true;

        // MongoDB stores full ISO string "2023-10-25T14:00:00.000Z"
        // Date input gives "2023-10-25"
        // We match strictly the date part
        const itemDate = new Date(item.date).toLocaleDateString('en-CA'); // YYYY-MM-DD local
        return itemDate === filterDate;
    });

    const getBadgeClass = (category) => {
        if (category === 'Optimal') return 'badge-success';
        if (category === 'Cukup') return 'badge-warning';
        return 'badge-danger';
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>Riwayat Evaluasi</h1>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <input
                            type="date"
                            className="form-control"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            style={{ maxWidth: '200px' }}
                        />
                    </div>
                    {filterDate && (
                        <button onClick={() => setFilterDate('')} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                            Reset
                        </button>
                    )}
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--border)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Tanggal</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Durasi</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Skor</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Kategori</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>
                                        <div className="loader" style={{ width: '24px', height: '24px', borderWidth: '3px' }}></div>
                                    </td>
                                </tr>
                            ) : filteredHistory.length > 0 ? (
                                filteredHistory.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Calendar size={16} color="var(--text-muted)" />
                                                {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{item.duration} Jam</td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{item.score}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span className={`badge ${getBadgeClass(item.category)}`}>
                                                {item.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.25rem 0.5rem', color: 'var(--primary)' }}
                                                    onClick={() => handleEdit(item)}
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.25rem 0.5rem', color: 'var(--danger)', borderColor: 'var(--danger-light)' }}
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
