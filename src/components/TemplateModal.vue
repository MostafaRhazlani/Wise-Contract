<template>
  <el-dialog v-model="visible" title="Select Template" width="650px" align-center @close="handleClose">
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

    <template #footer>
      <div class="dialog-footer">
        <el-button type="info" @click="handleClose">Cancel</el-button>
        <el-button
          v-if="selectedTemplate"
          type="success"
          @click="generatePDF"
        >
          Generate PDF
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Import Tiptap for JSON to HTML conversion
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Variable } from '@/extensions/VariableNode';
import { GripHorizontal } from 'lucide-vue-next';

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  post: string;
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
}>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

// Reactive data
const selectedType = ref<number | string>('');
const selectedTemplate = ref('');
const generating = ref(false);
const pdfContentRef = ref<HTMLElement>();
const templateStore = useTemplateStore();
const typeStore = useTypeStore();

// Computed
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
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
    selectedType.value = '';
    selectedTemplate.value = '';
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
}

function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => {
    return acc && acc[key]
  }, obj);
}

// Recursively replace variable nodes in Tiptap JSON
function replaceVariablesInJson(json: any, user: any): any {
  if (Array.isArray(json)) {
    return json.map(item => replaceVariablesInJson(item, user));
  } else if (json && typeof json === 'object') {
    if (json.type === 'variable' && json.attrs?.label) {
      // Replace variable node with a text node containing the value
      const value = getValueByPath(user, json.attrs.label);
      return {
        type: 'text',
        text: value ?? `[${json.attrs.label}]`,
        marks: json.marks
      };
    }
    // Recursively process children
    const newObj: any = { ...json };
    if (json.content) {
      newObj.content = replaceVariablesInJson(json.content, user);
    }
    return newObj;
  }
  return json;
}

function generatePDF() {
  const currentTemplate = templateStore.templates.find(template => String(template.id) === String(selectedTemplate.value));
  if (!currentTemplate) {
    ElMessage.error('No template selected');
    return;
  }

  // Replace variables in the JSON
  const contentJson = JSON.parse(currentTemplate.content_json);
  
  const replacedJson = replaceVariablesInJson(contentJson, { user: props.user });
  
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

  setTimeout(async () => {
    if (!pdfContentRef.value) return;
    try {
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
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
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
      pdf.save(`${currentTemplate.title || 'template'}.pdf`);
      ElMessage.success('PDF generated and downloaded!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      ElMessage.error('Failed to generate PDF');
    }
  }, 100);
}

// Load data on component mount
onMounted(async () => {
  await loadData();
});
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

/* PDF content styling */
#pdf-content {
  font-family: Arial, sans-serif;
}

#pdf-content h1, #pdf-content h2, #pdf-content h3 {
  margin-top: 20px;
  margin-bottom: 10px;
}

#pdf-content p {
  margin-bottom: 10px;
}

#pdf-content ul, #pdf-content ol {
  margin-bottom: 10px;
  padding-left: 20px;
}
</style>