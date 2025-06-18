import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import axios from '../plugins/axios'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/register',
            name: 'Register',
            component: () => import('../views/registerView.vue')
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/',
            name: 'Home',
            component: () => import('../views/HomeView.vue'),
            meta: {
                requiresAuth: true,
                role: [4],
                showSidebar: true,
                showHeader: false
            }
        },
        {
            path: '/editor/:type',
            name: 'Editor',
            component: () => import('../views/EditorView.vue'),
            meta: {
                requiresAuth: true,
                role: [4],
            }
        },
        {
            path: '/unauthorized',
            name: 'Unauthorized',
            component: () => import('../views/UnauthorizedView.vue'),
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/manager/dashboard',
            name: 'ManagerDashboard',
            component: () => import('../views/manager/DashboardView.vue'),
            meta: {
                requiresAuth: true,
                role: [3],
                showSidebar: true,
                showHeader: true
            }
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const token = authStore.token

    if (to.meta.requiresAuth) {
        if (!token) {
            authStore.logout()
            return next({ name: 'Login' })
        }
        
        try {
            const response = await axios.get('/me')
            const user = response.data.user
            const role = user.role_id
            authStore.setUser(user)
            authStore.userRole = role

            const requiredRoles = to.meta.role as number[] | undefined
            if (requiredRoles && authStore.userRole !== null) {
                // Check if user has required role
                console.log(requiredRoles);
                if (!requiredRoles.includes(authStore.userRole)) {
                    
                    // Only redirect to Unauthorized if not already there
                    if (to.name !== 'Unauthorized') {
                        return next({ name: 'Unauthorized' })
                    }
                }
            }
            // If no roles required or role check passed, allow access
            return next()
        } catch (error) {
            authStore.logout()
            return next({ name: 'Login' })
        }

    } else {
        return next()
    }
})

export default router