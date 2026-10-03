#!/usr/bin/env bash
# Usage: ./db_stats.sh path/to/database.db

DB="${1:-my_database.db}"

if [[ ! -f "$DB" ]]; then
  echo "Error: database file '$DB' not found." >&2
  exit 1
fi

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "Error: sqlite3 is not installed." >&2
  exit 1
fi

SIZE_KB=$(du -k "$DB" | cut -f1)
TABLES=$(sqlite3 "$DB" "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;")
TABLE_COUNT=$(echo "$TABLES" | grep -c .)
INDEX_COUNT=$(sqlite3 "$DB" "SELECT COUNT(*) FROM sqlite_master WHERE type='index';")

echo "Database:  $DB"
echo "File size: ${SIZE_KB} KB"
echo "Tables:    $TABLE_COUNT"
echo "Indexes:   $INDEX_COUNT"
echo
printf "%-30s %10s\n" "Table" "Rows"
printf "%-30s %10s\n" "------------------------------" "----------"

TOTAL=0
while IFS= read -r t; do
  [[ -z "$t" ]] && continue
  COUNT=$(sqlite3 "$DB" "SELECT COUNT(*) FROM \"$t\";")
  printf "%-30s %10s\n" "$t" "$COUNT"
  TOTAL=$((TOTAL + COUNT))
done <<< "$TABLES"

printf "%-30s %10s\n" "------------------------------" "----------"
printf "%-30s %10s\n" "Total rows" "$TOTAL"