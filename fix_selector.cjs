const fs = require('fs');
let code = fs.readFileSync('src/components/Report.tsx', 'utf8');

code = code.replace(
  "querySelectorAll('.backdrop-blur-md, .backdrop-blur-sm, .bg-transparent, .bg-white\\/5, .dark\\:bg-slate-800\\/50, .border-white\\/20')",
  "querySelectorAll('.backdrop-blur-md, .backdrop-blur-sm, .bg-transparent, .bg-white\\\\/5, .dark\\\\:bg-slate-800\\\\/50, .border-white\\\\/20')"
);

fs.writeFileSync('src/components/Report.tsx', code);
console.log('Fixed');
