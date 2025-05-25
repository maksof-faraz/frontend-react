import axios from 'axios';
import type { AddTaskModal, LoginRegister, taskChecklist } from '../types/userTypes';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


// Add a request interceptor
API.interceptors.request.use((config) => {

  const token = localStorage.getItem('token'); // or sessionStorage
  if (token && typeof config.url === 'string' && !['/login', '/register'].includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});



export const registerUser = (userData : LoginRegister) => {
    return API.post('/register', userData);
} 

export const loginUser = (userData : LoginRegister) => {
  return API.post('/login', userData);
} 

export const addTask = (taskData : AddTaskModal) => {
    return API.post('/addTask', taskData);
} 

export const updateTask = (taskData : AddTaskModal) => {
    return API.patch('/updateTask', taskData);
} 

export const deleteTask = (taskId : string) => {
    return API.delete(`/deleteTask/${taskId}`);
} 
export const addTaskchecklist = (taskChecklist : taskChecklist[]) => {
    return API.post('/addTaskchecklist', taskChecklist);
} 

export const getTasks = (type : string) => {
    return API.get(`/getTasks/${type}`);
} 
