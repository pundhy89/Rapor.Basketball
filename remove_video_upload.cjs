const fs = require('fs');

let content = fs.readFileSync('src/components/Settings.tsx', 'utf8');

// We want to remove the video URL input
content = content.replace(/<div className="flex flex-col gap-2 mb-2">\s*<input\s*type="text"\s*placeholder="URL Video Background Utama \(Maks 3MB, MP4\)"\s*value=\{localSettings\.academy\.appBgVideoUrl \|\| ''\}\s*onChange=\{e => setLocalSettings\(\{\.\.\.localSettings, academy: \{\.\.\.localSettings\.academy, appBgVideoUrl: e\.target\.value\}\}\)\}\s*className="w-full border border-white\/20 dark:border-white\/20 rounded-lg p\.2\.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 bg-white\/50 dark:bg-black\/50 backdrop-blur-md text-sm"\s*\/>\s*<\/div>/g, '');

// The badge
content = content.replace(/\{localSettings\.academy\.appBgVideoUrl \? \(\s*<div className="h-12 w-20 bg-slate-800 rounded border border-white\/20 dark:border-white\/20 flex items-center justify-center text-xs font-bold text-white">VIDEO<\/div>\s*\) : null\}/g, '');

// The upload input for video
content = content.replace(/<label className="text-xs font-semibold mt-2">Upload Video \(MP4, Maks 3MB\)<\/label>\s*<input\s*type="file"\s*accept="video\/mp4,video\/webm"\s*onChange=\{async \(e\) => \{[\s\S]*?\}\}\s*className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"\s*\/>/g, '');

fs.writeFileSync('src/components/Settings.tsx', content);

