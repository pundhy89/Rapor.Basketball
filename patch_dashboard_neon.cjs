const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Dashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

const replacement = `  const menuItems = [
    { path: '/material', icon: BookOpen, label: 'Materi Dasar', desc: 'Panduan kurikulum & pilar akademi', color: 'text-pink-400', glow: 'drop-shadow-[0_0_10px_#f472b6] [text-shadow:0_0_10px_#f472b6]' },
    { path: '/schedule', icon: CalendarDays, label: 'Jadwal Latihan', desc: 'Jadwal rutin per kelas', color: 'text-yellow-400', glow: 'drop-shadow-[0_0_10px_#facc15] [text-shadow:0_0_10px_#facc15]' },
    { path: '/students', icon: Users, label: 'Data Siswa', desc: 'Kelola data dan level atlet', color: 'text-green-400', glow: 'drop-shadow-[0_0_10px_#4ade80] [text-shadow:0_0_10px_#4ade80]' },
    { path: '/coaches', icon: UserSquare, label: 'Data Coach', desc: 'Profil dan sertifikasi', color: 'text-cyan-400', glow: 'drop-shadow-[0_0_10px_#22d3ee] [text-shadow:0_0_10px_#22d3ee]' },
    { path: '/assessment', icon: Star, label: 'Penilaian & Absen', desc: 'Input nilai 5 pilar dan kehadiran', color: 'text-fuchsia-400', glow: 'drop-shadow-[0_0_10px_#e879f9] [text-shadow:0_0_10px_#e879f9]' },
    { path: '/evaluation', icon: FileText, label: 'Evaluasi Periode', desc: 'Catatan perkembangan akhir', color: 'text-orange-400', glow: 'drop-shadow-[0_0_10px_#fb923c] [text-shadow:0_0_10px_#fb923c]' },
    { path: '/report', icon: Trophy, label: 'Rapor Siswa', desc: 'Lihat hasil akhir penilaian', color: 'text-lime-400', glow: 'drop-shadow-[0_0_10px_#a3e635] [text-shadow:0_0_10px_#a3e635]' },
    { path: '/notifications', icon: Bell, label: 'Notifikasi', desc: 'Info & pengumuman terbaru', color: 'text-blue-400', glow: 'drop-shadow-[0_0_10px_#60a5fa] [text-shadow:0_0_10px_#60a5fa]' },
  ];`;

content = content.replace(/const menuItems = \[\s*\{ path: '\/material'.*\}[\s\S]*?\];/, replacement);

fs.writeFileSync(file, content);
