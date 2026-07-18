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

  const toggleTheme = () => {
    updateSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' });
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#1A1C29] flex flex-col font-sans text-gray-900 dark:text-white transition-colors duration-300">
      {currentBgm && (
        <audio ref={audioRef} src={currentBgm} onEnded={handleSongEnd} loop={!settings.bgmList || settings.bgmList.length <= 1} />
      )}
      
      {/* Top Header */}
      <header className="bg-white/80 dark:bg-[#252836]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white p-4 sticky top-0 z-10 transition-colors duration-300 relative overflow-hidden">
        {academy.headerBgUrl && (
          <div 
            className="absolute inset-0 z-0 opacity-20 dark:opacity-30 pointer-events-none"
            style={{ 
              backgroundImage: `url(${academy.headerBgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              aspectRatio: academy.headerRatio === '4320x729' ? '4320/729' : academy.headerRatio === '4320x2832' ? '4320/2832' : '4320/1056'
            }}
          />
        )}
        <div className="max-w-3xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 text-left">
            {academy.logoUrl ? (
              <img src={academy.logoUrl} alt="Logo" className="w-10 h-10 rounded-full object-cover shadow-sm bg-white" />
            ) : (
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black text-white shadow-md">
                {academy.name.charAt(0) || 'D'}
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white leading-tight">{academy.name || 'Dragons Academy'}</h1>
              {academy.subtitle && (
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{academy.subtitle}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {hasBgm && (
              <button onClick={toggleMusic} className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all">
                {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            )}
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all">
              {settings.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 flex flex-col pb-24">
        <Outlet />
      </main>

      {/* Floating Navigation */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* The Menu Box */}
        <div 
          className={cn(
            "flex flex-col gap-1 bg-white/70 dark:bg-black/70 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.15)] p-1 transition-all duration-500 origin-bottom ease-out max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
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
                  "flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-300 w-12 h-12 shrink-0",
                  isActive ? "bg-blue-600 dark:bg-blue-500 text-white shadow-sm scale-105" : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/10"
                )}
              >
                <Icon className={cn("w-4 h-4 mb-0.5")} />
                <span className="text-[7px] font-bold tracking-wide text-center leading-tight truncate w-full">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Floating Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-12 h-12 bg-gradient-to-br from-[#F26A21] via-[#e55910] to-[#c94500] text-white rounded-full shadow-[0_4px_10px_rgba(242,106,33,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center active:scale-95 transition-all duration-300 z-10 hover:shadow-[0_6px_15px_rgba(242,106,33,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.4)]"
        >
          <div className={cn("transition-transform duration-500 text-white/90", isMenuOpen ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100")}>
            <Dribbble className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className={cn("transition-transform duration-500 text-white", isMenuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0 absolute")}>
            <X className="w-6 h-6" strokeWidth={2.5} />
          </div>
        </button>
      </div>
    </div>
  );
}
