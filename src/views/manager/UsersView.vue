<template>
  <div class="space-y-4 p-6 pt-20">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-green-700">User Management</h2>
      <div class="flex gap-2">
        <el-button
          v-if="selectedUsers.length > 0"
          type="primary"
          @click="uploadMultipleContracts"
          plain
        >
          <FileUp :size="16" class="mr-2" />
          Upload for Selected ({{ selectedUsers.length }})
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

    <!-- Element Plus table with green theme -->
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
      <!-- Selection checkbox column -->
      <el-table-column type="selection" align="start" width="50" />
      
      <!-- User column with avatar -->
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
                  <div v-if="!scope.row.avatar" :style="{ backgroundColor: getColorFromName() }" class="h-10 w-10 flex items-center justify-center font-bold text-lg text-white">
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
      
      <!-- Department column -->
      <el-table-column 
        property="department" 
        label="Department" 
        width="220"
        align="center"
      >
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
      
      <!-- Post column -->
      <el-table-column 
        property="post" 
        label="Post"
        align="center"
      >
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
      <el-table-column 
        property="phone" 
        label="Phone" 
        width="220"
        align="center"
      >
        <template #default="scope">
          <el-skeleton :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="text" style="width: 80%; margin: 0 auto" />
            </template>
            <template #default>
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-skeleton>
        </template>
      </el-table-column>
      
      <!-- Actions column -->
      <el-table-column label="Actions" width="380" align="center">
        <template #default="scope">
          <div class="flex justify-center gap-2">
            <el-skeleton :loading="loading" animated>
              <template #template>
                <div class="flex justify-center gap-2">
                  <el-skeleton-item variant="button" style="width: 60px; height: 32px" />
                  <el-skeleton-item variant="button" style="width: 60px; height: 32px" />
                  <el-skeleton-item variant="button" style="width: 70px; height: 32px" />
                </div>
              </template>
              <template #default>
                <el-button
                  size="small"
                  type="primary"
                  @click="uploadSingleContract(scope.row)"
                  plain
                >
                  <FileUp :size="15"/>&nbsp;Upload
                </el-button>
                <el-button
                  size="small"
                  type="success"
                  @click="editUser(scope.row)"
                  plain
                >
                  <UserPen :size="15"/>&nbsp;Edit
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteSingleUser(scope.row)"
                  plain
                >
                  <UserMinus :size="15"/>&nbsp;Delete
                </el-button>
              </template>
            </el-skeleton>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Template Modal - Used for both single and multiple uploads -->
    <TemplateModal 
      v-model="uploadModalVisible"
      :user="selectedUser"
      :users="selectedUsers"
      :is-multiple="isMultipleUpload"
      @contracts-generated="handleContractsGenerated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserPen, UserMinus, FileUp } from 'lucide-vue-next'
import axios from "axios";
import TemplateModal from '@/components/TemplateModal.vue';

interface User {
  id: number;
  name: string;
  email: string;
  department: any;
  post: any;
  phone: string;
  avatar: string;
}

const users = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const loading = ref(true);
const uploadModalVisible = ref(false);
const selectedUser = ref<User | null>(null);
const isMultipleUpload = ref(false);
const tableRef = ref();

// Create skeleton placeholder rows
const skeletonRows = ref(Array(5).fill({}));

onMounted(async () => {
  await loadUsers();
});

async function loadUsers() {
  loading.value = true;
  try {
    const response = await axios.get("/users");
    users.value = response.data.users;
  } catch (error) {
    console.error("Failed to fetch users", error);
    ElMessage.error("Failed to load users");
  } finally {
    loading.value = false;
  }
}

// Handle table selection changes
function handleSelectionChange(selection: User[]) {
  selectedUsers.value = selection;
}

function editUser(user: User) {
  ElMessage.info(`Edit user: ${user.name}`)
}

// Single user delete
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
    
    // Clear selection after successful delete
    if (tableRef.value) {
      tableRef.value.clearSelection();
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Failed to delete user', error);
      ElMessage.error('Failed to delete user');
    }
  }
}

// Multiple users delete
async function deleteMultipleUsers() {
  if (selectedUsers.value.length === 0) {
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

    // Delete all selected users
    const deletePromises = selectedUsers.value.map(user => 
      axios.delete(`/user/${user.id}`)
    );

    await Promise.all(deletePromises);
    
    ElMessage.success(`${selectedUsers.value.length} user${selectedUsers.value.length > 1 ? 's' : ''} deleted successfully`);
    
    // Clear selection and reload data
    selectedUsers.value = [];
    if (tableRef.value) {
      tableRef.value.clearSelection();
    }
    await loadUsers();

  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Failed to delete users', error);
      ElMessage.error('Failed to delete some users');
      // Reload data even if some deletions failed
      await loadUsers();
      if (tableRef.value) {
        tableRef.value.clearSelection();
      }
    }
  }
}

// Single user contract upload
function uploadSingleContract(user: User) {
  selectedUser.value = user;
  isMultipleUpload.value = false;
  uploadModalVisible.value = true;
}

// Multiple users contract upload
function uploadMultipleContracts() {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('Please select users to generate contracts for');
    return;
  }
  
  selectedUser.value = null;
  isMultipleUpload.value = true;
  uploadModalVisible.value = true;
}

// Handle successful contract generation
function handleContractsGenerated(count: number) {
  ElMessage.success(`${count} contract${count > 1 ? 's' : ''} generated successfully`);
  
  // Clear selection after successful generation
  if (isMultipleUpload.value) {
    selectedUsers.value = [];
    if (tableRef.value) {
      tableRef.value.clearSelection();
    }
  }
}

function getInitials(name: string): string {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function getColorFromName(): string {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  
  return `rgb(${r},${g},${b})`;
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

.custom-row {
  transition: none;
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

/* Striped rows with soft gray-white alternation - no hover */
.el-table :deep(.el-table__row--striped) {
  background-color: #f9fafb !important;
}

/* Green checkbox styling */
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

.el-button--primary.is-plain {
  background: #dbeafe;
  color: #2563eb;
  border-color: #93c5fd;
  transition: all 0.2s ease;
}

.el-button--primary.is-plain:hover {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.el-table .cell {
  word-break: break-word;
  line-height: 1.5;
}
</style>
