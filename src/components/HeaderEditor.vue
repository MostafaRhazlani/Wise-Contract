<template>
  <div class="bg-green-400 p-2 flex justify-between items-center">
    <RouterLink to="/">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-full overflow-hidden">
          <img class="object-cover w-full h-full" :src="companyStore.company?.company_logo" alt="" />
        </div>
        <h1 class="font-semibold text-white text-lg">{{ companyStore.company?.company_name }}</h1>
      </div>
    </RouterLink>
    <div class="flex items-center space-x-4">
      <!-- Download Button -->
      <button title="donwload template" @click="saveEditorContent"
        class="ml-4 p-2 text-white rounded hover:bg-green-500 transition"
        :class="{'cursor-no-drop bg-green-100' : isSaving }"
        :disabled="isSaving"
      >
        <Download />
      </button>
      <!-- User Profile Section -->
      <div class="relative">
        <button @click="userModalOpen = !userModalOpen"
          class="flex items-center space-x-2 rounded-lg transition-colors">
          <div
            class="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
          </div>
        </button>
        <UserProfileModal v-model:show="userModalOpen" position="top" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import UserProfileModal from "@/components/UserProfileModal.vue";
import { Download } from "lucide-vue-next";
import { RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from "@/store/authStore";
import { useCompanyStore } from "@/store/companyStore";
import { useTemplateStore } from "@/store/templateStore";
import { useTypeStore } from "@/store/typeStore";
import { ElMessage } from 'element-plus';
import { getContent } from "@/plugins/indexedDb";
import axios from "axios";
import html2canvas from "html2canvas";
import html2pdf from 'html2pdf.js';

const userModalOpen = ref(false);
const authStore = useAuthStore();
const companyStore = useCompanyStore();
const templateStore = useTemplateStore();
const typeStore = useTypeStore();
const route = useRoute();
const props = defineProps<{
    editorPageRefs: (HTMLElement | null)[]
}>();

// Check if current type is invoice
const isInvoiceType = computed(() => {
  const typeId = Number(route.params.type_id);
  const currentType = typeStore.types.find(type => type.id === typeId);
  return currentType?.title?.toLowerCase().includes('invoice') || false;
});

const userInitials = computed(() => {
  const name = authStore.user?.name || "";
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();
});

const isSaving = ref(false);

const downloadInvoicePDF = async () => {
    try {
        const invoiceElement = document.querySelector('.invoice-template');
        if (!invoiceElement) {
            console.error('Invoice template not found');
            return;
        }

        // Clone the invoice element to avoid modifying the original
        const clonedElement = invoiceElement.cloneNode(true) as HTMLElement;
        
        // Remove interactive elements from cloned element
        const interactiveElements = clonedElement.querySelectorAll('input, textarea, select, button, .logo-overlay');
        interactiveElements.forEach(el => {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                const inputEl = el as HTMLInputElement | HTMLTextAreaElement;
                const span = document.createElement('span');
                span.textContent = inputEl.value || inputEl.placeholder || '';
                span.className = inputEl.className;
                span.style.cssText = inputEl.style.cssText;
                inputEl.parentNode?.replaceChild(span, inputEl);
            } else if (el.tagName === 'SELECT') {
                const selectEl = el as HTMLSelectElement;
                const span = document.createElement('span');
                span.textContent = selectEl.value || selectEl.options[selectEl.selectedIndex]?.text || '';
                span.className = selectEl.className;
                span.style.cssText = selectEl.style.cssText;
                selectEl.parentNode?.replaceChild(span, selectEl);
            } else {
                el.remove();
            }
        });

        // Fix logo display - remove file path and keep only image
        const logoContainer = clonedElement.querySelector('.logo-container');
        if (logoContainer) {
            const logoPreview = logoContainer.querySelector('.logo-preview img') as HTMLImageElement;
            const logoUploadArea = logoContainer.querySelector('.logo-upload-area');
            
            if (logoPreview && logoPreview.src && !logoPreview.src.startsWith('file:')) {
                // Keep only the image, remove any text or overlay
                logoContainer.innerHTML = '';
                const imgElement = document.createElement('img');
                imgElement.src = logoPreview.src;
                imgElement.style.cssText = `
                    width: 150px;
                    height: 75px;
                    object-fit: contain;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    background: white;
                `;
                logoContainer.appendChild(imgElement);
            } else if (logoUploadArea) {
                // If no logo, show empty space instead of upload area
                logoContainer.innerHTML = '';
                const placeholder = document.createElement('div');
                placeholder.style.cssText = `
                    width: 150px;
                    height: 75px;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    background: white;
                `;
                logoContainer.appendChild(placeholder);
            }
        }

        // Create a temporary container for the PDF
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
            position: absolute;
            top: -10000px;
            left: -10000px;
            width: 210mm;
            background: white;
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        // Add PDF-specific styles to the cloned element
        clonedElement.style.cssText = `
            max-width: 210mm;
            width: 210mm;
            min-height: auto;
            margin: 0;
            padding: 1.5rem;
            box-shadow: none;
            border: none;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background: white;
            page-break-inside: avoid;
        `;

        // Adjust header for PDF
        const header = clonedElement.querySelector('.invoice-header') as HTMLElement;
        if (header) {
            header.style.cssText = `
                background: #f8fafc;
                border-bottom: 2px solid #e2e8f0;
                padding: 1rem;
                margin-bottom: 1rem;
            `;
        }

        // Adjust billing section for PDF
        const billingSection = clonedElement.querySelector('.billing-section') as HTMLElement;
        if (billingSection) {
            billingSection.style.cssText = `
                padding: 0 0 1rem 0;
                margin-bottom: 1rem;
            `;
        }

        // Adjust items section for PDF
        const itemsSection = clonedElement.querySelector('.items-section') as HTMLElement;
        if (itemsSection) {
            itemsSection.style.cssText = `
                padding: 0;
                margin-bottom: 1rem;
            `;
        }

        // Adjust footer section for PDF
        const footerSection = clonedElement.querySelector('.footer-section') as HTMLElement;
        if (footerSection) {
            footerSection.style.cssText = `
                padding: 0;
            `;
        }

        // Adjust table for better fit
        const table = clonedElement.querySelector('.items-table') as HTMLElement;
        if (table) {
            table.style.cssText = `
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
            `;
        }

        // Adjust table cells
        const tableCells = clonedElement.querySelectorAll('.items-table td, .items-table th');
        tableCells.forEach(cell => {
            (cell as HTMLElement).style.padding = '0.4rem 0.5rem';
        });

        // Adjust company name size
        const companyName = clonedElement.querySelector('.company-name-input') as HTMLElement;
        if (companyName) {
            companyName.style.fontSize = '1.1rem';
        }

        // Adjust invoice title size
        const invoiceTitle = clonedElement.querySelector('.invoice-title') as HTMLElement;
        if (invoiceTitle) {
            invoiceTitle.style.fontSize = '2.5rem';
        }

        tempContainer.appendChild(clonedElement);
        document.body.appendChild(tempContainer);

        // Generate PDF with optimized settings for single page
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `invoice-${new Date().getTime()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 1.5,
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: false,
                backgroundColor: '#ffffff',
                width: 794, // A4 width in pixels at 96 DPI
                height: 1123, // A4 height in pixels at 96 DPI
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: 'avoid-all' }
        };

        await html2pdf().set(opt).from(clonedElement).save();
        
        // Clean up
        document.body.removeChild(tempContainer);
        
        console.log('Invoice PDF downloaded successfully');
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
};

const saveEditorContent = async () => {
  // If it's an invoice type, download PDF instead of saving template
  if (isInvoiceType.value) {
    await downloadInvoicePDF();
    return;
  }

  // Original template saving logic for non-invoice types
  try {
    isSaving.value = true;  
    const formData = new FormData();
    const jsonContent = await getContent('editorContent');
    formData.append("company_id", String(companyStore.company?.id));
    formData.append("type_id", String(route.params.type_id));
    for (let i = 0; i < jsonContent.allContent.length; i++) {
      const jsonContentWithSize = {
        width: jsonContent.width,
        height: jsonContent.height,
        content: jsonContent.allContent
      }
      const el = props.editorPageRefs[i];
      
      if (!el) continue;
      const canvas = await html2canvas(el, { scale: 0.5 });
      const imageDataUrl = canvas.toDataURL("image/png");
      const fetchResponse = await fetch(imageDataUrl);
      const imageBlob = await fetchResponse.blob();
      const imageFile = new File([imageBlob], `template_thumbnail_${i + 1}.png`, { type: "image/png" });
      if (imageFile.size === 0) {
        console.warn(`Page ${i + 1} could not be captured. Skipping.`);
        continue;
      }
      formData.append('content_json[]', JSON.stringify(jsonContentWithSize));
      formData.append('image_path[]', imageFile);
    }
    const response = await axios.post("/template/save", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status === 200) {
      templateStore.getTemplatesCompany();
      ElMessage.success('Template saved successfully');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.log(errorMessage);
  } finally {
    isSaving.value = false;
  }
};
</script>