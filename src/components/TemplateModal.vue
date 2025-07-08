<template>
  <el-dialog 
    v-model="visible" 
    :title="modalTitle" 
    :width="isMultiple ? '800px' : '650px'" 
    align-center 
    @close="handleClose"
  >
    <!-- Users List (only show for multiple uploads) -->
    <div v-if="isMultiple && usersArray.length > 0" class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Selected Users ({{ usersArray.length }})</h3>
      <div class="max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-3">
        <div class="flex flex-wrap gap-2">
          <el-tag 
            v-for="user in usersArray" 
            :key="user.id"
            type="info"
            size="small"
          >
            {{ user.name }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- Filter by Type -->
    <div class="mb-6">
      <el-select v-model="selectedType" placeholder="Filter by type" style="width: 200px" @change="filterTemplates"
        clearable>
        <el-option label="All Types" value="" />
        <el-option v-for="type in availableTypes" :key="type.id" :label="type.title" :value="type.id" />
      </el-select>
    </div>

    <!-- Pass filtered templates to TemplatesList -->
    <TemplatesList @select-template="selectTemplate" :selected-template="selectedTemplate"
      :templates="filteredTemplates" />

    <!-- Progress Bar (only show for multiple uploads) -->
    <div v-if="isMultiple && generating" class="mt-6">
      <el-progress 
        :percentage="progressPercentage" 
        :status="progressStatus"
        :stroke-width="8"
      />
      <p class="text-sm text-gray-600 mt-2">
        {{ progressText }}
      </p>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" @click="handleClose" :disabled="generating">
          Cancel
        </el-button>
        <el-button
          v-if="selectedTemplate"
          type="success"
          @click="generatePDF"
          :loading="generating"
        >
          {{ buttonText }}
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- Hidden div for PDF content rendering -->
  <div 
    ref="pdfContentRef" 
    id="pdf-content" 
    style="position: absolute; left: -9999px; top: -9999px; width: 794px; background: white; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;"
  >
    <!-- PDF content will be inserted here -->
  </div>
</template>

<script setup lang="ts">
import TemplatesList from '@/components/TemplatesList.vue';
import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useTemplateStore } from '@/store/templateStore';
import { useTypeStore } from '@/store/typeStore';
import html2pdf from 'html2pdf.js';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Variable } from '@/extensions/VariableNode';

interface User {
  id: number;
  name: string;
  email: string;
  department: any;
  post: any;
  phone: string;
  avatar: string;
  join_date?: string;
  created_at?: string;
  role?: { role_name: string };
}

// Props
const props = defineProps<{
  modelValue: boolean;
  user: User | null;
  users?: User[];
  isMultiple?: boolean;
}>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'contracts-generated': [count: number];
}>();

// Reactive data
const selectedType = ref<number | string>('');
const selectedTemplate = ref('');
const generating = ref(false);
const progressPercentage = ref(0);
const progressStatus = ref<'success' | 'exception' | 'warning' | ''>('');
const progressText = ref('');
const pdfContentRef = ref<HTMLElement>();
const templateStore = useTemplateStore();
const typeStore = useTypeStore();

// Computed properties
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const isMultiple = computed(() => props.isMultiple || false);

// Ensure usersArray is always an array
const usersArray = computed(() => {
  if (!props.users) {
    console.warn('props.users is undefined');
    return [];
  }
  if (!Array.isArray(props.users)) {
    console.warn('props.users is not an array:', props.users);
    return [];
  }
  return props.users;
});

const modalTitle = computed(() => {
  if (isMultiple.value) {
    return `Generate Contracts for ${usersArray.value.length} Users`;
  }
  return 'Select Template';
});

const buttonText = computed(() => {
  if (isMultiple.value) {
    return `Generate ${usersArray.value.length} PDF${usersArray.value.length > 1 ? 's' : ''}`;
  }
  return 'Generate PDF';
});

