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
        <el-button type="success" @click="generateDocument" :disabled="!selectedTemplate" :loading="generating">
          {{ generating ? 'Generating PDF...' : 'Generate PDF Document' }}
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
import { Variable } from '@/extensions/VariableNode'; // Import your custom Variable extension

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


// Enhanced function to create user data mapping from variables
function createUserDataMapping(userData: User, variables: any[]): Record<string, any> {
  const mapping: Record<string, any> = {};
  
  console.log('=== CREATING USER DATA MAPPING ===');
  console.log('Available variables:', variables);
  console.log('User data structure:', userData);
  
  // Add current date/time variables
  const currentDate = new Date();
  const dynamicData = {
    current_date: currentDate.toLocaleDateString(),
    current_time: currentDate.toLocaleTimeString(),
    current_year: currentDate.getFullYear().toString(),
  };
  
  // Process each variable and try to find corresponding user data
  variables.forEach(variable => {
    const { key, label } = variable;
    
    console.log(`Processing variable - Key: ${key}, Label: ${label}`);
    
    // Check if it's a dynamic variable first
    if (
      typeof key === 'string' && key in dynamicData ||
      typeof label === 'string' && label in dynamicData
    ) {
      const value =
        (typeof key === 'string' && key in dynamicData ? dynamicData[key as keyof typeof dynamicData] : undefined) ||
        (typeof label === 'string' && label in dynamicData ? dynamicData[label as keyof typeof dynamicData] : undefined);
      mapping[key] = value;
      console.log(`Mapped dynamic variable ${key} -> ${value}`);
      return;
    }
    
    // Try to get value using the label as the path
    let value = getValueByPath(userData, label);
    
    // If not found by label, try some common variations
    if (value === null) {
      const variations = [
        // Remove user prefix and try direct properties
        label.replace(/^user\./, ''),
        label.replace(/^user\./, '').toLowerCase(),
        
        // Try with different separators
        label.replace(/\./g, '_').toLowerCase(),
        label.replace(/_/g, '.'),
        
        // Try the key itself
        key.toLowerCase(),
        key.replace(/_/g, '.'),
        
        // Try without prefixes
        label.toLowerCase(),
        label.replace(/\s+/g, '_').toLowerCase(),
        label.replace(/\s+/g, '').toLowerCase(),
      ];
      
      console.log(`Trying variations for ${label}:`, variations);
      
      for (const variation of variations) {
        value = getValueByPath(userData, variation);
        if (value !== null) {
          console.log(`Found value for ${label} using variation: ${variation} = ${value}`);
          break;
        }
      }
    } else {
      console.log(`Found direct value for ${label} = ${value}`);
    }
    
    // Store the mapping using the original key
    if (value !== null) {
      mapping[key] = formatValue(value, label);
      console.log(`Mapped ${key} -> ${mapping[key]}`);
    } else {
      console.log(`No value found for variable: ${label}`);
      // For debugging, let's see what properties are actually available
      if (label.includes('.')) {
        const rootPath = label.split('.')[0].replace('user', '');
        const rootObject = rootPath ? userData[rootPath as keyof User] : userData;
        console.log(`Available properties in ${rootPath || 'root'}:`, Object.keys(rootObject || {}));
      } else {
        console.log('Available root properties:', Object.keys(userData));
      }
      
      // Store placeholder for missing variables
      mapping[key] = `[${key}]`;
    }
  });
  
  console.log('Final mapping:', mapping);
  console.log('=== MAPPING COMPLETE ===');
  
  return mapping;
}

// Enhanced path resolution with better debugging
function getValueByPath(obj: any, path: string): any {
  if (!path || !obj) return null;
  
  // Remove "user." prefix if it exists since userData is already the user object
  let cleanPath = path.replace(/^user\./, '');
  
  console.log(`🔍 Resolving path: "${path}" -> "${cleanPath}"`);
  console.log('Available object keys:', Object.keys(obj));
  
  // Handle direct properties first
  if (obj[cleanPath] !== undefined) {
    console.log(`✅ Direct match: ${cleanPath} = ${obj[cleanPath]}`);
    return obj[cleanPath];
  }
  
  // Handle nested paths
  const pathParts = cleanPath.split('.');
  let current = obj;
  let currentPath = '';
  
  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    currentPath += (currentPath ? '.' : '') + part;
    
    console.log(`  Checking part: "${part}" in path: "${currentPath}"`);
    console.log(`  Current object:`, current);
    console.log(`  Available keys:`, current ? Object.keys(current) : 'null');
    
    if (current && current[part] !== undefined) {
      current = current[part];
      console.log(`  ✅ Found: ${part} = ${current}`);
    } else {
      console.log(`  ❌ Not found: ${part}`);
      return null;
    }
  }
  
  console.log(`✅ Final value for "${cleanPath}": ${current}`);
  return current;
}

