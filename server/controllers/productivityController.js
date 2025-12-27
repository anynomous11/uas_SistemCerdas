const Productivity = require('../models/Productivity');
const { calculateFuzzyScore, getCategory, getRecommendation } = require('../utils/fuzzyLogic');

exports.evaluateProductivity = async (req, res) => {
    try {
        const {
            durasi_belajar,
            tingkat_gangguan,
            target_belajar,
            tugas_selesai,
            waktu_belajar
        } = req.body;

        // Mapping inputs (supporting both formats just in case)
        const inputData = {
            duration: durasi_belajar || req.body.duration,
            interruptions: tingkat_gangguan || req.body.interruptions,
            target: target_belajar || req.body.target,
            tasks: tugas_selesai || req.body.tasks,
            mainTime: waktu_belajar || req.body.mainTime
        };

        // Validation
        if (inputData.duration === undefined || !inputData.interruptions) {
            return res.status(400).json({ error: "Data input tidak lengkap" });
        }

        // Fuzzy Logic Process
        const score = calculateFuzzyScore(inputData);
        const category = getCategory(score);
        const recommendation = getRecommendation(score, inputData);

        // Save to MongoDB
        const record = await Productivity.create({
            durasi_belajar: parseFloat(inputData.duration),
            tingkat_gangguan: inputData.interruptions,
            target_belajar: inputData.target,
            tugas_selesai: parseInt(inputData.tasks),
            waktu_belajar: inputData.mainTime,
            skor_produktivitas: score,
            kategori: category
        });

        res.json({
            skor_produktivitas: score,
            kategori_produktivitas: category,
            rekomendasi_belajar: recommendation,
            detail_simpan: record
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Terjadi kesalahan pada server", details: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await Productivity.find().sort({ created_at: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil riwayat" });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        // Get today's latest record
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayRecord = await Productivity.findOne({
            created_at: { $gte: startOfDay }
        }).sort({ created_at: -1 });

        // Get last 7 records for chart
        // Since we want chronological order for the chart (Mon -> Sun), we fetch, then sort.
        const weeklyRecords = await Productivity.find().sort({ created_at: -1 }).limit(7);
        const sortedWeekly = weeklyRecords.reverse();

        const weeklyData = sortedWeekly.map(rec => ({
            name: new Date(rec.created_at).toLocaleDateString('id-ID', { weekday: 'short' }),
            score: rec.skor_produktivitas
        }));

        res.json({
            todayScore: todayRecord ? todayRecord.skor_produktivitas : 0,
            todayCategory: todayRecord ? todayRecord.kategori : '-',
            weeklyData: weeklyData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengambil data dashboard" });
    }
};

exports.deleteProductivity = async (req, res) => {
    try {
        const { id } = req.params;
        await Productivity.findByIdAndDelete(id);
        res.json({ message: "Data berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: "Gagal menghapus data" });
    }
};

exports.updateProductivity = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            durasi_belajar,
            tingkat_gangguan,
            target_belajar,
            tugas_selesai,
            waktu_belajar
        } = req.body;

        const inputData = {
            duration: durasi_belajar || req.body.duration,
            interruptions: tingkat_gangguan || req.body.interruptions,
            target: target_belajar || req.body.target,
            tasks: tugas_selesai || req.body.tasks,
            mainTime: waktu_belajar || req.body.mainTime
        };

        // Re-calculate Fuzzy Logic
        const score = calculateFuzzyScore(inputData);
        const category = getCategory(score);

        const updatedRecord = await Productivity.findByIdAndUpdate(id, {
            durasi_belajar: parseFloat(inputData.duration),
            tingkat_gangguan: inputData.interruptions,
            target_belajar: inputData.target,
            tugas_selesai: parseInt(inputData.tasks),
            waktu_belajar: inputData.mainTime,
            skor_produktivitas: score,
            kategori: category
        }, { new: true });

        const recommendation = getRecommendation(score, inputData);

        res.json({
            skor_produktivitas: score,
            kategori_produktivitas: category,
            rekomendasi_belajar: recommendation,
            detail_simpan: updatedRecord
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal mengupdate data" });
    }
};
