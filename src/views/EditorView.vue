<template>
  <div class="bg-gray-100">
    <!-- Header with navigation -->
    <div class="bg-green-400 p-3 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <button @click="exportToPDF" class="p-2 hover:bg-green-500 rounded">
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </button>
      </div>
      <div class="w-8 h-8 bg-white rounded-full"></div>
    </div>

    <!-- Static Toolbar -->
    <div class="bg-white border-b border-gray-300 p-3">
      <div class="flex items-center space-x-2">
        <!-- Basic Formatting -->
        <div class="flex space-x-1">
          <button class="px-2 py-1 border rounded text-sm font-bold border-gray-300 hover:bg-gray-100">
            B
          </button>
          <button class="px-2 py-1 border rounded text-sm italic border-gray-300 hover:bg-gray-100">
            I
          </button>
          <button class="px-2 py-1 border rounded text-sm underline border-gray-300 hover:bg-gray-100">
            U
          </button>
          <button class="px-2 py-1 border rounded text-sm line-through border-gray-300 hover:bg-gray-100">
            S
          </button>
        </div>

        <!-- Font Size -->
        <div class="flex items-center space-x-1">
          <button class="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
            -
          </button>
          <input
            type="number"
            value="16"
            class="w-12 px-2 py-1 border border-gray-300 rounded text-sm text-center"
          />
          <button class="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
            +
          </button>
        </div>

        <!-- Text Color -->
        <div class="flex items-center space-x-1">
          <input
            type="color"
            value="#000000"
            class="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>

        <!-- Alignment -->
        <div class="flex space-x-1">
          <button class="p-2 border rounded border-gray-300 hover:bg-gray-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
          <button class="p-2 border rounded border-gray-300 hover:bg-gray-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M8 12h8M6 18h12"
              />
            </svg>
          </button>
          <button class="p-2 border rounded border-gray-300 hover:bg-gray-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M8 12h16M6 18h16"
              />
            </svg>
          </button>
        </div>

        <!-- Headings -->
        <div class="flex space-x-1">
          <button class="px-2 py-1 border rounded text-sm font-bold border-gray-300 hover:bg-gray-100">
            H1
          </button>
          <button class="px-2 py-1 border rounded text-sm font-bold border-gray-300 hover:bg-gray-100">
            H2
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex h-[calc(100vh-8rem)]">
      <!-- Left Sidebar - Filters -->
      <div class="w-72 bg-white border-r border-gray-300 overflow-hidden flex flex-col">
        <div class="p-3 overflow-y-auto flex-1">
          <!-- Department Filter -->
          <div class="mb-6">
            <div
              class="flex items-center justify-between cursor-pointer"
              @click="toggleDepartmentDropdown"
            >
              <h3 class="font-semibold text-gray-800">Choose Department:</h3>
              <svg
                :class="[
                  'w-4 h-4 transition-transform',
                  departmentDropdownOpen ? 'rotate-180' : '',
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div v-show="departmentDropdownOpen" class="mt-3 space-y-2">
              <label
                v-for="department in departments"
                :key="department.id"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="selectedDepartments"
                  :value="department.id"
                  @change="filterUsers"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm text-gray-700">{{ department.department_name }}</span>
              </label>
            </div>
          </div>

          <!-- Column Filter -->
          <div class="mb-6">
            <div
              class="flex items-center justify-between cursor-pointer"
              @click="toggleColumnDropdown"
            >
              <h3 class="font-semibold text-gray-800">Choose Columns:</h3>
              <svg
                :class="[
                  'w-4 h-4 transition-transform',
                  columnDropdownOpen ? 'rotate-180' : '',
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div v-show="columnDropdownOpen" class="mt-3 space-y-2">
              <label
                v-for="column in availableColumns"
                :key="column.key"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="selectedColumns"
                  :value="column.key"
                  class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span class="text-sm text-gray-700">{{ column.label }}</span>
              </label>
            </div>
          </div>

          <!-- Search -->
          <div class="mb-6">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="filterUsers"
                type="text"
                placeholder="Search..."
                class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
              />
              <button class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  class="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Filtered Users Results -->
          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-3">
              Users ({{ filteredUsers.length }})
            </h3>
            <div class="space-y-3 overflow-y-auto">
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                :class="[
                  'p-3 border rounded-lg transition-colors',
                  selectedUser?.id === user.id
                    ? 'bg-green-100 border-green-300'
                    : 'bg-gray-50 border-gray-200',
                ]"
                @click="selectUser(user)"
              >
                <div class="space-y-2">
                  <div
                    v-if="selectedColumns.includes('name')"
                    class="p-2 bg-white border border-gray-200 rounded"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium">{{ user.name }}</span>
                    </div>
                    <span class="text-xs text-gray-500">Name</span>
                  </div>

                  <div
                    v-if="selectedColumns.includes('email')"
                    class="p-2 bg-white border border-gray-200 rounded"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-sm truncate">{{ user.email }}</span>
                    </div>
                    <span class="text-xs text-gray-500">Email</span>
                  </div>

                  <div
                    v-if="selectedColumns.includes('phone')"
                    class="p-2 bg-white border border-gray-200 rounded"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-sm">{{ user.phone }}</span>
                    </div>
                    <span class="text-xs text-gray-500">Phone</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Center - Editor Area -->
      <div class="flex-1 bg-gray-200 p-8 overflow-y-auto">
        <div class="max-w-4xl mx-auto">
          <!-- A4 Paper -->
          <div
            ref="editorRef"
            contenteditable="true"
            class="bg-white shadow-lg min-h-[297mm] w-full max-w-[210mm] mx-auto p-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative"
            style="aspect-ratio: 210/297"
          >
            <div>
              <p class="text-gray-500">Select a contract template to start editing...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar - Contract Data -->
      <div class="w-80 bg-white border-l border-gray-300 overflow-hidden flex flex-col">
        <div class="p-4 overflow-y-auto flex-1">
          <!-- Selected User Info -->
          <div v-if="selectedUser" class="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">Selected User</h4>
            <div class="space-y-1 text-sm">
              <div><strong>Name:</strong> {{ selectedUser.name }}</div>
              <div><strong>Email:</strong> {{ selectedUser.email }}</div>
              <div><strong>Department:</strong> {{ selectedUser.department }}</div>
            </div>
          </div>

          <!-- Dynamic Variables -->
          <div class="mt-6">
            <h4 class="font-semibold text-gray-800 mb-3">Available Variables</h4>
            <div class="space-y-2">
              <div
                v-for="variable in dynamicVariables"
                :key="variable.key"
                @click="insertVariable(variable.key)"
                class="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 text-sm transition-colors border border-transparent hover:border-gray-300"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <code class="text-blue-600">{{ variable.syntax }}</code>
                    <div class="text-xs text-gray-500">{{ variable.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from 'axios';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  department_id: number;
  created_at: string;
  updated_at: string;
}

interface Department {
  id: number;
  department_name: string;
  description?: string;
}

interface DynamicVariable {
  key: string;
  syntax: string;
  description: string;
}

interface Column {
  key: string;
  label: string;
}

// Reactive state
const editorRef = ref<HTMLElement | null>(null);
const departmentDropdownOpen = ref<boolean>(true);
const columnDropdownOpen = ref<boolean>(true);
const selectedDepartments = ref<number[]>([]);
const selectedColumns = ref<string[]>(["name", "email"]);
const searchQuery = ref<string>("");
const selectedUser = ref<User | null>(null);

// Data
const departments = ref<Department[]>([]);
const allUsers = ref<User[]>([]);

const dynamicVariables = ref<DynamicVariable[]>([
  { key: "employee_name", syntax: "{employee_name}", description: "Selected user name" },
  {
    key: "employee_email",
    syntax: "{employee_email}",
    description: "Selected user email",
  },
  {
    key: "employee_department",
    syntax: "{employee_department}",
    description: "Selected user department",
  },
  {
    key: "employee_position",
    syntax: "{employee_position}",
    description: "Selected user position",
  },
  { key: "company_name", syntax: "{company_name}", description: "Company name" },
  { key: "current_date", syntax: "{current_date}", description: "Current date" },
  { key: "start_date", syntax: "{start_date}", description: "Contract start date" },
]);

const availableColumns = ref<Column[]>([
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
]);

// Computed
const filteredUsers = computed(() => {
  let users = [...allUsers.value];

  // Filter by department
  if (selectedDepartments.value.length > 0) {
    users = users.filter((user) => selectedDepartments.value.includes(user.department_id));
  }

  // Search in all available columns
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    users = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query)
      );
    });
  }

  return users;
});

