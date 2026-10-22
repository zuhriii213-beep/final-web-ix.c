// file: api/data.js
module.exports = async (req, res) => {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'zuhriii213-beep/final-web-ix.c';
  const FILE_PATH = 'database.json';
  const BRANCH = 'main';
  const API_URL = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GITHUB_TOKEN belum terbaca di Vercel' });
  }

  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'Vercel-Serverless-IXC'
  };

  try {
    // 1. Ambil data saat pengunjung membuka web (GET)
    if (req.method === 'GET') {
      const response = await fetch(`${API_URL}?ref=${BRANCH}`, { headers, cache: 'no-store' });
      if (!response.ok) {
        return res.status(404).json({ message: 'Database belum dibuat' });
      }
      const fileData = await response.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      return res.status(200).json(JSON.parse(content));
    }

    // 2. Simpan data saat Admin mengedit / klik Publikasikan (PUT)
    if (req.method === 'PUT') {
      let sha = undefined;
      const checkFile = await fetch(`${API_URL}?ref=${BRANCH}`, { headers, cache: 'no-store' });
      if (checkFile.ok) {
        const existing = await checkFile.json();
        sha = existing.sha;
      }

      const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const contentBase64 = Buffer.from(JSON.stringify(bodyData, null, 2)).toString('base64');

      const saveRes = await fetch(API_URL, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'Update data kelas dari Mode Admin',
          content: contentBase64,
          branch: BRANCH,
          ...(sha ? { sha } : {})
        })
      });

      if (!saveRes.ok) {
        const errText = await saveRes.text();
        return res.status(500).json({ error: 'GitHub menolak penyimpanan', detail: errText });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method tidak diizinkan' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
