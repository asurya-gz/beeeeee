const express = require("express");
const router = express.Router();
const ruanganController = require("../../controllers/RuanganController");

// Rute untuk mendapatkan semua ruangan
router.get("/get-all-ruangan", ruanganController.getAllRuangan);

// Rute untuk mendapatkan ruangan berdasarkan id (mengambil id dari body)
router.post("/get-ruangan-by-id", ruanganController.getAllRuanganById);

module.exports = router;
