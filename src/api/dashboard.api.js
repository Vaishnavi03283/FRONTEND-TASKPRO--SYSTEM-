import API from "./axios";

export const getUserDashboard = async () => {
  console.log("🔄 Fetching user dashboard data...");
  try {
    const res = await API.get("/dashboard/user");
    console.log("✅ User dashboard data fetched successfully!");
    console.log("📊 User Dashboard stats:", res.data?.data?.stats);
    console.log("📝 Recent activities:", res.data?.data?.recentActivities?.length || 0);
    
    return res.data?.data || res.data;
  } catch (err) {
    console.error("❌ USER DASHBOARD ERROR:", err.response?.data);
    
    // Return fallback data with proper structure
    return {
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        activeProjects: 0,
        totalUsers: 0
      },
      recentActivities: [],
      error: {
        message: "Failed to fetch user dashboard data",
        details: err.response?.data?.message || "Unknown error"
      }
    };
  }
};

export const getManagerDashboard = async () => {
  try {
    console.log("🔄 Fetching manager dashboard data...");
    const res = await API.get("/dashboard/manager");
    console.log("✅ Backend connected successfully!");
    console.log("📊 Dashboard data:", res.data.data?.stats);
    console.log("📁 Projects found:", res.data.data?.recentProjects?.length || 0);
    console.log("📝 Activities found:", res.data.data?.recentActivities?.length || 0);
    
    return res.data.data;
  } catch (err) {
    console.error("❌ MANAGER DASHBOARD ERROR:", err.response?.data);
    
    // Check for specific backend syntax errors
    const errorMessage = err.response?.data?.error || err.response?.data?.message || '';
    
    if (errorMessage.includes('Project.count is not a function')) {
      console.error("💡 Backend using wrong syntax! Needs PostgreSQL: Project.count({ where: { manager: managerId } }) instead of Project.count()");
    }
    if (errorMessage.includes('Project.findAll is not a function')) {
      console.error("💡 Backend using wrong syntax! Needs PostgreSQL: Project.findAll({ where: { manager: managerId } }) instead of Project.find()");
    }
    if (errorMessage.includes('Task.count is not a function')) {
      console.error("💡 Backend using wrong syntax! Needs PostgreSQL: Task.count({ where: { projectId: projectId } }) instead of Task.count()");
    }
    if (errorMessage.includes('Task.findAll is not a function')) {
      console.error("💡 Backend using wrong syntax! Needs PostgreSQL: Task.findAll({ where: { projectId: projectId } }) instead of Task.find()");
    }

    
    // Return fallback data with more detailed error info
    return {
      stats: {
        totalProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        teamMembers: 0
      },
      recentProjects: [],
      recentActivities: [],
      error: {
        message: "Backend database syntax error",
        details: "Backend needs to use PostgreSQL/Sequelize syntax with 'where' clauses",
        fixRequired: true
      }
    };
  }
};