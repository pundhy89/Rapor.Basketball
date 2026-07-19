const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Layout.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /<button\s+onClick=\{\(\) => setIsMenuOpen\(!isMenuOpen\)\}\s+className="w-12 h-12 bg-transparent dark:bg-transparent backdrop-blur-md text-white rounded-full shadow-\[0_8px_32px_0_rgba\(31,38,135,0\.1\)\] dark:shadow-\[0_8px_32px_0_rgba\(0,0,0,0\.3\)\] flex items-center justify-center active:scale-95 transition-all duration-300 z-10 hover:shadow-\[0_8px_32px_0_rgba\(31,38,135,0\.2\)\] dark:hover:shadow-\[0_8px_32px_0_rgba\(0,0,0,0\.4\)\] border border-white\/20 dark:border-white\/20"/g;

content = content.replace(regex, `<button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-12 h-12 bg-orange-500 text-white rounded-full shadow-[0_4px_15px_rgba(249,115,22,0.6),inset_0_-3px_5px_rgba(0,0,0,0.3),inset_0_3px_5px_rgba(255,255,255,0.5)] flex items-center justify-center active:scale-95 transition-all duration-300 z-10 hover:shadow-[0_6px_20px_rgba(249,115,22,0.8),inset_0_-3px_5px_rgba(0,0,0,0.3),inset_0_3px_5px_rgba(255,255,255,0.5)] border border-orange-400"`);

fs.writeFileSync(file, content);
