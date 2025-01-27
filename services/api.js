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
      return { mealRecord: null };
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

export const updateActivitiesRecord = async (residentId, activitiesData) => {
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
    console.error('Activities update error:', error);
    throw error.response?.data || { message: 'Error updating activities' };
  }
};
