#!/bin/bash
for FILE in src/components/*.tsx; do
  # Border transparency to 80% (20% opacity)
  sed -i 's/border-white\/50/border-white\/20/g' "$FILE"
  sed -i 's/border-white\/10/border-white\/20/g' "$FILE"
  
  # Reduce blur
  sed -i 's/backdrop-blur-xl/backdrop-blur-md/g' "$FILE"
  
  # Add glass light reflection effect
  sed -i -E 's/shadow-\[0_8px_32px_0_rgba\(31,38,135,0\.07\)\]/shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(31,38,135,0.07)]/g' "$FILE"
  sed -i -E 's/dark:shadow-\[0_8px_32px_0_rgba\(0,0,0,0\.2\)\]/dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_0_rgba(0,0,0,0.2)]/g' "$FILE"
  
  # Remove white layer
  sed -i 's/className="absolute inset-0 z-0 bg-white\/30 dark:bg-black\/30 backdrop-blur-\[50px\] pointer-events-none" \/>/className="absolute inset-0 z-0 pointer-events-none" \/>/g' "$FILE"
done

# Fix Dashboard icon
sed -i 's/import { Users, Star, FileText, UserSquare, ChevronRight, BookOpen, CalendarDays, Bell } from .lucide-react.;/import { Users, Star, FileText, UserSquare, ChevronRight, BookOpen, CalendarDays, Bell, Trophy } from '"'"'lucide-react'"'"';/g' src/components/Dashboard.tsx
sed -i 's/{ path: '"'"'\/report'"'"', icon: FileText, label: '"'"'Rapor Siswa'"'"', desc: '"'"'Lihat hasil akhir penilaian'"'"' }/{ path: '"'"'\/report'"'"', icon: Trophy, label: '"'"'Rapor Siswa'"'"', desc: '"'"'Lihat hasil akhir penilaian'"'"' }/g' src/components/Dashboard.tsx

