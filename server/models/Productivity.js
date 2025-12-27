const mongoose = require('mongoose');

const productivitySchema = new mongoose.Schema({
    durasi_belajar: {
        type: Number,
        required: true
    },
    tingkat_gangguan: {
        type: String,
        enum: ['rendah', 'sedang', 'tinggi'],
        required: true
    },
    target_belajar: {
        type: String,
        enum: ['tidak_tercapai', 'sebagian', 'tercapai'],
        required: true
    },
    tugas_selesai: {
        type: Number,
        required: true
    },
    waktu_belajar: {
        type: String,
        enum: ['pagi', 'siang', 'malam'],
        required: true
    },
    skor_produktivitas: {
        type: Number,
        required: true
    },
    kategori: {
        type: String,
        required: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Productivity', productivitySchema);
