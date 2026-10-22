// file: api/data.js (Mendukung Foto Full HD > 1 MB)
module.exports = async (req, res) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'zuhriii213-beep/final-web-ix.c';
  const FILE_PATH = 'database.json';
  const BRANCH = 'main';
  const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN belum dipasang di Environment Variables Vercel' });
  }

  const baseHeaders = {
    Authorization: `token ${GITHUB_TOKEN}`,
    'User-Agent': 'Vercel-Serverless-IXC'
  };

  try {
    // 1. GET: Ambil data publik (Menggunakan format .raw agar tembus batas 1 MB)
    if (req.method === 'GET') {
      const response = await fetch(`${API_URL}?ref=${BRANCH}`, {
        headers: {
          ...baseHeaders,
          Accept: 'application/vnd.github.v3.raw'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        return res.status(404).json({ message: 'Database belum ada' });
      }

      const rawText = await response.text();
      return res.status(200).json(JSON.parse(rawText));
    }

    // 2. PUT: Simpan foto & data baru dari Admin ke GitHub
    if (req.method === 'PUT') {
      let sha = undefined;

      // Ambil SHA lewat daftar folder root agar tetap terbaca walau ukuran file > 1 MB
      const dirRes = await fetch(`https://api.github.com/repos/${REPO}/contents?ref=${BRANCH}`, {
        headers: {
          ...baseHeaders,
          Accept: 'application/vnd.github.v3+json'
        },
        cache: 'no-store'
      });

      if (dirRes.ok) {
        const files = await dirRes.json();
        const dbFile = Array.isArray(files) ? files.find(f => f.name === FILE_PATH) : null;
        if (dbFile) sha = dbFile.sha;
      }

      const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const contentBase64 = Buffer.from(JSON.stringify(bodyData)).toString('base64');

      const saveRes = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          ...baseHeaders,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update foto & data kelas dari Mode Admin',
          content: contentBase64,
          branch: BRANCH,
          ...(sha ? { sha } : {})
        })
      });

      if (!saveRes.ok) {
        const errText = await saveRes.text();
        return res.status(500).json({ error: 'Gagal simpan ke GitHub', detail: errText });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method tidak diizinkan' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
