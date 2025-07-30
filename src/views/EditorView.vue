<template>
  <div class="">
    <HeaderEditor :editorPageRefs="editorPageRefs" />
    <!-- Toolbar -->
    <MenuControll :editor="editors[activePageIndex]" @insert-table="handleInsertTable"
      @insert-columns="handleInsertColumns" />
    <div class="h-[calc(100vh-11.8rem)]">
      <div class="flex h-full">
        <div class="flex">
          <!-- Floating Control Sidebar -->
          <EditorControlSidebar :activePanel="activePanel || undefined" @toggle-panel="togglePanel" />
          <!-- Left Sidebar Panel -->
          <transition name="fade">
            <div v-if="activePanel" class="w-80 bg-white border-r border-gray-200 flex flex-col">
              <div class="p-4 overflow-y-auto flex-1">
                <VariablesList v-if="activePanel === 'variables'" @select="insertVariable" />
                <div v-else-if="activePanel === 'templates'">
                  <h3 class="font-semibold text-gray-800 mb-4">Templates</h3>
                  <TemplatesList @select-template="handleSelectTemplate" />
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div :class="['flex flex-col', activePanel ? 'w-[calc(100vw-24.5rem)]' : 'w-[calc(100vw-4.5rem)]']">
          <div class="editor-zoomable-container overflow-auto w-full h-[calc(100vh-10rem)] bg-gray-100"
            ref="containerRef">
            <!-- <div class="w-full flex justify-center">
              <span class="">Template Loading...</span>
            </div> -->
            <div class="flex shadow w-full h-full mx-auto relative" :style="{
              width: `${pageSizeStore.pageWidth * zoomLevel}px`,
              height: `${pageSizeStore.pageHeight * zoomLevel}px`
            }">
              <div v-for="(editor, index) in editors" :ref="el => setEditorRef(el, index)" :key="index"
                :class="['transition-transform duration-200 ease-in-out', index === activePageIndex ? 'z-10 opacity-100' : 'pointer-events-none absolute -z-10']">
                <div class="w-full h-full relative notion-editor-container">
                  <EditorPage :editor="editor" :class="`bullet-style-${index} editor-page`" :style="{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top left',
                    width: `${pageSizeStore.pageWidth}px`,
                    height: `${pageSizeStore.pageHeight}px`,
                    overflow: 'hidden',
                  }" ref="editorPageRef" />
                  <!-- Notion-style block controls -->
                  <template v-for="block in getVisibleBlocks(editor, index)" :key="block.key">
                    <!-- Side menu button for block options -->
                    <NotionMenuButton :top="block.top + 5" :left="block.left + 60" :pageIndex="index" :pos="block.pos"
                      :editor="editor" :show="block.focused" />
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- Page Controls Component -->
          <EditorPageControls :zoom="zoomLevel" :pages="currentPages" :editors="editors" :currentPage="activePageIndex"
            @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @set-zoom="val => zoomLevel = val"
            @add-page="handleAddPage" @fullscreen="handleFullscreen" @select-page="handleSelectPage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderEditor from '@/components/HeaderEditor.vue';
import MenuControll from '@/components/toolbar/MenuControll.vue';
import TemplatesList from '@/components/TemplatesList.vue';
import EditorControlSidebar from '@/components/EditorControlSidebar.vue';
import VariablesList from '@/components/VariablesList.vue';
import EditorPageControls from '@/components/EditorPageControls.vue';
import EditorPage from '@/components/EditorPage.vue';
import { Editor } from '@tiptap/vue-3';
import { ref, onMounted, onUnmounted, computed, nextTick, watch, watchEffect } from 'vue';
import type { Ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useEditorStore } from "@/store/editorStore";
import { useTemplateStore } from "@/store/templateStore";
import { useVariablesStore } from '@/store/variablesStore';
import { useTypeStore } from '@/store/typeStore';
import { usePageSizeStore } from '@/store/pageSizeStore';