// Filter templates based on selected type
const filteredTemplates = computed(() => {
  if (!selectedType.value || selectedType.value === '') {
    return templateStore.templates;
  }

  const filtered = templateStore.templates.filter(template => {
    return template.type_id === Number(selectedType.value);
  });
  return filtered;
});

// Show ALL types (not just available ones)
const availableTypes = computed(() => {
  return typeStore.types;
});

// Watch for modal opening to load data and reset selections
watch(() => props.modelValue, async (newValue) => {
  if (newValue) {
    console.log('Modal opened');
    console.log('isMultiple:', isMultiple.value);
    console.log('usersArray:', usersArray.value);
    console.log('props.users:', props.users);
    
    selectedType.value = '';
    selectedTemplate.value = '';
    progressPercentage.value = 0;
    progressStatus.value = '';
    progressText.value = '';
    await loadData();
  }
});

// Methods
async function loadData() {
  try {
    // Load types if not already loaded
    if (!typeStore.types.length) {
      await typeStore.getTypes();
    }

    // Load all company templates    
    await templateStore.getTemplatesCompany();
  } catch (error) {
    console.error('Failed to load data:', error);
    ElMessage.error('Failed to load templates');
  }
}

function selectTemplate(templateId: string | number) {
  selectedTemplate.value = String(templateId);
  ElMessage.success(`Template ${templateId} selected`);
}

function filterTemplates() {
  // Reset selection when filtering
  selectedTemplate.value = '';
  // No need to call API - the computed property handles filtering
}

function handleClose() {
  visible.value = false;
  selectedType.value = '';
  selectedTemplate.value = '';
  generating.value = false;
  progressPercentage.value = 0;
  progressStatus.value = '';
  progressText.value = '';
}

// Helper function to get value from object path
function getValueByPath(obj: any, path: string): any {
  if (!path || !obj) return null;
  
  // Remove "user." prefix if it exists
  const cleanPath = path.replace(/^user\./, '');
  
  // Handle direct properties first
  if (obj[cleanPath] !== undefined) {
    return obj[cleanPath];
  }
  
  // Handle nested paths
  const pathParts = cleanPath.split('.');
  let current = obj;
  
  for (const part of pathParts) {
    if (current && current[part] !== undefined) {
      current = current[part];
    } else {
      return null;
    }
  }
  
  return current;
}

// Recursively replace variable nodes in Tiptap JSON
function replaceVariablesInJson(json: any, user: any): any {
  if (Array.isArray(json)) {
    return json.map(item => replaceVariablesInJson(item, user));
  } else if (json && typeof json === 'object') {
    const newObj: any = { ...json };
    
    if (json.type === 'variable' && json.attrs?.label) {
      // Replace variable node with a text node containing the value
      const value = getValueByPath(user, json.attrs.label);
      return {
        type: 'text',
        text: value ?? `[${json.attrs.label}]`,
        marks: json.marks,
      };
    }
    if (json.content) {
      newObj.content = replaceVariablesInJson(json.content, user);
    }
    return newObj;
  }
  
  return json;
}

