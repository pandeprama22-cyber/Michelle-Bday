# 🔧 Catatan Perbaikan (Fix Log)

## Bug fatal yang ditemukan & diperbaiki
1. **`HeartGallery.tsx` gagal compile** — komponen ini memanggil `siteContent.heartGalleryPhotos`, field yang **tidak pernah ada** di `config/content.ts` (yang ada `galaxyPhotos`). Ini menyebabkan error TypeScript dan scene ke-8 rusak/kosong.
2. **Scene "Galaksi Kenangan" belum pernah benar-benar dibangun** — CSS keyframe untuk orbit (`orbit-cw`, `orbit-ccw`, `shooting-star`) sudah disiapkan sebelumnya tapi komponennya tidak pernah dibuat. Halaman masih memakai `HeartGallery` versi lama (grid hati statis kecil).
3. **`.eq-bar` di Vinyl Player memanggil animasi `equalizer-bounce` yang tidak pernah didefinisikan** di `globals.css` — bar equalizer tidak akan bergerak sama sekali.
4. **`.progress-track` (slider musik) tidak punya styling sama sekali** — akan tampil sebagai slider default browser yang polos, tidak sesuai tema.
5. **[Update] Tidak semua foto di Galaksi Kenangan bisa diklik** — ring orbit foto terluar (dirender paling belakang di kode, tapi membentuk stacking context penuh 1 layar karena punya `transform`) secara tidak sengaja menutupi/menangkap semua klik di seluruh area galaksi, termasuk area yang secara visual ditempati foto ring dalam & tengah. Diperbaiki dengan menonaktifkan pointer-events pada wrapper ring (`pointer-events-none`) dan mengaktifkannya kembali khusus pada tombol foto (`pointer-events-auto`), sehingga klik selalu tepat sasaran ke foto yang dituju di ring manapun.
6. **[Update] Animasi ketikan (typewriter) di Surat Cinta kadang tidak jalan sama sekali** — sebelumnya animasi ini menunggu `setTimeout` 400ms setelah scene terdeteksi terlihat oleh scroll-observer. Kalau pengguna scroll agak cepat, status "terlihat" itu bisa berubah lagi sebelum 400ms selesai, sehingga timer dibatalkan dan animasi ketikan **tidak pernah dimulai**. Diperbaiki dengan memicu animasi seketika begitu scene pertama kali terdeteksi terlihat, tanpa jeda timer, sehingga tidak ada lagi kondisi balapan (race condition) yang bisa membatalkannya.

## Yang ditambahkan / diganti
1. **Scene baru: `GalaxyGallery.tsx`** menggantikan `HeartGallery.tsx` — implementasi penuh sesuai Addendum 2:
   - 3 ring orbit (dalam/tengah/luar) dengan kecepatan & arah putar berbeda
   - Foto core besar bercahaya (pulsing glow) di tengah
   - **Drag/swipe untuk memutar galaksi secara manual** (mouse & touch)
   - **Tap foto → lightbox membesar** menampilkan caption, tanggal, lokasi + navigasi prev/next + keyboard arrow/escape
   - Nebula drift + shooting star acak di background
   - Ukuran foto & radius mengikuti aturan minimum dari Addendum 1 (tidak ada elemen kekecilan)
2. **CSS baru di `globals.css`**: `equalizer-bounce`, `nebula-drift`, `core-pulse-glow`, `.progress-track` (styling slider custom), `.galaxy-*` utility classes.
3. **Kecepatan putaran vinyl** diubah dari 3 detik → 5.5 detik per putaran, menyesuaikan mood R&B/neo-soul yang lebih pelan dan soulful (lagu: *We Find Love* — Daniel Caesar).
4. Perbaikan kecil best-practice React (menghindari akses `.current` ref langsung saat render) di `MatrixRainCanvas.tsx` dan `GalaxyGallery.tsx`.

