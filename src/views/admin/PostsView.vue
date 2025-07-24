<template>
    <!-- filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\views\admin\PostsView.vue -->
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Header -->
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Posts</h1>
                <p class="text-gray-600">Manage job posts and positions</p>
            </div>
            <button @click="showCreateModal = true" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                <Plus :size="20" />
                <span>Add Post</span>
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
                        placeholder="Search posts..." 
                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                <select v-model="departmentFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    <option value="">All Departments</option>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                        {{ getDepartmentName(dept) }}
                    </option>
                </select>
                <button @click="refreshPosts" class="p-2 text-gray-500 hover:text-green-600 transition-colors">
                    <RefreshCw :size="20" />
                </button>
            </div>
        </div>

        <!-- Debug Info
        <div v-if="!loading && posts.length > 0" class="mb-4 p-4 bg-yellow-50 rounded-lg">
            <p class="text-sm text-yellow-800">Debug - First post data:</p>
            <pre class="text-xs text-yellow-700 mt-2">{{ JSON.stringify(posts[0], null, 2) }}</pre>
        </div> -->

        <!-- Posts Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
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
                                <div class="h-4 bg-gray-200 rounded w-24"></div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 rounded w-16"></div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 rounded w-20"></div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 rounded w-16"></div>
                            </td>
                        </tr>
                        <tr v-else-if="posts.length === 0">
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                                No posts found
                            </td>
                        </tr>
                        <tr v-else v-for="post in filteredPosts" :key="post.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ post.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ getPostName(post) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ getDepartmentNameById(post.department_id) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center space-x-2">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <Users :size="14" class="mr-1" />
                                        {{ post.employees_count || 0 }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(post.created_at) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex space-x-2">
                                    <button @click="viewEmployees(post)" class="text-green-600 hover:text-green-900 p-1" title="View Employees">
                                        <Users :size="16" />
                                    </button>
                                    <button @click="editPost(post)" class="text-blue-600 hover:text-blue-900 p-1" title="Edit Post">
                                        <Edit2 :size="16" />
                                    </button>
                                    <button @click="deletePost(post)" class="text-red-600 hover:text-red-900 p-1" title="Delete Post">
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
                    {{ showCreateModal ? 'Create Post' : 'Edit Post' }}
                </h3>
                
                <form @submit.prevent="showCreateModal ? createPost() : updatePost()">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
                        <input 
                            v-model="postForm.title" 
                            type="text" 
                            required 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter post title"
                        />
                    </div>
                    
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select 
                            v-model="postForm.department_id" 
                            required 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">Select a department</option>
                            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                {{ getDepartmentName(dept) }}
                            </option>
                        </select>
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

        <!-- Employees Modal -->
        <div v-if="showEmployeesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Employees in {{ selectedPost?.title }}
                    </h3>
                    <button @click="showEmployeesModal = false" class="text-gray-500 hover:text-gray-700">
                        <X :size="20" />
                    </button>
                </div>
                
                <div v-if="loadingEmployees" class="space-y-4">
                    <div v-for="n in 3" :key="n" class="animate-pulse">
                        <div class="flex items-center space-x-4">
                            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div class="flex-1 space-y-2">
                                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div v-else-if="employees.length === 0" class="text-center py-8">
                    <Users class="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p class="text-gray-500">No employees found for this post</p>
                </div>
                
                <div v-else class="space-y-4">
                    <div v-for="employee in employees" :key="employee.id" class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                            <span class="text-white text-sm font-semibold">{{ getInitials(employee.name) }}</span>
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">{{ employee.name }}</p>
                            <p class="text-xs text-gray-500">{{ employee.email }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\views\admin\PostsView.vue
import { ref, computed, onMounted } from 'vue'
import { Plus, Search, RefreshCw, Edit2, Trash2, Users, X } from 'lucide-vue-next'
import axios from '@/plugins/axios'

interface Department {
    id: number
    name?: string
    department_name?: string
    created_at: string
    updated_at: string
}

interface Post {
    id: number
    title: string  // Changed from name/post_name to title
    department_id: number
    employees_count?: number
    created_at: string
    updated_at: string
}

interface Employee {
    id: number
    name: string
    email: string
}

// Reactive data
const posts = ref<Post[]>([])
const departments = ref<Department[]>([])
const employees = ref<Employee[]>([])
const loading = ref(true)
const loadingEmployees = ref(false)
const searchQuery = ref('')
const departmentFilter = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showEmployeesModal = ref(false)
const selectedPost = ref<Post | null>(null)

const postForm = ref({
    title: '',  // Changed from post_name to title
    department_id: ''
})

// Helper functions
const getDepartmentName = (department: Department): string => {
    return department.department_name || department.name || 'Unknown Department'
}

const getPostName = (post: Post): string => {
    return post.title || 'Unknown Post'  // Changed to use title
}

const getDepartmentNameById = (departmentId: number): string => {
    const department = departments.value.find(d => d.id === departmentId)
    return department ? getDepartmentName(department) : 'Unknown Department'
}

const getInitials = (name: string): string => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
}

// Computed
const filteredPosts = computed(() => {
    let filtered = posts.value
    
    if (searchQuery.value) {
        filtered = filtered.filter(post => {
            const postName = getPostName(post)
            const departmentName = getDepartmentNameById(post.department_id)
            return postName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                   departmentName.toLowerCase().includes(searchQuery.value.toLowerCase())
        })
    }
    
    if (departmentFilter.value) {
        filtered = filtered.filter(post => post.department_id.toString() === departmentFilter.value)
    }
    
    return filtered
})

// Methods
const fetchDepartments = async () => {
    try {
        const response = await axios.get('/departments')
        departments.value = response.data.departments || response.data
    } catch (error) {
        console.error('Error fetching departments:', error)
    }
}

const fetchPosts = async () => {
    loading.value = true
    try {
        const response = await axios.get('/posts')
        console.log('Posts response:', response.data) // Debug log
        posts.value = response.data.posts || response.data
    } catch (error) {
        console.error('Error fetching posts:', error)
    } finally {
        loading.value = false
    }
}

const fetchEmployeesByPost = async (postId: number) => {
    loadingEmployees.value = true
    try {
        const response = await axios.get(`/posts/${postId}/employees`)
        employees.value = response.data.employees || response.data
    } catch (error) {
        console.error('Error fetching employees:', error)
        employees.value = []
    } finally {
        loadingEmployees.value = false
    }
}

const createPost = async () => {
    try {
        const response = await axios.post('/posts', postForm.value)
        posts.value.push(response.data.post || response.data)
        closeModal()
        fetchPosts() // Refresh the list
    } catch (error) {
        console.error('Error creating post:', error)
    }
}

const editPost = (post: Post) => {
    selectedPost.value = post
    postForm.value = {
        title: post.title,  // Changed from getPostName(post) to post.title
        department_id: post.department_id.toString()
    }
    showEditModal.value = true
}

const updatePost = async () => {
    if (!selectedPost.value) return
    
    try {
        const response = await axios.put(`/posts/${selectedPost.value.id}`, postForm.value)
        const index = posts.value.findIndex(p => p.id === selectedPost.value!.id)
        if (index !== -1) {
            posts.value[index] = response.data.post || response.data
        }
        closeModal()
    } catch (error) {
        console.error('Error updating post:', error)
    }
}

const deletePost = async (post: Post) => {
    const postName = getPostName(post)
    if (confirm(`Are you sure you want to delete the post "${postName}"?`)) {
        try {
            await axios.delete(`/posts/${post.id}`)
            posts.value = posts.value.filter(p => p.id !== post.id)
        } catch (error) {
            console.error('Error deleting post:', error)
        }
    }
}

const viewEmployees = (post: Post) => {
    selectedPost.value = post
    showEmployeesModal.value = true
    fetchEmployeesByPost(post.id)
}

const closeModal = () => {
    showCreateModal.value = false
    showEditModal.value = false
    selectedPost.value = null
    postForm.value = {
        title: '',  // Changed from post_name to title
        department_id: ''
    }
}

const refreshPosts = () => {
    fetchPosts()
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
}

// Lifecycle
onMounted(() => {
    fetchDepartments()
    fetchPosts()
})
</script>