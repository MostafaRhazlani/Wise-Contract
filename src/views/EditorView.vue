<template>
  <div class="bg-gray-100">
    <!-- Header with navigation -->
    <div class="bg-green-400 p-3 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <button @click="undo" class="p-2 hover:bg-green-500 rounded">
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
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        </button>
        <button @click="redo" class="p-2 hover:bg-green-500 rounded">
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
              d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
            />
          </svg>
        </button>
        <button class="p-2 hover:bg-green-500 rounded">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
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

    <!-- Toolbar -->
    <div class="bg-white border-b border-gray-300 p-3">
      <div class="flex items-center space-x-4 flex-wrap gap-2">
        <!-- Heading Buttons -->
        <div class="flex space-x-1">
          <button
            @click="formatText('h1')"
            :class="[
              'px-3 py-1 border rounded text-sm font-bold',
              isActive('h1')
                ? 'bg-green-200 border-green-400'
                : 'border-gray-300 hover:bg-gray-100',
            ]"
          >
            H1
          </button>
          <button
            @click="formatText('h2')"
            :class="[
              'px-3 py-1 border rounded text-sm font-bold',
              isActive('h2')
                ? 'bg-green-200 border-green-400'
                : 'border-gray-300 hover:bg-gray-100',
            ]"
          >
            H2
          </button>
        </div>

        <!-- Text Style Dropdown -->
        <select
          v-model="currentTextStyle"
          @change="applyTextStyle"
          class="px-3 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="normal">Text style</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="p">Paragraph</option>
        </select>

        <!-- Font Size -->
        <div class="flex items-center space-x-1">
          <button
            @click="decreaseFontSize"
            class="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
          >
            -
          </button>
          <input
            v-model="fontSize"
            @change="applyFontSize"
            type="number"
            min="8"
            max="72"
            class="w-12 px-2 py-1 border border-gray-300 rounded text-sm text-center"
          />
          <button
            @click="increaseFontSize"
            class="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <!-- Text Color -->
        <div class="flex items-center space-x-1">
          <button class="p-1 border border-gray-300 rounded hover:bg-gray-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21h16M7 21l4-4M3 5h4M7 5v12"
              />
            </svg>
          </button>
          <input
            v-model="textColor"
            @change="applyTextColor"
            type="color"
            class="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>

        <!-- Formatting Buttons -->
        <div class="flex space-x-1">
          <button
            @click="formatText('bold')"
            :class="[
              'px-2 py-1 border rounded text-sm font-bold',
              isActive('bold')
                ? 'bg-gray-200 border-gray-400'
                : 'border-gray-300 hover:bg-gray-100',
            ]"
          >
            B
          </button>
          <button
            @click="formatText('italic')"
            :class="[
              'px-2 py-1 border rounded text-sm italic',
              isActive('italic')
                ? 'bg-gray-200 border-gray-400'
                : 'border-gray-300 hover:bg-gray-100',
            ]"
          >
            I
          </button>
          <button
            @click="formatText('underline')"
            :class="[
              'px-2 py-1 border rounded text-sm underline',
              isActive('underline')
                ? 'bg-gray-200 border-gray-400'
                : 'border-gray-300 hover:bg-gray-100',
            ]"
          >
            U
          </button>
          <button
            @click="formatText('strikeThrough')"
            :class="[
              'px-2 py-1 border rounded text-sm line-through',
              isActive('strikeThrough')
                ? 'bg-gray-200 border-gray-400'
                : 'border-gray-300 hover:bg-gray-100',
            ]"
          >
            S
          </button>
        </div>

        <!-- Alignment Buttons -->
        <div class="flex space-x-1">
          <button
            @click="alignText('left')"
            :class="[
              'p-2 border rounded',
              currentAlignment === 'left'
                ? 'bg-gray-200 border-gray-400'
                : 'border-gray-300 hover:bg-gray-100',
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
          <button
            @click="alignText('center')"
            :class="[
              'p-2 border rounded',
              currentAlignment === 'center'
                ? 'bg-gray-200 border-gray-400'
                : 'border-gray-300 hover:bg-gray-100',
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M8 12h8M6 18h12"
              />
            </svg>
          </button>
          <button
            @click="alignText('right')"
            :class="[
              'p-2 border rounded',
              currentAlignment === 'right'
                ? 'bg-gray-200 border-gray-400'
                : 'border-gray-300 hover:bg-gray-100',
            ]"
          >
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
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex h-[calc(100vh-8rem)]">
      <!-- Left Sidebar - Filters -->
      <div class="w-64 bg-white border-r border-gray-300 overflow-hidden flex flex-col">
        <div class="p-4 overflow-y-auto flex-1">
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
                class="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                :class="[
                  'p-3 border rounded-lg transition-colors',
                  selectedUser?.id === user.id
                    ? 'bg-green-100 border-green-300'
                    : 'bg-gray-50 border-gray-200',
                ]"
              >
                <div class="space-y-2">
                  <!-- Individual draggable columns -->
                  <div
                    v-if="selectedColumns.includes('name')"
                    :draggable="true"
                    @dragstart="handleDragStart($event, user.name, 'name')"
                    @click="selectUser(user)"
                    class="p-2 bg-white border border-gray-200 rounded cursor-move hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium">{{ user.name }}</span>
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
                          d="M4 8h16M4 16h16"
                        />
                      </svg>
                    </div>
                    <span class="text-xs text-gray-500">Name</span>
                  </div>

                  <div
                    v-if="selectedColumns.includes('email')"
                    :draggable="true"
                    @dragstart="handleDragStart($event, user.email, 'email')"
                    @click="selectUser(user)"
                    class="p-2 bg-white border border-gray-200 rounded cursor-move hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-sm">{{ user.email }}</span>
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
                          d="M4 8h16M4 16h16"
                        />
                      </svg>
                    </div>
                    <span class="text-xs text-gray-500">Email</span>
                  </div>

                  <div
                    v-if="selectedColumns.includes('age')"
                    :draggable="true"
                    @dragstart="handleDragStart($event, user.age.toString(), 'age')"
                    @click="selectUser(user)"
                    class="p-2 bg-white border border-gray-200 rounded cursor-move hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-sm">{{ user.age }}</span>
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
                          d="M4 8h16M4 16h16"
                        />
                      </svg>
                    </div>
                    <span class="text-xs text-gray-500">Age</span>
                  </div>

                  <div
                    v-if="selectedColumns.includes('phone')"
                    :draggable="true"
                    @dragstart="handleDragStart($event, user.phone, 'phone')"
                    @click="selectUser(user)"
                    class="p-2 bg-white border border-gray-200 rounded cursor-move hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-sm">{{ user.phone }}</span>
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
                          d="M4 8h16M4 16h16"
                        />
                      </svg>
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
            @input="handleInput"
            @keyup="updateToolbarState"
            @mouseup="updateToolbarState"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @dragenter="handleDragEnter"
            class="bg-white shadow-lg min-h-[297mm] w-full max-w-[210mm] mx-auto p-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative"
            :style="{
              'font-size': `${fontSize}px`,
              'color': textColor,
              'text-align': currentAlignment
            }"
            style="aspect-ratio: 210/297"
          >
            <div v-if="selectedContract">
              <h1 class="text-3xl font-bold mb-6 text-center">
                {{ selectedContract.title }}
              </h1>
              <div v-html="processContractContent(selectedContract.content)"></div>
            </div>
            <div v-else>
              <p class="text-gray-500">Select a contract template to start editing...</p>
              <p class="text-sm text-gray-400 mt-2">
                You can drag and drop user data from the left sidebar
              </p>
            </div>

            <!-- Drop indicator -->
            <div
              v-show="isDragOver"
              class="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 flex items-center justify-center pointer-events-none"
            >
              <div class="text-blue-600 font-medium">Drop here to insert data</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar - Contract Data -->
      <div class="w-80 bg-white border-l border-gray-300 overflow-hidden flex flex-col">
        <div class="p-4 overflow-y-auto flex-1">
          <h3 class="font-semibold text-gray-800 mb-4">Contracts</h3>

          <!-- Contract List -->
          <div class="space-y-4">
            <div
              v-for="contract in contracts"
              :key="contract.id"
              @click="selectContract(contract)"
              :class="[
                'p-4 border rounded-lg cursor-pointer transition-colors',
                selectedContract?.id === contract.id
                  ? 'bg-blue-100 border-blue-300'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200',
              ]"
            >
              <div class="font-medium text-sm">{{ contract.title }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ contract.description }}</div>
              <div class="text-xs text-gray-400 mt-2">
                Last updated: {{ new Date(contract.updated_at).toLocaleDateString() }}
              </div>
            </div>
          </div>

          <!-- Selected User Info -->
          <div v-if="selectedUser" class="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">Selected User</h4>
            <div class="space-y-1 text-sm">
              <div><strong>Name:</strong> {{ selectedUser.name }}</div>
              <div><strong>Email:</strong> {{ selectedUser.email }}</div>
              <div><strong>Department:</strong> {{ selectedUser.department }}</div>
              <div><strong>Position:</strong> {{ selectedUser.position }}</div>
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
                :draggable="true"
                @dragstart="handleDragStart($event, variable.syntax, 'variable')"
                class="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 text-sm transition-colors border border-transparent hover:border-gray-300"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <code class="text-blue-600">{{ variable.syntax }}</code>
                    <div class="text-xs text-gray-500">{{ variable.description }}</div>
                  </div>
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
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
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
import { ref, computed, onMounted, nextTick } from "vue";
import axios from 'axios';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  phone: string;
  department: string;
  position: string;
}

