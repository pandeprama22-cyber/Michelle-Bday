// ============================================================
// 🎀 CONTENT CONFIGURATION — Digital Love Gift (Addendum 2)
// ============================================================
// Semua teks, tanggal, surat, foto, dan lagu diatur dari sini.
// ============================================================

export interface MemoryPhoto {
  id: string;
  src: string;
  caption: string;      // 1 kalimat spesifik & personal menceritakan momen
  date?: string;         // Contoh: "Agustus 2024"
  location?: string;     // Contoh: "Bandung", "Pantai Kuta"
  rotation?: number;     // Untuk polaroid (-6 sampai 6)
}

export interface SongConfig {
  src: string;        // path ke file MP3 di /public/audio/
  title: string;
  artist: string;
  album: string;
  genre: string;
  reason: string;     // alasan manis memilih lagu ini
  coverSrc?: string;  // gambar cover kecil di tengah piringan vinyl
}

export interface VideoConfig {
  src: string;
  poster: string;
}

export interface SiteContent {
  // --- Info Pasangan ---
  partnerName: string;
  nickname: string;
  senderName: string;
  senderNickname: string;

  // --- Tanggal & Acara ---
  anniversaryDate: string;  // Format: "YYYY-MM-DD"
  eventType: 'monthsary' | 'anniversary' | 'birthday';

  // --- Hero Section ---
  heroTitle: string;
  heroSubtitle: string;
  anniversaryTag: string;

  // --- Surat Cinta ---
  loveLetterParagraphs: string[];
  loveLetterSignature: string;
  loveLetterPhotoSrc: string;

  // --- Galeri Polaroid (Timeline) ---
  galleryTitle: string;
  gallerySubtitle: string;
  galleryPhotos: MemoryPhoto[];

  // --- Favorite Person Section ---
  favoritePersonCaption: string;
  favoritePersonSubtext: string;
  favoritePersonDate: string;
  favoritePersonLocation: string;
  favoritePersonMedia: VideoConfig | { src: string; type: 'image' };

  // --- Pemutar Musik Vinyl (Daniel Caesar - We Find Love) ---
  song: SongConfig;

  // --- Galaksi Kenangan (Rotating Multi-Ring Galaxy) ---
  galaxyTitle: string;
  galaxySubtitle: string;
  galaxyCorePhoto: string;
  galaxyPhotos: MemoryPhoto[]; // 20+ foto kenangan dengan caption mendalam

  // --- Penutup & Kontak ---
  closingMessage: string;
  whatsappNumber?: string;
  replyMessage?: string;

  // --- SEO / Open Graph Preview ---
  ogTitle: string;
  ogDescription: string;
  ogImage: string;

  // --- Amplop Pembuka ---
  envelopePhotoSrc: string;
}

// ============================================================
// 📅 HITUNG DURASI HUBUNGAN OTOMATIS
// ============================================================
export function calculateDuration(dateStr: string): {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  label: string;
} {
  const start = new Date(dateStr);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMonths = years * 12 + months;

  let label = '';
  if (years > 0) {
    label = `${years} Tahun${months > 0 ? ` ${months} Bulan` : ''}`;
  } else if (totalMonths > 0) {
    label = `${totalMonths} Bulan`;
  } else {
    label = `${days} Hari`;
  }

  return { years, months, days, totalMonths, label };
}

