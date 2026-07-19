const fs = require('fs');
let code = fs.readFileSync('src/components/Report.tsx', 'utf8');

code = code.replace(
  /const handleDownload = async \(\) => \{[\s\S]*?finally \{\s*setIsDownloading\(false\);\s*\}\s*\};/,
`const handleDownload = async () => {
    if (!reportRef.current || !selectedStudent) return;
    try {
      setIsDownloading(true);
      
      const elementsWithBlur = reportRef.current.querySelectorAll('.backdrop-blur-md, .backdrop-blur-sm, .bg-transparent, .bg-white\\/5, .dark\\:bg-slate-800\\/50, .border-white\\/20');
      const originalStyles = new Map();
      
      elementsWithBlur.forEach((el, idx) => {
        originalStyles.set(idx, el.className);
        let newClass = el.className
          .replace(/backdrop-blur-(md|sm)/g, '')
          .replace(/bg-transparent/g, 'bg-[#0B0C10]')
          .replace(/bg-white\\/5/g, 'bg-[#1f2937]')
          .replace(/dark\\:bg-slate-800\\/50/g, 'bg-[#1f2937]')
          .replace(/border-white\\/20/g, 'border-slate-700');
        el.className = newClass;
      });
      
      await new Promise(r => setTimeout(r, 100));

      const dataUrl = await toJpeg(reportRef.current, { 
        quality: 1,
        backgroundColor: '#0B0C10',
        style: {
          color: '#ffffff'
        }
      });
      
      elementsWithBlur.forEach((el, idx) => {
        el.className = originalStyles.get(idx);
      });

      const link = document.createElement('a');
      link.download = \`RAPOR_\${selectedStudent.name.replace(/\\s+/g, '_')}_\${activePeriod?.year}.jpeg\`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating report image', err);
      alert('Gagal mengunduh rapor. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };`
);

fs.writeFileSync('src/components/Report.tsx', code);
console.log('Report Export patched');
