const ruanganModel = require("../models/ruangan/ruanganModel");

// Controller untuk mendapatkan semua data ruangan
exports.getAllRuangan = (req, res) => {
  ruanganModel.getAllRuangan((err, ruangan) => {
    if (err) {
      console.error("Error retrieving all rooms:", err);
      return res.status(500).json({ message: "Gagal mengambil data ruangan." });
    }

    res.status(200).json({
      message: "Data ruangan berhasil diambil.",
      data: ruangan,
    });
  });
};

// Controller untuk mendapatkan data ruangan berdasarkan id
exports.getAllRuanganById = (req, res) => {
  const { id } = req.body;

  // Validasi input
  if (!id) {
    return res.status(400).json({ message: "ID ruangan diperlukan." });
  }

  ruanganModel.getAllRuanganById(id, (err, ruangan) => {
    if (err) {
      console.error("Error retrieving room by ID:", err);
      return res.status(500).json({ message: "Gagal mengambil data ruangan." });
    }

    if (!ruangan) {
      return res.status(404).json({ message: "Ruangan tidak ditemukan." });
    }

    res.status(200).json({
      message: "Data ruangan berhasil ditemukan.",
      data: ruangan,
    });
  });
};