interface Department {
  id: number;
  department_name: string;
  description?: string;
}

interface Column {
  key: string;
  label: string;
}

interface Contract {
  id: number;
  title: string;
  description: string;
  content: string;
  department_id: number;
  created_at: string;
  updated_at: string;
}

interface DynamicVariable {
  key: string;
  syntax: string;
  description: string;
}

// Reactive state
const editorRef = ref<HTMLElement | null>(null);
const fontSize = ref<number>(16);
const textColor = ref<string>("#000000");
const currentAlignment = ref<string>("left");
const currentTextStyle = ref<string>("normal");

// Filter state
const departmentDropdownOpen = ref<boolean>(true);
const columnDropdownOpen = ref<boolean>(true);
const selectedDepartments = ref<number[]>([]);
const selectedColumns = ref<string[]>(["name", "email"]);
const searchQuery = ref<string>("");
const selectedUser = ref<User | null>(null);
const selectedContract = ref<Contract | null>(null);
const openCategories = ref<number[]>([1, 2, 3]);

// Drag and drop state
const isDragOver = ref<boolean>(false);
const dragData = ref<{ value: string; type: string } | null>(null);

// Mock data
const departments = ref<Department[]>([]);

const availableColumns = ref<Column[]>([
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "age", label: "Age" },
  { key: "phone", label: "Phone" },
]);

