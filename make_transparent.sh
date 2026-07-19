#!/bin/bash
for FILE in src/components/*.tsx; do
  sed -i 's/bg-white\/40/bg-transparent/g' "$FILE"
  sed -i 's/dark:bg-black\/40/dark:bg-transparent/g' "$FILE"
  sed -i 's/bg-white\/60/bg-white\/5/g' "$FILE"
  sed -i 's/dark:bg-white\/10/dark:bg-white\/5/g' "$FILE"
done
