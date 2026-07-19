#!/bin/bash
FILE=$1
sed -i 's/border-black\/5/border-cyan-500\/20/g' $FILE
sed -i 's/hover:border-blue-500/hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]/g' $FILE
sed -i 's/border-white dark:border-black/border-cyan-500\/30/g' $FILE
sed -i 's/divide-gray-100/divide-cyan-500\/20/g' $FILE
sed -i 's/divide-gray-200/divide-cyan-500\/20/g' $FILE