import StarterKit from '@tiptap/starter-kit';
import { TextStyle, FontSize, FontFamily } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Focus from '@tiptap/extension-focus';
import { TableKit } from '@tiptap/extension-table'
import { Variable } from "@/extensions/variable";
import { OrderedList } from '@/extensions/list/order-list';
import { BulletedList } from '@/extensions/list/bullet-list';
import { LineHeight } from '@/extensions/line-height';
import ResizableImage from '@/extensions/image/resizable-image';
import { Columns, Column } from '@/extensions/columns/columns';
import { removeContent } from "@/plugins/indexedDb";
import { useRouter, useRoute } from 'vue-router'
import { TabHandler } from '@/extensions/tab-handler';
import NotionMenuButton from '@/components/notion-controls/NotionMenuButton.vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const editorPageRefs = ref<(HTMLElement | null)[]>([]);
const editors: Ref<Editor[]> = ref([]);
const activePageIndex: Ref<number> = ref(0);
const zoomLevel: Ref<number> = ref(1);
const isFullscreen: Ref<boolean> = ref(false);

const editorStore = useEditorStore();
const templateStore = useTemplateStore();
const variablesStore = useVariablesStore();
const typeStore = useTypeStore();
const pageSizeStore = usePageSizeStore();

const { activePanel } = storeToRefs(editorStore);
const { togglePanel } = editorStore;

const containerRef = ref<HTMLElement | null>(null);

const zoomMode = ref<'fit-width' | 'fit-height' | 'custom'>('fit-width');

function setEditorRef(el: any, index: number) {
  // Handle both Element and Vue component instance
  const element = el?.$el || el;
  editorPageRefs.value[index] = element as HTMLElement | null;
}

function handleZoomIn() {
  zoomMode.value = 'custom';
  zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2);
}

function handleZoomOut() {
  zoomMode.value = 'custom';
  zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5);
}

// Handle table insertion events from MenuControll
function handleInsertTable(tableData: any) {
  const currentPageIndex = activePageIndex.value;

  if (editors.value[currentPageIndex]) {
    // Calculate maximum rows that can fit in available space
    const maxRows = calculateMaxTableRows(currentPageIndex, tableData.cols);
    const requestedRows = tableData.rows;
    
    // Use the smaller of requested rows or maximum fitting rows
    const actualRows = Math.min(requestedRows, maxRows);
    
    if (actualRows < 2) { // Need at least header + 1 data row
      ElMessage({
        message: 'Cannot insert table: Not enough space on current page',
        type: 'warning',
        duration: 3000
      });
      return;
    }
    
    // Show message if we had to reduce the number of rows
    if (actualRows < requestedRows) {
      ElMessage({
        message: `Table size adjusted: Inserting ${actualRows} rows (${actualRows - 1} data rows + header) to fit available space`,
        type: 'info',
        duration: 4000
      });
    }

    const tableContent = {
      type: 'table',
      content: [
        // Header row
        {
          type: 'tableRow',
          content: Array(tableData.cols).fill(0).map(() => ({
            type: 'tableHeader',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Header' }] }]
          }))
        },
        // Data rows (actualRows - 1 because header is already counted)
        ...Array(actualRows - 1).fill(0).map(() => ({
          type: 'tableRow',
          content: Array(tableData.cols).fill(0).map(() => ({
            type: 'tableCell',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Cell' }] }]
          }))
        }))
      ]
    };

    editors.value[currentPageIndex].commands.insertContent(tableContent);
  }
}

