/**
 * Fuzzy Logic System for Productivity Evaluation
 */

// 1. Fuzzification
// Membership Functions

// Durasi (Hours): Pendek (0-2), Sedang (2-6), Lama (6-12)
const fuzzyDurasi = (x) => {
    let pendek = 0, sedang = 0, lama = 0;

    // Pendek: 1 at 0, 0 at 3
    if (x <= 3) pendek = (3 - x) / 3;
    if (x <= 0) pendek = 1;

    // Sedang: 0 at 1, 1 at 4, 0 at 7
    if (x > 1 && x <= 4) sedang = (x - 1) / 3;
    if (x > 4 && x < 7) sedang = (7 - x) / 3;

    // Lama: 0 at 5, 1 at 8+
    if (x >= 5) lama = (x - 5) / 3;
    if (x >= 8) lama = 1;

    return {
        pendek: Math.max(0, pendek),
        sedang: Math.max(0, sedang),
        lama: Math.max(0, Math.min(1, lama))
    };
};

// Gangguan: Rendah, Sedang, Tinggi (Discrete / Categorical input mapped to numeric for fuzzy logic if needed, but here simple mapping)
// Since input is categorical (rendah, sedang, tinggi), we assign membership 1.0 directly or use simple weights.
const fuzzyGangguan = (val) => {
    return {
        rendah: val === 'rendah' ? 1 : 0,
        sedang: val === 'sedang' ? 1 : 0,
        tinggi: val === 'tinggi' ? 1 : 0
    };
};

// Target: Tidak Tercapai, Sebagian, Tercapai (Categorical)
const fuzzyTarget = (val) => {
    return {
        tidak_tercapai: val === 'tidak_tercapai' ? 1 : 0,
        sebagian: val === 'sebagian' ? 1 : 0,
        tercapai: val === 'tercapai' ? 1 : 0
    };
};

// Tasks: Sedikit (0-2), Banyak (>2) - Simple additional factor, or integrate into rules.
// For Mamdani here we stick to the main 3 variables requested + Tasks as modifier or rule component.
// Let's integrate tasks into score post-fuzzy or as part of the rules.
// User spec: Variabel fuzzy: Durasi, Gangguan, Target. (Tasks not explicitly listed as fuzzy var but input).
// We will use tasks to boost the crisp output slightly or affect rules.

// 2. Inference Rules
const evaluateRules = (durasi, gangguan, target) => {
    const rules = [];

    // Rule 1: Jika Durasi Lama AND Gangguan Rendah AND Target Tercapai THEN Optimal
    rules.push({
        strength: Math.min(durasi.lama, gangguan.rendah, target.tercapai),
        output: 'optimal'
    });

    // Rule 2: Jika Durasi Sedang AND Gangguan Rendah AND Target Tercapai THEN Optimal
    rules.push({
        strength: Math.min(durasi.sedang, gangguan.rendah, target.tercapai),
        output: 'optimal'
    });

    // Rule 3: Jika Durasi Sedang AND Gangguan Sedang AND Target Sebagian THEN Cukup
    rules.push({
        strength: Math.min(durasi.sedang, gangguan.sedang, target.sebagian),
        output: 'cukup'
    });

    // Rule 4: Jika Durasi Pendek AND Gangguan Tinggi THEN Tidak Efektif
    rules.push({
        strength: Math.min(durasi.pendek, gangguan.tinggi),
        output: 'tidak_efektif'
    });

    // Rule 5: Jika Target Tidak Tercapai THEN Tidak Efektif (Strong rule)
    rules.push({
        strength: target.tidak_tercapai,
        output: 'tidak_efektif'
    });

    // Rule 6: Jika Durasi Lama AND Gangguan Tinggi THEN Cukup (Effort but distracted)
    rules.push({
        strength: Math.min(durasi.lama, gangguan.tinggi),
        output: 'cukup'
    });

    // Add more coverage rules
    // Default / low coverage fallback
    rules.push({
        strength: Math.min(durasi.pendek, target.tercapai), // Short but effective?
        output: 'cukup' // or quite good
    });

    // Aggregation (Max)
    let degrees = {
        tidak_efektif: 0,
        cukup: 0,
        optimal: 0
    };

    rules.forEach(r => {
        if (degrees[r.output] < r.strength) {
            degrees[r.output] = r.strength;
        }
    });

    return degrees;
};

