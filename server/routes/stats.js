const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [meta, tables] = await Promise.all([
      pool.query(`
        SELECT
          current_database() AS database,
          pg_size_pretty(pg_database_size(current_database())) AS size,
          (SELECT count(*) FROM pg_indexes WHERE schemaname = 'public')::int AS indexes,
          (SELECT count(*) FROM pg_stat_activity
             WHERE datname = current_database())::int AS connections
      `),
      pool.query(`
        SELECT
          t.table_name AS table,
          (xpath('/row/c/text()',
            query_to_xml(format('SELECT count(*) AS c FROM %I.%I',
              t.table_schema, t.table_name), false, true, '')))[1]::text::int AS rows,
          pg_size_pretty(pg_total_relation_size(
            quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))) AS size
        FROM information_schema.tables t
        WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
        ORDER BY rows DESC
      `),
    ]);

    res.json({
      ...meta.rows[0],
      tableCount: tables.rows.length,
      totalRows: tables.rows.reduce((sum, t) => sum + t.rows, 0),
      tables: tables.rows,
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to load database statistics" });
  }
});

module.exports = router;