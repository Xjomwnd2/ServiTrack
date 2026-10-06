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
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return;
    }

    setDashboardData(data);
  } catch (error) {
    console.error("Dashboard loading error:", error);
  } finally {
    setLoadingDashboard(false);
  }
}