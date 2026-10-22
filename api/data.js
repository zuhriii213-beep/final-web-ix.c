// file: api/data.js (Serverless Function untuk Vercel + GitHub)
export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'zuhriii213-beep/final-web-ix.c';
  const FILE_PATH = 'database.json';
  const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN belum dipasang di Vercel' });
  }

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  try {
    // 1. Saat pengunjung membuka web (GET) -> Ambil data dari database.json di GitHub
    if (req.method === 'GET') {
      const response = await fetch(API_URL, { headers, cache: 'no-store' });
      if (!response.ok) return res.status(404).json({ message: 'Database belum ada' });
      
      const fileData = await response.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      return res.status(200).json(JSON.parse(content));
    }

    // 2. Saat Admin mengedit / klik Publikasikan (PUT) -> Simpan ke GitHub
    if (req.method === 'PUT') {
      let sha = undefined;
      const checkFile = await fetch(API_URL, { headers, cache: 'no-store' });
      if (checkFile.ok) {
        const existing = await checkFile.json();
        sha = existing.sha;
      }

      const contentBase64 = Buffer.from(JSON.stringify(req.body, null, 2)).toString('base64');
      const saveRes = await fetch(API_URL, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'Update data kelas dari Mode Admin',
          content: contentBase64,
          sha: sha
        })
      });

      if (!saveRes.ok) throw new Error('Gagal menyimpan ke GitHub');
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method tidak didukung' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  }
      
