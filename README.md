# 💝 Digital Love Gift Website — Panduan Penggunaan & Kustomisasi

Website hadiah digital romantis bertema alur cerita (single-page app) yang menggabungkan nuansa **Cyber/Starfield Magic** (Matrix rain, countdown neon, starfield) dengan **Warm Vintage Sentimental** (kartu ucapan, polaroid washi tape, surat cinta, piringan vinyl, dan galeri konstelasi hati).

---

## 🚀 Cara Menjalankan di Komputer Lokal

1. **Buka folder proyek di Terminal / CMD**:
   ```bash
   cd love-gift
   ```

2. **Jalankan development server**:
   ```bash
   npm run dev
   ```

3. **Buka di browser**:
   Akses [http://localhost:3000](http://localhost:3000) di browser laptop atau buka via IP lokal di HP kamu.

---

## 🎨 Cara Mengganti Foto, Teks & Lagu (Super Mudah!)

Kamu **TIDAK PERLU** mengerti coding rumit untuk mengganti isi website ini. Cukup ikuti 2 langkah berikut:

### 1. Mengubah Teks, Nama, Tanggal, & Pesan
Buka file:
📁 `config/content.ts`

Di dalamnya kamu bisa langsung mengganti:
- `partnerName`: Nama lengkap atau panggilan pasangan (misal: `"Michelle"`)
- `nickname`: Panggilan sayang (misal: `"Sayang"`, `"Babe"`, `"Cil"`)
- `senderName`: Nama kamu
- `anniversaryDate`: Tanggal jadian/ulang tahun (format `"YYYY-MM-DD"`, durasi akan dihitung otomatis!)
- `heroTitle`: Judul pembuka besar
- `loveLetterParagraphs`: Kumpulan paragraf surat cintamu
- `song`: Judul lagu, artis, dan alasan memilih lagu tersebut
- `whatsappNumber`: Nomor WhatsApp kamu (format: `62812...`) agar pasangan bisa langsung membalas via WA
- `replyMessage`: Teks balasan otomatis untuk WhatsApp

---

### 2. Mengganti Foto, Video & Lagu

Semua file media disimpan di folder:
📁 `public/`

| Media | Lokasi | Format yang Disarankan |
|---|---|---|
| **Foto amplop** | `public/photos/envelope-reveal.webp` | WebP / JPG kotak (1:1) |
| **Foto surat** | `public/photos/letter-photo.webp` | WebP / JPG |
| **Galeri Polaroid** | `public/photos/gallery-1.webp` s/d `gallery-8.webp` | WebP / JPG foto momen berdua |
| **Foto Favorit** | `public/photos/favorite.webp` | WebP / JPG foto close-up terbaik |
| **Lagu MP3** | `public/audio/everything-the-black-skirts.mp3` | MP3 lagu "Everything" - The Black Skirts (nama file harus sama dengan `song.src` di `config/content.ts`) |
| **Cover Vinyl** | `public/photos/vinyl-center.webp` | WebP / JPG foto kecil di tengah piringan |
| **Galeri Hati** | `public/photos/heart-1.webp` s/d `heart-10.webp` | WebP / JPG 10 foto untuk siluet hati |
| **Thumbnail WA** | `public/photos/og-thumbnail.webp` | Thumbnail untuk preview chat WA |

> 🎵 **Lagu**: taruh file MP3 "Everything - The Black Skirts" ke folder `public/audio/` dengan nama persis `everything-the-black-skirts.mp3`. Kalau file belum ada, website tetap jalan tapi tanpa suara. Di Windows, pastikan ekstensi tidak jadi ganda (`.mp3.mp3`): aktifkan *View > File name extensions* di File Explorer untuk memeriksanya.

> 💡 **Tips Konversi Foto**: Untuk menjaga performa HP tetap ringan dan lancar 60fps, gunakan format `.webp` atau kompres foto kamu di [squoosh.app](https://squoosh.app) atau [tinypng.com](https://tinypng.com) sebelum dimasukkan.

---

## 🌐 Cara Deploy Gratis ke Vercel (Agar Bisa Dibagikan ke Pasangan)

1. Buat akun di [Vercel](https://vercel.com) dan hubungkan dengan akun GitHub kamu.
2. Push / upload folder project ini ke repository GitHub pribadi kamu.
3. Di Vercel Dashboard, klik **"Add New"** → **"Project"** → Pilih repository ini.
4. Setting Root Directory: pastikan mengarah ke `love-gift` jika berada dalam subfolder.
5. Klik **"Deploy"**. Dalam 1-2 menit, kamu akan mendapatkan link aktif seperti `hadiah-buat-michelle.vercel.app`!
6. Kirim link tersebut ke WhatsApp pasanganmu 💖

---

## 🛠️ Tech Stack yang Digunakan

- **Next.js 14+ (App Router)** & TypeScript
- **Tailwind CSS v4** dengan Custom Design Tokens
- **Framer Motion** untuk transisi halus antar-scene
- **HTML5 Canvas API** untuk efek Matrix digital rain, Starfield 3-layer parallax, dan floating hearts
- **Howler.js** untuk kontrol audio musik yang sinkron dengan piringan hitam (vinyl turntable)
- **Math Parametric Heart** untuk menyusun foto membentuk siluet hati bercahaya neon secara matematis
