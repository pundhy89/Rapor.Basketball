const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

if (!code.includes('notifications: NotificationMessage[];')) {
  // Add to AppState interface
  code = code.replace(/interface AppState \{/, "import { NotificationMessage } from './types';\n\ninterface AppState {\n  notifications: NotificationMessage[];\n  addNotification: (n: NotificationMessage) => void;\n  updateNotification: (n: NotificationMessage) => void;\n  deleteNotification: (id: string) => void;");
  
  // Add to initial state
  const defaultNotifs = `
  notifications: [
    {
      id: '1',
      type: 'info',
      title: 'Pendaftaran Turnamen Dibuka',
      message: 'Pendaftaran untuk turnamen kelompok umur 15 tahun ke bawah telah dibuka. Silakan hubungi Coach untuk pendaftaran.',
      time: '2 jam yang lalu',
      isNew: true
    },
    {
      id: '2',
      type: 'success',
      title: 'Hasil Evaluasi Periode Lalu',
      message: 'Rapor hasil evaluasi periode 1 telah selesai dicetak dan dapat diambil di admin academy.',
      time: '1 hari yang lalu',
      isNew: true
    },
    {
      id: '3',
      type: 'warning',
      title: 'Perubahan Jadwal Latihan',
      message: 'Jadwal latihan SMP hari Kamis dimajukan menjadi pukul 16:00 karena ada perbaikan lampu GOR.',
      time: '2 hari yang lalu',
      isNew: false
    },
    {
      id: '4',
      type: 'info',
      title: 'Sparing Partner SMA',
      message: 'Akan ada pertandingan persahabatan melawan SMA Negeri 1 pada hari Minggu pagi pukul 08:00.',
      time: '5 hari yang lalu',
      isNew: false
    }
  ],
  addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
  updateNotification: (notification) => set((state) => ({ notifications: state.notifications.map(n => n.id === notification.id ? notification : n) })),
  deleteNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
`;
  
  code = code.replace(/students: \[\],/, defaultNotifs + "\n  students: [],");
  
  fs.writeFileSync('src/store.ts', code);
  console.log('patched store.ts');
}
