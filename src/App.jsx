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