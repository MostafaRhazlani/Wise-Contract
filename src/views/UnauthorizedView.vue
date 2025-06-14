<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 py-8 px-4">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 class="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p class="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <button @click="goToHome"
                class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Go to Home
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
    router.push('/')
}
</script>