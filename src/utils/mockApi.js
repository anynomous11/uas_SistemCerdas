export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const API_URL = 'http://localhost:5000/api';

export const getHistory = async () => {
    try {
        const response = await fetch(`${API_URL}/riwayat-produktivitas`);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        // Map backend format to frontend expectation if needed
        return data.map(item => ({
            id: item._id, // Ensure ID is passed
            date: item.created_at,
            score: item.skor_produktivitas,
            category: item.kategori,
            duration: item.durasi_belajar,
            // Include raw data for edit
            raw: {
                durasi_belajar: item.durasi_belajar,
                tingkat_gangguan: item.tingkat_gangguan,
                target_belajar: item.target_belajar,
                tugas_selesai: item.tugas_selesai,
                waktu_belajar: item.waktu_belajar
            }
        }));
    } catch (e) {
        console.warn("Backend unavailable, using mock data", e);
        // Fallback or re-throw
        return [
            { id: '1', date: '2023-10-25', score: 85, category: 'Optimal', duration: 4 },
        ];
    }
};

export const evaluateProductivity = async (data) => {
    try {
        const payload = {
            durasi_belajar: data.duration,
            tingkat_gangguan: data.interruptions,
            target_belajar: data.target,
            tugas_selesai: data.tasks,
            waktu_belajar: data.mainTime
        };

        const response = await fetch(`${API_URL}/evaluasi-produktivitas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Evaluasi gagal');
        const result = await response.json();

        return {
            score: result.skor_produktivitas,
            category: result.kategori_produktivitas,
            recommendation: result.rekomendasi_belajar,
            date: new Date().toISOString().split('T')[0]
        };
    } catch (e) {
        console.warn("Backend error, falling back to local logic for demo", e);
        // Fallback/Mock logic
        return {
            score: 75,
            category: 'Cukup',
            recommendation: 'Mode offline: Backend tidak terhubung. Cek koneksi server.',
            date: new Date().toISOString()
        };
    }
};

export const getDashboardSummary = async () => {
    try {
        const response = await fetch(`${API_URL}/dashboard-stats`);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        return data; // Expected format: { todayScore, todayCategory, weeklyData: [{name, score}] }
    } catch (e) {
        console.warn("Backend unavailable, using mock data", e);
        // Fallback mock
        return {
            todayScore: 0,
            todayCategory: '-',
            weeklyData: []
        };
    }
};

export const deleteHistory = async (id) => {
    try {
        const response = await fetch(`${API_URL}/riwayat-produktivitas/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Delete failed');
        return true;
    } catch (e) {
        console.error("Delete failed", e);
        return false;
    }
};

export const updateHistory = async (id, data) => {
    try {
        const payload = {
            durasi_belajar: data.duration,
            tingkat_gangguan: data.interruptions,
            target_belajar: data.target,
            tugas_selesai: data.tasks,
            waktu_belajar: data.mainTime
        };

        const response = await fetch(`${API_URL}/riwayat-produktivitas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Update failed');
        const result = await response.json();

        return {
            score: result.skor_produktivitas,
            category: result.kategori_produktivitas,
            recommendation: result.rekomendasi_belajar,
            date: new Date().toISOString().split('T')[0]
        };
    } catch (e) {
        console.error("Update failed", e);
        throw e;
    }
};
