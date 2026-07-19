#!/bin/bash
FILE=$1
sed -i 's/text-[#05050A] shadow-\[0_0_10px_rgba(6,182,212,0.3)\] text-white/text-[#05050A] shadow-[0_0_10px_rgba(6,182,212,0.3)]/g' $FILE
sed -i 's/dark:border-gray-700//g' $FILE
sed -i 's/focus:border-blue-500/focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] bg-[#05050A]/g' $FILE
sed -i 's/bg-white dark:bg-black/bg-[#05050A]/g' $FILE
