import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { ref, computed } from 'vue'

interface User {
    id: number
    name: string
    email: string
    role: string
}

interface ValidationErrors {
    email?: string[]
    password?: string[]
    incorrectField?: string[]
}

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token'))
    const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
    const userRole = ref<string | null>(localStorage.getItem('userRole'))
    const errors = ref<ValidationErrors>({})

    const setUser = (userData: User) => {
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const login = async (email: string, password: string) => {
        errors.value = {}
        try {
            const response = await axios.post('/login', { email, password })
            
            if (response.data.token) {
                token.value = response.data.token
                localStorage.setItem('token', response.data.token)
            }

            if (response.data.user) {
                setUser(response.data.user)
                userRole.value = response.data.user.role_id
                localStorage.setItem('userRole', response.data.user.role_id)
            }

        } catch (error: any) {
            if (error.response?.data?.errors) {
                errors.value = error.response.data.errors
            }
        }
    }

    const logout = () => {
        token.value = null
        user.value = null
        userRole.value = null
        errors.value = {}
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('userRole')
    }

    return {
        token,
        user,
        userRole,
        errors,
        login,
        logout,
        setUser
    }
})
