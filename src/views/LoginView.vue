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
            :class="{ 'border-red-500': errors.email || errors.incorrectField }"
            :disabled="loading" 
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
          <p v-else-if="errors.incorrectField" class="mt-1 text-sm text-red-600">{{ errors.incorrectField[0] }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            :class="{ 'border-red-500': errors.password || errors.incorrectField }"
            :disabled="loading" 
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password[0] }}</p>
          <p v-else-if="errors.incorrectField" class="mt-1 text-sm text-red-600">{{ errors.incorrectField[0] }}</p>
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

      <!-- Sign Up Link -->
      <div class="text-center mt-6">
        <span class="text-sm text-gray-600">Don't have an account? </span>
        <button @click="goToRegister" :disabled="loading"
          class="text-sm font-medium text-green-600 hover:text-green-700 underline disabled:opacity-50 disabled:cursor-not-allowed">
          Sign up
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref<boolean>(false)

const errors = computed(() => authStore.errors)

interface LoginForm {
  email: string
  password: string
}

const loginForm = ref<LoginForm>({
  email: '',
  password: ''
})

const clearErrors = () => {
  authStore.errors = {}
}

const handleLogin = async (): Promise<void> => {
  loading.value = true
  clearErrors()

  try {
    await authStore.login(loginForm.value.email, loginForm.value.password)

    loginForm.value = {
      email: '',
      password: ''
    }

  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
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