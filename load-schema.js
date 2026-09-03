const fs = require("fs");
const { Client } = require("pg");
require("dotenv").config({ path: "./server/.env" });

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const schema = fs.readFileSync("./database/schema.sql", "utf8");

async function loadSchema() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL.");

    await client.query(schema);

    console.log("ServiTrack database schema created successfully.");
  } catch (error) {
    console.error("Schema error:", error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

loadSchema();

