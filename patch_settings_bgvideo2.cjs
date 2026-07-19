const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Settings.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /<input\s+type="text"\s+placeholder="URL Gambar Background Utama \(Opsional\)"[\s\S]*?className="flex-1 text-sm text-white\/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white\/30 dark:bg-white\/5 file:text-white dark:text-blue-400 hover:file:bg-white\/50 dark:bg-white\/5"\s*\/>\s*<\/div>\s*<\/div>/g;

const replacement = `<input 
                type="text" 
                placeholder="URL Gambar Background Utama (Opsional)"
                value={localSettings.academy.appBgUrl || ''}
                onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, appBgUrl: e.target.value}})}
                className="w-full border border-white/20 dark:border-white/20 rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm mb-2"
              />
              <div className="flex flex-col gap-2 mb-2">
                <input 
                  type="text" 
                  placeholder="URL Video Background Utama (Maks 3MB, MP4)"
                  value={localSettings.academy.appBgVideoUrl || ''}
                  onChange={e => setLocalSettings({...localSettings, academy: {...localSettings.academy, appBgVideoUrl: e.target.value}})}
                  className="w-full border border-white/20 dark:border-white/20 rounded-lg p-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 bg-white/50 dark:bg-black/50 backdrop-blur-md text-sm"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-1">
                {localSettings.academy.appBgUrl ? (
                  <img src={localSettings.academy.appBgUrl} alt="App BG" className="h-12 object-cover rounded border border-white/20 dark:border-white/20" />
                ) : null}
                {localSettings.academy.appBgVideoUrl ? (
                  <div className="h-12 w-20 bg-slate-800 rounded border border-white/20 dark:border-white/20 flex items-center justify-center text-xs font-bold text-white">VIDEO</div>
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
                  <label className="text-xs font-semibold mt-2">Upload Video (MP4, Maks 3MB)</label>
                  <input 
                    type="file" 
                    accept="video/mp4,video/webm"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 3 * 1024 * 1024) {
                          alert('Ukuran video maksimal 3MB. Silakan kompres video terlebih dahulu.');
                          e.target.value = '';
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setLocalSettings({...localSettings, academy: {...localSettings.academy, appBgVideoUrl: event.target?.result as string, appBgUrl: ''}});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                </div>
              </div>
            </div>`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content);
