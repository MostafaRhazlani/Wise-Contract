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
      <div class="mt-3 p-3 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-700">
          <strong>Note:</strong> All selected users will be combined into a single PDF file with multiple pages.
        </p>
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
      <p class="text-xs text-gray-500 mt-1">
        Creating a single PDF with {{ usersArray.length }} pages...
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
  <div id="hide-content">
    <div ref="pdfContentRef"></div>
  </div>
  
</template>

<script setup lang="ts">
import TemplatesList from '@/components/TemplatesList.vue';
import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

import { useTemplateStore } from '@/store/templateStore';
import { useTypeStore } from '@/store/typeStore';

import html2pdf from 'html2pdf.js';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle, FontSize, FontFamily } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { Columns, Column } from '@/extensions/columns/columns';
import { LineHeight } from '@/extensions/line-height';
import { TableKit } from '@tiptap/extension-table';
import Subscript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image';
import Superscript from '@tiptap/extension-superscript';
import { OrderedList } from '@/extensions/list/order-list';
import { BulletedList } from '@/extensions/list/bullet-list';
import { Editor } from '@tiptap/vue-3';
import resizableImage from '@/extensions/image/resizable-image';

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

// Computed
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const isMultiple = computed(() => props.isMultiple || false);

// Ensure usersArray is always an array
const usersArray = computed(() => {
  if (!props.users) {
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
    return `Generate Combined PDF (${usersArray.value.length} users)`;
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
    if (json.type === 'variable' && json.attrs?.key) {
      // Replace variable node with a text node containing the value
      const value = getValueByPath(user, json.attrs.key);
      return {
        type: 'text',
        text: String(value) ?? `[${json.attrs.key}]`,
        marks: json.marks ?? []
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

// Generate PDF for a single page and return the canvas
async function renderHtmlForUser(contentJson: any, user: User): Promise<string> {
  // Get the page background color from the store
  const parsedJson = JSON.parse(contentJson);
  // Inline styles for tables that need specific layout
  const pageStyle = `
    <style>
      table {
        table-layout: fixed;
        border-collapse: collapse;
      }
      .columns {
        display: flex !important;
        width: 100% !important;
        gap: 16px;
        margin: 8px 0;
      }
      .column {
        flex: 1 !important;
        min-width: 0;
        padding: 8px;
        box-sizing: border-box;
        background-color: transparent !important;
      }
      .column img {
        max-width: 100% !important;
        height: auto !important;
        display: block;
        margin: 0 auto;
      }
      .column p {
        margin: 0 0 8px 0;
      }
    </style>
  `;
  
  // Replace variables in the JSON
  const contentWithVariables = replaceVariablesInJson(parsedJson.content, user);
  
  // Convert the JSON to HTML using TipTap
  const editor = new Editor({
    editable: false,
    content: contentWithVariables,
    extensions: [
    StarterKit.configure({
        orderedList: false,
        bulletList: false,
      }),
      TextStyle,
      FontSize,
      FontFamily,
      Superscript,
      Subscript,
      OrderedList,
      BulletedList,
      LineHeight,
      Image,
      Color,
      TableKit.configure({
        table: { resizable: true },
      }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Columns,
      Column,
      resizableImage
    ],
  });
  
  // Wrap the content in a div with Tailwind classes
  const htmlContent = editor.getHTML();
  // Process the HTML content to add Tailwind classes
  const processHtmlWithTailwind = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Apply Tailwind classes to elements
    doc.querySelectorAll('h1').forEach(el => {
      el.className = 'text-4xl my-4';
    });
    doc.querySelectorAll('h2').forEach(el => {
      el.className = 'text-3xl my-3';
    });
    doc.querySelectorAll('h3').forEach(el => {
      el.className = 'text-2xl my-2';
    });
    doc.querySelectorAll('h4').forEach(el => {
      el.className = 'text-xl my-2';
    });
    
    // Apply list styles with proper type casting
    const setListStyle = (selector: string, style: string) => {
      doc.querySelectorAll(selector).forEach((el: Element) => {
        if (el instanceof HTMLElement) {
          el.style.listStyleType = style as any;
        }
      });
    };

    // Apply ordered list styles
    setListStyle('ol[type="1"], ol[type="decimal"]', 'decimal');
    setListStyle('ol[type="decimal-leading-zero"]', 'decimal-leading-zero');
    setListStyle('ol[type="i"]', 'lower-roman');
    setListStyle('ol[type="I"]', 'upper-roman');
    setListStyle('ol[type="a"]', 'lower-alpha');
    setListStyle('ol[type="A"], ol[type="upper-alpha"]', 'upper-alpha');
    
    // Apply unordered list styles
    setListStyle('ul.bullet-list-disc', 'disc');
    setListStyle('ul.bullet-list-circle', 'circle');
    setListStyle('ul.bullet-list-square', 'square');
    
    // Ensure list items have proper display and margin
    doc.querySelectorAll('li').forEach((el: Element) => {
      if (el instanceof HTMLElement) {
        el.style.display = 'list-item';
        el.style.margin = '4px 0';
      }
    });
    
    doc.querySelectorAll('h5').forEach(el => {
      el.className = 'text-lg my-2';
    });
    doc.querySelectorAll('h6').forEach(el => {
      el.className = 'text-base my-2';
    });
    doc.querySelectorAll('p').forEach(el => {
      el.className = 'mb-4 px-2';
    });
    doc.querySelectorAll('table').forEach(el => {
      el.className = 'w-full mt-4';
    });
    doc.querySelectorAll('th').forEach(el => {
      el.className = 'border border-gray-300 bg-gray-100 text-left font-bold overflow-hidden';
    });
    doc.querySelectorAll('td').forEach(el => {
      el.className = 'border border-gray-300 overflow-hidden';
    });
    doc.querySelectorAll('ul').forEach(el => {
      el.className = 'list-disc pl-5 my-2';
    });
    doc.querySelectorAll('ol').forEach(el => {
      el.className = 'list-decimal pl-5 my-2';
    });
    doc.querySelectorAll('li').forEach(el => {
      el.className = 'my-1';
    });
    // Don't override column images with inline-block
    doc.querySelectorAll('img:not(.column img)').forEach(el => {
      el.className = 'inline-block max-w-full h-auto';
    });
    
    return doc.body.innerHTML;
  };
  
  const processedHtml = processHtmlWithTailwind(htmlContent);
  const wrappedHtml = `
    <div class="w-full h-full font-sans">
      ${processedHtml}
    </div>
  `;
  
  return `${pageStyle}${wrappedHtml}`;
}

// Generate PDF for single user (for single upload mode) using html2pdf
async function generateSinglePDF(user: User, template: any): Promise<void> {
  try {
    // Combine all pages' HTML
    let combinedHtml = '';
    const pages = template.pages;

    // Add a container div with proper dimensions
    combinedHtml += `<div style="width: 100%;">`;

    for (let i = 0; i < pages.length; i++) {
      const parseContent = JSON.parse(pages[i].content_json);
      const html = await renderHtmlForUser(JSON.stringify(parseContent), user);

      combinedHtml += `
        <div 
          style="
            background: ${parseContent.backgroundColor}; 
            width: ${parseContent.width}px; 
            height: ${parseContent.height}px;
          "
          class="p-5 mx-auto overflow-hidden box-border"
        >
          <div class="w-full h-full overflow-auto">${html}</div>
        </div>
      `;
    }
    
    // Close the container div
    combinedHtml += `</div>`;

    console.log(combinedHtml);
    
    // Render the HTML into the hidden div
    if (pdfContentRef.value) {
      pdfContentRef.value.innerHTML = combinedHtml;
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    const fileName = `${user.name.replace(/\s+/g, '_')}_${template.title || 'contract'}.pdf`;
    const pxTomm = (px: number): number => px * 0.264583;
    const widthCm = pxTomm(JSON.parse(pages[0].content_json).width);
    const heightCm = pxTomm(JSON.parse(pages[0].content_json).height);
    
    await html2pdf().set({
      margin: 0,
      filename: fileName,
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        backgroundColor: JSON.parse(pages[0].content_json).backgroundColor || '#ffffff',
        logging: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: JSON.parse(pages[0].content_json).width,
        windowHeight: JSON.parse(pages[0].content_json).height
      },
      jsPDF: { 
        orientation: widthCm > heightCm ? 'landscape' : 'portrait', 
        unit: 'mm', 
        format: [widthCm, heightCm],
        hotfixes: ['px_scaling']
      }
    }).from(pdfContentRef.value).save();
  } catch (error) {
    throw error;
  }
}

// Generate combined PDF for multiple users (one PDF with multiple pages per user) using html2pdf
async function generateMultipleUsersPDF(users: User[], template: any): Promise<void> {
  try {
    let combinedHtml = '';
    let completed = 0;
    const allPages: string[] = [];

    const firstPage = template.pages?.[0];
    
    
    const parseFirstPage = JSON.parse(firstPage.content_json);
    const pxTomm = (px: number): number => px * 0.264583;
    const widthMm = pxTomm(parseFirstPage.width);
    const heightMm = pxTomm(parseFirstPage.height);
    const isLandscape = widthMm > heightMm;
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      progressText.value = `Processing ${user.name}... (${i + 1}/${users.length})`;

      // Process each page for the current user
      const pages = template.pages;
      for (let j = 0; j < pages.length; j++) {
        const page = pages[j];
        const parseContent = JSON.parse(page.content_json);
        // Pass the full content_json to renderHtmlForUser, not just the content
        const html = await renderHtmlForUser(page.content_json, user);

        // Wrap each page in a container with proper dimensions and styles
        const pageHtml = `
          <div 
            style="
              background: ${parseContent.backgroundColor || '#ffffff'}; 
              width: ${parseContent.width}px; 
              height: ${parseContent.height}px;
              position: relative;
              overflow: hidden;
              box-sizing: border-box;
              padding: 20px;
              margin: 0 auto;
            "
            class="page-container"
          >
            <div class="w-full h-full overflow-auto">${html}</div>
          </div>
        `;

        allPages.push(`<div>${pageHtml}</div>`);
      }
      completed++;
      progressPercentage.value = Math.round(((i + 1) / users.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (completed === 0) {
      throw new Error('No users were processed successfully');
    }
    
    combinedHtml = allPages.join('');

    // Render the HTML into the hidden div
    if (pdfContentRef.value) {
      pdfContentRef.value.innerHTML = combinedHtml;
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `${template.title || 'contract'}_${completed}users_${timestamp}.pdf`;
    const firstPageJson = JSON.parse(template.pages[0].content_json);
    await html2pdf().set({
      margin: 0,
      filename: fileName,
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        backgroundColor: firstPageJson.backgroundColor || '#ffffff',
        logging: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: firstPageJson.width,
        windowHeight: firstPageJson.height
      },
      jsPDF: { 
        orientation: isLandscape ? 'landscape' : 'portrait', 
        unit: 'mm', 
        format: [widthMm, heightMm],
        hotfixes: ['px_scaling']
      }
    }).from(pdfContentRef.value).save();
  } catch (error) {
    throw error;
  }
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
    // Multiple users generation - ONE PDF with multiple pages
    if (!usersArray.value.length) {
      ElMessage.error('No users selected');
      return;
    }

    generating.value = true;
    progressPercentage.value = 0;
    progressStatus.value = '';
    progressText.value = 'Starting combined PDF generation...';

    try {
      await generateMultipleUsersPDF(usersArray.value, currentTemplate);
      
      // Show success message
      progressStatus.value = 'success';
      progressText.value = `Successfully generated combined PDF with ${usersArray.value.length} user${usersArray.value.length > 1 ? 's' : ''}`;
      ElMessage.success(`Combined PDF with ${usersArray.value.length} user${usersArray.value.length > 1 ? 's' : ''} generated successfully!`);

      // Emit success event
      emit('contracts-generated', usersArray.value.length);
      
      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Combined PDF generation failed:', error);
      progressStatus.value = 'exception';
      progressText.value = 'Combined PDF generation failed';
      ElMessage.error('Failed to generate combined PDF');
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
</style>