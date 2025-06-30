export interface User {
    id: number
    name: string
    email: string
    role: string
}

export interface ValidationErrors {
    email?: string[]
    password?: string[]
    incorrectField?: string[]
}