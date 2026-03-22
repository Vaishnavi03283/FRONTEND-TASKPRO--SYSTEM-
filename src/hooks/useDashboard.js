import { useState, useEffect } from "react";
import {
  getUserDashboard,
  getManagerDashboard,
} from "../api/dashboard.api";
import { getAdminStats } from "../api/admin.api";

export const useUserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getUserDashboard();
        setData(result);
        setError(null);
      } catch (err) {
        setError("Failed to load user dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const useManagerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching manager dashboard data...");
      const result = await getManagerDashboard();
      console.log("✅ Dashboard data received:", result);
      setData(result);
      setError(null);
    } catch (err) {
      setError("Failed to load manager dashboard");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    console.log("🔄 Refetching dashboard data...");
    fetchData();
  };

  return { data, loading, error, refetch };
};

export const useAdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getAdminStats();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError("Failed to load admin dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};