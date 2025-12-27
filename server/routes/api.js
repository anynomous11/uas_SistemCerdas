const express = require('express');
const router = express.Router();
const productivityController = require('../controllers/productivityController');

router.post('/evaluasi-produktivitas', productivityController.evaluateProductivity);
router.get('/riwayat-produktivitas', productivityController.getHistory);
router.get('/dashboard-stats', productivityController.getDashboardStats);
router.delete('/riwayat-produktivitas/:id', productivityController.deleteProductivity);
router.put('/riwayat-produktivitas/:id', productivityController.updateProductivity);

module.exports = router;
