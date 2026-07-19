const fs = require('fs');

const code = `import React, { useState } from 'react';
import { ArrowLeft, Bell, Info, CheckCircle, AlertTriangle, Plus, MessageCircle, X, Save, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from './Layout';
import { useStore } from '../store';
import { NotificationMessage } from '../types';

export function Notifications() {
  const { notifications, addNotification, updateNotification, deleteNotification, settings } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NotificationMessage>>({
    type: 'info',
    title: '',
    message: '',
    time: 'Baru saja'
  });

  const handleOpenModal = (notif?: NotificationMessage) => {
    if (notif) {
      setEditingId(notif.id);
      setFormData(notif);
    } else {
      setEditingId(null);
      setFormData({
        type: 'info',
        title: '',
        message: '',
        time: 'Baru saja',
        isNew: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.message) return;
    
    if (editingId) {
      updateNotification(formData as NotificationMessage);
    } else {
      addNotification({
        ...formData,
        id: Date.now().toString(),
        isNew: true
      } as NotificationMessage);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (editingId) {
      deleteNotification(editingId);
      setIsModalOpen(false);
    }
  };

  const shareToWhatsApp = (notif: NotificationMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = \`*\${notif.title}*\\n\\n\${notif.message}\\n\\n---\\nUntuk membalas, silakan hubungi: https://wa.me/\${settings.academy.phone.replace(/\\D/g, '')}\`;
    window.open(\`https://wa.me/?text=\${encodeURIComponent(text)}\`, '_blank');
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center justify-between sticky top-0 bg-transparent z-10 py-2 gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 bg-transparent dark:bg-transparent backdrop-blur-md border border-white/20 dark:border-white/20 rounded-full hover:bg-white/50 dark:bg-white/5 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
            <ArrowLeft className="w-5 h-5 text-white/90" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide leading-tight">Notifikasi</h2>
            <p className="text-xs text-white/70 font-medium">Informasi & Pengumuman</p>
          </div>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="p-2 bg-blue-600/80 text-white rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-white/20 hover:bg-blue-500 transition-colors flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {(!notifications || notifications.length === 0) ? (
          <div className="bg-transparent dark:bg-transparent backdrop-blur-md p-8 rounded-2xl border border-gray-100 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
            <Bell className="w-12 h-12 text-white/90 mx-auto mb-3" />
            <p className="text-white/70 font-medium">Belum ada notifikasi baru.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isInfo = notif.type === 'info';
            const isSuccess = notif.type === 'success';
            const isWarning = notif.type === 'warning';
            
            return (
              <div 
                key={notif.id} 
                onClick={() => handleOpenModal(notif)}
                className={cn(
                  "bg-transparent dark:bg-transparent backdrop-blur-md p-4 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] border flex gap-4 relative overflow-hidden cursor-pointer hover:bg-white/5 dark:hover:bg-slate-800/50 transition-colors",
                  notif.isNew ? "border-blue-400 dark:border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "border-white/20 dark:border-white/10"
                )}
              >
                {notif.isNew && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full m-3 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                  isInfo && "bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-blue-400/50",
                  isSuccess && "bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/50",
                  isWarning && "bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-400/50"
                )}>
                  {isInfo && <Info className="w-6 h-6 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                  {isSuccess && <CheckCircle className="w-6 h-6 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                  {isWarning && <AlertTriangle className="w-6 h-6 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="font-bold text-white tracking-wide text-sm">{notif.title}</h3>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed mb-3 pr-4 line-clamp-2">{notif.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-white/50">{notif.time}</span>
                    <button 
                      onClick={(e) => shareToWhatsApp(notif, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-300 rounded-lg text-xs font-semibold hover:bg-green-500/30 transition-colors border border-green-500/30"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WA
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1f2937] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Edit Notifikasi' : 'Notifikasi Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-white/70">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Judul</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Contoh: Jadwal Latihan"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Isi Pesan</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 min-h-[100px]"
                  placeholder="Ketik pesan..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Tipe</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">Status</label>
                  <select 
                    value={formData.isNew ? 'new' : 'read'}
                    onChange={(e) => setFormData({...formData, isNew: e.target.value === 'new'})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none"
                  >
                    <option value="new">Baru</option>
                    <option value="read">Dibaca</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
              {editingId ? (
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl font-bold text-sm hover:bg-red-500/30 flex items-center gap-2 transition-colors border border-red-500/30"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              ) : <div></div>}
              
              <button 
                onClick={handleSave}
                disabled={!formData.title || !formData.message}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/Notifications.tsx', code);
console.log('patched Notifications.tsx');