// 3. Defuzzification (Centroid Method)
// Output Membership Functions: Tidak Efektif (0-40), Cukup (40-70), Optimal (70-100)
// Triangular/Trapezoidal shapes
const defuzzify = (degrees) => {
    // Riemann Sum integration for centroid
    let numerator = 0;
    let denominator = 0;

    // Iterate through x (score 0 to 100)
    for (let x = 0; x <= 100; x += 5) {
        // Calculate membership of x in each output set
        let muTidak = 0;
        if (x <= 40) muTidak = 1; // Simplify to trapezoid/shoulder
        else if (x <= 60) muTidak = (60 - x) / 20;

        let muCukup = 0;
        if (x >= 30 && x <= 50) muCukup = (x - 30) / 20;
        else if (x > 50 && x <= 70) muCukup = 1;
        else if (x > 70 && x <= 90) muCukup = (90 - x) / 20;

        let muOptimal = 0;
        if (x >= 60 && x <= 80) muOptimal = (x - 60) / 20;
        else if (x > 80) muOptimal = 1;

        // Clip by degree (Mamdanis Min implication)
        let valTidak = Math.min(muTidak, degrees.tidak_efektif);
        let valCukup = Math.min(muCukup, degrees.cukup);
        let valOptimal = Math.min(muOptimal, degrees.optimal);

        // Aggregation (Max)
        let maxVal = Math.max(valTidak, valCukup, valOptimal);

        numerator += x * maxVal;
        denominator += maxVal;
    }

    if (denominator === 0) return 0;
    return numerator / denominator;
};

const calculateFuzzyScore = (data) => {
    const durasiSet = fuzzyDurasi(parseFloat(data.duration));
    const gangguanSet = fuzzyGangguan(data.interruptions);
    const targetSet = fuzzyTarget(data.target);

    // Inference
    const outputDegrees = evaluateRules(durasiSet, gangguanSet, targetSet);

    // Defuzzification
    let score = defuzzify(outputDegrees);

    // Bonus for completed tasks (simple linear addition post-fuzzy, or could be part of rules)
    // Spec says 3 variables, let's just create a slight modifier for task counts
    if (data.tasks > 5) score = Math.min(100, score + 5);
    if (data.tasks === 0) score = Math.max(0, score - 5);

    return Math.round(score);
};

const getCategory = (score) => {
    if (score >= 75) return 'Optimal';
    if (score >= 45) return 'Cukup';
    return 'Tidak Efektif';
};

const getRecommendation = (score, data) => {
    if (score >= 80) return "Pertahankan kinerja luar biasa ini! Metode belajarmu sudah sangat efektif.";
    if (score >= 60) {
        if (data.interruptions === 'tinggi') return "Hasil cukup baik, namun cobalah mencari tempat yang lebih tenang untuk mengurangi gangguan.";
        if (data.duration < 2) return "Efektivitas oke, tapi cobalah menambah durasi belajar sedikit lagi.";
        return "Tingkatkan konsistensi target belajarmu.";
    }
    if (data.target === 'tidak_tercapai') return "Fokus pada pencapaian target kecil terlebih dahulu agar tidak merasa terbeban.";
    if (data.interruptions === 'tinggi') return "Gangguan sangat mempengaruhi produktivitasmu. Matikan notifikasi HP saat belajar.";
    return "Evaluasi kembali jadwal dan metode belajarmu. Coba teknik Pomodoro.";
};

module.exports = {
    calculateFuzzyScore,
    getCategory,
    getRecommendation
};