// Helper function to format dates and values
function formatValue(value: any, path: string): string {
  if (value === null || value === undefined) return '';
  
  // Handle dates
  if (path.includes('date') || path.includes('created_at') || path.includes('updated_at')) {
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return String(value);
    }
  }
  
  // Handle booleans
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  return String(value);
}

// Main function to replace variables in content_json using label-based mapping
function replaceVariablesInContent(contentJson: any, userData: User, variables: any[]): any {
  if (!userData) return contentJson;
  
  // Create mapping from variables to user data
  const userDataMapping = createUserDataMapping(userData, variables);
  
  console.log('=== REPLACEMENT PROCESS ===');
  console.log('User data mapping:', userDataMapping);
  
  // Create a deep copy of content_json to avoid mutations
  const processedContent = JSON.parse(JSON.stringify(contentJson));
  
  // Find and replace variables recursively - ENSURE ALL VARIABLES ARE REPLACED
  const replaceInNode = (node: any): any => {
    if (Array.isArray(node)) {
      return node.map(replaceInNode);
    }
    
    if (node && typeof node === 'object') {
      // Handle variable nodes specifically
      if (node.type === 'variable' && node.attrs && node.attrs.key) {
        const variableKey = node.attrs.key;
        console.log(`Found variable node with key: ${variableKey}`);
        
        // Always replace variable nodes - use empty string if no value found
        const replacementValue = userDataMapping[variableKey] || `[${variableKey}]`;
        console.log(`Replacing variable ${variableKey} with: ${replacementValue}`);
        
        // Replace variable node with text node
        return {
          type: 'text',
          text: replacementValue
        };
      }
      
      // Recursively process other object properties
      const processed: any = {};
      for (const key in node) {
        processed[key] = replaceInNode(node[key]);
      }
      return processed;
    }
    
    return node;
  };
  
  const result = replaceInNode(processedContent);
  
  // Double check - remove any remaining variable nodes
  const cleanResult = removeVariableNodes(result);
  
  console.log('=== REPLACEMENT COMPLETE ===');
  return cleanResult;
}

// Helper function to ensure no variable nodes remain
function removeVariableNodes(node: any): any {
  if (Array.isArray(node)) {
    return node.map(removeVariableNodes).filter(n => n !== null);
  }
  
  if (node && typeof node === 'object') {
    // If it's still a variable node, convert to text
    if (node.type === 'variable') {
      console.warn('Found remaining variable node, converting to text:', node);
      return {
        type: 'text',
        text: node.attrs?.label || node.attrs?.key || '[Variable]'
      };
    }
    
    // Recursively process other object properties
    const processed: any = {};
    for (const key in node) {
      const processedValue = removeVariableNodes(node[key]);
      if (processedValue !== null) {
        processed[key] = processedValue;
      }
    }
    return processed;
  }
  
  return node;
}

// Convert processed JSON to HTML using Tiptap
function convertToHTML(processedJson: any): string {
  try {
    console.log('Converting to HTML with processed JSON:', processedJson);
    
    // Define Tiptap extensions - INCLUDING the Variable extension for safety
    const extensions = [
      StarterKit,
      TextStyle,
      Color,
      Highlight,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      // Include Variable extension just in case some nodes remain
      Variable.configure({
        HTMLAttributes: {
          class: 'variable-node',
        },
        getVariables: () => [], // Empty since we've replaced all variables
      }),
    ];

    // Generate HTML from JSON
    const html = generateHTML(processedJson, extensions);
    
    console.log('Generated HTML successfully:', html);
    
    // Wrap in a styled container
    return `
      <div style="
        max-width: 794px;
        margin: 0 auto;
        padding: 40px;
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background: white;
      ">
        ${html}
      </div>
    `;
  } catch (error) {
    console.error('Error converting JSON to HTML:', error);
    console.error('Problematic JSON:', processedJson);
    
    // Fallback: create simple HTML from text content
    return createFallbackHTML(processedJson);
  }
}

