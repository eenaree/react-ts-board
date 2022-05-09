import axios from 'axios';

export const localServer = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});
