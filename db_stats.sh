#!/usr/bin/env bash
# Usage: ./db_stats.sh [path/to/.env]

ENV_FILE="${1:-server/.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: env file '$ENV_FILE' not found." >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "Error: psql is not installed or not in PATH." >&2
  exit 1
fi

# Read only the DB_* values (handles Windows line endings)
get() { grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '\r'; }

export PGHOST="$(get DB_HOST)"
export PGPORT="$(get DB_PORT)"
export PGDATABASE="$(get DB_NAME)"
export PGUSER="$(get DB_USER)"
export PGPASSWORD="$(get DB_PASSWORD)"

q() { psql -X -A -t -c "$1"; }

if ! q "SELECT 1;" >/dev/null 2>&1; then
  echo "Error: could not connect to database '$PGDATABASE' at $PGHOST:$PGPORT." >&2
  exit 1
fi

echo "Database:   $PGDATABASE ($PGHOST:$PGPORT)"
echo "Size:       $(q "SELECT pg_size_pretty(pg_database_size(current_database()));")"
echo "Tables:     $(q "SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';")"
echo "Indexes:    $(q "SELECT count(*) FROM pg_indexes WHERE schemaname='public';")"
echo "Connections: $(q "SELECT count(*) FROM pg_stat_activity WHERE datname=current_database();")"
echo
echo "Row counts and size per table:"
psql -X -c "
SELECT
  t.table_name AS \"Table\",
  (xpath('/row/c/text()',
     query_to_xml(format('SELECT count(*) AS c FROM %I.%I', t.table_schema, t.table_name), false, true, '')))[1]::text::bigint AS \"Rows\",
  pg_size_pretty(pg_total_relation_size(quote_ident(t.table_schema)||'.'||quote_ident(t.table_name))) AS \"Size\"
FROM information_schema.tables t
WHERE t.table_schema='public' AND t.table_type='BASE TABLE'
ORDER BY 2 DESC;"