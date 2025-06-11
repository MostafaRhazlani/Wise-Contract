import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/auth',
        name: 'Auth',
        component: () => import('../views/loginVien.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/registerView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router