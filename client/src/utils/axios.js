/**
 * Axios instance with base configuration
 */
import axios from 'axios'
import { API_BASE_URL } from '../config/api.js'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosInstance

