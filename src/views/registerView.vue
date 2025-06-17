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
      <div v-if="errors.general" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        <ul class="list-disc list-inside">
          <li v-for="error in errors.general" :key="error">{{ error }}</li>
        </ul>
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
            :class="{ 'border-red-500': errors.name }"
            :disabled="loading"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="registerForm.email"
            type="email"
            placeholder="Enter your email"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.email }"
            :disabled="loading"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="registerForm.password"
            type="password"
            placeholder="Create a password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.password }"
            :disabled="loading"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password[0] }}</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            v-model="registerForm.confirmation_password"
            type="password"
            placeholder="Confirm your password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.confirmation_password }"
            :disabled="loading"
          />
          <p v-if="errors.confirmation_password" class="mt-1 text-sm text-red-600">{{ errors.confirmation_password[0] }}</p>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            v-model="registerForm.phone"
            type="tel"
            placeholder="Enter your phone number"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.phone }"
            :disabled="loading"
          />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone[0] }}</p>
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
import axios from '../plugins/axios'

const router = useRouter()

const loading = ref<boolean>(false)
const errors = ref<Record<string, string[]>>({})
const successMessage = ref<string>('')

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

const clearErrors = () => {
  errors.value = {}
}

const handleRegister = async (): Promise<void> => {
  clearErrors()
  successMessage.value = ''
  loading.value = true

  try {
    const response = await axios.post('/register', {
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password,
      confirmation_password: registerForm.value.confirmation_password,
      phone: registerForm.value.phone
    })
    
    registerForm.value = {
      name: '',
      email: '',
      password: '',
      confirmation_password: '',
      phone: ''
    }

    successMessage.value = 'Account created successfully! Redirecting to login...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value = { general: ['Registration failed'] }
    }
  } finally {
    loading.value = false
  }
}

const goToLogin = (): void => {
  router.push('/login')
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