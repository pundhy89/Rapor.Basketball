const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Layout.tsx');
let content = fs.readFileSync(file, 'utf8');

const bgVideoStr = `      {academy.appBgVideoUrl ? (
        <video 
          className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none opacity-50"
          src={academy.appBgVideoUrl} 
          autoPlay 
          muted 
          loop 
          playsInline
        />
      ) : academy.appBgUrl ? (`;

content = content.replace(/      \{academy\.appBgUrl \? \(/, bgVideoStr);

fs.writeFileSync(file, content);
