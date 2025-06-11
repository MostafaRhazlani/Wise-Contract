<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, Star, Settings, Home, User, Mail, LogIn, UserPlus } from 'lucide-vue-next'

const router = useRouter()
const count = ref(0)
const isVisible = ref(true)

const goToAuth = () => {
  router.push('/auth')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="text-center mb-12">
        <div class="flex items-center justify-center mb-4">
          <Heart class="w-8 h-8 text-red-500 mr-3" />
          <h1 class="text-4xl font-bold text-gray-800">
            Wise Contract
          </h1>
          <Star class="w-8 h-8 text-yellow-500 ml-3" />
        </div>
        <p class="text-lg text-gray-600 mb-6">
          Testing Tailwind dependencies and utilities with Lucide icons
        </p>
        
        <!-- Auth Buttons -->
        <div class="flex gap-4 justify-center">
          <button 
            @click="goToAuth"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
          >
            <LogIn class="w-5 h-5 mr-2" />
            Login
          </button>
          <button 
            @click="goToRegister"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
          >
            <UserPlus class="w-5 h-5 mr-2" />
            Register
          </button>
        </div>
      </header>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Card 1 - Colors & Typography -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center mb-3">
            <Settings class="w-5 h-5 text-blue-600 mr-2" />
            <h2 class="text-xl font-semibold text-blue-600">Colors & Typography</h2>
          </div>
          <p class="text-gray-700 mb-4">Testing various color schemes and font weights.</p>
          <div class="space-y-2">
            <div class="w-full h-4 bg-red-500 rounded"></div>
            <div class="w-full h-4 bg-green-500 rounded"></div>
            <div class="w-full h-4 bg-blue-500 rounded"></div>
          </div>
        </div>

        <!-- Card 2 - Interactive Counter -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl font-semibold text-green-600 mb-3">Interactive Counter</h2>
          <div class="text-center">
            <div class="text-3xl font-bold text-gray-800 mb-4">{{ count }}</div>
            <button 
              @click="count++"
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Increment
            </button>
            <button 
              @click="count = 0"
              class="ml-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </div>

        <!-- Card 3 - Toggle Visibility -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-xl font-semibold text-purple-600 mb-3">Toggle Component</h2>
          <button 
            @click="isVisible = !isVisible"
            class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg mb-4 transition-colors duration-200"
          >
            Toggle Box
          </button>
          <div 
            v-if="isVisible" 
            class="w-full h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-semibold transition-all duration-300"
          >
            I'm visible! 🎉
          </div>
        </div>
      </div>

      <!-- Responsive Navigation Bar -->
      <nav class="bg-white rounded-lg shadow-lg p-4 mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div class="flex items-center">
            <Home class="w-5 h-5 text-gray-800 mr-2" />
            <div class="text-lg font-semibold text-gray-800">Navigation Test</div>
          </div>
          <div class="flex space-x-4">
            <button @click="goToAuth" class="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
              <LogIn class="w-4 h-4 mr-1" />
              Login
            </button>
            <button @click="goToRegister" class="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200">
              <UserPlus class="w-4 h-4 mr-1" />
              Register
            </button>
            <a href="#" class="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
              <User class="w-4 h-4 mr-1" />
              About
            </a>
            <a href="#" class="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
              <Mail class="w-4 h-4 mr-1" />
              Contact
            </a>
          </div>
        </div>
      </nav>
    </div>
  </main>
</template>

<style scoped>
/* Custom styles if needed - Tailwind should handle most styling */
</style>