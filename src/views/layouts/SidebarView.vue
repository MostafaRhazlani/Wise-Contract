<template>
  <!-- filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\views\layouts\SidebarView.vue -->
  <div class="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-10 transition-all duration-300 ease-in-out"
    :class="sidebarExpanded ? 'w-64' : 'w-16'">
    <!-- Menu Toggle -->
    <div class="p-3">
      <button @click="toggleSidebar"
        class="w-10 h-8 text-slate-900 rounded text-xs font-medium hover:bg-gray-100 transition-colors">
        <MenuIcon class="w-6 h-6 mx-auto" />
      </button>
    </div>

    <!-- Navigation Items -->
    <nav class="mt-4 flex-1">
      <!-- Admin Sidebar -->
      <template v-if="authStore.userRole === 1">
        <div class="px-3 py-2 mt-4">
          <span v-if="sidebarExpanded" class="text-xs font-semibold text-gray-500 uppercase">Admin</span>
        </div>
        <div v-for="item in adminSidebarItems" :key="item.name"
          class="flex items-center cursor-pointer group transition-all duration-200 ease-in-out mx-2 rounded-lg hover:bg-gray-50"
          :class="{ 'bg-green-50': item.active }" @click="setActiveItem(item)">
          <div class="flex items-center w-full p-3">
            <component :is="item.icon" class="w-6 h-6 flex-shrink-0 transition-colors duration-200"
              :class="item.active ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'" />
            <span v-if="sidebarExpanded" class="ml-3 text-sm font-medium transition-all duration-200"
              :class="item.active ? 'text-green-600' : 'text-gray-700 group-hover:text-green-600'">
              {{ item.name }}
            </span>
          </div>
        </div>
      </template>

      <!-- Manager Sidebar -->
      <template v-else-if="canAccessManagerDashboard">
        <div class="px-3 py-2 mt-4">
          <span v-if="sidebarExpanded" class="text-xs font-semibold text-gray-500 uppercase">Manager</span>
        </div>
        <div v-for="item in managerDashboardItems" :key="item.name"
          class="flex items-center cursor-pointer group transition-all duration-200 ease-in-out mx-2 rounded-lg hover:bg-gray-50"
          :class="{ 'bg-green-50': item.active }" @click="setActiveItem(item)">
          <div class="flex items-center w-full p-3">
            <component :is="item.icon" class="w-6 h-6 flex-shrink-0 transition-colors duration-200"
              :class="item.active ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'" />
            <span v-if="sidebarExpanded" class="ml-3 text-sm font-medium transition-all duration-200"
              :class="item.active ? 'text-green-600' : 'text-gray-700 group-hover:text-green-600'">
              {{ item.name }}
            </span>
          </div>
        </div>
      </template>

      <!-- Developer Sidebar -->
      <template v-else-if="authStore.userRole === 5">
        <div class="px-3 py-2 mt-4">
          <span v-if="sidebarExpanded" class="text-xs font-semibold text-gray-500 uppercase">Developer</span>
        </div>
        <div v-for="item in SidebarDeveloper" :key="item.name"
          class="flex items-center cursor-pointer group transition-all duration-200 ease-in-out mx-2 rounded-lg hover:bg-gray-50"
          :class="{ 'bg-green-50': item.active }" @click="setActiveItem(item)">
          <div class="flex items-center w-full p-3">
            <component :is="item.icon" class="w-6 h-6 flex-shrink-0 transition-colors duration-200"
              :class="item.active ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'" />
            <span v-if="sidebarExpanded" class="ml-3 text-sm font-medium transition-all duration-200"
              :class="item.active ? 'text-green-600' : 'text-gray-700 group-hover:text-green-600'">
              {{ item.name }}
            </span>
          </div>
        </div>
      </template>

      <!-- Regular User Sidebar -->
      <template v-else>
        <div v-for="item in sidebarItems" :key="item.name"
          class="flex items-center cursor-pointer group transition-all duration-200 ease-in-out mx-2 rounded-lg hover:bg-gray-50"
          :class="{ 'bg-green-50': item.active }" @click="setActiveItem(item)">
          <div class="flex items-center w-full p-3">
            <component :is="item.icon" class="w-6 h-6 flex-shrink-0 transition-colors duration-200"
              :class="item.active ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'" />
            <span v-if="sidebarExpanded" class="ml-3 text-sm font-medium transition-all duration-200"
              :class="item.active ? 'text-green-600' : 'text-gray-700 group-hover:text-green-600'">
              {{ item.name }}
            </span>
          </div>
        </div>
      </template>
    </nav>

    <!-- Profile Section -->
    <div class="absolute bottom-0 left-0 right-0 p-3">
      <div class="relative">
        <button @click="showProfileModal = !showProfileModal"
          class="flex items-center w-full p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div
            class="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
          </div>
          <div v-if="sidebarExpanded" class="ml-3 text-left">
            <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
            <p class="text-xs text-gray-500">{{ userEmail }}</p>
          </div>
        </button>

        <UserProfileModal v-model:show="showProfileModal" position="bottom" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../../store/authStore";
