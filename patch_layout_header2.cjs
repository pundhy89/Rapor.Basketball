const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Layout.tsx');
let content = fs.readFileSync(file, 'utf8');

const newHeader = `      {/* Top Header Sticky */}
      <header className="sticky top-0 z-20 bg-transparent dark:bg-transparent backdrop-blur-md border-b border-white/20 dark:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] p-4 transition-colors duration-500 overflow-hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4 text-left">
            <div className="relative w-12 h-12 rounded-full p-[2px] bg-transparent dark:bg-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {academy.logoUrl ? (
                  <img src={academy.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="font-black text-white text-xl">
                    {academy.name.charAt(0) || "D"}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-xl tracking-wide text-white leading-tight drop-shadow-md">{academy.name || "Dragons Academy"}</h1>
              {academy.subtitle && (
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider drop-shadow-sm">{academy.subtitle}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasBgm && (
              <button onClick={toggleMusic} className="p-2.5 text-white/90 hover:text-white rounded-full transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] border border-white/20 dark:border-white/20 bg-white/10 backdrop-blur-md">
                {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            )}
            <button onClick={toggleTheme} className="p-2.5 text-white/90 hover:text-white rounded-full transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] border border-white/20 dark:border-white/20 bg-white/10 backdrop-blur-md">
              {settings.theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="relative w-full z-0 overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] border-b border-white/20 dark:border-white/20">
        {academy.headerBgUrl ? (
          <div 
            className="w-full relative pointer-events-none"
            style={{ 
              backgroundImage: \`url(\${academy.headerBgUrl})\`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              aspectRatio: academy.headerRatio === "4320x729" ? "4320/729" : academy.headerRatio === "4320x2832" ? "4320/2832" : "4320/1056"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-50" />
          </div>
        ) : (
          <div className="w-full bg-slate-900/50" style={{ aspectRatio: "4320/1056" }} />
        )}
      </div>
`;

const headerRegex = /\{\/\* Banner \*\/\}[\s\S]*?<\/header>/;
content = content.replace(headerRegex, newHeader);

// And wait, before doing this, let's also remove the top padding of main if they want overlap? 
// No, they said "border pesan pada beranda tetap berada di tempat berkesan menumpuk header" was the PROBLEM.
// So keeping normal flow for main is correct.

fs.writeFileSync(file, content);
