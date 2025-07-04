import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, ValidationErrors } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token'))
    const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
    const userRole = ref<number | null>(localStorage.getItem('userRole') ? parseInt(localStorage.getItem('userRole')!) : null)
    const errors = ref<ValidationErrors>({})
    const router = useRouter()

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
                localStorage.setItem('userRole', response.data.user.role_id.toString())

                // Redirect based on role
                if (response.data.user.role_id === 3) {
                    router.push({ name: 'ManagerDashboard' })
                } else if (response.data.user.role_id === 4) {
                    router.push({ name: 'Home' })
                }
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
