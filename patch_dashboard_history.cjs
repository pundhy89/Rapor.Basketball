const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

if (!code.includes('Archive,')) {
    code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, Archive } from 'lucide-react';");
}

code = code.replace(
  "{ path: '/assessment', icon: Star, label: 'Penilaian & Absen', desc: 'Input nilai 5 pilar dan kehadiran', color: 'text-fuchsia-400', glow: 'drop-shadow-[0_0_10px_#e879f9] [text-shadow:0_0_10px_#e879f9]' },",
  "{ path: '/assessment', icon: Star, label: 'Penilaian & Absen', desc: 'Input nilai 5 pilar dan kehadiran', color: 'text-fuchsia-400', glow: 'drop-shadow-[0_0_10px_#e879f9] [text-shadow:0_0_10px_#e879f9]' },\n    { path: '/history', icon: Archive, label: 'Log & History', desc: 'Riwayat absensi dan penilaian harian siswa', color: 'text-indigo-400', glow: 'drop-shadow-[0_0_10px_#818cf8] [text-shadow:0_0_10px_#818cf8]' },"
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log('Done');
