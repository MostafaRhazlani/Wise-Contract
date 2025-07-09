<template>
  <!-- filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\components\UserModal.vue -->
  <el-dialog
    v-model="visible"
    :title="isEditing ? 'Edit User' : 'Add New User'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-position="top"
      label-width="120px"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Name -->
        <el-form-item label="Full Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter full name" />
        </el-form-item>

        <!-- Email -->
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Enter email address" type="email" />
        </el-form-item>

        <!-- Phone -->
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="form.phone" placeholder="Enter phone number" />
        </el-form-item>

        <!-- Role -->
        <el-form-item label="Role" prop="role_id">
          <el-select v-model="form.role_id" placeholder="Select role" style="width: 100%" @change="handleRoleChange">
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.role_name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>

        <!-- Department -->
        <el-form-item label="Department" prop="department_id">
          <el-select v-model="form.department_id" placeholder="Select department" style="width: 100%">
            <el-option
              v-for="department in departments"
              :key="department.id"
              :label="department.department_name"
              :value="department.id"
            />
          </el-select>
        </el-form-item>

        <!-- Post -->
        <el-form-item label="Position" prop="post_id">
          <el-select v-model="form.post_id" placeholder="Select position" style="width: 100%">
            <el-option
              v-for="post in posts"
              :key="post.id"
              :label="post.title"
              :value="post.id"
            />
          </el-select>
        </el-form-item>
      </div>

      <!-- Password Section (only for non-employee roles) -->
      <div v-if="requiresPassword" class="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 class="text-sm font-semibold text-blue-800 mb-3">
          Authentication Required
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item label="Password" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="Enter password"
              show-password
            />
          </el-form-item>
          <el-form-item label="Confirm Password" prop="password_confirmation">
            <el-input
              v-model="form.password_confirmation"
              type="password"
              placeholder="Confirm password"
              show-password
            />
          </el-form-item>
        </div>
      </div>

      <!-- Info Message -->
      <div v-if="selectedRole" class="mt-4 p-3 rounded-lg" :class="requiresPassword ? 'bg-blue-50' : 'bg-green-50'">
        <p class="text-sm" :class="requiresPassword ? 'text-blue-700' : 'text-green-700'">
          <strong>{{ selectedRole.role_name }} Role:</strong>
          {{ requiresPassword 
            ? 'This user will have system access and requires a password for authentication.' 
            : 'This user is an employee without system access. No password required.' 
          }}
        </p>
      </div>
    </el-form>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="loading"
        >
          {{ isEditing ? 'Update User' : 'Create User' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\components\UserModal.vue
import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import axios from 'axios';

interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role_id: number | null;
  department_id: number | null;
  post_id: number | null;
  company_id: number;
  password?: string;
  password_confirmation?: string;
}

interface Role {
  id: number;
  role_name: string;
}

interface Department {
  id: number;
  department_name: string;
}

interface Post {
  id: number;
  title: string;
}

// Props
const props = defineProps<{
  modelValue: boolean;
  user?: User | null;
  isEditing?: boolean;
}>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'user-saved': [user: User];
}>();

// Reactive data
const formRef = ref<FormInstance>();
const loading = ref(false);
const roles = ref<Role[]>([]);
const departments = ref<Department[]>([]);
const posts = ref<Post[]>([]);

const form = ref<User>({
  name: '',
  email: '',
  phone: '',
  role_id: null,
  department_id: null,
  post_id: null,
  company_id: 1,
  password: '',
  password_confirmation: ''
});

// Computed
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const selectedRole = computed(() => {
  if (!form.value.role_id) return null;
  return roles.value.find(role => role.id === form.value.role_id) || null;
});

const requiresPassword = computed(() => {
  if (!selectedRole.value) return false;
  return selectedRole.value.role_name.toLowerCase() !== 'employee';
});