// Methods
const toggleDepartmentDropdown = () => {
  departmentDropdownOpen.value = !departmentDropdownOpen.value;
};

const toggleColumnDropdown = () => {
  columnDropdownOpen.value = !columnDropdownOpen.value;
};

const filterUsers = () => {
  // Filtering is handled by computed property
};

const selectUser = (user: User) => {
  selectedUser.value = user;
};

const insertVariable = (variableKey: string) => {
  const syntax = `{${variableKey}}`;
  if (editorRef.value) {
    editorRef.value.focus();
    document.execCommand('insertText', false, syntax);
  }
};

const exportToPDF = async () => {
  alert("PDF export functionality - would integrate html2canvas + jsPDF here");
};

// Fetch departments from API
const fetchDepartments = async () => {
  try {
    const response = await axios.get('/department');
    departments.value = response.data.departments;
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
};

// Fetch users from API
const fetchUsers = async () => {
  try {
    const response = await axios.get('/users');
    allUsers.value = response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Initialize
onMounted(() => {
  fetchDepartments();
  fetchUsers();
});
</script>

<style scoped>
/* Custom styles */
[contenteditable]:focus {
  outline: none;
}

.variable-tag {
  display: inline-block;
  user-select: none;
  cursor: default;
}

.variable-tag:hover {
  @apply bg-blue-200;
}
</style>