// Fallback HTML creation if Tiptap fails
function createFallbackHTML(content: any): string {
  const extractText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join(' ');
    if (node && typeof node === 'object') {
      if (node.text) return node.text;
      if (node.content) return extractText(node.content);
      return Object.values(node).map(extractText).join(' ');
    }
    return '';
  };
  
  const text = extractText(content);
  
  return `
    <div style="
      max-width: 794px;
      margin: 0 auto;
      padding: 40px;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
    ">
      <h2>Document Content</h2>
      <div style="white-space: pre-wrap;">${text}</div>
    </div>
  `;
}

// Generate PDF from HTML content
async function generatePDF(htmlContent: string, fileName: string) {
  if (!pdfContentRef.value) {
    throw new Error('PDF content container not found');
  }

  // Insert HTML content into hidden div
  pdfContentRef.value.innerHTML = htmlContent;

  // Wait for content to render
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Create canvas from HTML content
  const canvas = await html2canvas(pdfContentRef.value, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: pdfContentRef.value.scrollWidth,
    height: pdfContentRef.value.scrollHeight
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
  pdf.save(fileName);
}

async function generateDocument() {
  if (!selectedTemplate.value || !props.user) {
    ElMessage.error('Please select a template');
    return;
  }

  generating.value = true;

  try {
    // Get the selected template from filtered templates
    const template = filteredTemplates.value.find(t => String(t.id) === selectedTemplate.value);
    
    if (!template) {
      ElMessage.error('Template not found');
      return;
    }

    console.log('=== GENERATE DOCUMENT ===');
    console.log('Selected Template ID:', selectedTemplate.value);
    console.log('Template Object:', template);
    console.log('Template content_json (raw):', template.content_json);
    
    // Parse the content_json
    let parsedJson;
    try {
      parsedJson = JSON.parse(template.content_json);
      console.log('Template content_json (parsed):', parsedJson);
    } catch (parseError) {
      console.error('Failed to parse content_json:', parseError);
      ElMessage.error('Template content is not valid JSON');
      return;
    }
    
    console.log('=== USER DATA STRUCTURE ===');
    console.log('User data:', props.user);
    console.log('User data keys:', Object.keys(props.user));
    if (props.user.company) {
      console.log('Company data keys:', Object.keys(props.user.company));
    }
    if (props.user.role) {
      console.log('Role data keys:', Object.keys(props.user.role));
    }
    console.log('=== END USER DATA ===');
    
    // Get variables from your variables store
    const { useVariablesStore } = await import('@/store/variablesStore');
    const variablesStore = useVariablesStore();
    
    // Ensure variables are loaded
    if (!variablesStore.variables.length) {
      await variablesStore.fetchVariables();
    }
    
    console.log('Available variables:', variablesStore.variables);
    
    // Replace variables dynamically using label-based mapping
    const processedContent = replaceVariablesInContent(parsedJson, props.user, variablesStore.variables);
    
    console.log('=== PROCESSING TO PDF ===');
    console.log('Processed content_json:', JSON.stringify(processedContent, null, 2));
    
    // Convert to HTML
    const htmlContent = convertToHTML(processedContent);
    console.log('Generated HTML:', htmlContent);
    
    // Generate PDF
    const fileName = `${props.user.name.replace(/\s+/g, '_')}_Template_${template.id}_${new Date().toISOString().split('T')[0]}.pdf`;
    await generatePDF(htmlContent, fileName);
    
    console.log('=== PDF GENERATED SUCCESSFULLY ===');
    console.log('File name:', fileName);

    ElMessage.success(`PDF generated and downloaded successfully for ${props.user.name}`);
    emit('generate', selectedTemplate.value, props.user);
    
    handleClose();

  } catch (error: any) {
    console.error('Document generation failed:', error);
    ElMessage.error('Failed to generate PDF. Please try again.');
  } finally {
    generating.value = false;
  }
}

function handleClose() {
  visible.value = false;
  selectedType.value = '';
  selectedTemplate.value = '';
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