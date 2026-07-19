#!/bin/bash
FILE=$1
# Backgrounds
sed -i 's/bg-\[#0D1838\]\/80 backdrop-blur-md/bg-white\/40 dark:bg-black\/40 backdrop-blur-xl/g' $FILE
sed -i 's/bg-\[#0B0F24\]\/60 backdrop-blur-sm/bg-white\/40 dark:bg-black\/40 backdrop-blur-xl/g' $FILE
sed -i 's/bg-\[#0B0F24\]/bg-transparent/g' $FILE
sed -i 's/bg-\[#05050A\]/bg-white\/50 dark:bg-black\/50 backdrop-blur-md/g' $FILE
sed -i 's/bg-cyan-900\/40/bg-white\/50 dark:bg-white\/10/g' $FILE
sed -i 's/bg-cyan-900\/20/bg-white\/30 dark:bg-white\/5/g' $FILE
sed -i 's/bg-cyan-900\/60/bg-white\/60 dark:bg-white\/20/g' $FILE

# Borders
sed -i 's/border-cyan-500\/50/border-white\/50 dark:border-white\/10/g' $FILE
sed -i 's/border-cyan-500\/40/border-white\/50 dark:border-white\/10/g' $FILE
sed -i 's/border-cyan-500\/30/border-white\/50 dark:border-white\/10/g' $FILE
sed -i 's/border-cyan-500\/20/border-white\/50 dark:border-white\/10/g' $FILE
sed -i 's/border-\[2px\] border-[#0B0F24]/border-white\/50 dark:border-white\/10/g' $FILE

# Shadows
sed -i 's/shadow-\[0_0_[a-zA-Z0-9_,().]*\]/shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]/g' $FILE
sed -i 's/shadow-\[0_4px_[a-zA-Z0-9_,().]*\]/shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]/g' $FILE
sed -i 's/shadow-\[0_8px_[a-zA-Z0-9_,().]*\]/shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]/g' $FILE
sed -i 's/shadow-xl/shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]/g' $FILE

# Text colors
sed -i 's/text-white tracking-wide/text-slate-800 dark:text-slate-100 tracking-wide/g' $FILE
sed -i 's/text-cyan-50 /text-slate-800 dark:text-slate-100 /g' $FILE
sed -i 's/text-cyan-100\/80/text-slate-600 dark:text-slate-300/g' $FILE
sed -i 's/text-cyan-200\/60/text-slate-500 dark:text-slate-400/g' $FILE
sed -i 's/text-cyan-100\/60/text-slate-500 dark:text-slate-400/g' $FILE
sed -i 's/text-cyan-100\/50/text-slate-500 dark:text-slate-400/g' $FILE
sed -i 's/text-cyan-100/text-slate-600 dark:text-slate-300/g' $FILE
sed -i 's/text-cyan-200/text-slate-700 dark:text-slate-200/g' $FILE
sed -i 's/text-cyan-300/text-slate-800 dark:text-slate-100/g' $FILE
sed -i 's/text-cyan-400/text-slate-800 dark:text-slate-100/g' $FILE

# Brand backgrounds
sed -i 's/bg-cyan-500 text-\[#05050A\]/bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900/g' $FILE
sed -i 's/bg-cyan-500 hover:bg-cyan-400 text-\[#05050A\]/bg-slate-800 dark:bg-slate-200 hover:bg-slate-700 dark:hover:bg-slate-300 text-white dark:text-slate-900/g' $FILE
sed -i 's/bg-cyan-400 text-\[#05050A\]/bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900/g' $FILE

# Hover / Focus
sed -i 's/focus:border-cyan-400/focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-400\/20/g' $FILE
sed -i 's/hover:border-cyan-400/hover:border-white\/80 dark:hover:border-white\/30/g' $FILE
sed -i 's/hover:bg-cyan-900\/40/hover:bg-white\/50 dark:hover:bg-white\/10/g' $FILE

# specific gradients
sed -i 's/bg-gradient-to-br from-cyan-400 via-blue-600 to-cyan-500 text-\[#05050A\]/bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900/g' $FILE
sed -i 's/bg-gradient-to-r from-cyan-300 to-blue-500/text-slate-800 dark:text-slate-100/g' $FILE
sed -i 's/text-transparent bg-clip-text //g' $FILE

# dropshadow
sed -i 's/drop-shadow-\[0_0_[a-zA-Z0-9_,().]*\]//g' $FILE