const allUsers = ref<User[]>([
  {
    id: 1,
    name: "John Doe",
    email: "john@company.com",
    age: 30,
    phone: "+1234567890",
    department: "Engineering",
    position: "Senior Developer",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@company.com",
    age: 28,
    phone: "+1234567891",
    department: "Marketing",
    position: "Marketing Manager",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@company.com",
    age: 35,
    phone: "+1234567892",
    department: "Human Resources",
    position: "HR Director",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@company.com",
    age: 32,
    phone: "+1234567893",
    department: "Engineering",
    position: "Tech Lead",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@company.com",
    age: 29,
    phone: "+1234567894",
    department: "Human Resources",
    position: "HR Specialist",
  },
]);

const contracts = ref<Contract[]>([]);

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

// Computed
const filteredUsers = computed(() => {
  let users = allUsers.value;

  // Filter by departments
  if (selectedDepartments.value.length > 0) {
    const selectedDeptNames = departments.value
      .filter((dept) => selectedDepartments.value.includes(dept.id))
      .map((dept) => dept.department_name);

    users = users.filter((user) => selectedDeptNames.includes(user.department));
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    users = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query) ||
        user.position.toLowerCase().includes(query)
    );
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

const toggleCategory = (categoryId: number) => {
  const index = openCategories.value.indexOf(categoryId);
  if (index > -1) {
    openCategories.value.splice(index, 1);
  } else {
    openCategories.value.push(categoryId);
  }
};

const filterUsers = () => {
  // Filtering is handled by computed property
};

const selectUser = (user: User) => {
  selectedUser.value = user;
  updateContractContent();
};

const selectContract = (contract: Contract) => {
  selectedContract.value = contract;
  updateContractContent();
};

const processContractContent = (content: string): string => {
  if (!selectedUser.value) return content;

  let processedContent = content;

  // Replace variables with actual user data
  processedContent = processedContent.replace(
    /{employee_name}/g,
    selectedUser.value.name
  );
  processedContent = processedContent.replace(
    /{employee_email}/g,
    selectedUser.value.email
  );
  processedContent = processedContent.replace(
    /{employee_department}/g,
    selectedUser.value.department
  );
  processedContent = processedContent.replace(
    /{employee_position}/g,
    selectedUser.value.position
  );
  processedContent = processedContent.replace(
    /{company_name}/g,
    "ContractCraft Pro Inc."
  );
  processedContent = processedContent.replace(
    /{current_date}/g,
    new Date().toLocaleDateString()
  );
  processedContent = processedContent.replace(
    /{start_date}/g,
    new Date().toLocaleDateString()
  );

  return processedContent;
};

const updateContractContent = () => {
  if (editorRef.value && selectedContract.value) {
    nextTick(() => {
      const processedContent = processContractContent(selectedContract.value!.content);
      editorRef.value!.innerHTML = processedContent;
    });
  }
};

const insertVariable = (variableKey: string) => {
  const syntax = `{${variableKey}}`;

  // Clear any existing selection first
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
  }

  // Focus the editor
  if (editorRef.value) {
    editorRef.value.focus();

    // Insert at the current cursor position or at the end
    insertTextAtCursor(syntax);
  }
};

// Editor methods (same as before)
const formatText = (command: string) => {
  document.execCommand(command, false, "");
  updateToolbarState();
};

const isActive = (command: string): boolean => {
  return document.queryCommandState(command);
};

