import axios, { type AxiosResponse, AxiosError } from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Types matching your Laravel API
export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmation_password: string
  phone?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  email_verified_at?: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token?: string
  message?: string
}

export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data)
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', response.status, response.data)
    return response
  },
  (error: AxiosError<ApiErrorResponse>) => {
    console.error('API Error:', error.response?.status, error.response?.data)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
    
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (userData: RegisterRequest): Promise<AxiosResponse<AuthResponse>> => 
    api.post('/register', userData),
  
  login: (credentials: LoginRequest): Promise<AxiosResponse<AuthResponse>> => 
    api.post('/login', credentials),
    
  logout: (): Promise<AxiosResponse> => 
    api.post('/logout'),
    
  me: (): Promise<AxiosResponse<User>> => 
    api.get('/user')
}

export default api