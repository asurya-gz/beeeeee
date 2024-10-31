const express = require("express");
const router = express.Router();
const penggunaController = require("../../controllers/penggunaController");

// Rute untuk membuat pengguna baru
router.post("/register-pengguna", penggunaController.createPengguna);
router.post("/verifikasi-pengguna", penggunaController.verifyUser);

module.exports = router;
