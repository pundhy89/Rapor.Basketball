#!/bin/bash
FILE=$1
sed -i 's/bg-gray-100 dark:bg-gray-800/bg-cyan-900\/40 border border-cyan-500\/20/g' $FILE
sed -i 's/bg-[a-z]*-50 dark:bg-[a-z]*-900\/20/bg-cyan-900\/20/g' $FILE
sed -i 's/bg-[a-z]*-100 dark:bg-[a-z]*-800/bg-cyan-900\/40/g' $FILE
sed -i 's/text-[a-z]*-700/text-cyan-300/g' $FILE
sed -i 's/text-[a-z]*-600 dark:text-[a-z]*-400/text-cyan-300/g' $FILE
sed -i 's/text-[a-z]*-900 dark:text-[a-z]*-200/text-cyan-100/g' $FILE
sed -i 's/border-white border-cyan-500\/40/border-cyan-500\/40/g' $FILE
