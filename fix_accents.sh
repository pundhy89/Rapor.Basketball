#!/bin/bash
for FILE in src/components/*.tsx; do
  sed -i 's/bg-cyan-500\/20 blur-\[80px\]/bg-blue-400\/10 dark:bg-blue-400\/5 blur-[80px]/g' "$FILE"
  sed -i 's/bg-cyan-400 shadow-\[0_0_15px_#22d3ee\]/bg-slate-800 dark:bg-slate-200 shadow-sm/g' "$FILE"
  sed -i 's/bg-cyan-500\/10 blur-\[100px\]/bg-blue-400\/10 dark:bg-blue-400\/5 blur-[100px]/g' "$FILE"
  sed -i 's/drop-shadow-\[0_0_5px_#22d3ee\]/drop-shadow-sm/g' "$FILE"
  sed -i 's/shadow-\[0_0_15px_rgba(6,182,212,0.6)\]/shadow-md/g' "$FILE"
  sed -i 's/shadow-\[0_0_10px_rgba(6,182,212,0.2)\]/shadow-sm/g' "$FILE"
  sed -i 's/shadow-\[0_0_15px_#22d3ee\]/shadow-sm/g' "$FILE"
  sed -i 's/shadow-\[0_0_30px_rgba(6,182,212,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.4)\]/shadow-lg/g' "$FILE"
  sed -i 's/shadow-\[0_0_20px_rgba(6,182,212,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.4)\]/shadow-md/g' "$FILE"
  sed -i 's/border-cyan-200/border-white\/50 dark:border-white\/10/g' "$FILE"
done
