const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Settings.tsx');
let content = fs.readFileSync(file, 'utf8');

// Back button
content = content.replace(/onClick=\{\(\) => navigate\(-1\)\}/g, "onClick={() => navigate('/')}");

// Export block
content = content.replace(/<div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">/g, '<div className="p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">');
content = content.replace(/<h4 className="font-semibold text-emerald-900 mb-1">Export Data<\/h4>/g, '<h4 className="font-bold text-white mb-1">Export Data</h4>');

// Simulasi block
content = content.replace(/<div className="p-4 bg-purple-50 rounded-xl border border-purple-100">/g, '<div className="p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">');
content = content.replace(/<h4 className="font-semibold text-purple-900 mb-1">Simulasi Data \(Testing\)<\/h4>/g, '<h4 className="font-bold text-white mb-1">Simulasi Data (Testing)</h4>');

// Reset block
content = content.replace(/<div className="p-4 bg-white\/30 dark:bg-white\/5 rounded-xl border border-blue-100">/g, '<div className="p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]">');
content = content.replace(/<h4 className="font-semibold text-blue-900 mb-1">Reset Database<\/h4>/g, '<h4 className="font-bold text-white mb-1">Reset Database</h4>');

// Fix text colors in these blocks if needed (they have text-white mb-3, which is fine)
// We just make sure there's no dark:text-blue-400
content = content.replace(/text-white dark:text-blue-400 mb-3/g, 'text-white mb-3');

fs.writeFileSync(file, content);
