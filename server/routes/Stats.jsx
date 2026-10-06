import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function Stats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/api/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Request failed");
        setStats(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1>Database Statistics</h1>
      <p>
        {stats.database} · {stats.size} · {stats.tableCount} tables ·{" "}
        {stats.indexes} indexes · {stats.totalRows} total rows ·{" "}
        {stats.connections} connections
      </p>
      <table>
        <thead>
          <tr>
            <th>Table</th>
            <th>Rows</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {stats.tables.map((t) => (
            <tr key={t.table}>
              <td>{t.table}</td>
              <td>{t.rows}</td>
              <td>{t.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stats;