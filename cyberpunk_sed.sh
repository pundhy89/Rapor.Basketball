#!/bin/bash
FILE=$1
# Backgrounds
sed -i 's/bg-white dark:bg-\[#1A1C29\]/bg-[#0D1838]\/80 backdrop-blur-md/g' $FILE
sed -i 's/bg-gray-50 dark:bg-\[#151720\]/bg-transparent/g' $FILE
sed -i 's/bg-white dark:bg-black/bg-[#0B0F24]\/60 backdrop-blur-sm/g' $FILE
sed -i 's/bg-gray-50 dark:bg-gray-900/bg-[#05050A]/g' $FILE
# Borders
sed -i 's/border-gray-200 dark:border-gray-800/border-cyan-500\/30/g' $FILE
sed -i 's/border-gray-100 dark:border-gray-800/border-cyan-500\/20/g' $FILE
sed -i 's/border-white dark:border-black/border-cyan-500\/30/g' $FILE
# Text colors
sed -i 's/text-gray-900 dark:text-white/text-white tracking-wide/g' $FILE
sed -i 's/text-gray-800 dark:text-gray-200/text-cyan-50/g' $FILE
sed -i 's/text-gray-700 dark:text-gray-300/text-cyan-100\/80/g' $FILE
sed -i 's/text-gray-600 dark:text-gray-400/text-cyan-200\/60/g' $FILE
sed -i 's/text-gray-500 dark:text-gray-400/text-cyan-100\/60/g' $FILE
# Misc specific fixes
sed -i 's/border-b border-black\/5/border-t border-cyan-500\/20/g' $FILE
sed -i 's/shadow-sm/shadow-[0_0_15px_rgba(6,182,212,0.15)]/g' $FILE
