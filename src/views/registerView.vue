<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <!-- Header -->
      <h1 class="text-3xl font-bold text-green-700 text-center mb-6">Create Your Account</h1>
      <p class="text-center text-gray-600 mb-8">Please fill in the information to register.</p>

      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center mb-4">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="text-gray-600 mt-2">Creating your account...</p>
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

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            v-model="registerForm.name"
            type="text"
            placeholder="Enter your full name"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            :disabled="loading"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="registerForm.email"
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
            v-model="registerForm.password"
            type="password"
            placeholder="Create a password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            :disabled="loading"
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            v-model="registerForm.confirmation_password"
            type="password"
            placeholder="Confirm your password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            :disabled="loading"
          />
        </div>

        <!-- Phone (Optional - as shown in your Postman) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
          <input
            v-model="registerForm.phone"
            type="tel"
            placeholder="Enter your phone number"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            :disabled="loading"
          />
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-base rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
        >
          {{ loading ? 'Creating Account...' : 'Sign Up' }}
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

      <!-- Sign In Link -->
      <div class="text-center mt-6">
        <span class="text-sm text-gray-600">Already have an account? </span>
        <button 
          @click="goToLogin"
          :disabled="loading"
          class="text-sm font-medium text-green-600 hover:text-green-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign in
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

// Register form with proper typing
interface RegisterForm {
  name: string
  email: string
  password: string
  confirmation_password: string
  phone: string
}

const registerForm = ref<RegisterForm>({
  name: '',
  email: '',
  password: '',
  confirmation_password: '',
  phone: ''
})

const handleRegister = async (): Promise<void> => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''

  // Validate passwords match
  if (registerForm.value.password !== registerForm.value.confirmation_password) {
    errorMessage.value = 'Passwords do not match!'
    return
  }

  // Validate password length
  if (registerForm.value.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long!'
    return
  }

  loading.value = true

  try {
    // Send data exactly as shown in your Postman
    const response = await authAPI.register({
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password,
      confirmation_password: registerForm.value.confirmation_password,
      phone: registerForm.value.phone
    })

    console.log('Registration successful:', response.data)
    
    successMessage.value = 'Account created successfully! Redirecting to login...'
    
    // Clear form
    registerForm.value = {
      name: '',
      email: '',
      password: '',
      confirmation_password: '',
      phone: ''
    }

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/auth')
    }, 2000)

  } catch (error) {
    console.error('Registration failed:', error)
    
    const axiosError = error as AxiosError<ApiErrorResponse>
    
    if (axiosError.response) {
      const { status, data } = axiosError.response
      
      if (status === 422) {
        // Handle validation errors like in your Postman response
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
          errorMessage.value = data.message || 'Validation failed'
        }
      } else if (status === 409) {
        errorMessage.value = 'Email already exists'
      } else {
        errorMessage.value = data.message || 'Registration failed'
      }
    } else if (axiosError.request) {
      errorMessage.value = 'Network error. Please check your connection and try again.'
    } else {
      errorMessage.value = 'Something went wrong. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const goToHome = (): void => {
  router.push('/')
}

const goToLogin = (): void => {
  router.push('/auth')
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