// ============================================================
// 💝 ISI KONTEN LENGKAP & DETAIL
// ============================================================
export const siteContent: SiteContent = {
  partnerName: 'Michelle',
  nickname: 'Sayang',
  senderName: 'Prama',
  senderNickname: 'Love',

  anniversaryDate: '2026-01-15',
  eventType: 'birthday',

  heroTitle: 'Happy Birthday, Michelle',
  heroSubtitle: '22 September 2026 — The world feels so much better and more fun ever since you came into it.',
  anniversaryTag: 'Our Beautiful Journey Together',

  // --- Surat Cinta ---
  loveLetterParagraphs: [
    'Happy bhirtday michelle, my love god bless you. panjang umur ya sayang semoga selalu diberi kesehatan dan selalu dapat keberuntungan, babe ure 16 years old right now and i want to be with you till we die together,',
    'so aku minta maaf kalo selama ini aku belum bisa jadi partner yang baik buat kamu, yang masih bingung cara ngetreat dan memperlakukan kamu spesial, dan kedepannya aku harap aku bisa berubah lebih baik lagi,',
    'makasi juga ya udah mau tetep sama aku even its hard and have many struggle, ik we strong, ik we can be together in the future,',
    'beberapa pecahan kenangan foto foto ada disini dan aku ngebuat website ini karena aku tau aku ga bagus bikin handcraft heheee, semoga kamu suka yaa sayanggg,',
    'loveyouusomuchh sayangg happy bhirtdayyy',
  ],
  loveLetterSignature: 'Dengan segenap cinta dan rinduku,',
  loveLetterPhotoSrc: '/photos/letter-photo.webp',

  // --- Galeri Polaroid (Timeline dengan caption spesifik) ---
  galleryTitle: 'Our Moment',
  gallerySubtitle: 'Every corner of the city, every second of time, always feels magical with you.',
  galleryPhotos: [
    {
      id: 'polaroid-1',
      src: '/photos/gallery-1.webp',
      caption: 'When i first fell in love with you',
      date: 'Januari 2026',
      rotation: -5,
    },
    {
      id: 'polaroid-2',
      src: '/photos/gallery-2.webp',
      caption: 'Our first date',
      date: 'Januari 2026',
      rotation: 4,
    },
    {
      id: 'polaroid-3',
      src: '/photos/gallery-3.webp',
      caption: 'The day we officially became a couple',
      date: 'Februari 2026',
      rotation: -3,
    },
    {
      id: 'polaroid-4',
      src: '/photos/gallery-4.webp',
      caption: 'First date as a couple',
      date: 'Februari 2026',
      rotation: 6,
    },
    {
      id: 'polaroid-5',
      src: '/photos/gallery-5.webp',
      caption: 'First sunset together',
      date: 'Februari 2026',
      rotation: -4,
    },
    {
      id: 'polaroid-6',
      src: '/photos/gallery-6.webp',
      caption: 'Our first hiking',
      date: 'Februari 2026',
      rotation: 5,
    },
    {
      id: 'polaroid-7',
      src: '/photos/gallery-7.webp',
      caption: 'Our first sunrise',
      date: 'Juni 2026',
      rotation: -6,
    },
    {
      id: 'polaroid-8',
      src: '/photos/gallery-8.webp',
      caption: 'First time together at the peak of mount. Agung 3242 mdpl',
      date: 'Juli 2026',
      rotation: 3,
    },
  ],

  // --- Favorite Person Section ---
  favoritePersonCaption: '“In a room full of art, I would still stare at you.”',
  favoritePersonSubtext: 'You are not just my priority—you are my whole world.',
  favoritePersonDate: 'Selamanya di Hatiku',
  favoritePersonLocation: 'Tempat Terindah Bersamamu',
  favoritePersonMedia: {
    src: '/photos/favorite.webp',
    type: 'image' as const,
  },

  // --- LAGU VINYL BARU: Daniel Caesar - Best Part ---
  song: {
    src: '/audio/song.mp3',
    title: 'Best Part',
    artist: 'Daniel Caesar ft. H.E.R.',
    album: 'Freudian (2017)',
    genre: 'R&B / Neo-Soul',
    reason: '“You’re the coffee that I need in the morning, you’re my sunshine in the rain when it’s pouring... If life is a movie, then you’re the best part.” Kamu selalu jadi bagian terbaik di setiap hariku.',
    coverSrc: '/photos/vinyl-center.webp',
  },

  // --- SCENE BARU: GALAKSI KENANGAN (20 Foto Orbit dengan Caption Kaya) ---
  galaxyTitle: 'Galaksi Kenangan Kita',
  galaxySubtitle: 'Setiap bintang adalah satu momen indah yang tak akan pernah kulupa',
  galaxyCorePhoto: '/photos/galaxy-core.webp',
  galaxyPhotos: [
    {
      id: 'galaxy-1',
      src: '/photos/galaxy-01.webp',
      caption: 'hehe our first date',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-2',
      src: '/photos/galaxy-02.webp',
      caption: 'seruu yahhh di nekoo awal awal',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-3',
      src: '/photos/galaxy-03.webp',
      caption: 'uuuuu for the first time aku ajak kinou',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-4',
      src: '/photos/galaxy-04.webp',
      caption: 'behh michel doang yg cakep',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-5',
      src: '/photos/galaxy-05.webp',
      caption: 'p abang',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-6',
      src: '/photos/galaxy-06.webp',
      caption: 'ututu after lomba climbing',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-7',
      src: '/photos/galaxy-07.webp',
      caption: 'Our first time SOS',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-8',
      src: '/photos/galaxy-08.webp',
      caption: 'Hmmm photo pulang ekstra',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-9',
      src: '/photos/galaxy-09.webp',
      caption: 'Enak jadi pengen makan sate lagii',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-10',
      src: '/photos/galaxy-10.webp',
      caption: 'gemeshh aja fotonya',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-11',
      src: '/photos/galaxy-11.webp',
      caption: 'iii nemenin sayangku jadi model',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-12',
      src: '/photos/galaxy-12.webp',
      caption: 'ee ini gtau sih biar jumpsacre aja',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-13',
      src: '/photos/galaxy-13.webp',
      caption: 'disini bubub cantik bgt',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-14',
      src: '/photos/galaxy-14.webp',
      caption: 'UUUU kbunshikkk niiii',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-15',
      src: '/photos/galaxy-15.webp',
      caption: 'After 15km?',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-16',
      src: '/photos/galaxy-16.webp',
      caption: 'MAM RAMENNNNN',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-17',
      src: '/photos/galaxy-17.webp',
      caption: 'Yey having fun with my fam',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-18',
      src: '/photos/galaxy-18.webp',
      caption: 'AGung DI BECEEEE',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-19',
      src: '/photos/galaxy-19.webp',
      caption: 'EDELWEISSS AAAAA',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-20',
      src: '/photos/galaxy-20.webp',
      caption: 'Hmmm dsni ngambek sih tapi yaudah',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-21',
      src: '/photos/galaxy-21.webp',
      caption: 'Putih abuuuuu',
      date: '',
      location: '',
    },
    {
      id: 'galaxy-22',
      src: '/photos/galaxy-22.webp',
      caption: 'Senyum roblokzxxzxzx',
      date: '',
      location: '',
    },
  ],

  // --- Penutup & Kontak ---
  closingMessage: 'Thank you for coming into this world and choosing me to be by your side. Happy birthday, my soulmate. This love will always be yours, forever..',
  whatsappNumber: '6281234567890',
  replyMessage: 'Sayang, aku sudah lihat galaksi kenangan dan website hadiahnya... makasih banyak yaa, aku terharu banget! I love you so much! 🥹🥰💕',

  // --- Open Graph / SEO Preview ---
  ogTitle: '💝 Hadiah Ulang Tahun Spesial Untukmu',
  ogDescription: 'Ada galaksi kenangan dan pesan rahasia yang dibuat khusus hanya untukmu. Buka sekarang yaa! 🎀',
  ogImage: '/photos/og-thumbnail.webp',

  envelopePhotoSrc: '/photos/envelope-reveal.webp',
};


