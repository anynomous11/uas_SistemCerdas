import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { evaluateProductivity, updateHistory } from '../utils/mockApi';
import { Save, AlertCircle } from 'lucide-react';

const InputData = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    // Check if we are in edit mode
    const { editMode, id, initialData } = location.state || {};

    const [formData, setFormData] = useState({
        duration: '',
        interruptions: 'rendah',
        target: 'sebagian',
        tasks: '',
        mainTime: 'pagi'
    });

    useEffect(() => {
        if (editMode && initialData) {
            setFormData(initialData);
        }
    }, [editMode, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let result;
            if (editMode) {
                // Update existing record
                result = await updateHistory(id, formData);
            } else {
                // Create new record
                result = await evaluateProductivity(formData);
            }

            // Navigate to results
            navigate('/evaluasi', { state: { result, input: formData, isUpdate: editMode } });
        } catch (error) {
            console.error("Operation failed", error);
            alert("Gagal menyimpan data. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
            <h1 className="page-title">{editMode ? 'Edit Data Produktivitas' : 'Input Data Harian'}</h1>

            <div className="card">
                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label className="input-label" htmlFor="duration">Durasi Belajar (Jam)</label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            className="form-control"
                            placeholder="Contoh: 4"
                            min="0"
                            max="24"
                            step="0.5"
                            required
                            value={formData.duration}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="interruptions">Tingkat Gangguan</label>
                        <select
                            id="interruptions"
                            name="interruptions"
                            className="form-control"
                            value={formData.interruptions}
                            onChange={handleChange}
                        >
                            <option value="rendah">Rendah (Sedikit/Tidak ada)</option>
                            <option value="sedang">Sedang (Beberapa kali)</option>
                            <option value="tinggi">Tinggi (Sering terganggu)</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="target">Pencapaian Target Target</label>
                        <select
                            id="target"
                            name="target"
                            className="form-control"
                            value={formData.target}
                            onChange={handleChange}
                        >
                            <option value="tidak_tercapai">Tidak Tercapai</option>
                            <option value="sebagian">Sebagian Tercapai</option>
                            <option value="tercapai">Tercapai Sepenuhnya</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="tasks">Jumlah Tugas Diselesaikan</label>
                        <input
                            type="number"
                            id="tasks"
                            name="tasks"
                            className="form-control"
                            placeholder="Contoh: 2"
                            min="0"
                            required
                            value={formData.tasks}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="mainTime">Waktu Belajar Utama</label>
                        <select
                            id="mainTime"
                            name="mainTime"
                            className="form-control"
                            value={formData.mainTime}
                            onChange={handleChange}
                        >
                            <option value="pagi">Pagi (05:00 - 11:00)</option>
                            <option value="siang">Siang (11:00 - 15:00)</option>
                            <option value="malam">Malam (18:00 - 22:00)</option>
                        </select>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="loader" style={{ width: '20px', height: '20px', borderWidth: '3px', marginRight: '8px' }}></div>
                                    Mengevaluasi...
                                </>
                            ) : (
                                <>
                                    <Save size={20} /> {editMode ? 'Update Evaluasi' : 'Simpan & Evaluasi'}
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #dbeafe' }}>
                <AlertCircle size={24} color="#2563eb" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem', color: '#1e40af' }}>
                    <strong>Tips:</strong> {editMode ? 'Mengubah data akan menghitung ulang skor produktivitas Anda.' : 'Isi data sejujur mungkin untuk mendapatkan hasil evaluasi yang akurat dan rekomendasi yang bermanfaat.'}
                </p>
            </div>
        </div>
    );
};

export default InputData;