import { useRouter, useRoute } from "vue-router";
import UserProfileModal from "../../components/UserProfileModal.vue";
import {
  MenuIcon,
  HomeIcon,
  LayoutTemplateIcon,
  LayoutDashboard,
  Building2,
  Users,
  FileJson2,
  Settings,
  Building,
  Briefcase,
} from "lucide-vue-next";

interface SidebarItem {
  name: string;
  icon: any;
  active: boolean;
  route: string;
}

const props = defineProps<{
  sidebarExpanded: boolean;
}>();

const emit = defineEmits<{
  (e: "update:sidebarExpanded", value: boolean): void;
}>();

const showProfileModal = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// user data
const userName = computed(() => authStore.user?.name || "");
const userEmail = computed(() => authStore.user?.email || "");

// get first character from first name and last name
const userInitials = computed(() => {
  return userName.value
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();
});

// Add computed property for role-based access
const canAccessManagerDashboard = computed(() => {
  const role = authStore.userRole;
  return role === 3;
});

// Update sidebar items with routes
const sidebarItems = computed(() => [
  { name: "Home", icon: HomeIcon, route: "/" },
  { name: "Templates", icon: LayoutTemplateIcon, route: "/templates" },
  { name: "Users", icon: Users, route: "/editor/users" },
].map(item => ({
  ...item,
  active: route.path === item.route
})));

// Add admin sidebar items
const adminSidebarItems = computed(() => [
  { name: "Dashboard", icon: LayoutDashboard, route: "/admin/dashboard" },
  { name: "Users", icon: Users, route: "/admin/users" },
  { name: "Companies", icon: Building2, route: "/admin/companies" },
  { name: "Templates", icon: LayoutTemplateIcon, route: "/admin/templates" },
  { name: "Departments", icon: Building, route: "/admin/departments" },
  { name: "Posts", icon: Briefcase, route: "/admin/posts" },
  { name: "Settings", icon: Settings, route: "/admin/settings" },
].map(item => ({
  ...item,
  active: route.path === item.route
})));

// Add manager dashboard items if user has access
const managerDashboardItems = computed(() => {
  if (!canAccessManagerDashboard.value) return [];

  return [
    { name: "Overview", icon: LayoutDashboard, route: "/manager/dashboard" },
    { name: "Company", icon: Building2, route: "/manager/company" },
  ].map(item => ({
    ...item,
    active: route.path === item.route
  }));
});

const SidebarDeveloper = computed(() => [
  { name: "Variable", icon: FileJson2, route: "/developer/variable" },
].map(item => ({
  ...item,
  active: route.path === item.route
})));

// Update setActiveItem to use router navigation
const setActiveItem = (item: SidebarItem) => {
  console.log('Navigating to:', item.route); // Debug log
  router.push(item.route);
};

// Methods
const toggleSidebar = () => {
  emit("update:sidebarExpanded", !props.sidebarExpanded);
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    showProfileModal.value = false;
  }
};

// Initial active state
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  console.log('Current route:', route.path); // Debug log
  console.log('User role:', authStore.userRole); // Debug log
});
</script>

<style></style>
