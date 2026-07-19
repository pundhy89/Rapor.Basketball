#!/bin/bash
for FILE in src/components/*.tsx; do
  sed -i 's/dark:text-slate-[0-9]\{3\}/text-white/g' "$FILE"
  sed -i 's/text-slate-[0-9]\{3\}/text-white/g' "$FILE"
done
