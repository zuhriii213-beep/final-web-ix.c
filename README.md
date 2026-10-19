# Website Kelas IX.C — SMPN 1 Sekar

Website profil kelas interaktif dengan fitur:
- Tampilan responsif modern & glassmorphism (Tailwind CSS)
- Musik latar (audio player)
- Manajemen data lokal (Wali kelas, struktur organisasi, jadwal, dan galeri)
- Notifikasi pengunjung otomatis ke Bot Telegram via Vercel Serverless Function (aman tanpa mengekspos token bot di sisi klien)

## Cara Deploy ke Vercel

1. Ekstrak file zip ini ke folder lokal.
2. Upload folder ini ke GitHub atau import langsung lewat dashboard Vercel ([vercel.com](https://vercel.com)).
3. Di dashboard Vercel, buka proyek Anda:
   - Masuk ke **Settings** > **Environment Variables**.
   - Tambahkan variabel:
     - `TELEGRAM_BOT_TOKEN` = token bot Telegram Anda dari @BotFather.
     - `TELEGRAM_CHAT_ID` = ID chat Telegram Anda dari @userinfobot.
4. Redeploy proyek Anda di Vercel. Selesai!
