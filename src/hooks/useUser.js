import { useState, useEffect } from "react";
import {
  getUsers,
  deleteUser,
  updateRole,
} from "../api/user.api";
import { getActiveUsers } from "../api/admin.api";

export const useUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error };
};

export const useUser = () => {
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data.data || []);
  };

  const fetchActive = async () => {
    const data = await getActiveUsers();
    setActiveUsers(data.data || []);
  };

  const removeUser = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  const changeRole = async (id, role) => {
    await updateRole(id, role);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
    fetchActive();
  }, []);

  return {
    users,
    activeUsers,
    removeUser,
    changeRole,
  };
};