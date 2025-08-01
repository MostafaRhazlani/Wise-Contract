<template>
  <!-- filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\views\manager\DashboardView.vue -->
  <div class="space-y-4 p-6 pt-20">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-green-700">User Management Dashboard</h2>
      <div class="flex gap-2">
        <el-button type="success" @click="addUser" plain>
          <UserPlus :size="16" class="mr-2" />
          Add User
        </el-button>
        
        <el-button
          v-if="selectedUsers.length > 0"
          type="danger"
          @click="deleteMultipleUsers"
          plain
        >
          <UserMinus :size="16" class="mr-2" />
          Delete Selected ({{ selectedUsers.length }})
        </el-button>
      </div>
    </div>

    <el-table
      ref="tableRef"
      :data="loading ? skeletonRows : users"
      style="width: 100%; margin: 1em auto;"
      header-cell-class-name="custom-header"
      row-class-name="custom-row"
      class="rounded-lg bg-white"
      :row-style="{ height: '60px' }"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="start" width="50" />
      
      <!-- User column -->
      <el-table-column label="User" align="left">
        <template #default="scope">
          <div class="flex items-center">
            <el-skeleton :loading="loading" animated style="width: 100%">
              <template #template>
                <div class="flex items-center">
                  <el-skeleton-item variant="circle" style="width: 40px; height: 40px; margin-right: 12px" />
                  <div class="flex-1">
                    <el-skeleton-item variant="text" style="width: 60%; margin-bottom: 4px" />
                    <el-skeleton-item variant="text" style="width: 80%" />
                  </div>
                </div>
              </template>
              <template #default>
                <div class="min-w-10 max-w-10 min-h-10 max-h-10 rounded-full overflow-hidden mr-3">
                  <div 
                    v-if="!scope.row.avatar" 
                    :style="{ backgroundColor: getColorFromName(scope.row.name) }" 
                    class="h-10 w-10 flex items-center justify-center font-bold text-lg text-white"
                  >
                    {{ getInitials(scope.row.name) }}
                  </div>
                  <img v-else :src="scope.row.avatar" :alt="scope.row.name" class="h-full w-full" />
                </div>
                <div class="min-w-96">
                  <div class="text-sm font-medium text-gray-900">{{ scope.row.name }}</div>
                  <div class="text-sm text-gray-500">{{ scope.row.email }}</div>
                </div>
              </template>
            </el-skeleton>
          </div>
        </template>
      </el-table-column>
      
      <!-- Role column -->
      <el-table-column label="Role" width="120" align="center">
        <template #default="scope">
          <el-skeleton :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="text" style="width: 60%; margin: 0 auto" />
            </template>
            <template #default>
              <el-tag :type="getRoleTagType(scope.row.role?.role_name)" size="small">
                {{ scope.row.role?.role_name || 'N/A' }}
              </el-tag>
            </template>
          </el-skeleton>
        </template>
      </el-table-column>
      
      <!-- Department column -->
      <el-table-column label="Department" width="220" align="center">
        <template #default="scope">
          <el-skeleton :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="text" style="width: 60%; margin: 0 auto" />
            </template>
            <template #default>
              <span>{{ scope.row.department?.department_name || 'N/A' }}</span>
            </template>
          </el-skeleton>
        </template>
      </el-table-column>
      
      <!-- Position column -->
      <el-table-column label="Position" align="center">
        <template #default="scope">
          <el-skeleton :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="text" style="width: 70%; margin: 0 auto" />
            </template>
            <template #default>
              <span>{{ scope.row.post?.title || 'N/A' }}</span>
            </template>
          </el-skeleton>
        </template>
      </el-table-column>
      
      <!-- Phone column -->
      <el-table-column label="Phone" width="220" align="center">
        <template #default="scope">
          <el-skeleton :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="text" style="width: 80%; margin: 0 auto" />
            </template>
            <template #default>
              <span>{{ scope.row.phone || 'N/A' }}</span>
            </template>
          </el-skeleton>
        </template>
      </el-table-column>
      
      <!-- Actions column -->
      <el-table-column label="Actions" width="220" align="center">
        <template #default="scope">
          <div class="flex justify-center gap-2">
            <el-skeleton :loading="loading" animated>
              <template #template>
                <div class="flex justify-center gap-2">
                  <el-skeleton-item variant="button" style="width: 60px; height: 32px" />
                  <el-skeleton-item variant="button" style="width: 70px; height: 32px" />
                </div>
              </template>
              <template #default>
                <el-button size="small" type="success" @click="editUser(scope.row)" plain>
                  <UserPen :size="15"/>&nbsp;Edit
                </el-button>
                <el-button size="small" type="danger" @click="deleteSingleUser(scope.row)" plain>
                  <UserMinus :size="15"/>&nbsp;Delete
                </el-button>
              </template>
            </el-skeleton>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <UserModal
      v-model="userModalVisible"
      :user="editingUser"
      :is-editing="isEditing"
      @user-saved="handleUserSaved"
    />
  </div>
