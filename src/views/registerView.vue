<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <!-- Header -->
      <h1 class="text-3xl font-bold text-green-700 text-center mb-6">Create Your Account</h1>
      <p class="text-center text-gray-600 mb-8">Please fill in the information to register.</p>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            v-model="registerForm.fullName"
            type="text"
            placeholder="Enter your full name"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
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
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-base rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Sign Up
        </button>
      </form>

      
      <!-- Back to Home Button -->
      <button
        @click="goToHome"
        class="w-full mt-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors"
      >
        Back to Home
      </button>

      <!-- Sign In Link -->
      <div class="text-center mt-6">
        <span class="text-sm text-gray-600">Already have an account? </span>
        <button 
          @click="goToLogin"
          class="text-sm font-medium text-green-600 hover:text-green-700 underline"
        >
          Sign in
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const registerForm = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('Passwords do not match!')
    return
  }
  
  alert(`Registration attempted with:\nName: ${registerForm.value.fullName}\nEmail: ${registerForm.value.email}\nPassword: ${registerForm.value.password}`)
  console.log('Register data:', registerForm.value)
}

const handleSocialRegister = (provider) => {
  alert(`${provider} registration clicked`)
}

const goToHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/auth')
}
</script>

<style scoped>
/* Tailwind handles most styling, only minimal overrides if desired. */
</style>