// Dynamic validation rules
const formRules = computed(() => {
  const rules: Record<string, Array<any>> = {
    name: [
      { required: true, message: 'Please enter the full name', trigger: 'blur' }
    ],
    email: [
      { required: true, message: 'Please enter the email', trigger: 'blur' },
      { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
    ],
    role_id: [
      { required: true, message: 'Please select a role', trigger: 'change' }
    ]
  };

  // Add password validation only for non-employee roles
  if (requiresPassword.value) {
    rules.password = [
      { required: true, message: 'Please enter a password', trigger: 'blur' },
      { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' }
    ];
    rules.password_confirmation = [
      { required: true, message: 'Please confirm the password', trigger: 'blur' },
      {
        validator: (_rule: unknown, value: unknown, callback: (error?: Error) => void) => {
          if (value !== form.value.password) {
            callback(new Error('Passwords do not match'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ];
  }

  return rules;
});

// Methods
function handleRoleChange() {
  // Clear password fields when switching roles
  if (!requiresPassword.value) {
    form.value.password = '';
    form.value.password_confirmation = '';
  }
  
  // Clear validation errors
  if (formRef.value) {
    formRef.value.clearValidate(['password', 'password_confirmation']);
  }
}

async function loadData() {
  try {
    console.log('Starting to load form data...');
    
    const [rolesRes, departmentsRes, postsRes] = await Promise.all([
      axios.get('/roles'),        
      axios.get('/departments'),  
      axios.get('/posts')         
    ]);

    console.log('Raw API responses:', { 
      rolesRes: rolesRes.data, 
      departmentsRes: departmentsRes.data, 
      postsRes: postsRes.data 
    });

    // Handle different response structures
    roles.value = rolesRes.data.roles || rolesRes.data || [];
    departments.value = departmentsRes.data.departments || departmentsRes.data || [];
    posts.value = postsRes.data.posts || postsRes.data || [];
    
    console.log('Processed data:', { 
      roles: roles.value, 
      departments: departments.value, 
      posts: posts.value 
    });

    // Show success message only if we have data
    if (roles.value.length > 0 || departments.value.length > 0 || posts.value.length > 0) {
      console.log('Form data loaded successfully');
    } else {
      console.warn('No data received from API endpoints');
      ElMessage.warning('Some form data may be empty. Please check your data.');
    }
    
  } catch (error: any) {
    console.error('Failed to load form data:', error);
    
    // More specific error handling
    if (error.response?.status === 401) {
      ElMessage.error('Authentication required. Please login again.');
    } else if (error.response?.status === 403) {
      ElMessage.error('You do not have permission to access this data.');
    } else if (error.response?.status === 404) {
      ElMessage.error('API endpoints not found. Please check your routes.');
    } else {
      ElMessage.error(`Failed to load form data: ${error.message}`);
    }
  }
}

function resetForm() {
  form.value = {
    name: '',
    email: '',
    phone: '',
    role_id: null,
    department_id: null,
    post_id: null,
    company_id: 1,
    password: '',
    password_confirmation: ''
  };
  
  if (formRef.value) {
    formRef.value.resetFields();
  }
}

function handleClose() {
  visible.value = false;
  resetForm();
}

async function handleSubmit() {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    const submitData = { ...form.value };
    
    // Remove password fields if not required
    if (!requiresPassword.value) {
      delete submitData.password;
      delete submitData.password_confirmation;
    }

    console.log('Submitting data:', submitData);

    let response;
    if (props.isEditing && props.user?.id) {
      response = await axios.put(`/users/${props.user.id}`, submitData);
    } else {
      response = await axios.post('/users', submitData);
    }

    ElMessage.success(props.isEditing ? 'User updated successfully' : 'User created successfully');
    emit('user-saved', response.data.user);
    handleClose();
  } catch (error: any) {
    console.error('Failed to save user:', error);
    
    if (error.response?.status === 401) {
      ElMessage.error('Authentication required. Please login again.');
    } else if (error.response?.status === 403) {
      ElMessage.error('You do not have permission to perform this action.');
    } else if (error.response?.data?.errors) {
      // Handle validation errors
      const errors = error.response.data.errors;
      Object.keys(errors).forEach(field => {
        ElMessage.error(errors[field][0]);
      });
    } else {
      ElMessage.error('Failed to save user');
    }
  } finally {
    loading.value = false;
  }
}

// Watch for user changes (editing mode)
watch(() => props.user, (newUser) => {
  if (newUser && props.isEditing) {
    form.value = {
      ...newUser,
      password: '',
      password_confirmation: ''
    };
  }
}, { immediate: true });

// Watch for modal opening
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    loadData();
  }
});

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.el-form-item {
  margin-bottom: 20px;
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-3 {
  gap: 0.75rem;
}

.gap-4 {
  gap: 1rem;
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>