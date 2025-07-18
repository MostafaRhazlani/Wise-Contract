<template>
  <div class="">
    <HeaderEditor :editors="editors" :editorPageRefs="editorPageRefs" />
    <!-- Zoom Mode Controls removed -->
    <!-- Editor Layout -->
    <!-- Toolbar -->
    <EditorToolbar :editor="editors[activePageIndex]" />
    <div class="h-[calc(100vh-6.8rem)]">
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
          <div class="editor-zoomable-container overflow-auto w-full h-[calc(100vh-10rem)] bg-gray-100" ref="containerRef">
            <div
              class="flex shadow w-full h-full mx-auto relative"
              :style="{
                width: `${pageWidth * zoomLevel}px`,
                height: `${pageHeight * zoomLevel}px`
              }"
            >
              <div 
                v-for="(editor, index) in editors"
                :ref="el => editorPageRefs[index] = el as HTMLElement | null"
                :key="index"
                :class="['transition-transform duration-200 ease-in-out', index === activePageIndex ? 'z-10 opacity-100' : 'pointer-events-none absolute -z-10']"
              >
                <div class="w-full h-full relative">
                  <EditorPage
                    :editor="editor"
                    :style="{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: 'top left',
                      width: `${pageWidth}px`,
                      height: `${pageHeight}px`,
                    }"
                    ref="editorPageRef"
                  />
                  <!-- Paragraph delete button as component -->
                  <template v-for="block in getVisibleBlocks(editor, index)" :key="block.key">
                    <ParagraphDeleteButton
                      :top="block.top"
                      :left="block.left"
                      :pageIndex="index"
                      :pos="block.pos"
                      :show="block.active && block.type === 'paragraph'"
                      @delete="deleteParagraph"
                    />
                  </template>
                </div>
              </div>
            </div>
          </div>
          <!-- Page Controls Component -->
          <EditorPageControls 
            :zoom="zoomLevel" 
            :pages="currentPages" 
            :editors="editors"
            :currentPage="activePageIndex"
            @zoom-in="handleZoomIn" 
            @zoom-out="handleZoomOut" 
            @set-zoom="val => zoomLevel = val" 
            @add-page="handleAddPage"
            @fullscreen="handleFullscreen" 
            @select-page="handleSelectPage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import HeaderEditor from '@/components/HeaderEditor.vue';
  import EditorToolbar from '@/components/EditorToolbar.vue';
  import TemplatesList from '@/components/TemplatesList.vue';
  import EditorControlSidebar from '@/components/EditorControlSidebar.vue';
  import VariablesList from '@/components/VariablesList.vue';
  import EditorPageControls from '@/components/EditorPageControls.vue';
  import EditorPage from '@/components/EditorPage.vue';
  import { Editor } from '@tiptap/vue-3';
  import { GripVertical } from 'lucide-vue-next';
  import { ref, onMounted, onUnmounted, computed, watch, nextTick, defineComponent, h } from 'vue';
  import type { Ref } from 'vue';
  import { storeToRefs } from 'pinia';

  import { useEditorStore } from "@/store/editorStore";
  import { useTemplateStore } from "@/store/templateStore";
  import { useVariablesStore } from '@/store/variablesStore';

  import StarterKit from '@tiptap/starter-kit';
  import { TextStyle } from '@tiptap/extension-text-style';
  import Color from '@tiptap/extension-color';
  import TextAlign from '@tiptap/extension-text-align';
  import Image from '@tiptap/extension-image';
  import Focus from '@tiptap/extension-focus';
  import { Variable } from "@/extensions/VariableNode";
  import ResizableImage from '@/extensions/image/resizableImage';
  import { Columns, Column } from '@/extensions/columns/columns';
  import { getContent, removeContent, setContent } from "@/plugins/indexedDb";
  import { useRouter, useRoute } from 'vue-router'
  import { ElDialog, ElButton } from 'element-plus'

  const router = useRouter();
  const route = useRoute();
  const editorPageRefs = ref<(HTMLElement | null)[]>([]);
  const editors: Ref<Editor[]> = ref([]);
  const activePageIndex: Ref<number> = ref(0);
  const zoomLevel: Ref<number> = ref(1);
  const isFullscreen: Ref<boolean> = ref(false);
  const pages: Ref<any[]> = ref([]);

  const editorStore = useEditorStore();
  const templateStore = useTemplateStore();
  const variablesStore = useVariablesStore();

  const { activePanel } = storeToRefs(editorStore);
  const { togglePanel } = editorStore;

  const containerRef = ref<HTMLElement | null>(null);

  const pageWidth = 794;
  const pageHeight = 1123;
  const zoomMode = ref<'fit-width' | 'fit-height' | 'custom'>('fit-width');

  function handleZoomIn() {
    zoomMode.value = 'custom';
    zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2);
  }
  function handleZoomOut() {
    zoomMode.value = 'custom';
    zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5);
  }

  function createEditor(content = '') {
    return new Editor({
      content,
      extensions: [
        StarterKit,
        TextStyle,
        Image,
        Color,
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
        ResizableImage, // <-- Add this line
      ],
      onUpdate: () => {
        // Save all editors' content to IndexedDB on any update
        const allContent = editors.value.map(editor => editor.getJSON());
        setContent("editorContent", allContent);
      },
    });
  }

  const insertVariable = (variable: { key: string; label: string }) => {
    if (editors.value[activePageIndex.value]) {
      editors.value[activePageIndex.value].commands.insertVariable({
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
      const pagesContent = template.pages.map(page => JSON.parse(page.content_json));
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
              const editor = editors.value[activePageIndex.value];
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
            const editor = editors.value[activePageIndex.value];
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
    const pagesContent = await getContent("editorContent");
    if (pagesContent && Array.isArray(pagesContent)) {
      editors.value = pagesContent.map((content: any) => createEditor(content));
    } else if (editors.value.length === 0) {
      editors.value.push(createEditor());
    }

      containerRef.value?.addEventListener('paste', handlePaste);
      containerRef.value?.addEventListener('drop', handleDrop);

  });

  onUnmounted(() => {
    editors.value.forEach(editor => editor.destroy());
    removeContent("editorContent");

    if(activePanel) {
      localStorage.removeItem('activePanel');
      activePanel.value = null;
    }

    if(containerRef.value) {
      containerRef.value.removeEventListener('paste', handlePaste);
      containerRef.value.removeEventListener('drop', handleDrop);
    }
  });

  // Add to getVisibleBlocks: also return block type
  function getVisibleBlocks(editor: Editor, pageIndex: number) {
    const blocks: any[] = [];
    const view = editor.view;
    const selectionPos = editor.state.selection.from;
    const containerRect = editorPageRefs.value[pageIndex]?.getBoundingClientRect();
    if (!containerRect) return blocks;
    view.dom.querySelectorAll('p,div,li').forEach((el, idx) => {
      const pos = view.posAtDOM(el, 0);
      const rect = el.getBoundingClientRect();
      const isActive = selectionPos >= pos && selectionPos <= pos + el.textContent.length + 1;
      blocks.push({
        key: idx,
        top: rect.top - containerRect.top + el.offsetHeight / 2 - 16,
        left: -40,
        pageIndex,
        pos,
        active: isActive,
        type: el.nodeName.toLowerCase(),
      });
    });
    return blocks;
  }

  // Delete paragraph at position
  function deleteParagraph(pageIndex: number, pos: number) {
    const editor = editors.value[pageIndex];
    if (!editor) return;
    editor.commands.command(({ tr, state }) => {
      const $pos = state.doc.resolve(pos);
      const node = $pos.nodeAfter;
      if (!node || node.type.name !== 'paragraph') return false;
      tr.delete(pos, pos + node.nodeSize);
      return true;
    });
  }

  // ParagraphDeleteButton component
  const ParagraphDeleteButton = defineComponent({
    props: {
      top: Number,
      left: Number,
      pageIndex: Number,
      pos: Number,
      show: Boolean,
    },
    emits: ['delete'],
    setup(props, { emit }) {
      return () =>
        props.show
          ? h(
              'button',
              {
                class:
                  'absolute z-40 bg-white border rounded w-7 h-7 flex items-center justify-center shadow hover:bg-red-100 text-red-500 paragraph-delete-btn',
                style: { top: `${props.top}px`, left: `${props.left - 32}px` },
                onClick: () => emit('delete', props.pageIndex, props.pos),
                title: 'Delete paragraph',
                type: 'button',
              },
              '🗑'
            )
          : null;
    },
  });
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
  
  .ProseMirror h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }
  
  .ProseMirror h2 {
    font-size: 1.5em;
    margin: 0.83em 0;
  }
  
  .ProseMirror ul,
  .ProseMirror ol {
    padding: 0 1em;
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
    padding: 2rem; /* Optional: vertical padding */
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    overflow: auto;
  }

  .selected-node {
    background: #f5faff;
    border-radius: 4px;
    padding: 8px;
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