// Generate PDF for single user
async function generateSinglePDF(user: User, template: any): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      // Replace variables in the JSON
      const contentJson = JSON.parse(template.content_json);
      const replacedJson = replaceVariablesInJson(contentJson, user);
      
      // Generate HTML from the replaced JSON
      const html = generateHTML(replacedJson, [
        StarterKit,
        Color,
        TextStyle,
        Highlight,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Underline,
        Variable
      ]);

      // Render the HTML into the hidden div
      if (pdfContentRef.value) {
        pdfContentRef.value.innerHTML = html;
      }

      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!pdfContentRef.value) {
        reject(new Error('PDF content container not found'));
        return;
      }

      const canvas = await html2canvas(pdfContentRef.value, { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: pdfContentRef.value.scrollWidth,
        height: pdfContentRef.value.scrollHeight
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF with user name
      const fileName = isMultiple.value 
        ? `${user.name.replace(/\s+/g, '_')}_${template.title || 'contract'}.pdf`
        : `${template.title || 'template'}.pdf`;
      
      pdf.save(fileName);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Main generatePDF function (handles both single and multiple)
async function generatePDF() {
  const currentTemplate = templateStore.templates.find(template => 
    String(template.id) === String(selectedTemplate.value)
  );
  
  if (!currentTemplate) {
    ElMessage.error('No template selected');
    return;
  }

  if (isMultiple.value) {
    // Multiple users generation
    if (!usersArray.value.length) {
      ElMessage.error('No users selected');
      return;
    }

    console.log('Starting multiple PDF generation for:', usersArray.value.length, 'users');

    generating.value = true;
    progressPercentage.value = 0;
    progressStatus.value = '';
    progressText.value = 'Starting PDF generation...';

    try {
      let completed = 0;
      let failed = 0;

      for (let i = 0; i < usersArray.value.length; i++) {
        const user = usersArray.value[i];
        
        try {
          progressText.value = `Generating PDF for ${user.name}... (${i + 1}/${usersArray.value.length})`;
          
          await generateSinglePDF(user, currentTemplate);
          completed++;
          
          // Update progress
          progressPercentage.value = Math.round(((i + 1) / usersArray.value.length) * 100);
          
          // Small delay to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`Failed to generate PDF for ${user.name}:`, error);
          failed++;
        }
      }

      // Show results
      if (completed === usersArray.value.length) {
        progressStatus.value = 'success';
        progressText.value = `Successfully generated ${completed} PDF${completed > 1 ? 's' : ''}`;
        ElMessage.success(`All ${completed} contracts generated successfully!`);
      } else if (completed > 0) {
        progressStatus.value = 'warning';
        progressText.value = `Generated ${completed} PDF${completed > 1 ? 's' : ''}, ${failed} failed`;
        ElMessage.warning(`${completed} contracts generated, ${failed} failed`);
      } else {
        progressStatus.value = 'exception';
        progressText.value = 'All PDF generations failed';
        ElMessage.error('Failed to generate any contracts');
      }

      // Emit success event
      emit('contracts-generated', completed);
      
      // Auto-close after success
      setTimeout(() => {
        if (completed > 0) {
          handleClose();
        }
      }, 2000);

    } catch (error) {
      console.error('Multiple PDF generation failed:', error);
      progressStatus.value = 'exception';
      progressText.value = 'PDF generation failed';
      ElMessage.error('Failed to generate contracts');
    } finally {
      generating.value = false;
    }
  } else {
    // Single user generation
    if (!props.user) {
      ElMessage.error('No user selected');
      return;
    }

    try {
      generating.value = true;
      await generateSinglePDF(props.user, currentTemplate);
      ElMessage.success('PDF generated and downloaded!');
      handleClose();
    } catch (error) {
      console.error('PDF generation failed:', error);
      ElMessage.error('Failed to generate PDF');
    } finally {
      generating.value = false;
    }
  }
}

// Load data on component mount
onMounted(async () => {
  await loadData();
});
</script>

<style>
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.el-tag {
  margin-bottom: 4px;
}

/* Card miniature styling */
.w-fullcard-miniature {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

#hide-content {
  position: absolute;
  left: -9999px;
  top: 0;
  visibility: visible;
}

/* PDF content styling */
#pdf-content {
  font-family: Arial, sans-serif;
}

#pdf-content h1, #pdf-content h2, #pdf-content h3 {
  margin-top: 20px;
  margin-bottom: 10px;
}

#pdf-content h1 {
  font-size: 2em;
  font-weight: bold;
}

#pdf-content h2 {
  font-size: 1.5em;
  font-weight: bold;
}

#pdf-content p {
  margin-bottom: 10px;
}

#pdf-content ul, #pdf-content ol {
  margin-bottom: 10px;
  padding-left: 20px;
}
</style>