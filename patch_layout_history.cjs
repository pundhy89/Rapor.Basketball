const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Also need to import Clock if not imported, but wait, we use History icon or FileText icon? Let's use Archive or Clock
if (!code.includes('Archive,')) {
    code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, Archive } from 'lucide-react';");
}

code = code.replace(
  "{ path: '/assessment', icon: Star, label: 'Nilai' },",
  "{ path: '/assessment', icon: Star, label: 'Nilai' },\n    { path: '/history', icon: Archive, label: 'History' },"
);

fs.writeFileSync('src/components/Layout.tsx', code);
console.log('Done');
