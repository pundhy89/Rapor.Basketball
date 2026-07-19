#!/bin/bash
for FILE in src/components/*.tsx; do
  sed -i 's/text-slate-800 dark:text-slate-100/text-white/g' "$FILE"
  sed -i 's/text-slate-800 dark:text-slate-200/text-white/g' "$FILE"
  sed -i 's/text-slate-600 dark:text-slate-300/text-white\/90/g' "$FILE"
  sed -i 's/text-slate-500 dark:text-slate-400/text-white\/70/g' "$FILE"
  
  # Catch any remaining explicit slate colors
  sed -i 's/text-slate-800/text-white/g' "$FILE"
  sed -i 's/text-slate-600/text-white\/90/g' "$FILE"
  sed -i 's/text-slate-500/text-white\/70/g' "$FILE"
  
  # Remove dark variants if they were left over
  sed -i 's/dark:text-slate-100/text-white/g' "$FILE"
  sed -i 's/dark:text-slate-200/text-white/g' "$FILE"
  sed -i 's/dark:text-slate-300\/90/text-white\/90/g' "$FILE"
  sed -i 's/dark:text-slate-300/text-white\/90/g' "$FILE"
  sed -i 's/dark:text-slate-400/text-white\/70/g' "$FILE"
done