</template>

<script setup lang="ts">
// filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\views\manager\DashboardView.vue
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserPen, UserMinus, UserPlus } from 'lucide-vue-next'
import axios from "axios";
import UserModal from '@/components/UserModal.vue';

interface User {
  id: number;
  name: string;
  email: string;
  department: any;
  department_id: number;
  post: any;
  post_id: number;
  phone: string;
  avatar: string;
  role: any;
  role_id: number;
  company_id: number;
}

const users = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const loading = ref(true);
const tableRef = ref();
const userModalVisible = ref(false);
const editingUser = ref<User | null>(null);
const isEditing = ref(false);
const skeletonRows = ref(Array(5).fill({}));

onMounted(() => {
  loadUsers();
});

async function loadUsers() {
  loading.value = true;
  try {
    const response = await axios.get("/users");
    users.value = response.data.users || response.data || [];
  } catch (error) {
    console.error("Failed to fetch users", error);
    ElMessage.error("Failed to load users");
  } finally {
    loading.value = false;
  }
}

function handleSelectionChange(selection: User[]) {
  selectedUsers.value = Array.isArray(selection) ? selection : [];
}

function addUser() {
  editingUser.value = null;
  isEditing.value = false;
  userModalVisible.value = true;
}

function editUser(user: User) {
  editingUser.value = user;
  isEditing.value = true;
  userModalVisible.value = true;
}

function handleUserSaved() {
  loadUsers();
}

async function deleteSingleUser(user: User) {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete user "${user.name}"?`,
      'Delete User',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    );

    await axios.delete(`/user/${user.id}`);
    ElMessage.success('User deleted successfully');
    await loadUsers();
    tableRef.value?.clearSelection();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Failed to delete user', error);
      ElMessage.error('Failed to delete user');
    }
  }
}

async function deleteMultipleUsers() {
  if (!selectedUsers.value.length) {
    ElMessage.warning('Please select users to delete');
    return;
  }

  try {
    const userNames = selectedUsers.value.map(u => u.name).join(', ');
    const confirmMessage = selectedUsers.value.length === 1 
      ? `Are you sure you want to delete user "${userNames}"?`
      : `Are you sure you want to delete ${selectedUsers.value.length} users?\n\nUsers: ${userNames}`;

    await ElMessageBox.confirm(
      confirmMessage,
      `Delete ${selectedUsers.value.length} User${selectedUsers.value.length > 1 ? 's' : ''}`,
      {
        confirmButtonText: 'Delete All',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    );

    const deletePromises = selectedUsers.value.map(user => 
      axios.delete(`/user/${user.id}`)
    );

    await Promise.all(deletePromises);
    
    ElMessage.success(`${selectedUsers.value.length} user${selectedUsers.value.length > 1 ? 's' : ''} deleted successfully`);
    
    selectedUsers.value = [];
    tableRef.value?.clearSelection();
    await loadUsers();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Failed to delete users', error);
      ElMessage.error('Failed to delete some users');
      await loadUsers();
      tableRef.value?.clearSelection();
    }
  }
}

function getInitials(name: string): string {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function getColorFromName(name: string): string {
  if (!name) return '#6EE7B7';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 60%)`;
}

function getRoleTagType(roleName: string) {
  if (!roleName) return 'info';
  switch (roleName.toLowerCase()) {
    case 'admin': return 'danger';
    case 'manager': return 'success';
    case 'editor': return 'warning';
    case 'employee': return 'info';
    default: return 'info';
  }
}
</script>

<style scoped>
.el-table {
  border-radius: 0.75rem;
  overflow: hidden;
  background: #ffffff;
}

.custom-header {
  background: #bbf7d0 !important;
  color: #166534 !important;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 12px 8px !important;
}

.el-table th {
  background: #bbf7d0;
  color: #166534;
  font-weight: 700;
  border-bottom: 2px solid #a7f3d0;
}

.el-table td {
  padding: 12px 8px;
  vertical-align: middle;
  border-bottom: 1px solid #e5e7eb;
}

.el-table :deep(.el-table__row--striped) {
  background-color: #f9fafb !important;
}

.el-table :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #16a34a !important;
  border-color: #16a34a !important;
}

.el-table :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: #16a34a !important;
  border-color: #16a34a !important;
}

.el-table :deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: #ffffff !important;
}

.el-table :deep(.el-checkbox__input.is-focus .el-checkbox__inner) {
  border-color: #16a34a !important;
}

.el-table :deep(.el-checkbox__inner:hover) {
  border-color: #16a34a !important;
}

.el-button--success.is-plain {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
  transition: all 0.2s ease;
}

.el-button--success.is-plain:hover {
  background: #16a34a;
  color: #ffffff;
  border-color: #16a34a;
}

.el-button--danger.is-plain {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
  transition: all 0.2s ease;
}

.el-button--danger.is-plain:hover {
  background: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
}

.el-table .cell {
  word-break: break-word;
  line-height: 1.5;
}
</style>
