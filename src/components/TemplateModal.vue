<template>
  <el-dialog
    v-model="visible"
    title="Select Template"
    width="650px"
    align-center
    @close="handleClose"
  >
    <!-- Filter by Type -->
    <div class="mb-6">
      <el-select
        v-model="selectedType"
        placeholder="Filter by type"
        style="width: 200px"
        @change="filterTemplates"
      >
        <el-option label="All Types" value="" />
        <el-option label="Card" value="card" />
        <el-option label="Contract" value="contract" />
        <el-option label="Certificate" value="certificate" />
        <el-option label="Purchase Order" value="purchase-order" />
      </el-select>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <template v-for="template in filteredTemplates" :key="template.id">
        <el-card 
          class="template-card cursor-pointer hover:shadow-lg transition-shadow"
          @click="selectTemplate(template.id)"
          :class="{ 'selected': selectedTemplate === template.id }"
        >
          <div class="">
            <template v-if="template.type === 'card'">
              <img
                :src="getImageForTemplate(template.type)"
                alt="Card Miniature"
                class="w-fullcard-miniature"
              />
            </template>
            <template v-else-if="template.type === 'contract'">
              <img
                :src="getImageForTemplate(template.type)"
                alt="Contract Miniature"
                class="w-fullcard-miniature"
              />
            </template>
            <template v-else-if="template.type === 'certificate'">
              <img
                :src="getImageForTemplate(template.type)"
                alt="Certificate Miniature"
                class="w-fullcard-miniature"
              />
            </template>
            <template v-else-if="template.type === 'purchase-order'">
              <img
                :src="getImageForTemplate(template.type)"
                alt="Purchase Order Miniature"
                class="w-fullcard-miniature"
              />
            </template>
            <template v-else>
              <component :is="template.icon" :size="48" :class="template.iconClass" class="mx-auto mb-3" />
            </template>
          </div>
        </el-card>
      </template>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button 
          type="primary" 
          @click="generateDocument"
          :disabled="!selectedTemplate"
        >
          Generate Document
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { FileText, ShoppingCart, Award, FileCheck, CreditCard, Users, ClipboardList } from 'lucide-vue-next';

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  post: string;
  phone: string;
  avatar: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  type: 'card' | 'contract' | 'certificate' | 'purchase-order';
  icon: any;
  iconClass: string;
}

// Props
const props = defineProps<{
  modelValue: boolean;
  user: User | null;
}>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'generate': [templateId: string, user: User];
}>();

// Reactive data
const selectedType = ref('');
const selectedTemplate = ref('');

// CDN image paths
const imageUrls = {
  'card': 'https://cdn.jsdelivr.net/gh/mazin0eg/document-templates/images/id-card-template.jpg',
  'contract': 'https://cdn.jsdelivr.net/gh/mazin0eg/document-templates/images/contract-template.jpg',
  'certificate': 'https://cdn.jsdelivr.net/gh/mazin0eg/document-templates/images/certificate-template.jpg',
  'purchase-order': 'https://cdn.jsdelivr.net/gh/mazin0eg/document-templates/images/purchase-order-template.jpg'
};

// Fallback image URLs
const fallbackImageUrls = {
  'card': 'https://placehold.co/400x300/e6f7ff/0072b5?text=ID+Card+Template',
  'contract': 'https://placehold.co/400x300/f0f9eb/67c23a?text=Contract+Template',
  'certificate': 'https://placehold.co/400x300/fdf6ec/e6a23c?text=Certificate+Template',
  'purchase-order': 'https://placehold.co/400x300/f2f6fc/409eff?text=Purchase+Order+Template'
};

// Function to get image URL with fallback
function getImageForTemplate(type: string) {
  return imageUrls[type as keyof typeof imageUrls] || fallbackImageUrls[type as keyof typeof fallbackImageUrls];
}

