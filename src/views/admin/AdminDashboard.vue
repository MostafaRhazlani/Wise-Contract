<template>
    <!-- filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\views\admin\AdminDashboard.vue -->
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p class="text-gray-600">Welcome back, {{ userName }}! Here's what's happening in your system.</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <Users :size="24" />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Total Users</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <Building2 :size="24" />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Companies</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.totalCompanies }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <LayoutTemplate :size="24" />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Templates</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.totalTemplates }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                        <FileText :size="24" />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Documents</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.totalDocuments }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                        <Building :size="24" />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Departments</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.totalDepartments }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 rounded-full bg-pink-100 text-pink-600 mr-4">
                        <Briefcase :size="24" />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Posts</p>
                        <p class="text-2xl font-bold text-gray-900">{{ stats.totalPosts }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Recent Activity -->
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div class="p-6">
                    <div v-if="loading" class="space-y-4">
                        <div v-for="n in 5" :key="n" class="animate-pulse">
                            <div class="flex items-center space-x-4">
                                <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div class="flex-1 space-y-2">
                                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="space-y-4">
                        <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-4">
                            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                <span class="text-white text-sm font-semibold">{{ activity.userInitials }}</span>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900">{{ activity.description }}</p>
                                <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- System Overview -->
            <div class="bg-white rounded-lg shadow">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">System Overview</h3>
                </div>
                <div class="p-6">
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-600">Active Users</span>
                            <span class="text-sm font-bold text-green-600">{{ stats.activeUsers }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-600">Server Status</span>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                                Online
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-600">Storage Used</span>
                            <span class="text-sm font-bold text-gray-900">{{ stats.storageUsed }}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-600 h-2 rounded-full" :style="{ width: stats.storageUsed + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-8 bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <button @click="navigateTo('/admin/users')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <Users class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm font-medium text-gray-600">Manage Users</p>
                    </button>
                    <button @click="navigateTo('/admin/companies')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors">
                        <Building2 class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm font-medium text-gray-600">Manage Companies</p>
                    </button>
                    <button @click="navigateTo('/admin/templates')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
                        <LayoutTemplate class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm font-medium text-gray-600">Manage Templates</p>
                    </button>
                    <button @click="navigateTo('/admin/departments')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                        <Building class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm font-medium text-gray-600">Manage Departments</p>
                    </button>
                    <button @click="navigateTo('/admin/posts')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-colors">
                        <Briefcase class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm font-medium text-gray-600">Manage Posts</p>
                    </button>
                    <button @click="navigateTo('/admin/settings')" class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors">
                        <Settings class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm font-medium text-gray-600">System Settings</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { 
    Users, 
    Building2, 
    LayoutTemplate, 
    FileText, 
    Settings,
    Building,
    Briefcase
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const loading = ref(true)
const stats = ref({
    totalUsers: 0,
    totalCompanies: 0,
    totalTemplates: 0,
    totalDocuments: 0,
    totalDepartments: 0,
    totalPosts: 0,
    activeUsers: 0,
    storageUsed: 0
})

const recentActivities = ref([
    {
        id: 1,
        userInitials: 'JD',
        description: 'John Doe created a new template',
        timestamp: '2 minutes ago'
    },
    {
        id: 2,
        userInitials: 'SM',
        description: 'Sarah Miller updated company settings',
        timestamp: '15 minutes ago'
    },
    {
        id: 3,
        userInitials: 'RA',
        description: 'Robert Anderson created a new department',
        timestamp: '1 hour ago'
    },
    {
        id: 4,
        userInitials: 'LW',
        description: 'Lisa Williams added new post',
        timestamp: '2 hours ago'
    },
    {
        id: 5,
        userInitials: 'MJ',
        description: 'Mike Johnson joined the system',
        timestamp: '3 hours ago'
    }
])

// Computed properties
const userName = computed(() => authStore.user?.name || 'Admin')

// Methods
const navigateTo = (path: string) => {
    router.push(path)
}

const fetchDashboardData = async () => {
    loading.value = true
    
    try {
        // Simulate API calls - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - replace with actual API responses
        stats.value = {
            totalUsers: 1247,
            totalCompanies: 86,
            totalTemplates: 342,
            totalDocuments: 5678,
            totalDepartments: 24,
            totalPosts: 156,
            activeUsers: 89,
            storageUsed: 67
        }
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
    } finally {
        loading.value = false
    }
}

// Lifecycle
onMounted(() => {
    fetchDashboardData()
})
</script>