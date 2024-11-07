const db = require("../../db");

// Fungsi untuk mendapatkan semua data ruangan
exports.getAllRuangan = (callback) => {
  const query = "SELECT * FROM ruangan";

  db.query(query, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

exports.getAllRuanganById = (id, callback) => {
  const query = `
      SELECT r.*, rf.facility, rr.rule, rts.period, rts.time_range
      FROM ruangan AS r
      LEFT JOIN ruangan_facilities AS rf ON r.id = rf.ruangan_id
      LEFT JOIN ruangan_rules AS rr ON r.id = rr.ruangan_id
      LEFT JOIN ruangan_time_slots AS rts ON r.id = rts.ruangan_id
      WHERE r.id = ?
    `;
  const values = [id];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    if (result.length === 0) {
      return callback(null, null); // Jika tidak ada data ruangan dengan id tersebut
    }

    // Menyusun data ruangan dengan fasilitas, aturan, dan slot waktu
    const ruangan = {
      id: result[0].id,
      name: result[0].name,
      description: result[0].description,
      capacity: result[0].capacity,
      image: result[0].image,
      with_letter: result[0].with_letter,
      facilities: [],
      rules: [],
      time_slots: [],
    };

    result.forEach((row) => {
      if (row.facility && !ruangan.facilities.includes(row.facility)) {
        ruangan.facilities.push(row.facility);
      }
      if (row.rule && !ruangan.rules.includes(row.rule)) {
        ruangan.rules.push(row.rule);
      }
      if (
        row.period &&
        row.time_range &&
        !ruangan.time_slots.some(
          (slot) =>
            slot.period === row.period && slot.time_range === row.time_range
        )
      ) {
        ruangan.time_slots.push({
          period: row.period,
          time_range: row.time_range,
        });
      }
    });

    callback(null, ruangan);
  });
};
