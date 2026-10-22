// file: server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Limit 50MB agar muat menampung upload foto base64 dari Galeri & Siswa
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Endpoint ambil data kelas untuk semua pengunjung
app.get('/api/data', (req, res) => {
  if (!fs.existsSync(DB_FILE)) {
    return res.status(404).json({ message: 'Belum ada database tersimpan' });
  }
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  res.json(JSON.parse(raw));
});

// Endpoint simpan perubahan dari Mode Admin
app.put('/api/data', (req, res) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menyimpan data' });
  }
});

// Endpoint notifikasi pengunjung (/api/notif)
app.post('/api/notif', (req, res) => {
  console.log('Pengunjung baru:', req.body);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server Kelas IX.C berjalan di port ${PORT}`);
});
