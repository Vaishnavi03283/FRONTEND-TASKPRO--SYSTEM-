import API from "./axios";

export const getTasks = async () => {
  const res = await API.get("/tasks");
  return res.data;
};

export const createTask = async (data) => {
  console.log('🔍 API: Creating task with data:', data);
  console.log('🔍 API: Endpoint: POST /tasks');
  
  // Validate required fields before sending
  if (!data.title || data.title.trim() === '') {
    throw new Error('Task title is required');
  }
  
  if (!data.project_id) {
    throw new Error('Project ID is required');
  }
  
  if (!data.created_by) {
    throw new Error('Created by user ID is required');
  }
  
  // Log the final payload
  const payload = {
    title: data.title.trim(),
    description: data.description?.trim() || '',
    priority: data.priority || 'MEDIUM',
    status: data.status || 'PENDING',
    due_date: data.due_date || null,
    project_id: data.project_id,
    assigned_user_ids: Array.isArray(data.assigned_user_ids) ? data.assigned_user_ids : [],
    created_by: data.created_by
  };
  
  console.log('🔍 API: Final payload being sent:', payload);
  
  try {
    const res = await API.post("/tasks", payload);
    console.log('✅ API: Task created successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ API: Task creation failed:', error.response?.data);
    console.error('❌ API: Error status:', error.response?.status);
    console.error('❌ API: Full error:', error);
    throw error;
  }
};

export const getTaskById = async (id) => {
  if (!id) {
    throw new Error('Task ID is required');
  }
  console.log('🔍 API: Fetching task with ID:', id);
  const res = await API.get(`/tasks/${id}`);
  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await API.put(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await API.delete(`/tasks/${id}`);
  return res.data;
};

export const assignTask = async (id, userId) => {
  if (!id) {
    throw new Error('Task ID is required for assignment');
  }
  if (!userId) {
    throw new Error('User ID is required for assignment');
  }
  
  console.log('🔗 API: Assigning task', id, 'to user', userId);
  console.log('🔗 API: Endpoint:', `PUT /tasks/${id}/assign`);
  console.log('🔗 API: Payload:', { userId });
  
  try {
    const res = await API.put(`/tasks/${id}/assign`, { userId });
    console.log('✅ API: Task assigned successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ API: Failed to assign task:', error.response?.data || error.message);
    throw error;
  }
};

// Enhanced assign task for multiple users
export const assignTaskToMultipleUsers = async (id, userIds) => {
  if (!id) {
    throw new Error('Task ID is required for assignment');
  }
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new Error('User IDs array is required for assignment');
  }
  
  console.log('🔗 API: Assigning task', id, 'to multiple users:', userIds);
  console.log('🔗 API: Endpoint:', `PUT /tasks/${id}/assign`);
  console.log('🔗 API: Payload:', { userIds });
  
  try {
    const res = await API.put(`/tasks/${id}/assign`, { userIds });
    console.log('✅ API: Task assigned to multiple users successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ API: Failed to assign task to multiple users:', error.response?.data || error.message);
    throw error;
  }
};

export const updateStatus = async (id, status) => {
  return API.patch(`/tasks/${id}/status`, { status });
};

export const getProjectTasks = async (projectId) => {
  try {
    // Try the direct endpoint first
    const res = await API.get(`/projects/${projectId}/tasks`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // Fallback: get all tasks and filter by project_id
      const allTasksRes = await API.get("/tasks");
      const allTasks = allTasksRes.data;
      
      // Handle both paginated and direct responses
      const tasks = Array.isArray(allTasks) ? allTasks : (allTasks?.data || []);
      
      // Filter tasks by project_id
      const projectTasks = tasks.filter(task => task.project_id === projectId);
      return {
        data: projectTasks,
        total: projectTasks.length,
        page: 1,
        limit: projectTasks.length
      };
    }
    throw error;
  }
};

// Comments API
export const addComment = async (taskId, commentData) => {
  const res = await API.post(`/tasks/${taskId}/comments`, commentData);
  return res.data;
};

export const getComments = async (taskId) => {
  if (!taskId) {
    throw new Error('Task ID is required');
  }
  console.log('🔍 API: Fetching comments for task ID:', taskId);
  const res = await API.get(`/tasks/${taskId}/comments`);
  return res.data;
};

export const deleteComment = async (taskId, commentId) => {
  const res = await API.delete(`/tasks/${taskId}/comments/${commentId}`);
  return res.data;
};

export const updateComment = async (taskId, commentId, commentData) => {
  const res = await API.put(`/tasks/${taskId}/comments/${commentId}`, commentData);
  return res.data;
};