## [Update 2] Polish visual & perbaikan build (sesi berikutnya)
1. **Emoji dekoratif diganti ikon SVG custom** — `HeroTitle`, `StarfieldEnvelope`, `LoveLetter`, `FavoritePerson`, `VinylPlayer`, `GalaxyGallery`, `PolaroidGallery`, `Outro` sebelumnya memakai emoji platform (💖✨💕🌸💌👆🔇🔊🌹💓🎶▶❚❚✕←→💬🔄). Emoji ini dirender berbeda-beda tampilannya di tiap OS/device (Windows vs iOS vs Android) dan warnanya bentrok dengan palet emas/pink/cream situs yang sudah ditata rapi. Dibuat set ikon garis tipis baru di `app/components/ui/Icons.tsx` (mengikuti `currentColor`, jadi otomatis ikut warna tema) dan semua pemakaian dekoratif di atas diganti ke ikon ini. Teks konten personal (surat, pesan WhatsApp, meta OG) yang memang seharusnya berisi emoji dari pengguna dibiarkan apa adanya.
2. **`sizes` prop yang hilang pada beberapa `<Image fill>`** (`LoveLetter.tsx` foto polaroid kecil, `StarfieldEnvelope.tsx` foto amplop) ditambahkan agar Next.js bisa mengoptimalkan ukuran gambar yang dikirim ke browser.
3. **Build gagal karena Google Fonts tidak bisa diakses** — sebelumnya `app/layout.tsx` memakai `next/font/google` (`Great_Vibes`, `Playfair_Display`, `Poppins`), yang men-download font dari `fonts.googleapis.com` **saat build**. Di lingkungan mana pun yang membatasi akses ke domain itu (sandbox ini, proxy kantor, CI tanpa internet), `next build` gagal total meskipun kodenya tidak salah. Diperbaiki dengan meng-host font-nya sendiri: file `.ttf` yang sama disimpan di `app/fonts/` dan dimuat lewat `next/font/local`. Build sekarang selalu berhasil di mana pun, tanpa bergantung ke internet sama sekali saat build.

## [Update 3] Animasi scene "Surat Cinta" (LoveLetter) — sebelumnya terasa flat
Keluhan: hanya bagian atas (header + baris pertama ketikan) yang terasa beranimasi; sisanya (paragraf lain, materai, tanda tangan, foto tempel) muncul nyaris bersamaan begitu kartu surat masuk layar, jadi terasa datar/flat.

Penyebab: paragraf ke-2 dst, materai, tanda tangan, dan foto tempel semuanya dipicu oleh `whileInView` pada scroll — begitu kartu suratnya (yang tinggi) mulai terlihat, hampir semua elemen di dalamnya langsung ikut "terlihat" oleh IntersectionObserver di saat yang sama, sehingga jeda stagger 0.15 detik nyaris tidak kerasa.

Perbaikan:
1. Paragraf ke-2 dan seterusnya, materai/wax seal, tanda tangan, dan foto tempel sekarang dipicu oleh **state waktu** (`typewriterDone`, dihitung dari selesainya animasi ketik paragraf pertama) alih-alih posisi scroll — jadi surat terasa "ditulis" baris demi baris secara berurutan, selalu konsisten animasinya di layar berapa pun tingginya.
2. Materai diberi animasi masuk (pop-in dengan sedikit rotasi) plus goyangan halus tak berhenti (idle float) supaya tidak terasa mati begitu muncul.
3. Salam pembuka ("Sayangku, ...") diberi animasi fade+slide sendiri saat kartu muncul.
4. Tanda tangan penutup ("Your Love") dan foto tempel diberi animasi masuk yang lebih hidup (foto: rotate-in dengan sedikit efek pantul).
5. Ditambahkan partikel hati & sparkle mengambang di latar belakang seluruh section (bukan cuma di dalam kartu), supaya area sekitar kartu surat juga tidak terasa kosong/statis — konsisten dengan scene Hero dan Envelope yang sudah punya elemen serupa.

