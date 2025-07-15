<template>
  <!-- filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\views\registerView.vue -->
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <!-- Header -->
      <h1 class="text-3xl font-bold text-green-700 text-center mb-6">Create Manager Account</h1>
      
      <!-- Step Indicator -->
      <div class="flex justify-between mb-8">
        <div class="flex items-center">
          <div :class="step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
          <span class="ml-2 text-sm" :class="step >= 1 ? 'text-green-600' : 'text-gray-500'">Personal Info</span>
        </div>
        <div class="flex-1 mx-4 mt-4">
          <div :class="step >= 2 ? 'bg-green-600' : 'bg-gray-300'" class="h-1 rounded"></div>
        </div>
        <div class="flex items-center">
          <div :class="step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
          <span class="ml-2 text-sm" :class="step >= 2 ? 'text-green-600' : 'text-gray-500'">Company Info</span>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center mb-4">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="text-gray-600 mt-2">{{ step === 1 ? 'Validating information...' : 'Creating your account...' }}</p>
      </div>

      <!-- Error Messages -->
      <div v-if="errors.general && errors.general.length > 0" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        <ul class="list-disc list-inside">
          <li v-for="error in errors.general" :key="error">{{ error }}</li>
        </ul>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
        {{ successMessage }}
      </div>

      <!-- Step 1: Personal Information -->
      <form v-if="step === 1" @submit.prevent="handleStep1" class="space-y-6">
        <p class="text-center text-gray-600 mb-6">Please fill in your personal information to get started.</p>

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
            v-model="registerForm.password_confirmation"
            type="password"
            placeholder="Confirm your password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.password_confirmation }"
            :disabled="loading"
          />
          <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation[0] }}</p>
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

        <!-- Next Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-base rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
        >
          {{ loading ? 'Validating...' : 'Next' }}
        </button>
      </form>

      <!-- Step 2: Company Information -->
      <form v-if="step === 2" @submit.prevent="handleStep2" class="space-y-6">
        <p class="text-center text-gray-600 mb-6">Please provide your company information.</p>

        <!-- Company Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            v-model="registerForm.company_name"
            type="text"
            placeholder="Enter your company name"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.company_name }"
            :disabled="loading"
          />
          <p v-if="errors.company_name" class="mt-1 text-sm text-red-600">{{ errors.company_name[0] }}</p>
        </div>

        <!-- Company Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
          <input
            v-model="registerForm.company_email"
            type="email"
            placeholder="Enter your company email"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.company_email }"
            :disabled="loading"
          />
          <p v-if="errors.company_email" class="mt-1 text-sm text-red-600">{{ errors.company_email[0] }}</p>
        </div>

        <!-- Company Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
          <textarea
            v-model="registerForm.company_address"
            placeholder="Enter your company address"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            :class="{ 'border-red-500': errors.company_address }"
            :disabled="loading"
          ></textarea>
          <p v-if="errors.company_address" class="mt-1 text-sm text-red-600">{{ errors.company_address[0] }}</p>
        </div>

        <!-- Company Logo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Logo (Optional)</label>
          <input
            @change="handleLogoUpload"
            type="file"
            accept="image/*"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            :disabled="loading"
          />
          <p class="mt-1 text-xs text-gray-500">Upload your company logo (JPG, PNG, GIF - Max 2MB)</p>
          
          <!-- Logo Preview -->
          <div v-if="logoPreview" class="mt-2">
            <img :src="logoPreview" alt="Company Logo Preview" class="w-20 h-20 object-cover rounded border">
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-4">
          <button
            type="button"
            @click="goBackToStep1"
            :disabled="loading"
            class="flex-1 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-base rounded focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-base rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>
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

const step = ref<number>(1)
const loading = ref<boolean>(false)
const errors = ref<Record<string, string[]>>({})
const successMessage = ref<string>('')
const logoPreview = ref<string>('')
const selectedFile = ref<File | null>(null)

interface RegisterForm {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone: string
  role_id: number
  company_name: string
  company_email: string
  company_address: string
}

const registerForm = ref<RegisterForm>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  role_id: 3, // Default to manager role
  company_name: '',
  company_email: '',
  company_address: ''
})

const clearErrors = () => {
  errors.value = {}
}

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      errors.value = { general: ['File size must be less than 2MB'] }
      return
    }

    // Store the file for later upload
    selectedFile.value = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const validateStep1 = (): boolean => {
  clearErrors()
  
  if (!registerForm.value.name) {
    errors.value.name = ['Name is required']
    return false
  }
  
  if (!registerForm.value.email) {
    errors.value.email = ['Email is required']
    return false
  }
  
  if (!registerForm.value.password) {
    errors.value.password = ['Password is required']
    return false
  }
  
  if (registerForm.value.password !== registerForm.value.password_confirmation) {
    errors.value.password_confirmation = ['Passwords do not match']
    return false
  }
  
  if (!registerForm.value.phone) {
    errors.value.phone = ['Phone is required']
    return false
  }
  
  return true
}

const validateStep2 = (): boolean => {
  clearErrors()
  
  if (!registerForm.value.company_name) {
    errors.value.company_name = ['Company name is required']
    return false
  }
  
  if (!registerForm.value.company_email) {
    errors.value.company_email = ['Company email is required']
    return false
  }
  
  if (!registerForm.value.company_address) {
    errors.value.company_address = ['Company address is required']
    return false
  }
  
  return true
}

const handleStep1 = async (): Promise<void> => {
  if (!validateStep1()) return
  
  loading.value = true
  
  try {
    step.value = 2
  } catch (error: any) {
    console.error('Step 1 error:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value = { general: ['Validation failed'] }
    }
  } finally {
    loading.value = false
  }
}

const handleStep2 = async (): Promise<void> => {
  if (!validateStep2()) return
  await submitRegistration()
}

const submitRegistration = async (): Promise<void> => {
  clearErrors()
  loading.value = true

  try {
    // Create FormData for multipart/form-data request
    const formData = new FormData()
    
    // Append all form fields
    formData.append('name', registerForm.value.name)
    formData.append('email', registerForm.value.email)
    formData.append('password', registerForm.value.password)
    formData.append('password_confirmation', registerForm.value.password_confirmation)
    formData.append('phone', registerForm.value.phone)
    formData.append('role_id', registerForm.value.role_id.toString())
    formData.append('company_name', registerForm.value.company_name)
    formData.append('company_email', registerForm.value.company_email)
    formData.append('company_address', registerForm.value.company_address)
    
    // Append file if selected
    if (selectedFile.value) {
      formData.append('company_logo', selectedFile.value, selectedFile.value.name)
    }

    console.log('Submitting registration data with FormData')
    
    const response = await axios.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    console.log('Registration successful:', response.data)
    successMessage.value = 'Account created successfully! Redirecting to login...'
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (error: any) {
    console.error('Registration error:', error)
    console.error('Error response:', error.response?.data)
    
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      errors.value = { general: [error.response.data.message] }
    } else if (error.message) {
      errors.value = { general: [error.message] }
    } else {
      errors.value = { general: ['Registration failed. Please try again.'] }
    }
  } finally {
    loading.value = false
  }
}

const goBackToStep1 = (): void => {
  step.value = 1
  clearErrors()
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