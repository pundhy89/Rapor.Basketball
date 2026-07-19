const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('export interface NotificationMessage')) {
  code += `\nexport interface NotificationMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  isNew: boolean;
}\n`;
  fs.writeFileSync('src/types.ts', code);
  console.log('patched types.ts');
}