// Handle columns insertion events from MenuControll
function handleInsertColumns(columnData: any) {
  const currentPageIndex = activePageIndex.value;

  // Check if columns can fit before inserting
  if (editors.value[currentPageIndex]) {
    if (!canContentFit(currentPageIndex, 'columns', columnData)) {
      ElMessage({
        message: 'Cannot insert columns: Not enough space on current page',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    // Create columns content structure
    const columns = Array(columnData.columnCount)
      .fill(0)
      .map(() => ({
        type: 'column',
        content: [{ type: 'paragraph' }],
      }));

    editors.value[currentPageIndex].commands.insertContent({
      type: 'columns',
      content: columns,
    });
  }
}

// Helper function to calculate available height in current page
function getAvailableHeight(editorIndex: number): number {
  const editorDOM = editors.value[editorIndex]?.view.dom;
  if (!editorDOM) return 0;
  
  const pageHeight = pageSizeStore.pageHeight - 80; // Account for padding
  const currentContentHeight = editorDOM.scrollHeight;
  const availableHeight = pageHeight - currentContentHeight;
  
  return Math.max(0, availableHeight);
}

// Helper function to calculate maximum rows that can fit in available space
function calculateMaxTableRows(editorIndex: number, cols: number): number {
  const availableHeight = getAvailableHeight(editorIndex);
  const estimatedRowHeight = 40; // Approximate row height
  const tablePadding = 20; // Table padding and borders
  const headerHeight = 40; // Header row height
  
  // Calculate available height for data rows
  const availableForRows = availableHeight - tablePadding - headerHeight;
  
  // Calculate maximum number of data rows that can fit
  const maxDataRows = Math.floor(availableForRows / estimatedRowHeight);
  
  // Total rows = header row + data rows (minimum 1 data row)
  const totalRows = Math.max(1, maxDataRows) + 1; // +1 for header
  
  return totalRows;
}

// Helper function to estimate content height before insertion
function estimateContentHeight(contentType: string, data?: any): number {
  switch (contentType) {
    case 'table':
      // Estimate table height: header + rows * row height
      const rows = data?.rows || 2;
      const estimatedRowHeight = 40; // Approximate row height
      return rows * estimatedRowHeight + 20; // Add some padding
    
    case 'columns':
      // Estimate columns height: minimum height for columns
      return 80; // Minimum column height
    
    case 'variable':
      // Variables are inline, minimal height impact
      return 25; // Approximate line height
    
    case 'text':
      // Single line of text
      return 30; // Approximate line height with padding
    
    default:
      return 30; // Default estimation
  }
}

// Helper function to check if content can fit
function canContentFit(editorIndex: number, contentType: string, data?: any): boolean {
  const availableHeight = getAvailableHeight(editorIndex);
  const estimatedHeight = estimateContentHeight(contentType, data);
  
  return estimatedHeight <= availableHeight;
}

function createEditor(content = '', index = 0) {
  const ed = new Editor({
    content,
    editable: true, // Start with editable true, will be updated by watcher
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
      Variable.configure({
        HTMLAttributes: { class: "variable-node" },
        getVariables: () => variablesStore.variables,
      }),
      Columns,
      Column,
      Focus.configure({
        className: 'selected-node',
        mode: 'all',
      }),
      ResizableImage,
      TabHandler
    ],
    onUpdate: () => {
      // Save all editors' content to IndexedDB on any update
      pageSizeStore.setPageSize(pageSizeStore.pageWidth, pageSizeStore.pageHeight);
      pageSizeStore.setAllContent(editors.value.map(editor => editor.getJSON()));
      
      // Log height information after content update (but less frequently for typing)
      nextTick(() => {
        const editorIndex = editors.value.indexOf(ed);
        if (editorIndex !== -1) {
          // Only log for significant content changes, not every keystroke
          const availableHeight = getAvailableHeight(editorIndex);
          if (!availableHeight) { // Warn when space is getting low
            editors.value[editorIndex].view.dom.setAttribute('contenteditable', 'false');
            ElMessage({
              message: 'Not enough space to continue editing remove last line you add to can edit again',
              type: 'warning',
              duration: 5000
            });
          } else {
            editors.value[editorIndex].view.dom.setAttribute('contenteditable', 'true');
          }
        }
      });
    },
  });

  return ed;
}

const insertVariable = (variable: { key: string; label: string }) => {
  const currentPageIndex = activePageIndex.value;

  if (editors.value[currentPageIndex]) {
    // Variables are inline elements, so they rarely cause height issues
    // But we'll still check for consistency
    if (!canContentFit(currentPageIndex, 'variable')) {
      ElMessage({
        message: 'Cannot insert variable: Not enough space on current page',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    editors.value[currentPageIndex].commands.insertVariable({
      key: variable.key,
      label: variable.label,
    });
  }
};

const handleSelectTemplate = (templateId: number) => {
  const template = templateStore.templates.find(el => el.id === templateId);
  if (template?.pages && template.pages.length > 0) {

    editors.value.forEach(editor => editor.destroy());
    router.push({
      name: 'Editor',
      params: { type_id: route.params.type_id, template_id: templateId }
    });

    // Replace all editors with the template's pages
    const content: any[] = [];
    const pagesContent = template.pages.map(page => {
      content.push(JSON.parse(page.content_json).content);
      return JSON.parse(page.content_json).content;
    });
    pageSizeStore.setAllContent(content);
    editors.value = pagesContent.map((content: any) => createEditor(content));
    activePageIndex.value = 0;
  }
};

const handleAddPage = () => {
  editors.value.push(createEditor());
  activePageIndex.value = editors.value.length - 1;
};

const handleSelectPage = (index: number) => {
  activePageIndex.value = index;
};

const template_pages = computed(() => {
  const template = templateStore.templates.find(el => el.id === Number(route.params.template_id));
  return template?.pages ?? [];
})

const currentPages = computed(() => {
  return editors.value.map((editor, index) => {
    const templatePage = template_pages.value[index];
    return {
      ...(templatePage || {})
    }
  })
});

const handleFullscreen = () => {
  const elem = document.documentElement;
  if (!isFullscreen.value) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
    isFullscreen.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    isFullscreen.value = false;
  }
};

// Add paste and drop event listeners for image insertion
const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  if (items) {
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const src = e.target?.result as string;
            const currentPageIndex = activePageIndex.value;

            const editor = editors.value[currentPageIndex];
            if (editor) {
              editor.commands.insertContent({
                type: 'resizableImage',
                attrs: { src, alt: 'Image', width: 150 }
              });
            }
          };
          reader.readAsDataURL(file);
          event.preventDefault();
          break;
        }
      }
    }
  }
};

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files;
  if (files) {
    for (const file of files) {
      if (file.type.indexOf('image') !== -1) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          const currentPageIndex = activePageIndex.value;

          const editor = editors.value[currentPageIndex];
          if (editor) {
            editor.commands.insertContent({
              type: 'resizableImage',
              attrs: { src, alt: 'Image', width: 150 }
            });
          }
        };
        reader.readAsDataURL(file);
        event.preventDefault();
        break;
      }
    }
  }
};

