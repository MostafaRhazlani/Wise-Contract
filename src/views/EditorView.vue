<template>
  <div class="">
    <HeaderEditor :editors="editors" :editorPageRefs="editorPageRefs" />

    <!-- Editor Layout -->
    <!-- Toolbar -->
    <EditorToolbar :editor="editors[activePageIndex]" />
    <div class="h-[calc(100vh-6.8rem)]">
      <div class="flex h-full">
        <div class="flex">
          <!-- Floating Control Sidebar -->
          <EditorControlSidebar @toggle-panel="togglePanel" />
          <!-- Left Sidebar Panel -->
          <transition name="fade">
            <div v-if="activePanel" class="w-80 bg-white border-r border-gray-200 flex flex-col">
              <div class="p-4 overflow-y-auto flex-1">
                <VariablesList v-if="activePanel === 'variables'" @select="insertVariable" />
                <div v-if="activePanel === 'templates'">
                  <h3 class="font-semibold text-gray-800 mb-4">Templates</h3>
                  <TemplatesList @select-template="handleSelectTemplate" />
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div class="flex flex-col w-full">
          <div class="h-[calc(100vh-10rem)] w-full overflow-auto bg-gray-100">
            <div class="flex items-center justify-center w-max h-max min-w-full min-h-full mx-auto my-10 relative">
              <div 
                v-for="(editor, index) in editors"
                :ref="el => editorPageRefs[index] = el as HTMLElement | null"
                :class="[index === activePageIndex ? 'z-10 opacity-100' : 'pointer-events-none absolute -z-10']"
                :key="index" 
                :style="{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top',
                }">
                <EditorPage :editor="editor"/>
              </div>
            </div>
          </div>
          <!-- Page Controls Component -->
          <EditorPageControls :zoom="zoomLevel" :pages="template_pages" :currentPage="activePageIndex"
            @zoom-in="handleZoomIn" @zoom-out="handleZoomOut" @set-zoom="zoomLevel = $event" @add-page="handleAddPage"
            @fullscreen="handleFullscreen" @select-page="handleSelectPage"/>
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
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import type { Ref } from 'vue';
  import { storeToRefs } from 'pinia';

  import { useEditorStore } from "@/store/editorStore";
  import { useTemplateStore } from "@/store/templateStore";
  import { useVariablesStore } from '@/store/variablesStore';

  import StarterKit from '@tiptap/starter-kit';
  import TextStyle from '@tiptap/extension-text-style';
  import Underline from "@tiptap/extension-underline";
  import Color from '@tiptap/extension-color';
  import TextAlign from '@tiptap/extension-text-align';
  import { Variable } from "@/extensions/VariableNode";
  import { getContent, removeContent, setContent } from "@/plugins/indexedDb";
  import { useRouter, useRoute } from 'vue-router'


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

  function createEditor(content = '') {
    return new Editor({
      content,
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Color,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Variable.configure({
          HTMLAttributes: { class: "variable-node" },
          getVariables: () => variablesStore.variables,
        }),
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
  
  const handleZoomIn = () => {
    zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2);
  };
  const handleZoomOut = () => {
    zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5);
  };
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

  onMounted(async () => {
    const pagesContent = await getContent("editorContent");
    if (pagesContent && Array.isArray(pagesContent)) {
      editors.value = pagesContent.map((content: any) => createEditor(content));
    } else if (editors.value.length === 0) {
      editors.value.push(createEditor());
    }
  });

  onUnmounted(() => {
    editors.value.forEach(editor => editor.destroy());
    removeContent("editorContent");
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
    margin: 1em 0;
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
</style>