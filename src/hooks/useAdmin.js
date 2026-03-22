import { useState, useEffect, useCallback } from 'react';
import { 
  getAdminStats, 
  getAdminProjects, 
  getAdminTasks, 
  getActiveUsers,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  activateUser,
  getSystemHealth,
  getSystemLogs
} from '../api/admin.api';

// Admin Dashboard Stats Hook
export const useAdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminStats();
      const statsData = response.data || response;
      setStats(statsData);
      console.log('Admin stats updated:', statsData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch admin stats';
      setError(errorMessage);
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

// Admin Projects Hook
export const useAdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminProjects();
      setProjects(response.data || response || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch admin projects';
      setError(errorMessage);
      console.error('Error fetching admin projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
};

// Admin Tasks Hook
export const useAdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminTasks();
      setTasks(response.data || response || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch admin tasks';
      setError(errorMessage);
      console.error('Error fetching admin tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
};

// Active Users Hook
export const useActiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getActiveUsers();
      setUsers(response.data || response || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch active users';
      setError(errorMessage);
      console.error('Error fetching active users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveUsers();
  }, [fetchActiveUsers]);

  return { users, loading, error, refetch: fetchActiveUsers };
};

// All Users Hook with Priority Filters
export const useAllUsers = (filters = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const fetchUsers = useCallback(async (newFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers(newFilters);
      const usersData = response.data || response.users || response || [];
      const paginationData = response.pagination || {};
      
      setUsers(usersData);
      setPagination(prev => ({
        ...prev,
        ...paginationData,
        page: newFilters.page || prev.page
      }));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateFilters = useCallback((newFilters) => {
    fetchUsers({ ...filters, ...newFilters, page: 1 });
  }, [fetchUsers, filters]);

  const nextPage = useCallback(() => {
    if (pagination.page < Math.ceil(pagination.total / pagination.limit)) {
      fetchUsers({ ...filters, page: pagination.page + 1 });
    }
  }, [fetchUsers, filters, pagination]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      fetchUsers({ ...filters, page: pagination.page - 1 });
    }
  }, [fetchUsers, filters, pagination]);

  return { 
    users, 
    loading, 
    error, 
    pagination,
    refetch: fetchUsers,
    updateFilters,
    nextPage,
    prevPage
  };
};

// Admin User Actions Hook
export const useAdminUserActions = () => {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const updateUserRoleAction = useCallback(async (userId, role) => {
    try {
      setLoading(prev => ({ ...prev, [userId]: true }));
      setError(null);
      const response = await updateUserRole(userId, role);
      console.log('User role updated successfully:', response);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update user role';
      setError(errorMessage);
      console.error('Error updating user role:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }
  }, []);

  const deactivateUserAction = useCallback(async (userId) => {
    try {
      setLoading(prev => ({ ...prev, [userId]: true }));
      setError(null);
      const response = await deactivateUser(userId);
      console.log('User deactivated successfully:', response);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to deactivate user';
      setError(errorMessage);
      console.error('Error deactivating user:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }
  }, []);

  const activateUserAction = useCallback(async (userId) => {
    try {
      setLoading(prev => ({ ...prev, [userId]: true }));
      setError(null);
      const response = await activateUser(userId);
      console.log('User activated successfully:', response);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to activate user';
      setError(errorMessage);
      console.error('Error activating user:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }
  }, []);

  return { 
    loading, 
    error, 
    updateUserRole: updateUserRoleAction,
    deactivateUser: deactivateUserAction,
    activateUser: activateUserAction,
    clearError: () => setError(null)
  };
};
