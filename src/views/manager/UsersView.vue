<template>
  <div class="space-y-4 p-6 pt-20">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-green-700">User Management</h2>
    </div>

    <!-- Element Plus table with green theme -->
    <el-table
      :data="loading ? skeletonRows : users"
      style="width: 100%; margin: 1em auto;"
      header-cell-class-name="custom-header"
      row-class-name="custom-row"
      class="rounded-lg bg-white"
      :row-style="{ height: '60px' }"
      stripe
    >
      <!-- Selection checkbox column -->
      <el-table-column type="selection" align="start" />
      
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
                <img :src="scope.row.avatar" :alt="scope.row.name" class="h-10 w-10 rounded-full mr-3" />
                <div>
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
              <span>{{ scope.row.department }}</span>
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
              <span>{{ scope.row.post }}</span>
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
                  @click="uploadFile(scope.row)"
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
                  @click="deleteUser(scope.row)"
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

    <!-- Template Modal Component -->
    <TemplateModal 
      v-model="uploadModalVisible"
      :user="selectedUser"
      @generate="handleGenerate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from 'element-plus'
import { UserPen, UserMinus, FileUp } from 'lucide-vue-next'
import axios from "axios";
import TemplateModal from '@/components/TemplateModal.vue';

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  post: string;
  phone: string;
  avatar: string;
}

const users = ref<User[]>([]);
const loading = ref(true);
const uploadModalVisible = ref(false);
const selectedUser = ref<User | null>(null);

// Create skeleton placeholder rows
const skeletonRows = ref(Array(5).fill({}));

onMounted(async () => {
  loading.value = true;
  try {
    const response = await axios.get("/users");
    // Map backend data to fit your table structure
    users.value = response.data.users.map((user: any) => ({
      ...user,
      department: user.department ? user.department.department_name : "",
      post: user.post ? user.post.title : "",
      avatar: user.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D1D5DB'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E",
    }));
  } catch (error) {
    console.error("Failed to fetch users", error);
    ElMessage.error("Failed to load users");
  } finally {
    loading.value = false;
  }
});

function editUser(user: User) {
  ElMessage.info(`Edit user: ${user.name}`)
}

function deleteUser(user: User) {
  ElMessage.warning(`Delete user: ${user.name}`)
}

function uploadFile(user: User) {
  selectedUser.value = user;
  uploadModalVisible.value = true;
}

function handleGenerate(templateId: string, user: User) {
  // Handle document generation here
  console.log('Generate document:', templateId, 'for user:', user);
  uploadModalVisible.value = false;
  selectedUser.value = null;
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

/* Template card styling */
.template-card {
  border: 2px solid transparent;
  transition: all 0.3s ease;
  min-height: 180px;
}

.template-card:hover {
  border-color: #e5e7eb;
  transform: translateY(-2px);
}

.template-card.selected {
  border-color: #3b82f6;
  background-color: #f0f9ff;
}

.template-card.selected .el-card__body {
  background-color: #e0f2fe;
}

.el-select {
  margin-bottom: 16px;
}
</style>
