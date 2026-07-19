#!/bin/bash
FILE=$1
sed -i 's/hover:bg-gray-100 dark:bg-white\/5/hover:bg-cyan-900\/40/g' $FILE
sed -i 's/hover:bg-gray-100 dark:hover:bg-gray-800/hover:bg-cyan-900\/40/g' $FILE
sed -i 's/hover:bg-gray-50 dark:hover:bg-white\/5/hover:bg-cyan-900\/40/g' $FILE
sed -i 's/bg-blue-600 hover:bg-blue-700/bg-cyan-500 hover:bg-cyan-400 text-[#05050A] font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]/g' $FILE
sed -i 's/bg-blue-600/bg-cyan-500 text-[#05050A] shadow-[0_0_10px_rgba(6,182,212,0.3)]/g' $FILE
sed -i 's/bg-blue-500/bg-cyan-400 text-[#05050A] shadow-[0_0_10px_rgba(6,182,212,0.3)]/g' $FILE
sed -i 's/text-blue-600/text-cyan-400/g' $FILE
sed -i 's/text-blue-500/text-cyan-300/g' $FILE
sed -i 's/text-gray-500/text-cyan-100\/50/g' $FILE
sed -i 's/text-gray-400/text-cyan-100\/50/g' $FILE
sed -i 's/text-gray-900/text-white/g' $FILE
sed -i 's/bg-white/bg-[#0D1838]/g' $FILE
sed -i 's/border-gray-200/border-cyan-500\/30/g' $FILE
sed -i 's/border-gray-300/border-cyan-500\/30/g' $FILE
sed -i 's/border-white/border-cyan-500\/30/g' $FILE
sed -i 's/bg-gray-50/bg-[#0B0F24]/g' $FILE
sed -i 's/bg-gray-100/bg-[#0B0F24]\/60/g' $FILE
sed -i 's/bg-gray-800/bg-[#0B0F24]\/60/g' $FILE
sed -i 's/bg-gray-900/bg-[#05050A]/g' $FILE
