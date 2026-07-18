import { ArrowLeft, Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from './Layout';

export function Notifications() {
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'Pendaftaran Turnamen Dibuka',
      message: 'Pendaftaran untuk turnamen kelompok umur 15 tahun ke bawah telah dibuka. Silakan hubungi Coach untuk pendaftaran.',
      time: '2 jam yang lalu',
      isNew: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Hasil Evaluasi Periode Lalu',
      message: 'Rapor hasil evaluasi periode 1 telah selesai dicetak dan dapat diambil di admin academy.',
      time: '1 hari yang lalu',
      isNew: true
    },
    {
      id: 3,
      type: 'warning',
      title: 'Perubahan Jadwal Latihan',
      message: 'Jadwal latihan SMP hari Kamis dimajukan menjadi pukul 16:00 karena ada perbaikan lampu GOR.',
      time: '2 hari yang lalu',
      isNew: false
    },
    {
      id: 4,
      type: 'info',
      title: 'Sparing Partner SMA',
      message: 'Akan ada pertandingan persahabatan melawan SMA Negeri 1 pada hari Minggu pagi pukul 08:00.',
      time: '5 hari yang lalu',
      isNew: false
    }
  ];

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-3 sticky top-0 bg-gray-50 dark:bg-[#151720] z-10 py-2">
        <Link to="/" className="p-2 bg-white dark:bg-[#1A1C29] border border-gray-200 dark:border-gray-800 rounded-full hover:bg-gray-100 dark:bg-white/5 transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </Link>
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">Notifikasi</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Informasi dan pengumuman terbaru</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white dark:bg-[#1A1C29] p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
            <Bell className="w-12 h-12 text-gray-700 dark:text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada notifikasi baru.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isInfo = notif.type === 'info';
            const isSuccess = notif.type === 'success';
            const isWarning = notif.type === 'warning';

            return (
              <div 
                key={notif.id} 
                className={cn(
                  "bg-white dark:bg-[#1A1C29] p-4 rounded-xl shadow-sm border flex gap-4 relative overflow-hidden",
                  notif.isNew ? "border-blue-200 dark:border-blue-800" : "border-gray-100"
                )}
              >
                {notif.isNew && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-blue-50 dark:bg-blue-900/200 rounded-full m-3" />
                )}
                
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  isInfo && "bg-blue-50 text-blue-600",
                  isSuccess && "bg-green-50 text-green-600",
                  isWarning && "bg-amber-50 text-amber-600"
                )}>
                  {isInfo && <Info className="w-5 h-5" />}
                  {isSuccess && <CheckCircle className="w-5 h-5" />}
                  {isWarning && <AlertTriangle className="w-5 h-5" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{notif.title}</h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-2 pr-4">{notif.message}</p>
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{notif.time}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
