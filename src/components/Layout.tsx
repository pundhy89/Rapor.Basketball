import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Star, Trophy, Volume2, VolumeX, Moon, Sun, Dribbble, X, FileText, UserSquare, BookOpen, CalendarDays, Bell, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStore } from '../store';
import { useState, useRef, useEffect } from 'react';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = useStore(state => state.settings);
  const updateSettings = useStore(state => state.updateSettings);

  const students = useStore(state => state.students);
  const updateStudent = useStore(state => state.updateStudent);
  
  useEffect(() => {
    students.forEach(s => {
      if (s.studentId && s.studentId.startsWith('DA-2026-')) {
        updateStudent({ ...s, studentId: s.studentId.replace('DA-2026-', 'DBA-') });
      }
    });
  }, [students, updateStudent]);

  const academy = settings.academy;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentBgm, setCurrentBgm] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const hasBgm = (settings.bgmList && settings.bgmList.length > 0) || settings.bgmUrl;

  // Initialize random BGM
  useEffect(() => {
    if (settings.bgmList && settings.bgmList.length > 0) {
      const randomIndex = Math.floor(Math.random() * settings.bgmList.length);
      setCurrentBgm(settings.bgmList[randomIndex].url);
    } else if (settings.bgmUrl) {
      setCurrentBgm(settings.bgmUrl);
    } else {
      setCurrentBgm(null);
    }
  }, [settings.bgmList, settings.bgmUrl]);

  // Sync dark mode class to HTML
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const toggleTheme = () => {
    updateSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  // BGM Player
  useEffect(() => {
    if (audioRef.current && currentBgm) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Audio play failed", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentBgm]);
  
  // Handle song ending - play next random
  const handleSongEnd = () => {
    if (settings.bgmList && settings.bgmList.length > 1) {
      let nextIndex = Math.floor(Math.random() * settings.bgmList.length);
      // Ensure it doesn't play the exact same song if there are others
      if (settings.bgmList[nextIndex].url === currentBgm) {
        nextIndex = (nextIndex + 1) % settings.bgmList.length;
      }
      setCurrentBgm(settings.bgmList[nextIndex].url);
      
      // Auto play next song if it was playing
      setTimeout(() => {
        if (isPlaying && audioRef.current) {
          audioRef.current.play().catch(console.error);
        }
      }, 500);
    }
  };

  // Click Sound
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    const playClick = () => {
      if (!settings.clickSoundEnabled) return;
      try {
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
          } else {
            return;
          }
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume().catch(console.error);
        }
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
      } catch (e) {
        console.error(e);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        playClick();
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      if (audioCtx) {
        audioCtx.close().catch(console.error);
      }
    };
  }, [settings.clickSoundEnabled]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };


  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/material', icon: BookOpen, label: 'Materi' },
    { path: '/schedule', icon: CalendarDays, label: 'Jadwal' },
    { path: '/students', icon: Users, label: 'Siswa' },
    { path: '/coaches', icon: UserSquare, label: 'Coach' },
    { path: '/assessment', icon: Star, label: 'Nilai' },
    { path: '/evaluation', icon: FileText, label: 'Evaluasi' },
    { path: '/report', icon: Trophy, label: 'Rapor' },
    { path: '/notifications', icon: Bell, label: 'Notif' },
    { path: '/settings', icon: Settings, label: 'Pengaturan' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10] flex flex-col font-sans text-white transition-colors duration-500 relative overflow-hidden">
      {academy.appBgVideoUrl ? (
        <video 
          className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none opacity-100"
          src={academy.appBgVideoUrl} 
          autoPlay 
          muted 
          loop 
          playsInline
        />
      ) : academy.appBgUrl ? (
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ 
            backgroundImage: `url(${academy.appBgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 1
          }}
        />
      ) : (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-600/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 dark:bg-purple-600/20 blur-[100px] pointer-events-none" />
        </>
      )}

      {currentBgm && (
        <audio ref={audioRef} src={currentBgm} onEnded={handleSongEnd} loop={!settings.bgmList || settings.bgmList.length <= 1} />
      )}
      
                  {/* Top Header Sticky */}
      <header className="sticky top-0 z-20 bg-transparent dark:bg-transparent backdrop-blur-md  shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] p-4 transition-colors duration-500 overflow-hidden">
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
      <div className="relative w-full z-0 overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] ">
        {academy.headerBgUrl ? (
          <div 
            className="w-full relative pointer-events-none"
            style={{ 
              backgroundImage: `url(${academy.headerBgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              paddingBottom: academy.headerRatio === "4320x729" ? "16.875%" : academy.headerRatio === "4320x2832" ? "65.555%" : "24.444%"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-100" />
          </div>
        ) : (
          <div className="w-full bg-slate-900/50" style={{ paddingBottom: academy.headerRatio === "4320x729" ? "16.875%" : academy.headerRatio === "4320x2832" ? "65.555%" : "24.444%" }} />
        )}
      </div>



      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 -mt-16 flex flex-col pb-24 relative z-10">
        <Outlet />
      </main>

      {/* Floating Navigation */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* The Menu Box */}
        <div 
          className={cn(
            "flex flex-col gap-1 bg-transparent dark:bg-transparent backdrop-blur-md border border-white/20 dark:border-white/20 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)] p-1 transition-all duration-500 origin-bottom ease-out max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
            isMenuOpen ? "scale-100 opacity-100 translate-y-0 translate-x-0" : "scale-50 opacity-0 translate-y-12 pointer-events-none"
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-300 w-12 h-12 shrink-0 relative",
                  isActive ? "bg-white/5 dark:bg-white/20 text-blue-600 dark:text-blue-400 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/20 dark:border-white/20 scale-105" : "text-white/90 text-white/70 hover:bg-white/50 dark:hover:bg-white/10"
                )}
              >
                <Icon className={cn("w-4 h-4 mb-0.5", isActive && "drop-shadow-sm")} />
                <span className="text-[7px] font-bold tracking-wide text-center leading-tight truncate w-full">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Floating Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-12 h-12 bg-orange-500 text-white rounded-full shadow-[0_4px_15px_rgba(249,115,22,0.6),inset_0_-3px_5px_rgba(0,0,0,0.3),inset_0_3px_5px_rgba(255,255,255,0.5)] flex items-center justify-center active:scale-95 transition-all duration-300 z-10 hover:shadow-[0_6px_20px_rgba(249,115,22,0.8),inset_0_-3px_5px_rgba(0,0,0,0.3),inset_0_3px_5px_rgba(255,255,255,0.5)] border border-orange-400"
        >
          <div className={cn("transition-transform duration-500", isMenuOpen ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100")}>
            <Dribbble className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className={cn("transition-transform duration-500", isMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0 absolute")}>
            <X className="w-6 h-6" strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </div>
  );
}
