const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Dashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

const replacement = `  const menuItems = [
    { path: '/material', icon: BookOpen, label: 'Materi Dasar', desc: 'Panduan kurikulum & pilar akademi', color: 'text-pink-400', glow: 'drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]' },
    { path: '/schedule', icon: CalendarDays, label: 'Jadwal Latihan', desc: 'Jadwal rutin per kelas', color: 'text-yellow-400', glow: 'drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' },
    { path: '/students', icon: Users, label: 'Data Siswa', desc: 'Kelola data dan level atlet', color: 'text-green-400', glow: 'drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]' },
    { path: '/coaches', icon: UserSquare, label: 'Data Coach', desc: 'Profil dan sertifikasi', color: 'text-cyan-400', glow: 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' },
    { path: '/assessment', icon: Star, label: 'Penilaian & Absen', desc: 'Input nilai 5 pilar dan kehadiran', color: 'text-fuchsia-400', glow: 'drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]' },
    { path: '/evaluation', icon: FileText, label: 'Evaluasi Periode', desc: 'Catatan perkembangan akhir', color: 'text-orange-400', glow: 'drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]' },
    { path: '/report', icon: Trophy, label: 'Rapor Siswa', desc: 'Lihat hasil akhir penilaian', color: 'text-lime-400', glow: 'drop-shadow-[0_0_8px_rgba(163,230,53,0.8)]' },
    { path: '/notifications', icon: Bell, label: 'Notifikasi', desc: 'Info & pengumuman terbaru', color: 'text-blue-400', glow: 'drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' },
  ];`;

content = content.replace(/const menuItems = \[\s*\{ path: '\/material'.*\}[\s\S]*?\];/, replacement);

content = content.replace(/<Icon className="w-7 h-7 text-white drop-shadow-sm" \/>/, `<Icon className={\`w-7 h-7 \${item.color} \${item.glow}\`} />`);
content = content.replace(/<h3 className="font-bold text-white tracking-wide">\{item.label\}<\/h3>/, `<h3 className={\`font-bold \${item.color} \${item.glow} tracking-wide\`}>{item.label}</h3>`);
content = content.replace(/group-hover:bg-slate-800 dark:group-hover:bg-slate-200/, `group-hover:bg-slate-800 dark:group-hover:bg-white/10`);

fs.writeFileSync(file, content);
