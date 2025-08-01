<template>
  <div class="space-y-4 p-6 pt-20">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-green-700">Variable Management</h2>
      <div class="flex gap-2">
        <el-button
          v-if="selectedVariables.length > 0"
          type="danger"
          @click="deleteMultipleVariables"
          plain
        >
          <Trash2 :size="16" class="mr-2" />
          Delete Selected ({{ selectedVariables.length }})
        </el-button>
        <el-button
          type="success"
          @click="showAddForm = true"
          plain
        >
          <Plus :size="16" class="mr-2" />
          Add Variable
        </el-button>
      </div>
    </div>

    <!-- Element Plus table with green theme -->
    <el-table
      ref="tableRef"
      :data="loading ? skeletonRows : variables"
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
      
      <!-- Key column -->
      <el-table-column label="Key" align="left" width="250">
        <template #default="scope">
          <el-skeleton :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="text" style="width: 80%" />
            </template>
            <template #default>
              <el-tag type="info" size="small">{{ scope.row.key }}</el-tag>
            </template>
          </el-skeleton>
        </template>
      </el-table-column>
      
      <!-- Label column -->
      <el-table-column label="Label" align="left">
        <template #default="scope">
          <el-skeleton :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="text" style="width: 70%" />
            </template>
            <template #default>
              <div class="font-medium text-gray-900">{{ scope.row.label }}</div>
            </template>
          </el-skeleton>
        </template>
      </el-table-column>
      
      <!-- Created At column -->
      <el-table-column label="Created" align="center" width="150">
        <template #default="scope">
          <el-skeleton :loading="loading" animated>
            <template #template>
              <el-skeleton-item variant="text" style="width: 80%; margin: 0 auto" />
            </template>
            <template #default>
              <span class="text-sm text-gray-500">
                {{ formatDate(scope.row.created_at) }}
              </span>
            </template>
          </el-skeleton>
        </template>
      </el-table-column>
      
      <!-- Actions column -->
      <el-table-column label="Actions" width="180" align="center">
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
                <el-button
                  size="small"
                  type="success"
                  @click="editVariable(scope.row)"
                  plain
                >
                  <Edit :size="15"/>&nbsp;Edit
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteSingleVariable(scope.row)"
                  plain
                >
                  <Trash2 :size="15"/>&nbsp;Delete
                </el-button>
              </template>
            </el-skeleton>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Add/Edit Variable Dialog -->
    <el-dialog
      v-model="showAddForm"
      :title="editingVariable ? 'Edit Variable' : 'Add Variable'"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="variableForm"
        :rules="formRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="Key" prop="key">
          <el-input
            v-model="variableForm.key"
            placeholder="e.g., user_name"
            :disabled="editingVariable !== null"
            class="green-input"
          />
        </el-form-item>
        
        <el-form-item label="Label" prop="label">
          <el-input
            v-model="variableForm.label"
            placeholder="e.g., user.name"
            class="green-input"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm">Cancel</el-button>
          <el-button
            type="primary"
            @click="saveVariable"
            :loading="saving"
          >
            {{ editingVariable ? 'Update' : 'Create' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Trash2, Plus } from 'lucide-vue-next'
import axios from "axios";

interface Variable {
  id: number;
  key: string;
  label: string;
  created_at: string;
  updated_at: string;
}

const variables = ref<Variable[]>([]);
const selectedVariables = ref<Variable[]>([]);
const loading = ref(true);
const saving = ref(false);
const showAddForm = ref(false);
const editingVariable = ref<Variable | null>(null);
const tableRef = ref();

// Form data - simplified to only key and label
const variableForm = ref({
  key: '',
  label: ''
});

// Form validation rules - removed type validation
const formRules = {
  key: [
    { required: true, message: 'Key is required', trigger: 'blur' },
    { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: 'Key must be a valid identifier', trigger: 'blur' }
  ],
  label: [
    { required: true, message: 'Label is required', trigger: 'blur' }
  ]
};

const formRef = ref();

// Create skeleton placeholder rows
const skeletonRows = ref(Array(5).fill({}));

onMounted(async () => {
  await loadVariables();
});

async function loadVariables() {
  loading.value = true;
  try {
    const response = await axios.get("/variables");
    variables.value = response.data.data;
  } catch (error) {
    console.error("Failed to fetch variables", error);
    ElMessage.error("Failed to load variables");
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

// Handle table selection changes
function handleSelectionChange(selection: Variable[]) {
  selectedVariables.value = selection;
}

function editVariable(variable: Variable) {
  editingVariable.value = variable;
  variableForm.value = {
    key: variable.key,
    label: variable.label
  };
  showAddForm.value = true;
}

// Delete single variable
async function deleteSingleVariable(variable: Variable) {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete the variable "${variable.key}"?`,
      'Delete Variable',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    );

    await axios.delete(`/variable/${variable.id}`);
    ElMessage.success('Variable deleted successfully');
    await loadVariables();
    
    // Clear selection after successful delete
    if (tableRef.value) {
      tableRef.value.clearSelection();
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Failed to delete variable', error);
      ElMessage.error('Failed to delete variable');
    }
  }
}

// Delete multiple selected variables
async function deleteMultipleVariables() {
  if (selectedVariables.value.length === 0) {
    ElMessage.warning('Please select variables to delete');
    return;
  }

  try {
    const variableKeys = selectedVariables.value.map(v => v.key).join(', ');
    const confirmMessage = selectedVariables.value.length === 1 
      ? `Are you sure you want to delete the variable "${variableKeys}"?`
      : `Are you sure you want to delete ${selectedVariables.value.length} variables?\n\nVariables: ${variableKeys}`;

    await ElMessageBox.confirm(
      confirmMessage,
      `Delete ${selectedVariables.value.length} Variable${selectedVariables.value.length > 1 ? 's' : ''}`,
      {
        confirmButtonText: 'Delete All',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    );

    // Delete all selected variables
    const deletePromises = selectedVariables.value.map(variable => 
      axios.delete(`/variable/${variable.id}`)
    );

    await Promise.all(deletePromises);
    
    ElMessage.success(`${selectedVariables.value.length} variable${selectedVariables.value.length > 1 ? 's' : ''} deleted successfully`);
    
    // Clear selection and reload data
    selectedVariables.value = [];
    if (tableRef.value) {
      tableRef.value.clearSelection();
    }
    await loadVariables();

  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Failed to delete variables', error);
      ElMessage.error('Failed to delete some variables');
      // Reload data even if some deletions failed
      await loadVariables();
      if (tableRef.value) {
        tableRef.value.clearSelection();
      }
    }
  }
}

async function saveVariable() {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    saving.value = true;

    if (editingVariable.value) {
      // Update existing variable
      await axios.put(`/variable/${editingVariable.value.id}`, variableForm.value);
      ElMessage.success('Variable updated successfully');
    } else {
      // Create new variable
      await axios.post('/variable', variableForm.value);
      ElMessage.success('Variable created successfully');
    }

    await loadVariables();
    resetForm();
  } catch (error: any) {
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message);
    } else {
      ElMessage.error('Failed to save variable');
    }
  } finally {
    saving.value = false;
  }
}

function resetForm() {
  showAddForm.value = false;
  editingVariable.value = null;
  variableForm.value = {
    key: '',
    label: ''
  };
  formRef.value?.resetFields();
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

/* Changed primary button to green theme */
.el-button--primary {
  background: #16a34a !important;
  color: #ffffff !important;
  border-color: #16a34a !important;
  transition: all 0.2s ease;
}

.el-button--primary:hover {
  background: #15803d !important;
  color: #ffffff !important;
  border-color: #15803d !important;
}

.el-button--primary:focus {
  background: #15803d !important;
  border-color: #15803d !important;
}

.el-button--primary:active {
  background: #14532d !important;
  border-color: #14532d !important;
}

/* Green input styling */
.green-input :deep(.el-input__wrapper) {
  border-color: #d1d5db;
  transition: all 0.2s ease;
}

.green-input :deep(.el-input__wrapper:hover) {
  border-color: #16a34a !important;
}

.green-input :deep(.el-input__wrapper.is-focus) {
  border-color: #16a34a !important;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2) !important;
}

.green-input :deep(.el-input__inner:focus) {
  outline: none;
}

/* Green form label styling */
.el-form-item :deep(.el-form-item__label) {
  color: #166534;
  font-weight: 600;
}

/* Disabled input styling */
.green-input :deep(.el-input__wrapper.is-disabled) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.green-input :deep(.el-input__inner:disabled) {
  color: #6b7280;
  background-color: transparent;
}

.el-table .cell {
  word-break: break-word;
  line-height: 1.5;
}

/* Dialog styling */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Form styling */
.el-form-item {
  margin-bottom: 20px;
}

/* Tag styling */
.el-tag {
  font-weight: 500;
}
</style>