const applyTextStyle = () => {
  // Implementation for text style
};

const increaseFontSize = () => {
  fontSize.value = Math.min(fontSize.value + 2, 72);
  applyFontSize();
};

const decreaseFontSize = () => {
  fontSize.value = Math.max(fontSize.value - 2, 8);
  applyFontSize();
};

const applyFontSize = () => {
  if (editorRef.value) {
    editorRef.value.style.fontSize = fontSize.value + "px";
  }
};

const applyTextColor = () => {
  document.execCommand("foreColor", false, textColor.value);
};

const alignText = (alignment: string) => {
  currentAlignment.value = alignment;
  document.execCommand(
    "justify" + alignment.charAt(0).toUpperCase() + alignment.slice(1),
    false,
    ""
  );
};

const updateToolbarState = () => {
  nextTick(() => {
    if (document.queryCommandState("justifyLeft")) currentAlignment.value = "left";
    else if (document.queryCommandState("justifyCenter"))
      currentAlignment.value = "center";
    else if (document.queryCommandState("justifyRight")) currentAlignment.value = "right";
  });
};

const handleInput = (event: Event) => {
  console.log("Content changed:", (event.target as HTMLElement).innerHTML);
};

const undo = () => {
  document.execCommand("undo", false, "");
};

const redo = () => {
  document.execCommand("redo", false, "");
};

const exportToPDF = async () => {
  alert("PDF export functionality - would integrate html2canvas + jsPDF here");
};

const handleDragStart = (event: DragEvent, value: string, type: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", value);
    event.dataTransfer.setData("application/json", JSON.stringify({ value, type }));
    event.dataTransfer.effectAllowed = "copy";
  }
};

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer!.dropEffect = "copy";
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  if (!editorRef.value) return;

  const jsonData = event.dataTransfer?.getData("application/json");
  const textData = event.dataTransfer?.getData("text/plain");

  // Get the drop position
  const dropX = event.clientX;
  const dropY = event.clientY;

  // Find the closest text node at the drop position
  const range = document.caretRangeFromPoint(dropX, dropY);
  if (!range) return;

  // Set the selection to the drop point
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Insert the content at the drop position
  if (jsonData) {
    try {
      const data = JSON.parse(jsonData);
      const span = document.createElement('span');
      span.className = 'variable-tag bg-blue-100 text-blue-800 px-1 rounded';
      span.contentEditable = 'false';
      span.textContent = data.value;
      
      range.deleteContents();
      range.insertNode(span);

      // Move cursor after the inserted content
      range.setStartAfter(span);
      range.setEndAfter(span);
      selection?.removeAllRanges();
      selection?.addRange(range);
    } catch (e) {
      console.error('Error parsing JSON data:', e);
    }
  } else if (textData) {
    const span = document.createElement('span');
    span.className = 'variable-tag bg-blue-100 text-blue-800 px-1 rounded';
    span.contentEditable = 'false';
    span.textContent = textData;
    
    range.deleteContents();
    range.insertNode(span);

    // Move cursor after the inserted content
    range.setStartAfter(span);
    range.setEndAfter(span);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};

const insertTextAtCursor = (text: string, type: string = 'variable') => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();

    // Create a span element for the variable or user data
    const span = document.createElement('span');
    if (type === 'user') {
      span.className = 'user-data bg-green-100 text-green-800 px-1 rounded';
    } else {
      span.className = 'variable-tag bg-blue-100 text-blue-800 px-1 rounded';
    }
    span.contentEditable = 'false';
    span.textContent = text;
    
    range.insertNode(span);

    // Move cursor after inserted text
    range.setStartAfter(span);
    range.setEndAfter(span);
    selection.removeAllRanges();
    selection.addRange(range);
  }
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

// Fetch contracts from API
const fetchContracts = async () => {
  try {
    const response = await axios.get('/contracts');
    contracts.value = response.data.contracts;
  } catch (error) {
    console.error('Error fetching contracts:', error);
  }
};

// Initialize
onMounted(() => {
  fetchDepartments();
  fetchContracts();
  // Select first contract by default
  if (contracts.value[0]) {
    selectedContract.value = contracts.value[0];
  }
});
</script>

<style scoped>
/* Custom styles */
[contenteditable]:focus {
  outline: none;
}

.editor-content h1 {
  @apply text-4xl font-bold mb-4;
}

.editor-content h2 {
  @apply text-2xl font-bold mb-3;
}

.editor-content p {
  @apply mb-2;
}

.variable-tag {
  display: inline-block;
  user-select: none;
  cursor: default;
}

.variable-tag:hover {
  @apply bg-blue-200;
}

.user-data {
  display: inline-block;
  user-select: none;
  cursor: default;
}

.user-data:hover {
  @apply bg-green-200;
}
</style>
