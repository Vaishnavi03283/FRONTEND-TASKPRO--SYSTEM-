import { useState, useEffect } from 'react';
import commentAPI from '../api/comment.api';

export const useComments = (taskId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentAPI.getComments(taskId);
      setComments(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (text) => {
    try {
      const response = await commentAPI.addComment(taskId, { text });
      setComments((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (taskId) fetchComments();
  }, [taskId]);

  return { comments, loading, error, addComment, deleteComment, refresh: fetchComments };
};