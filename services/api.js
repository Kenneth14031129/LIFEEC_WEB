import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Login
export const registerUser = async (userData) => {
  try {
    const { data } = await api.post('/users/register', userData);
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred' };
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data } = await api.post('/users/login', { email, password });
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifyOTP = async (otpData) => {
  try {
    const { data } = await api.post('/users/verify-otp', otpData);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'OTP verification failed' };
  }
};

// Resident List
export const getResidents = async () => {
  try {
    const { data } = await api.get('/residents');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching residents' };
  }
};

//Add Resident
export const addNewResident = async (residentData) => {
  try {
    const { data } = await api.post('/addresidents/add', residentData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error adding resident' };
  }
};

//Resident Details
export const getResidentDetails = async (id) => {
  try {
    const { data } = await api.get(`/residents/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching resident details' };
  }
};

export const updateHealth = async (id, healthData) => {
  try {
    const { data } = await api.put(`/residents/${id}/health`, healthData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating health data' };
  }
};

//Health Record
export const createHealthRecord = async (residentId, healthData) => {
  try {
    const { data } = await api.post(`/residents/${residentId}/health`, healthData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating health record' };
  }
};

export const getHealthRecords = async (residentId) => {
  try {
    const { data } = await api.get(`/residents/${residentId}/health`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching health records' };
  }
};

export const updateHealthRecord = async (residentId, recordId, healthData) => {
  try {
    const { data } = await api.put(`/residents/${residentId}/health/${recordId}`, healthData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating health record' };
  }
};

//Meal Record
export const getMealRecord = async (residentId) => {
  try {
    const { data } = await api.get(`/residents/${residentId}/meals`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { mealRecords: [] };
    }
    throw error;
  }
};

export const createMealRecord = async (residentId, mealData) => {
  try {
    const { data } = await api.post(`/residents/${residentId}/meals`, mealData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating meal record' };
  }
};

export const updateMealRecord = async (residentId, recordId, mealData) => {
  try {
    const { data } = await api.put(
      `/residents/${residentId}/meals/${recordId}`,
      mealData
    );
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating meal record' };
  }
};

// Activities Record
export const getActivitiesRecord = async (residentId) => {
  try {
    const { data } = await api.get(`/residents/${residentId}/activities`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { activities: [] };
    }
    throw error.response?.data || { message: 'Error fetching activities' };
  }
};

export const createActivitiesRecord = async (residentId, activitiesData) => {
  try {
    // Ensure date is in correct format
    const processedData = {
      ...activitiesData,
      activities: activitiesData.activities.map(activity => ({
        ...activity,
        date: new Date(activity.date).toISOString().split('T')[0]
      }))
    };

    const { data } = await api.post(`/residents/${residentId}/activities`, processedData);
    return data;
  } catch (error) {
    console.error('Activities creation error:', error);
    throw error.response?.data || { message: 'Error creating activities record' };
  }
};

export const updateActivitiesRecord = async (residentId, recordId, activitiesData) => {
  try {
    // Ensure date is in correct format
    const processedData = {
      ...activitiesData,
      activities: activitiesData.activities.map(activity => ({
        ...activity,
        date: new Date(activity.date).toISOString().split('T')[0]
      }))
    };

    const { data } = await api.put(`/residents/${residentId}/activities/${recordId}`, processedData);
    return data;
  } catch (error) {
    console.error('Activities update error:', error);
    throw error.response?.data || { message: 'Error updating activities' };
  }
};

//Add User
export const getUsers = async () => {
  try {
    const { data } = await api.get('/users');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching users' };
  }
};

export const addUser = async (userData) => {
  try {
    const { data } = await api.post('/users/add', userData);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error adding user' };
  }
};

//Emergency Alert
export const createEmergencyAlert = async (alertData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const { data } = await api.post('/emergency-alerts', alertData);
    return data;
  } catch (error) {
    console.error('Detailed error:', error.response || error);
    throw error.response?.data || { message: 'Error creating emergency alert' };
  }
};

export const getResidentEmergencyAlerts = async (residentId) => {
  try {
    const { data } = await api.get(`/emergency-alerts/${residentId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching emergency alerts' };
  }
};

export const markAlertsAsRead = async (alertIds) => {
  try {
    const { data } = await api.put('/emergency-alerts/mark-read', { alertIds });
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error marking alerts as read' };
  }
};

//View Profile
export const getProfile = async () => {
  try {
    const { data } = await api.get('/users/profile');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching profile' };
  }
};

export const updateProfile = async (userData) => {
  try {
    console.log('Sending update request with data:', userData);
    const { data } = await api.put('/users/profile', userData);
    console.log('Server response:', data);
    return data;
  } catch (error) {
    console.error('Update profile error:', error.response || error);
    throw error.response?.data || { 
      message: error.response?.data?.message || error.message || 'Error updating profile' 
    };
  }
};

export const changeUserPassword = async (passwordData) => {
  try {
    const { data } = await api.put('/users/change-password', passwordData);
    return data;
  } catch (error) {
    throw error.response?.data || { 
      message: 'Error changing password' 
    };
  }
};

//Messages
export const getConversations = async () => {
  try {
    const { data } = await api.get('/conversations');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching conversations' };
  }
};

export const getMessages = async (userId) => {
  try {
    const { data } = await api.get(`/messages/${userId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching messages' };
  }
};

export const sendMessage = async (receiverId, content) => {
  try {
    const { data } = await api.post('/messages', {
      receiverId,
      content
    });
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error sending message' };
  }
};

export const markMessagesAsDelivered = async (senderId) => {
  try {
    const { data } = await api.put(`/messages/deliver/${senderId}`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error marking messages as delivered' };
  }
};

export const markMessagesAsRead = async (senderId) => {
  try {
    const { data } = await api.put(`/messages/${senderId}/read`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error marking messages as read' };
  }
};

//Archive
export const archiveUser = async (userId) => {
  try {
    const { data } = await api.put(`/users/${userId}/archive`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error archiving user' };
  }
};

export const getArchivedUsers = async () => {
  try {
    const { data } = await api.get('/users/archived');
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching archived users' };
  }
};

export const restoreUser = async (userId) => {
  try {
    const { data } = await api.put(`/users/${userId}/restore`);
    return data;
  } catch (error) {
    throw error.response?.data || { message: 'Error restoring user' };
  }
};