// Computed
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// All available templates
const allTemplates = ref<Template[]>([
  // Card Templates
  {
    id: 'employee-card',
    name: 'Employee Card',
    description: 'Standard employee identification card',
    type: 'card',
    icon: CreditCard,
    iconClass: 'text-blue-500'
  },
  {
    id: 'access-card',
    name: 'Access Card',
    description: 'Building and system access card',
    type: 'card',
    icon: Users,
    iconClass: 'text-green-500'
  },
  {
    id: 'visitor-card',
    name: 'Visitor Card',
    description: 'Temporary visitor identification card',
    type: 'card',
    icon: CreditCard,
    iconClass: 'text-orange-500'
  },
  
  // Contract Templates
  {
    id: 'employment-contract',
    name: 'Employment Contract',
    description: 'Standard employment agreement',
    type: 'contract',
    icon: FileText,
    iconClass: 'text-blue-600'
  },
  {
    id: 'freelance-contract',
    name: 'Freelance Contract',
    description: 'Freelancer service agreement',
    type: 'contract',
    icon: FileText,
    iconClass: 'text-purple-600'
  },
  {
    id: 'nda-contract',
    name: 'NDA Contract',
    description: 'Non-disclosure agreement',
    type: 'contract',
    icon: FileText,
    iconClass: 'text-red-600'
  },
  
  // Certificate Templates
  {
    id: 'completion-certificate',
    name: 'Completion Certificate',
    description: 'Course or training completion certificate',
    type: 'certificate',
    icon: Award,
    iconClass: 'text-yellow-500'
  },
  {
    id: 'achievement-certificate',
    name: 'Achievement Certificate',
    description: 'Performance achievement certificate',
    type: 'certificate',
    icon: Award,
    iconClass: 'text-gold-500'
  },
  {
    id: 'attendance-certificate',
    name: 'Attendance Certificate',
    description: 'Event or meeting attendance certificate',
    type: 'certificate',
    icon: Award,
    iconClass: 'text-green-600'
  },
  
  // Purchase Order Templates
  {
    id: 'standard-po',
    name: 'Standard Purchase Order',
    description: 'Standard goods purchase order',
    type: 'purchase-order',
    icon: ShoppingCart,
    iconClass: 'text-green-500'
  },
  {
    id: 'service-po',
    name: 'Service Purchase Order',
    description: 'Service procurement order',
    type: 'purchase-order',
    icon: ClipboardList,
    iconClass: 'text-blue-500'
  },
  {
    id: 'urgent-po',
    name: 'Urgent Purchase Order',
    description: 'Priority purchase order',
    type: 'purchase-order',
    icon: ShoppingCart,
    iconClass: 'text-red-500'
  }
]);

// Computed property for filtered templates
const filteredTemplates = computed(() => {
  if (!selectedType.value) {
    return allTemplates.value;
  }
  return allTemplates.value.filter(template => template.type === selectedType.value);
});

// Watch for modal opening to reset selections
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedType.value = '';
    selectedTemplate.value = '';
  }
});

// Methods
function selectTemplate(templateId: string) {
  selectedTemplate.value = templateId;
}

function filterTemplates() {
  selectedTemplate.value = '';
}

function generateDocument() {
  if (selectedTemplate.value && props.user) {
    const template = allTemplates.value.find(t => t.id === selectedTemplate.value);
    ElMessage.success(`Generating ${template?.name} for ${props.user.name}`);
    emit('generate', selectedTemplate.value, props.user);
    handleClose();
  }
}

function handleClose() {
  visible.value = false;
  selectedType.value = '';
  selectedTemplate.value = '';
}

function getTagType(type: string) {
  switch (type) {
    case 'card': return 'primary';
    case 'contract': return 'success';
    case 'certificate': return 'warning';
    case 'purchase-order': return 'info';
    default: return 'primary';
  }
}
</script>

<style scoped>
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

/* Card miniature styling */
.w-fullcard-miniature {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}
</style>