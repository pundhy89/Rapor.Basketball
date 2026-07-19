#!/bin/bash
for FILE in src/components/*.tsx; do
  # Replace 4 or 3 or 2 duplicated shadows
  sed -i -E 's/(dark:shadow-\[0_8px_32px_0_rgba\([0-9,.]+\)\] )+dark:shadow-\[0_8px_32px_0_rgba\([0-9,.]+\)\]/dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]/g' "$FILE"
  sed -i -E 's/dark:shadow-\[0_8px_32px_0_rgba\([0-9,.]+\)\] dark:shadow-\[0_8px_32px_0_rgba\([0-9,.]+\)\]/dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]/g' "$FILE"
  
  sed -i -E 's/(shadow-\[0_8px_32px_0_rgba\([0-9,.]+\)\] )+shadow-\[0_8px_32px_0_rgba\([0-9,.]+\)\]/shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]/g' "$FILE"
  sed -i -E 's/shadow-\[0_8px_32px_0_rgba\([0-9,.]+\)\] shadow-\[0_8px_32px_0_rgba\([0-9,.]+\)\]/shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]/g' "$FILE"
done
