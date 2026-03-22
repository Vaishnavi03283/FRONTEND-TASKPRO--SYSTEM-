import { useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth.api";

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCurrentUser();
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // This would need an update profile API endpoint
      // For now, we'll just update the local state
      setProfile(prev => ({ ...prev, ...profileData }));
    } catch (err) {
      throw new Error(err.message || 'Failed to update profile');
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      // This would use the changePassword API
      const { changePassword } = await import("../api/auth.api");
      await changePassword(passwordData);
    } catch (err) {
      throw new Error(err.message || 'Failed to change password');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    updatePassword,
    refetch: fetchProfile
  };
};
