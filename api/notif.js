export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ error: 'Environment variables not configured' });
  }

  const { waktu, perangkat } = req.body || {};
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown IP';

  const pesan = 
    `🔔 *Pengunjung Baru Web IX.C*\n\n` +
    `⏰ *Waktu:* ${waktu || 'Tidak terdeteksi'}\n` +
    `🌐 *IP:* \`${ip}\`\n` +
    `📱 *Perangkat:* \`${perangkat || 'Tidak terdeteksi'}\``;

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: pesan,
        parse_mode: 'Markdown'
      })
    });

    const data = await tgRes.json();
    if (!data.ok) {
      return res.status(502).json({ error: data.description });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