onMounted(async () => {
  const template_id: number = Number(route.params.template_id);
  await pageSizeStore.loadFromIndexedDB();
  if (!pageSizeStore.pageWidth && !pageSizeStore.pageHeight) {
    await typeStore.getType(Number(route.params.type_id));
    const type = typeStore.type;
    if (template_id) {
      const template = await templateStore.getTemplate(template_id);
      const content: any[] = [];
      template?.pages.map(page => content.push(JSON.parse(page.content_json).content));
      pageSizeStore.setAllContent(content);

    }
    pageSizeStore.setPageSize(type?.width ?? 0, type?.height ?? 0);
  }

  if (pageSizeStore.allContent.length > 0) {
    editors.value = pageSizeStore.allContent.map(content => createEditor(content));
  } else {
    editors.value = [createEditor()];
  }

  containerRef.value?.addEventListener('paste', handlePaste);
  containerRef.value?.addEventListener('drop', handleDrop);
});

onUnmounted(() => {
  editors.value.forEach(editor => editor.destroy());
  removeContent("editorContent");
  pageSizeStore.clearStatePageSize();

  if (activePanel) {
    localStorage.removeItem('activePanel');
    activePanel.value = null;
  }

  if (containerRef.value) {
    containerRef.value.removeEventListener('paste', handlePaste);
    containerRef.value.removeEventListener('drop', handleDrop);
  }
});

