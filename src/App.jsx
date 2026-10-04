const [dashboardData, setDashboardData] = useState({
  stats: {
    total_customers: 0,
    new_requests: 0,
    scheduled_jobs: 0,
    completed_jobs: 0,
  },
  appointments: [],
});

const [loadingDashboard, setLoadingDashboard] = useState(false);

async function loadDashboard() {
  const token = localStorage.getItem("token");

  if (!token) return;

  setLoadingDashboard(true);

  try {
    const response = await fetch(`${API_URL}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // always fetch fresh counts
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return;
    }

    // Merge with safe defaults so missing fields can't crash the page
    setDashboardData({
      stats: {
        total_customers: data.stats?.total_customers ?? 0,
        new_requests: data.stats?.new_requests ?? 0,
        scheduled_jobs: data.stats?.scheduled_jobs ?? 0,
        completed_jobs: data.stats?.completed_jobs ?? 0,
      },
      appointments: data.appointments ?? [],
    });
  } catch (error) {
    console.error("Dashboard loading error:", error);
  } finally {
    setLoadingDashboard(false);
  }
}