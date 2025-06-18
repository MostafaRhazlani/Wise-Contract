<template>
  <div class="space-y-4 p-6 pt-20">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">User Management</h2>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="user.avatar" :alt="user.name" class="h-10 w-10 rounded-full" />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.company }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
                  ]"
                >
                  {{ user.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  company: string;
  status: "active" | "pending";
  avatar: string;
}

interface Company {
  id: number;
  name: string;
}

// Sample data
const companies = ref<Company[]>([
  { id: 1, name: "TechCorp Inc." },
  { id: 2, name: "Green Energy Solutions" },
  { id: 3, name: "Digital Marketing Pro" },
  { id: 4, name: "FinTech Innovations" },
]);

const users = ref<User[]>([
  {
    id: 1,
    name: "Mostafa Rhazlani",
    email: "mo@gmail.com",
    role: "Admin",
    company: "AgriWise",
    status: "active",
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D1D5DB'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E",
  },
]);
</script> 