## [Update 4] Menggabungkan elemen dari kedua video referensi
Setelah menganalisis ulang kedua video referensi lebih detail, ditemukan dua elemen khas yang belum ada di project:

1. **Nama penerima muncul dari hujan matrix** (terinspirasi referensi lovescape.id yang menampilkan "ANITA" terbentuk dari efek matrix rain). Digabung dengan efek countdown 3-2-1 yang sudah ada sebelumnya menjadi satu alur intro: hujan → nama muncul → hitung mundur → ledakan transisi.
   - Percobaan pertama memakai teknik sampling piksel dari grid kolom rain (sama seperti teknik mask digit 1/2/3 yang sudah ada) — ternyata di lebar layar HP kolomnya terlalu jarang (~27 kolom) untuk membentuk nama 8 huruf ("Michelle") dengan jelas, hasilnya cuma titik-titik acak yang tidak terbaca.
   - **Solusi final:** efek "decode" ala hacker — tiap huruf nama dimulai dari karakter acak lalu terkunci satu per satu dari kiri ke kanan menjadi huruf aslinya, digambar sebagai teks tajam bercahaya pink di atas hujan yang tetap berjalan di latar. Pendekatan ini tidak bergantung pada resolusi kolom rain sama sekali, jadi dijamin selalu terbaca jelas di layar berapa pun (HP maupun desktop), untuk nama sepanjang apa pun.
   - Nama diambil dari `siteContent.partnerName` secara otomatis.

2. **Doodle pasangan kecil di bawah tanda tangan surat** (terinspirasi referensi craft.lymade yang punya sketsa pasangan kartun di bawah suratnya). Ditambahkan ikon SVG line-art baru (`CoupleDoodleIcon`) di `Icons.tsx`, muncul di `LoveLetter.tsx` sebagai penutup manis setelah tanda tangan, mengikuti sekuens animasi berurutan yang sudah dibuat di Update 3 (muncul terakhir, setelah foto tempel).

## Status verifikasi (Update 4)
- ✅ `npx tsc --noEmit` — 0 error
- ✅ `npx eslint` — 0 error
- ✅ `npm run build` — sukses penuh
- ✅ Diuji visual dengan Playwright pada intro: rain (0–1.8s) → nama "Michelle" ter-decode huruf demi huruf dan terbaca penuh & jelas (±2.7s) → transisi mulus ke countdown 3-2-1 yang sudah ada — dan pada surat cinta: doodle pasangan muncul tepat setelah tanda tangan & foto tempel sesuai urutan.


## [Update 5] Memasukkan lagu "Everything" - The Black Skirts
Lagu sebelumnya tidak pernah terputar karena dua masalah:

1. **Nama file salah (ekstensi ganda).** File tersimpan sebagai `everything-the-black-skirts.mp3.mp3`, padahal `config/content.ts` (`song.src`) meminta `/audio/everything-the-black-skirts.mp3`. Ini biasa terjadi di Windows saat ekstensi file disembunyikan lalu file di-rename manual. Akibatnya Howler tidak menemukan file dan situs berjalan tanpa suara.
2. **Isi file bukan MP3 asli.** File hasil unduhan ternyata AAC dalam wadah MP4/DASH yang hanya diganti nama jadi `.mp3`. Browser desktop kadang masih bisa memutarnya, tetapi Safari/iPhone sering gagal.

**Perbaikan:** file dikonversi menjadi MP3 asli (192 kbps, 44.1 kHz, stereo, durasi 5:03), disimpan sebagai `public/audio/everything-the-black-skirts.mp3` (persis sama dengan `song.src`), dan file lama berekstensi ganda dihapus. Tidak ada perubahan kode.

## Cara menjalankan
```bash
cd love-gift
npm install
npm run dev       # untuk development lokal
npm run build     # untuk build production sebelum deploy ke Vercel
```
