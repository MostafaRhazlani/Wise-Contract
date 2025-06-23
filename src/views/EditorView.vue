<template>
  <div class="bg-slate-100">
    <!-- Header with navigation -->
    <div class="bg-green-400 p-2 flex justify-end items-center">
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

    <!-- Main Content Area -->
    <div class="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <!-- Center area -->
      <div class="flex-1 overflow-hidden flex flex-col">
        <!-- Toolbar -->
        <EditorToolbar :editor="editor" />

        <!-- Editor Area -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-4 w-full">
            <div class="max-w-4xl mx-auto">
              <!-- A4 Paper -->
              <div class="bg-white shadow-lg rounded-lg min-h-[297mm] max-w-[210mm] mx-auto p-16">
                <EditorContent :editor="editor" class="prose max-w-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar - Contract Data -->
      <div class="w-80 bg-white border-l border-gray-300 overflow-hidden flex flex-col">
        <div class="p-4 overflow-y-auto flex-1">
          <!-- Dynamic Variables -->
          <div class="mt-6">
            <VariablesList @select="insertVariable" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import UserProfileModal from "@/components/UserProfileModal.vue";
import { useAuthStore } from "../store/authStore";
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import EditorToolbar from '@/components/EditorToolbar.vue'
import { Variable } from '@/extensions/VariableNode'
import VariablesList from '@/components/VariablesList.vue'
import { useVariablesStore } from '@/store/variablesStore'

const userModalOpen = ref<boolean>(false);
const authStore = useAuthStore();
const variablesStore = useVariablesStore();

// Split name user to get first characters
const userInitials = computed(() => {
  const name = authStore.user?.name || "";
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();
});

// Reactive state
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Variable.configure({
      HTMLAttributes: {
        class: 'variable-node',
      },
      getVariables: () => variablesStore.variables,
    }),
  ],
  onUpdate: ({ editor }) => {
    // Save content to localStorage whenever it changes
    localStorage.setItem('editorContent', editor.getHTML())
  }
})

const insertVariable = (variableKey: string) => {
  if (editor.value) {
    editor.value.commands.insertVariable(variableKey);
  }
};

onMounted(() => {
  if (variablesStore.variables.length === 0) {
    variablesStore.fetchVariables();
  }
  const savedContent = localStorage.getItem('editorContent')
  if (savedContent && editor.value) {
    editor.value.commands.setContent(savedContent)
  }
})

onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<style>
.ProseMirror {
  outline: none;
  min-height: 200px;
}

.variable-node {
  background-color: oklch(96.2% 0.044 156.743);
  padding: 2px 4px;
  border-radius: 4px;
  color: oklch(72.3% 0.219 149.579);
  font-family: monospace;
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
</style>
