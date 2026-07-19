import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Download, Save, Plus, Trash2, Database, AlertTriangle, CheckCircle, CloudUpload, CloudDownload, ArrowLeft , FileJson, UploadCloud} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EvaluationPeriod } from '../types';
import { cn } from './Layout';
import { calculateStudentScore } from '../utils/calculations';
import { generateSeedData } from '../utils/seedData';
import { initDrive, syncToDrive, restoreFromDrive } from '../lib/driveSync';

export function Settings() {
  const store = useStore();
  const navigate = useNavigate();
  const { settings, updateSettings, students, assessments, attendances, injectSeedData, resetData, setAllData } = store;
  const [localSettings, setLocalSettings] = useState(settings);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    initDrive(() => {
      console.log('Google Drive API ready');
    });
  }, []);

  
  const handleExportJSON = () => {
    const state = useStore.getState();
    const data = {
      students: state.students,
      coaches: state.coaches,
      assessments: state.assessments,
      attendances: state.attendances,
      evaluations: state.evaluations,
      settings: state.settings,
      schedules: state.schedules,
      notifications: state.notifications
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `akademi_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm('Apakah Anda yakin ingin menimpa semua data saat ini dengan data dari file backup?')) {
          setAllData(data);
          if (data.settings) setLocalSettings(data.settings);
          alert('Data berhasil dipulihkan!');
        }
      } catch (err) {
        alert('Format file backup tidak valid!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleBackupToDrive = () => {
    setSyncStatus('Memulai backup...');
    syncToDrive(store, (msg) => {
      setSyncStatus(msg);
      setTimeout(() => setSyncStatus(''), 5000);
    });
  };

  const handleRestoreFromDrive = () => {
    setSyncStatus('Memulai pemulihan...');
    restoreFromDrive((data) => {
      setAllData(data);
      if (data.settings) setLocalSettings(data.settings);
    }, (msg) => {
      setSyncStatus(msg);
      setTimeout(() => setSyncStatus(''), 5000);
    });
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleSimulateData = () => {
    const seed = generateSeedData(settings.activePeriodId);
    injectSeedData(seed);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    resetData();
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleAddPeriod = () => {
    const newPeriod: EvaluationPeriod = {
      id: crypto.randomUUID(),
      semester: '1',
      month: 'Januari - Juni',
      year: new Date().getFullYear().toString(),
    };
    setLocalSettings(prev => ({
      ...prev,
      periods: [...prev.periods, newPeriod]
    }));
  };

  const handleUpdatePeriod = (id: string, field: keyof EvaluationPeriod, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      periods: prev.periods.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleRemovePeriod = (id: string) => {
    setLocalSettings(prev => ({
      ...prev,
      periods: prev.periods.filter(p => p.id !== id),
      activePeriodId: prev.activePeriodId === id && prev.periods.length > 1 ? prev.periods.find(p => p.id !== id)?.id || '' : prev.activePeriodId
    }));
  };

  const handleDownloadCSV = () => {
    // Generate CSV for students and report summary
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Nama,Kelas,Nilai Pilar,Nilai Absensi,Nilai Akhir\n";

    students.forEach(student => {
      const stats = calculateStudentScore(student.id, assessments, attendances, settings);
      csvContent += `${student.studentId},${student.name},${student.classLevel},${stats.pilarScore.toFixed(2)},${stats.attScore.toFixed(2)},${stats.finalScore.toFixed(2)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const activePeriod = settings.periods.find(p => p.id === settings.activePeriodId);
    const periodName = activePeriod ? `${activePeriod.semester}_${activePeriod.year}` : 'Rapor';
    link.setAttribute("download", `Data_${periodName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-6 relative">
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-full border border-white/20 dark:border-white/20 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h2 className="text-2xl font-black text-purple-400 drop-shadow-[0_0_10px_#c084fc] [text-shadow:0_0_10px_#c084fc]">Pengaturan</h2>
      </div>

      {/* Academy Settings */}
      <div className="bg-transparent dark:bg-transparent backdrop-blur-md p-5 rounded-2xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] space-y-4">
        <h3 className="font-bold border-b pb-2">Profil Academy</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Judul / Nama Academy</label>
            <input 
              type="text" 
              value={localSettings.academy.name}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, name: e.target.value}})}
              className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Sub Judul</label>
            <input 
              type="text" 
              value={localSettings.academy.subtitle || ''}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, subtitle: e.target.value}})}
              className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-xs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Nama Kepala Academy</label>
            <input 
              type="text" 
              value={localSettings.academy.headName}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, headName: e.target.value}})}
              className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Nomor Kontak</label>
            <input 
              type="text" 
              value={localSettings.academy.phone}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, phone: e.target.value}})}
              className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Alamat</label>
            <textarea 
              value={localSettings.academy.address}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, address: e.target.value}})}
              className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm h-20 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Logo Academy</label>
            <div className="flex items-center gap-4">
              {localSettings.academy.logoUrl ? (
                <img src={localSettings.academy.logoUrl} alt="Logo" className="h-16 w-16 object-contain rounded-lg border border-white/20 dark:border-white/20 bg-transparent" />
              ) : (
                <div className="h-16 w-16 bg-transparent/60 dark:bg-slate-200/50 dark:bg-slate-800/50 rounded-lg border border-white/20 dark:border-white/20 flex items-center justify-center text-xs text-white/70">Kosong</div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const { compressImage } = await import('../utils/imageCompressor');
                      const compressed = await compressImage(file, 200, 200);
                      setLocalSettings({...localSettings, academy: {...localSettings.academy, logoUrl: compressed}});
                    } catch (err) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setLocalSettings({...localSettings, academy: {...localSettings.academy, logoUrl: event.target?.result as string}});
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }}
                className="flex-1 text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/30 dark:bg-white/5 file:text-white dark:text-blue-400 hover:file:bg-blue-100 dark:bg-blue-900/40"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Background Header</label>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white/90">Background Header (Opsional)</label>
              <input 
                type="text" 
                placeholder="URL Gambar Background (Opsional)"
                value={localSettings.academy.headerBgUrl || ''}
                onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, headerBgUrl: e.target.value}})}
                className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm"
              />
              <div className="flex items-center gap-4 mt-1">
                {localSettings.academy.headerBgUrl ? (
                  <img src={localSettings.academy.headerBgUrl} alt="Header BG" className="h-12 object-cover rounded border border-white/20 dark:border-white/20" />
                ) : null}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const { compressImage } = await import('../utils/imageCompressor');
                        const compressed = await compressImage(file, 1000, 1000);
                        setLocalSettings({...localSettings, academy: {...localSettings.academy, headerBgUrl: compressed}});
                      } catch (err) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setLocalSettings({...localSettings, academy: {...localSettings.academy, headerBgUrl: event.target?.result as string}});
                        };
                        reader.readAsDataURL(file);
                      }
                    }
                  }}
                  className="flex-1 text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/30 dark:bg-white/5 file:text-white dark:text-blue-400 hover:file:bg-white/50 dark:bg-white/5"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="text-xs font-bold text-white/90">Background Utama App (Opsional)</label>
              <input 
                type="text" 
                placeholder="URL Gambar Background Utama (Opsional)"
                value={localSettings.academy.appBgUrl || ''}
                onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, appBgUrl: e.target.value}})}
                className="w-full border border-white/20 dark:border-white/20 rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm mb-2"
              />
              <div className="flex flex-wrap items-center gap-4 mt-1">
                {localSettings.academy.appBgUrl ? (
                  <img src={localSettings.academy.appBgUrl} alt="App BG" className="h-12 object-cover rounded border border-white/20 dark:border-white/20" />
                ) : null}
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold">Upload Gambar (JPG/PNG)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const { compressImage } = await import('../utils/imageCompressor');
                          const compressed = await compressImage(file, 2000, 2000); 
                          setLocalSettings({...localSettings, academy: {...localSettings.academy, appBgUrl: compressed, appBgVideoUrl: ''}});
                        } catch (err) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setLocalSettings({...localSettings, academy: {...localSettings.academy, appBgUrl: event.target?.result as string, appBgVideoUrl: ''}});
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Rasio Header</label>
            <select
              value={localSettings.academy.headerRatio || '4320x1056'}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, headerRatio: e.target.value as any}})}
              className="w-full border border-white/20 dark:border-white/20  bg-transparent dark:bg-transparent backdrop-blur-md rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm"
            >
              <option value="4320x729">4320 x 729</option>
              <option value="4320x1056">4320 x 1056</option>
              <option value="4320x2832">4320 x 2832</option>
            </select>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-white/90">Background Music (BGM)</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-white/70 font-medium">Suara Klik UI</span>
                <input 
                  type="checkbox"
                  checked={localSettings.clickSoundEnabled || false}
                  onChange={(e) => setLocalSettings({...localSettings, clickSoundEnabled: e.target.checked})}
                  className="rounded text-white w-4 h-4"
                />
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                accept="audio/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []) as File[];
                  if (files.length > 0) {
                    const newBgms = [...(localSettings.bgmList || [])];
                    files.forEach((file: File) => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        newBgms.push({
                          id: Math.random().toString(36).substr(2, 9),
                          name: file.name,
                          url: event.target?.result as string
                        });
                        setLocalSettings({...localSettings, bgmList: [...newBgms]});
                      };
                      reader.readAsDataURL(file);
                    });
                  }
                }}
                className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/30 dark:bg-white/5 file:text-white dark:text-blue-400 hover:file:bg-blue-100 dark:bg-blue-900/40"
              />
              <div className="space-y-2 mt-2">
                {(localSettings.bgmList || []).map((bgm, index) => (
                  <div key={bgm.id} className="flex items-center justify-between bg-transparent p-2 rounded-lg border border-white/20 dark:border-white/20">
                    <span className="text-xs text-white/90 font-medium truncate w-3/4">{index + 1}. {bgm.name}</span>
                    <button 
                      onClick={() => {
                        const newList = (localSettings.bgmList || []).filter(item => item.id !== bgm.id);
                        setLocalSettings({...localSettings, bgmList: newList});
                      }}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                {(localSettings.bgmList || []).length > 1 && (
                  <p className="text-[10px] text-white/70 italic mt-1">* BGM akan diputar secara acak</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Periods */}
      <div className="bg-transparent dark:bg-transparent backdrop-blur-md p-5 rounded-2xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold">Periode Evaluasi</h3>
          <button onClick={handleAddPeriod} className="text-white dark:text-white flex items-center gap-1 text-sm font-semibold hover:bg-white/30 dark:bg-white/5 px-2 py-1 rounded-lg">
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
        
        <div className="space-y-4">
          {localSettings.periods.map((period) => (
            <div key={period.id} className={cn("p-4 rounded-xl border relative", localSettings.activePeriodId === period.id ? "bg-white/30 dark:bg-white/5 border-blue-200 dark:border-blue-800" : "bg-transparent border-white/20 dark:border-white/20")}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Semester</label>
                  <input type="text" value={period.semester} onChange={(e) => handleUpdatePeriod(period.id, 'semester', e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md bg-transparent dark:bg-transparent backdrop-blur-md" placeholder="Contoh: Ganjil" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Tahun</label>
                  <input type="text" value={period.year} onChange={(e) => handleUpdatePeriod(period.id, 'year', e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md bg-transparent dark:bg-transparent backdrop-blur-md" placeholder="2026" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Bulan</label>
                <input type="text" value={period.month} onChange={(e) => handleUpdatePeriod(period.id, 'month', e.target.value)} className="w-full border border-white/20 dark:border-white/20  rounded-lg p-2 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md bg-transparent dark:bg-transparent backdrop-blur-md" placeholder="Contoh: Januari - Juni" />
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/20 dark:border-white/20">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="activePeriod" 
                    checked={localSettings.activePeriodId === period.id} 
                    onChange={() => setLocalSettings({...localSettings, activePeriodId: period.id})}
                    className="text-white dark:text-white focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-white/90">Set sebagai aktif</span>
                </label>
                <button onClick={() => handleRemovePeriod(period.id)} className="text-white/70 hover:text-white p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {localSettings.periods.length === 0 && (
            <p className="text-sm text-center text-white/70 py-2">Belum ada periode. Silakan tambah.</p>
          )}
        </div>
      </div>

      <div className="bg-transparent dark:bg-transparent backdrop-blur-md p-5 rounded-2xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] space-y-4">
        <h3 className="font-bold border-b pb-2">Bobot Penilaian (%)</h3>
        
        <div className="space-y-3">
          {(Object.keys(localSettings.weights) as Array<keyof typeof localSettings.weights>).map(key => (
            <div key={key} className="flex justify-between items-center">
              <label className="text-sm font-medium capitalize text-white/90">{key}</label>
              <input 
                type="number" 
                value={localSettings.weights[key]}
                onChange={e => setLocalSettings({
                  ...localSettings, 
                  weights: { ...localSettings.weights, [key]: Number(e.target.value) }
                })}
                className="w-20 border border-white/20 dark:border-white/20  rounded-lg p-2 text-center text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400/20 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] bg-white/50 dark:bg-black/50 backdrop-blur-md"
              />
            </div>
          ))}
        </div>

        <button onClick={handleSave} className="w-full bg-slate-800 dark:bg-slate-200 text-white text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4 active:bg-blue-700">
          <Save className="w-5 h-5" /> Simpan Pengaturan
        </button>
      </div>

      <div className="bg-transparent dark:bg-transparent backdrop-blur-md p-5 rounded-2xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] space-y-4">
        <h3 className="font-bold border-b pb-2">Admin & Database</h3>
        
        <div className="space-y-3">
          <div className="p-4 bg-white/30 dark:bg-white/5 rounded-xl border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Google Drive Sync</h4>
                <p className="text-xs text-white dark:text-blue-300">Backup dan restore data ke akun Google Drive Anda.</p>
              </div>
              {syncStatus && (
                <span className="text-xs font-medium text-white bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full animate-pulse">{syncStatus}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleBackupToDrive} className="w-full bg-slate-800 dark:bg-slate-200 hover:bg-slate-700 dark:hover:bg-slate-300 text-white text-white font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
                <CloudUpload className="w-4 h-4" /> Backup ke Drive
              </button>
              <button onClick={handleRestoreFromDrive} className="w-full bg-white/50 dark:bg-white/5 hover:bg-transparent text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm border border-blue-200 transition-colors">
                <CloudDownload className="w-4 h-4" /> Restore dari Drive
              </button>
            </div>
          </div>

          
          <div className="p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
            <h4 className="font-bold text-white mb-1">Local Backup (.JSON)</h4>
            <p className="text-xs text-white mb-3">Download semua pengaturan dan data ke file JSON untuk dipindahkan ke domain lain (misal: Github Pages).</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleExportJSON} className="w-full bg-slate-800 dark:bg-slate-200 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors hover:bg-slate-700">
                <FileJson className="w-4 h-4" /> Export Backup
              </button>
              <label className="w-full bg-blue-600/50 hover:bg-blue-600/70 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm border border-blue-400/30 transition-colors cursor-pointer">
                <UploadCloud className="w-4 h-4" /> Import Backup
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>
          </div>

          <div className="p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
            <h4 className="font-bold text-white mb-1">Export Data CSV</h4>
            <p className="text-xs text-white mb-3">Download semua data rapor siswa dalam format Spreadsheet (CSV).</p>
            <button onClick={handleDownloadCSV} className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 active:bg-emerald-700 text-sm transition-colors">
              <Download className="w-4 h-4" /> Download Database CSV
            </button>
          </div>

          <div className="p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
            <h4 className="font-bold text-white mb-1">Simulasi Data (Testing)</h4>
            <p className="text-xs text-white mb-3">Generate 20 siswa, 4 coach, dan histori nilai acak untuk melihat cara kerja sistem ranking.</p>
            <button onClick={handleSimulateData} className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 active:bg-purple-700 text-sm transition-colors">
              <Database className="w-4 h-4" /> Generate Dummy Data
            </button>
          </div>

          <div className="p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">
            <h4 className="font-bold text-white mb-1">Reset Database</h4>
            <p className="text-xs text-white mb-3">Hapus permanen semua data siswa, nilai, absen, coach, dan evaluasi. Hati-hati!</p>
            <button onClick={handleResetData} className="w-full bg-slate-800 dark:bg-slate-200 text-white text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 active:bg-blue-700 text-sm transition-colors">
              <AlertTriangle className="w-4 h-4" /> Reset Semua Data
            </button>
          </div>
        </div>
      </div>

      {showSaveSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white/50 dark:bg-black/50 backdrop-blur-md text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-top-4 z-50">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Aksi berhasil dilakukan</span>
        </div>
      )}
    </div>
  );
}
