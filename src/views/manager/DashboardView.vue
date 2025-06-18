<template>
  <div class="min-h-screen">
    <div class="flex">
      <!-- Main Content -->
      <main class="flex-1 p-6">
        <!-- Overview Tab -->
        <div class="space-y-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Companies</p>
                  <p class="text-2xl font-bold text-gray-900">{{ totalCompanies }}</p>
                </div>
                <Building2 class="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Users</p>
                  <p class="text-2xl font-bold text-gray-900">{{ totalUsers }}</p>
                </div>
                <Users class="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Active Users</p>
                  <p class="text-2xl font-bold text-gray-900">{{ activeUsers }}</p>
                </div>
                <UserCheck class="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Pending Users</p>
                  <p class="text-2xl font-bold text-gray-900">{{ pendingUsers }}</p>
                </div>
                <Clock class="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                <span class="text-sm text-gray-700">New company "TechCorp Inc." was created</span>
                <span class="text-xs text-gray-500 ml-auto">2 hours ago</span>
              </div>
              <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span class="text-sm text-gray-700">User "Alice Johnson" was assigned Admin role</span>
                <span class="text-xs text-gray-500 ml-auto">4 hours ago</span>
              </div>
              <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-2 h-2 bg-yellow-600 rounded-full"></div>
                <span class="text-sm text-gray-700">3 new users are pending approval</span>
                <span class="text-xs text-gray-500 ml-auto">1 day ago</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button
                  @click="navigateToCompany"
                  class="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    <Building2 class="h-5 w-5 text-green-600" />
                    <span class="text-sm font-medium text-gray-900">Manage Companies</span>
                  </div>
                  <ChevronRight class="h-4 w-4 text-gray-400" />
                </button>
                <button
                  @click="navigateToUsers"
                  class="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    <Users class="h-5 w-5 text-green-600" />
                    <span class="text-sm font-medium text-gray-900">Manage Users</span>
                  </div>
                  <ChevronRight class="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Task Overview</h3>
              <div class="space-y-4">
                <div v-for="task in tasks" :key="task.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <CheckCircle2 v-if="task.status === 'completed'" class="h-5 w-5 text-green-600" />
                    <AlertCircle v-else-if="task.status === 'pending'" class="h-5 w-5 text-yellow-600" />
                    <Clock4 v-else class="h-5 w-5 text-blue-600" />
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ task.title }}</p>
                      <p class="text-xs text-gray-500">{{ task.count }} items</p>
                    </div>
                  </div>
                  <button class="text-sm text-green-600 hover:text-green-700 font-medium">
                    View Details
                  </button>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-200">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-900">Overall Progress</span>
                    <span class="text-sm text-gray-500">60% Complete</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" style="width: 60%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  Building2,
  Users,
  UserCheck,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock4,
} from "lucide-vue-next";

const router = useRouter();

// Navigation methods
const navigateToCompany = () => {
  router.push({ name: 'ManagerCompany' });
};

const navigateToUsers = () => {
  router.push({ name: 'ManagerUsers' });
};

// Task data
const tasks = [
  { id: 1, title: 'Review new company applications', status: 'completed', count: 5 },
  { id: 2, title: 'Pending user approvals', status: 'pending', count: 3 },
  { id: 3, title: 'System maintenance', status: 'upcoming', count: 2 }
];

// Sample data for dashboard
const totalCompanies = 4;
const totalUsers = 5;
const activeUsers = 3;
const pendingUsers = 2;
</script>
