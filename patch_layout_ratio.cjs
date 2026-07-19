const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Layout.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /<div\s+className="w-full relative pointer-events-none"\s+style=\{\{\s+backgroundImage: `url\(\$\{academy.headerBgUrl\}\)`,\s+backgroundSize: "cover",\s+backgroundPosition: "center",\s+aspectRatio: academy.headerRatio === "4320x729" \? "4320\/729" : academy.headerRatio === "4320x2832" \? "4320\/2832" : "4320\/1056"\s+\}\}\s+>/g;

const replacement = `<div 
            className="w-full relative pointer-events-none"
            style={{ 
              backgroundImage: \`url(\${academy.headerBgUrl})\`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              paddingBottom: academy.headerRatio === "4320x729" ? "16.875%" : academy.headerRatio === "4320x2832" ? "65.555%" : "24.444%"
            }}
          >`;

content = content.replace(regex, replacement);

const fallbackRegex = /<div className="w-full bg-slate-900\/50" style=\{\{ aspectRatio: "4320\/1056" \}\} \/>/g;
content = content.replace(fallbackRegex, '<div className="w-full bg-slate-900/50" style={{ paddingBottom: academy.headerRatio === "4320x729" ? "16.875%" : academy.headerRatio === "4320x2832" ? "65.555%" : "24.444%" }} />');

fs.writeFileSync(file, content);
