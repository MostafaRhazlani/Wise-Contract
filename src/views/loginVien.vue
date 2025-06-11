<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <!-- Header -->
      <h1 class="text-3xl font-bold text-green-700 text-center mb-6">Welcome</h1>
      <p class="text-center text-gray-600 mb-8">Sign in to your account</p>

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
          />
        </div>

        <!-- Remember Me and Forgot -->
        <div class="flex items-center justify-between text-sm text-gray-600">
          <div>
            <input
              id="rememberMe"
              v-model="loginForm.remember"
              type="checkbox"
              class="mr-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <label for="rememberMe" class="cursor-pointer">
              Remember me
            </label>
          </div>
          <a href="#" class="text-green-600 hover:underline hover:text-green-700">
            Forgot password?
          </a>
        </div>

        <!-- Sign In Button -->
        <button
          type="submit"
          class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Sign In
        </button>
      </form>

      <!-- Back to Home Button -->
      <button
        @click="goToHome"
        class="w-full mt-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors"
      >
        Back to Home
      </button>

      <!-- Sign Up Link -->
      <div class="text-center mt-6">
        <span class="text-sm text-gray-600">Don't have an account? </span>
        <button 
          @click="goToRegister"
          class="text-sm font-medium text-green-600 hover:text-green-700 underline"
        >
          Sign up
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginForm = ref({
  email: '',
  password: '',
  remember: false
})

const handleLogin = () => {
  alert(`Login attempted with:\nEmail: ${loginForm.value.email}\nPassword: ${loginForm.value.password}`)
  console.log('Login data:', loginForm.value)
}

const goToHome = () => {
  router.push('/')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
/* Tailwind handles most styling, only minimal overrides if desired. */
</style>