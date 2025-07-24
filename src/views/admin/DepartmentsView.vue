<template>
    <!-- filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\views\admin\DepartmentsView.vue -->
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Header -->
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Departments</h1>
                <p class="text-gray-600">Manage your organization's departments</p>
            </div>
            <button @click="showCreateModal = true" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Plus :size="20" />
                <span>Add Department</span>
            </button>
        </div>

        <!-- Search and Filter -->
        <div class="mb-6 bg-white rounded-lg shadow p-4">
            <div class="flex items-center space-x-4">
                <div class="flex-1 relative">
                    <Search :size="20" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        placeholder="Search departments..." 
                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <button @click="refreshDepartments" class="p-2 text-gray-500 hover:text-green-600 transition-colors">
                    <RefreshCw :size="20" />
                </button>
            </div>
        </div>

      

        <!-- Departments Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="loading" v-for="n in 5" :key="n" class="animate-pulse">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 rounded w-8"></div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 rounded w-32"></div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 rounded w-20"></div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 rounded w-20"></div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 rounded w-16"></div>
                            </td>
                        </tr>
                        <tr v-else-if="departments.length === 0">
                            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                                No departments found
                            </td>
                        </tr>
                        <tr v-else v-for="department in filteredDepartments" :key="department.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ department.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ getDepartmentName(department) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(department.created_at) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(department.updated_at) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex space-x-2">
                                    <button @click="editDepartment(department)" class="text-blue-600 hover:text-blue-900 p-1">
                                        <Edit2 :size="16" />
                                    </button>
                                    <button @click="deleteDepartment(department)" class="text-red-600 hover:text-red-900 p-1">
                                        <Trash2 :size="16" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    {{ showCreateModal ? 'Create Department' : 'Edit Department' }}
                </h3>
                
                <form @submit.prevent="showCreateModal ? createDepartment() : updateDepartment()">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                        <input 
                            v-model="departmentForm.department_name" 
                            type="text" 
                            required 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter department name"
                        />
                    </div>
                    
                    <div class="flex justify-end space-x-3">
                        <button 
                            type="button" 
                            @click="closeModal" 
                            class="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            {{ showCreateModal ? 'Create' : 'Update' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Search, RefreshCw, Edit2, Trash2 } from 'lucide-vue-next'
import axios from '@/plugins/axios'

interface Department {
    id: number
    name?: string
    department_name?: string
    created_at: string
    updated_at: string
}

// Reactive data
const departments = ref<Department[]>([])
const loading = ref(true)
const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedDepartment = ref<Department | null>(null)

const departmentForm = ref({
    department_name: ''
})

// Helper function to get department name
const getDepartmentName = (department: Department): string => {
    return department.department_name || department.name || 'No Name'
}

// Computed
const filteredDepartments = computed(() => {
    if (!searchQuery.value) return departments.value
    return departments.value.filter(dept => {
        const name = getDepartmentName(dept)
        return name.toLowerCase().includes(searchQuery.value.toLowerCase())
    })
})

// Methods
const fetchDepartments = async () => {
    loading.value = true
    try {
        const response = await axios.get('/departments')
        console.log('Departments response:', response.data) // Debug log
        departments.value = response.data.departments || response.data
    } catch (error) {
        console.error('Error fetching departments:', error)
    } finally {
        loading.value = false
    }
}

const createDepartment = async () => {
    try {
        const response = await axios.post('/departments', departmentForm.value)
        departments.value.push(response.data.department || response.data)
        closeModal()
    } catch (error) {
        console.error('Error creating department:', error)
    }
}

const editDepartment = (department: Department) => {
    selectedDepartment.value = department
    departmentForm.value = {
        department_name: getDepartmentName(department)
    }
    showEditModal.value = true
}

const updateDepartment = async () => {
    if (!selectedDepartment.value) return
    
    try {
        const response = await axios.put(`/departments/${selectedDepartment.value.id}`, departmentForm.value)
        const index = departments.value.findIndex(d => d.id === selectedDepartment.value!.id)
        if (index !== -1) {
            departments.value[index] = response.data.department || response.data
        }
        closeModal()
    } catch (error) {
        console.error('Error updating department:', error)
    }
}

const deleteDepartment = async (department: Department) => {
    const name = getDepartmentName(department)
    if (confirm(`Are you sure you want to delete the department "${name}"?`)) {
        try {
            await axios.delete(`/departments/${department.id}`)
            departments.value = departments.value.filter(d => d.id !== department.id)
        } catch (error) {
            console.error('Error deleting department:', error)
        }
    }
}

const closeModal = () => {
    showCreateModal.value = false
    showEditModal.value = false
    selectedDepartment.value = null
    departmentForm.value = {
        department_name: ''
    }
}

const refreshDepartments = () => {
    fetchDepartments()
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
    fetchDepartments()
})
</script>