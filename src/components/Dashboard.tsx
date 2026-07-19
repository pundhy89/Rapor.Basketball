import { Link } from 'react-router-dom';
import { Users, Star, FileText, UserSquare, ChevronRight, BookOpen, CalendarDays, Bell, Trophy } from 'lucide-react';
import { useStore } from '../store';

export function Dashboard() {
      const menuItems = [
    { path: '/material', icon: BookOpen, label: 'Materi Dasar', desc: 'Panduan kurikulum & pilar akademi', color: 'text-pink-400', glow: 'drop-shadow-[0_0_10px_#f472b6] [text-shadow:0_0_10px_#f472b6]' },
    { path: '/schedule', icon: CalendarDays, label: 'Jadwal Latihan', desc: 'Jadwal rutin per kelas', color: 'text-yellow-400', glow: 'drop-shadow-[0_0_10px_#facc15] [text-shadow:0_0_10px_#facc15]' },
    { path: '/students', icon: Users, label: 'Data Siswa', desc: 'Kelola data dan level atlet', color: 'text-green-400', glow: 'drop-shadow-[0_0_10px_#4ade80] [text-shadow:0_0_10px_#4ade80]' },
    { path: '/coaches', icon: UserSquare, label: 'Data Coach', desc: 'Profil dan sertifikasi', color: 'text-cyan-400', glow: 'drop-shadow-[0_0_10px_#22d3ee] [text-shadow:0_0_10px_#22d3ee]' },
    { path: '/assessment', icon: Star, label: 'Penilaian & Absen', desc: 'Input nilai 5 pilar dan kehadiran', color: 'text-fuchsia-400', glow: 'drop-shadow-[0_0_10px_#e879f9] [text-shadow:0_0_10px_#e879f9]' },
    { path: '/evaluation', icon: FileText, label: 'Evaluasi Periode', desc: 'Catatan perkembangan akhir', color: 'text-orange-400', glow: 'drop-shadow-[0_0_10px_#fb923c] [text-shadow:0_0_10px_#fb923c]' },
    { path: '/report', icon: Trophy, label: 'Rapor Siswa', desc: 'Lihat hasil akhir penilaian', color: 'text-lime-400', glow: 'drop-shadow-[0_0_10px_#a3e635] [text-shadow:0_0_10px_#a3e635]' },
    { path: '/notifications', icon: Bell, label: 'Notifikasi', desc: 'Info & pengumuman terbaru', color: 'text-blue-400', glow: 'drop-shadow-[0_0_10px_#60a5fa] [text-shadow:0_0_10px_#60a5fa]' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Featured Card */}
      <div className="relative bg-transparent dark:bg-transparent backdrop-blur-md rounded-3xl p-8 text-white border-[2px] border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 dark:bg-blue-400/5 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        {/* Decorative elements */}
        <div className="absolute -left-2 top-10 w-4 h-16 bg-slate-800 dark:bg-slate-200 shadow-sm rounded-r-md pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 tracking-wider text-white drop-shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">Welcome, Coach</h2>
          <p className="text-white/90/90 text-sm font-semibold max-w-[200px] tracking-wide">Pilih menu di bawah untuk mengelola aktivitas academy.</p>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="group bg-transparent dark:bg-transparent backdrop-blur-md p-5 rounded-3xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] flex items-center gap-5 hover:border-white/80 dark:hover:border-white/30/60 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 dark:via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
              
              <div className="bg-white/5 dark:bg-white/5 border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 group-hover:text-white group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] transition-all duration-300">
                <Icon className={`w-7 h-7 ${item.color} ${item.glow}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${item.color} ${item.glow} tracking-wide`}>{item.label}</h3>
                <p className="text-xs text-white/70 font-semibold">{item.desc}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 dark:bg-white/5 border border-white/20 dark:border-white/20 flex items-center justify-center group-hover:bg-slate-800 dark:group-hover:bg-white/10 group-hover:border-white/80 dark:hover:border-white/30 transition-colors duration-300">
                <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-white dark:group-hover:text-white" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
