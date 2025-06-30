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

    <!-- Debug info (remove in production) -->
    <div v-if="selectedTemplate" class="mb-4 p-2 bg-blue-50 rounded text-sm">
      Selected Template ID: {{ selectedTemplate }}
    </div>

    <!-- Pass props to TemplatesList -->
    <TemplatesList 
      @select-template="selectTemplate"
      :selected-template="selectedTemplate"
      :filter-type="selectedType"
    />

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button 
          type="primary" 
          @click="generateDocument"
          :disabled="!selectedTemplate"
          :loading="generating"
        >
          {{ generating ? 'Generating PDF...' : 'Generate Document' }}
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- Hidden div for PDF generation -->
  <div 
    ref="pdfContent" 
    id="pdf-content" 
    style="position: absolute; left: -9999px; top: -9999px; width: 794px; padding: 40px; background: white;"
  >
    <!-- PDF content will be inserted here -->
  </div>
</template>

<script setup lang="ts">
import TemplatesList from '@/components/TemplatesList.vue';
import { ref, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useTemplateStore } from '@/store/templateStore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Import Tiptap for JSON to HTML conversion
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'

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
  company?: { 
    company_name: string;
    email: string;
    phone: string;
    address: string;
  };
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
const generating = ref(false);
const pdfContent = ref<HTMLElement>();
const templateStore = useTemplateStore();

// Computed
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Watch for modal opening to reset selections
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedType.value = '';
    selectedTemplate.value = '';
  }
});

// Methods
function selectTemplate(templateId: string | number) {
  console.log('Template selected:', templateId);
  selectedTemplate.value = String(templateId);
  ElMessage.success(`Template ${templateId} selected`);
}

function filterTemplates() {
  selectedTemplate.value = '';
}

async function generateDocument() {
  if (!selectedTemplate.value || !props.user) {
    ElMessage.error('Please select a template');
    return;
  }

  generating.value = true;

  try {
    // Get the selected template
    const template = templateStore.templates.find(t => String(t.id) === selectedTemplate.value);
    
    if (!template) {
      ElMessage.error('Template not found');
      return;
    }

    // Use Tiptap to convert JSON to HTML and replace variables
    const content_json = template.content_json;
    
    console.log('Processed HTML content:', content_json);
    const htmlContent = generateHTML(content_json, [StarterKit]);

    console.log(htmlContent);
    
    handleClose();

  } catch (error: any) {
    console.error('PDF generation failed:', error);
    ElMessage.error('Failed to generate PDF. Please try again.');
  } finally {
    generating.value = false;
  }
}

async function generatePDF(userName: string, templateName: string) {
  if (!pdfContent.value) return;

  // Create canvas from HTML content
  const canvas = await html2canvas(pdfContent.value, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: pdfContent.value.scrollWidth,
    height: pdfContent.value.scrollHeight
  });

  // Create PDF
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

  // Add image to PDF
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add new pages if content is longer than one page
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Download the PDF
  const fileName = `${userName.replace(/\s+/g, '_')}_${templateName}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}

function handleClose() {
  visible.value = false;
  selectedType.value = '';
  selectedTemplate.value = '';
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

#pdf-content {
  font-family: Arial, sans-serif;
}

/* Card miniature styling */
.w-fullcard-miniature {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}
</style>