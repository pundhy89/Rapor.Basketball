import { useStore } from '../store';
import { Download, Save, Plus, Trash2, Database, AlertTriangle, CheckCircle, CloudUpload, CloudDownload, ArrowLeft } from 'lucide-react';
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
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <h2 className="text-xl font-bold">Pengaturan</h2>
      </div>

      {/* Academy Settings */}
      <div className="bg-white dark:bg-[#1A1C29] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="font-bold border-b pb-2">Profil Academy</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Judul / Nama Academy</label>
            <input 
              type="text" 
              value={localSettings.academy.name}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, name: e.target.value}})}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sub Judul</label>
            <input 
              type="text" 
              value={localSettings.academy.subtitle || ''}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, subtitle: e.target.value}})}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-xs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Kepala Academy</label>
            <input 
              type="text" 
              value={localSettings.academy.headName}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, headName: e.target.value}})}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor Kontak</label>
            <input 
              type="text" 
              value={localSettings.academy.phone}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, phone: e.target.value}})}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat</label>
            <textarea 
              value={localSettings.academy.address}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, address: e.target.value}})}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm h-20 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo Academy</label>
            <div className="flex items-center gap-4">
              {localSettings.academy.logoUrl ? (
                <img src={localSettings.academy.logoUrl} alt="Logo" className="h-16 w-16 object-contain rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#151720]" />
              ) : (
                <div className="h-16 w-16 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">Kosong</div>
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
                className="flex-1 text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:bg-blue-900/20 file:text-blue-700 dark:text-blue-400 hover:file:bg-blue-100 dark:bg-blue-900/40"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background Header</label>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="URL Gambar Background (Opsional)"
                value={localSettings.academy.headerBgUrl || ''}
                onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, headerBgUrl: e.target.value}})}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm"
              />
              <div className="flex items-center gap-4 mt-1">
                {localSettings.academy.headerBgUrl ? (
                  <img src={localSettings.academy.headerBgUrl} alt="Header BG" className="h-12 object-cover rounded border border-gray-200 dark:border-gray-800" />
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
                  className="flex-1 text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:bg-blue-900/20 file:text-blue-700 dark:text-blue-400 hover:file:bg-blue-100 dark:bg-blue-900/40"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rasio Header</label>
            <select
              value={localSettings.academy.headerRatio || '4320x1056'}
              onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, headerRatio: e.target.value as any}})}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1A1C29] rounded-lg p-2.5 outline-none focus:border-blue-500 text-sm"
            >
              <option value="4320x729">4320 x 729</option>
              <option value="4320x1056">4320 x 1056</option>
              <option value="4320x2832">4320 x 2832</option>
            </select>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Background Music (BGM)</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-gray-500 font-medium">Suara Klik UI</span>
                <input 
                  type="checkbox"
                  checked={localSettings.clickSoundEnabled || false}
                  onChange={(e) => setLocalSettings({...localSettings, clickSoundEnabled: e.target.checked})}
                  className="rounded text-blue-600 w-4 h-4"
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
                className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:bg-blue-900/20 file:text-blue-700 dark:text-blue-400 hover:file:bg-blue-100 dark:bg-blue-900/40"
              />
              <div className="space-y-2 mt-2">
                {(localSettings.bgmList || []).map((bgm, index) => (
                  <div key={bgm.id} className="flex items-center justify-between bg-gray-50 dark:bg-[#151720] p-2 rounded-lg border border-gray-200 dark:border-gray-800">
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate w-3/4">{index + 1}. {bgm.name}</span>
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
                  <p className="text-[10px] text-gray-500 italic mt-1">* BGM akan diputar secara acak</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Periods */}
      <div className="bg-white dark:bg-[#1A1C29] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold">Periode Evaluasi</h3>
          <button onClick={handleAddPeriod} className="text-blue-600 dark:text-blue-500 flex items-center gap-1 text-sm font-semibold hover:bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
        
        <div className="space-y-4">
          {localSettings.periods.map((period) => (
            <div key={period.id} className={cn("p-4 rounded-xl border relative", localSettings.activePeriodId === period.id ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : "bg-gray-50 dark:bg-[#151720] border-gray-200 dark:border-gray-800")}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Semester</label>
                  <input type="text" value={period.semester} onChange={(e) => handleUpdatePeriod(period.id, 'semester', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm outline-none focus:border-blue-500 bg-white dark:bg-[#1A1C29]" placeholder="Contoh: Ganjil" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tahun</label>
                  <input type="text" value={period.year} onChange={(e) => handleUpdatePeriod(period.id, 'year', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm outline-none focus:border-blue-500 bg-white dark:bg-[#1A1C29]" placeholder="2026" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Bulan</label>
                <input type="text" value={period.month} onChange={(e) => handleUpdatePeriod(period.id, 'month', e.target.value)} className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm outline-none focus:border-blue-500 bg-white dark:bg-[#1A1C29]" placeholder="Contoh: Januari - Juni" />
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="activePeriod" 
                    checked={localSettings.activePeriodId === period.id} 
                    onChange={() => setLocalSettings({...localSettings, activePeriodId: period.id})}
                    className="text-blue-600 dark:text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Set sebagai aktif</span>
                </label>
                <button onClick={() => handleRemovePeriod(period.id)} className="text-gray-500 dark:text-gray-400 hover:text-blue-500 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {localSettings.periods.length === 0 && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-2">Belum ada periode. Silakan tambah.</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1C29] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="font-bold border-b pb-2">Bobot Penilaian (%)</h3>
        
        <div className="space-y-3">
          {(Object.keys(localSettings.weights) as Array<keyof typeof localSettings.weights>).map(key => (
            <div key={key} className="flex justify-between items-center">
              <label className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">{key}</label>
              <input 
                type="number" 
                value={localSettings.weights[key]}
                onChange={e => setLocalSettings({
                  ...localSettings, 
                  weights: { ...localSettings.weights, [key]: Number(e.target.value) }
                })}
                className="w-20 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-center text-sm outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>

        <button onClick={handleSave} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4 active:bg-blue-700">
          <Save className="w-5 h-5" /> Simpan Pengaturan
        </button>
      </div>

      <div className="bg-white dark:bg-[#1A1C29] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="font-bold border-b pb-2">Admin & Database</h3>
        
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Google Drive Sync</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">Backup dan restore data ke akun Google Drive Anda.</p>
              </div>
              {syncStatus && (
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full animate-pulse">{syncStatus}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleBackupToDrive} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors">
                <CloudUpload className="w-4 h-4" /> Backup ke Drive
              </button>
              <button onClick={handleRestoreFromDrive} className="w-full bg-white hover:bg-gray-50 text-blue-700 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm border border-blue-200 transition-colors">
                <CloudDownload className="w-4 h-4" /> Restore dari Drive
              </button>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <h4 className="font-semibold text-emerald-900 mb-1">Export Data</h4>
            <p className="text-xs text-emerald-700 mb-3">Download semua data rapor siswa dalam format Spreadsheet (CSV).</p>
            <button onClick={handleDownloadCSV} className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 active:bg-emerald-700 text-sm transition-colors">
              <Download className="w-4 h-4" /> Download Database CSV
            </button>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <h4 className="font-semibold text-purple-900 mb-1">Simulasi Data (Testing)</h4>
            <p className="text-xs text-purple-700 mb-3">Generate 20 siswa, 4 coach, dan histori nilai acak untuk melihat cara kerja sistem ranking.</p>
            <button onClick={handleSimulateData} className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 active:bg-purple-700 text-sm transition-colors">
              <Database className="w-4 h-4" /> Generate Dummy Data
            </button>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-blue-900 mb-1">Reset Database</h4>
            <p className="text-xs text-blue-700 dark:text-blue-400 mb-3">Hapus permanen semua data siswa, nilai, absen, coach, dan evaluasi. Hati-hati!</p>
            <button onClick={handleResetData} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 active:bg-blue-700 text-sm transition-colors">
              <AlertTriangle className="w-4 h-4" /> Reset Semua Data
            </button>
          </div>
        </div>
      </div>

      {showSaveSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-4 z-50">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Aksi berhasil dilakukan</span>
        </div>
      )}
    </div>
  );
}
