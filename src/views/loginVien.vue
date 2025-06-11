<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <!-- Header -->
      <h1 class="text-3xl font-bold text-green-700 text-center mb-6">Welcome Back</h1>
      <p class="text-center text-gray-600 mb-8">Sign in to your account</p>

      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center mb-4">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="text-gray-600 mt-2">Signing you in...</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        <div v-if="Array.isArray(errorMessage)">
          <ul class="list-disc list-inside">
            <li v-for="error in errorMessage" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div v-else>{{ errorMessage }}</div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
        {{ successMessage }}
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="loginForm.email"
            type="email"
            placeholder="Enter your email"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            :disabled="loading"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            :disabled="loading"
          />
        </div>

        <!-- Remember Me and Forgot Password -->
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="loginForm.remember"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              :disabled="loading"
            />
            <label for="remember" class="ml-2 text-gray-600">
              Remember me
            </label>
          </div>
          <a href="#" class="text-green-600 hover:text-green-700 hover:underline">
            Forgot password?
          </a>
        </div>

        <!-- Sign In Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-base rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
        >
          {{ loading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <!-- Back to Home Button -->
      <button
        @click="goToHome"
        :disabled="loading"
        class="w-full mt-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Back to Home
      </button>

      <!-- Sign Up Link -->
      <div class="text-center mt-6">
        <span class="text-sm text-gray-600">Don't have an account? </span>
        <button 
          @click="goToRegister"
          :disabled="loading"
          class="text-sm font-medium text-green-600 hover:text-green-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign up
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, type ApiErrorResponse } from '../services/api'
import type { AxiosError } from 'axios'

const router = useRouter()

const loading = ref<boolean>(false)
const errorMessage = ref<string | string[]>('')
const successMessage = ref<string>('')

// Login form data matching your API structure
const loginForm = ref({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async (): Promise<void> => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''

  // Basic validation
  if (!loginForm.value.email || !loginForm.value.password) {
    errorMessage.value = 'Please fill in all required fields'
    return
  }

  loading.value = true

  try {
    // Call login API with credentials
    const response = await authAPI.login({
      email: loginForm.value.email,
      password: loginForm.value.password
    })

    console.log('Login successful:', response.data)
    
    // Store authentication data
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
    }
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    successMessage.value = 'Login successful! Redirecting...'
    
    // Clear form
    loginForm.value = {
      email: '',
      password: '',
      remember: false
    }

    // Redirect to home page after 1.5 seconds
    setTimeout(() => {
      router.push('/')
    }, 1500)

  } catch (error) {
    console.error('Login failed:', error)
    
    const axiosError = error as AxiosError<ApiErrorResponse>
    
    if (axiosError.response) {
      const { status, data } = axiosError.response
      
      if (status === 401) {
        // Unauthorized - wrong credentials
        errorMessage.value = 'Invalid email or password. Please try again.'
      } else if (status === 422) {
        // Validation errors
        if (data.errors) {
          // Convert errors object to array of strings
          const errorArray: string[] = []
          Object.keys(data.errors).forEach(key => {
            if (Array.isArray(data.errors![key])) {
              errorArray.push(...data.errors![key])
            }
          })
          errorMessage.value = errorArray
        } else {
          errorMessage.value = data.message || 'Invalid credentials'
        }
      } else if (status === 429) {
        // Too many requests
        errorMessage.value = 'Too many login attempts. Please try again later.'
      } else {
        errorMessage.value = data.message || 'Login failed. Please try again.'
      }
    } else if (axiosError.request) {
      // Network error
      errorMessage.value = 'Network error. Please check your connection and try again.'
    } else {
      // Other error
      errorMessage.value = 'Something went wrong. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const goToHome = (): void => {
  router.push('/')
}

const goToRegister = (): void => {
  router.push('/register')
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>