// Updated getVisibleBlocks: detect hovered and focused blocks
function getVisibleBlocks(editor: Editor, pageIndex: number) {
  const blocks: any[] = [];
  const view = editor.view;
  const selectionPos = editor.state.selection.from;
  const containerRect = editorPageRefs.value[pageIndex]?.getBoundingClientRect();
  if (!containerRect) return blocks;

  view.dom.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6,table').forEach((el, idx) => {
    // Skip paragraphs that are inside tables or table cells
    if (el.tagName.toLowerCase() === 'p') {
      const isInsideTable = el.closest('table, td, th, tr');
      if (isInsideTable) {
        return; // Skip this paragraph
      }
    }

    const pos = view.posAtDOM(el, 0);
    // Skip if position is invalid
    if (pos === -1 || pos >= view.state.doc.content.size) return;

    const rect = el.getBoundingClientRect();
    const textLength = el.textContent?.length || 0;
    const node = view.state.doc.nodeAt(pos);
    const nodeSize = node?.nodeSize || textLength + 2;

    // Focus detection
    const isActive = selectionPos >= pos && selectionPos <= pos + nodeSize;
    const hasFocusClass = el.classList.contains('selected-node');
    const isWithinElement = selectionPos >= pos && selectionPos <= pos + nodeSize;
    const isFocused = isActive || hasFocusClass || isWithinElement;

    // Show buttons for focused OR hovered blocks
    const shouldShow = isFocused;

    blocks.push({
      key: idx,
      top: rect.top - containerRect.top + (el as HTMLElement).offsetHeight / 2 - 16,
      left: -40,
      pageIndex,
      pos,
      active: isActive,
      focused: shouldShow,
      type: el.nodeName.toLowerCase(),
    });
  });
  return blocks;
}
</script>

<style>
.ProseMirror {
  outline: none;
  min-height: 200px;
}

.variable-node {
  font-family: sans-serif;
  background-color: #dcfce7;
  border-radius: 4px;
  user-select: text;
}

.ProseMirror p {
  padding: 8px;
}

.ProseMirror h1,
h2,
h3,
h4,
h5,
h6 {
  padding: 8px;
}

.ProseMirror h1 {
  font-size: 2.5em;
  margin: 0.67em 0;
}

.ProseMirror h2 {
  font-size: 2em;
  margin: 0.83em 0;
}

.ProseMirror h3 {
  font-size: 1.5em;
  margin: 0.83em 0;
}

.ProseMirror h4 {
  font-size: 1.25em;
  margin: 0.83em 0;
}

.ProseMirror h5 {
  font-size: 1em;
  margin: 0.83em 0;
}

.ProseMirror h6 {
  font-size: 0.85em;
  margin: 0.83em 0;
}

.ProseMirror code {
  background-color: #f1f1f1;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

.ProseMirror pre {
  background: #0d0d0d;
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.ProseMirror pre code {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 0.8rem;
}

.ProseMirror blockquote {
  padding-left: 1rem;
  border-left: 2px solid #ddd;
}

.ProseMirror hr {
  border: none;
  border-top: 2px solid #ddd;
  margin: 2rem 0;
}

.ProseMirror .variable-node.ProseMirror-selectednode {
  outline: 2px solid #22d3ee;
  background-color: #bbf7d0;
}

.ProseMirror ul,
.ProseMirror ol {
  list-style-position: outside;
}

.ProseMirror li {
  display: list-item;
  margin: 4px 0;
}

.ProseMirror ol[type="decimal"] {
  list-style-type: decimal;
}

.ProseMirror ol[type="decimal-leading-zero"] {
  list-style-type: decimal-leading-zero;
}

.ProseMirror ol[type="lower-roman"] {
  list-style-type: lower-roman;
}

.ProseMirror ol[type="upper-roman"] {
  list-style-type: upper-roman;
}

.ProseMirror ol[type="lower-alpha"] {
  list-style-type: lower-alpha;
}

.ProseMirror ol[type="upper-alpha"] {
  list-style-type: upper-alpha;
}

.ProseMirror ul.bullet-list-disc {
  list-style-type: disc;
}

.ProseMirror ul.bullet-list-circle {
  list-style-type: circle;
}

.ProseMirror ul.bullet-list-square {
  list-style-type: square;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hide-content {
  position: absolute;
  left: -9999px;
  top: 0;
  visibility: visible;
}

.scale-transition {
  transition: transform 0.2s ease;
}

.transform-wrapper {
  width: max-content;
  height: max-content;
}

.editor-zoomable-container {
  padding: 2rem;
  /* Optional: vertical padding */
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow: auto;
}

.selected-node {
  background: #f5faff;
  border-radius: 4px;
  transition: background 0.2s;
}

/* Optional: style for the "+" button and popup */
.plus-block-btn {
  transition: background 0.2s;
}

.block-action-popup {
  min-width: 120px;
}

.paragraph-delete-btn {
  transition: background 0.2s;
}
</style>