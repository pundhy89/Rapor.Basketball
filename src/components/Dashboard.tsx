import { Link } from 'react-router-dom';
import { Users, Star, FileText, UserSquare, ChevronRight, BookOpen, CalendarDays, Bell } from 'lucide-react';
import { useStore } from '../store';

export function Dashboard() {
  const menuItems = [
    { path: '/material', icon: BookOpen, label: 'Materi Dasar', desc: 'Panduan kurikulum & pilar akademi' },
    { path: '/schedule', icon: CalendarDays, label: 'Jadwal Latihan', desc: 'Jadwal rutin per kelas' },
    { path: '/students', icon: Users, label: 'Data Siswa', desc: 'Kelola data dan level atlet' },
    { path: '/coaches', icon: UserSquare, label: 'Data Coach', desc: 'Profil dan sertifikasi' },
    { path: '/assessment', icon: Star, label: 'Penilaian & Absen', desc: 'Input nilai 5 pilar dan kehadiran' },
    { path: '/evaluation', icon: FileText, label: 'Evaluasi Periode', desc: 'Catatan perkembangan akhir' },
    { path: '/report', icon: FileText, label: 'Rapor Siswa', desc: 'Lihat hasil akhir penilaian' },
    { path: '/notifications', icon: Bell, label: 'Notifikasi', desc: 'Info & pengumuman terbaru' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Featured Card */}
      <div className="relative bg-blue-600 dark:bg-blue-700 rounded-3xl p-8 text-white shadow-[0_10px_40px_rgba(37,99,235,0.3)] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/30 dark:bg-blue-500/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome, Coach</h2>
          <p className="text-blue-100/90 text-sm font-medium max-w-[200px]">Pilih menu di bawah untuk mengelola aktivitas academy.</p>
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
              className="group bg-white dark:bg-[#1A1C29] p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] flex items-center gap-5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <div className="bg-blue-50 dark:bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white tracking-tight">{item.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.desc}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-white" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
