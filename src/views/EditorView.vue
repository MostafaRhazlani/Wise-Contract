<template>
  <div class="bg-slate-100">
    <!-- Header with navigation -->
    <div class="bg-green-400 p-2 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <button @click="exportToPDF" class="p-2 hover:bg-green-500 rounded">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>
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
            <h4 class="font-semibold text-gray-800 mb-3">Available Variables</h4>
            <div class="space-y-2">
              <div v-for="variable in dynamicVariables" :key="variable.key" @click="insertVariable(variable.key)"
                class="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 text-sm transition-colors border border-transparent hover:border-gray-300">
                <div class="flex items-center justify-between">
                  <div>
                    <code class="text-blue-600">{{ variable.syntax }}</code>
                    <div class="text-xs text-gray-500">{{ variable.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";
import UserProfileModal from "@/components/UserProfileModal.vue";
import { useAuthStore } from "../store/authStore";
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import EditorToolbar from '@/components/EditorToolbar.vue'

// Types
interface DynamicVariable {
  key: string;
  syntax: string;
  description: string;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  profile_image?: string;
}

// Reactive state
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
})

const userModalOpen = ref<boolean>(false);
const authStore = useAuthStore();

// Data
const dynamicVariables = ref<DynamicVariable[]>([
  { key: "employee_name", syntax: "{employee_name}", description: "Selected user name" },
  {
    key: "employee_email",
    syntax: "{employee_email}",
    description: "Selected user email",
  },
  {
    key: "employee_department",
    syntax: "{employee_department}",
    description: "Selected user department",
  },
  {
    key: "employee_position",
    syntax: "{employee_position}",
    description: "Selected user position",
  },
  { key: "company_name", syntax: "{company_name}", description: "Company name" },
  { key: "current_date", syntax: "{current_date}", description: "Current date" },
  { key: "start_date", syntax: "{start_date}", description: "Contract start date" },
]);

// Computed
const userInitials = computed(() => {
  const name = authStore.user?.name || "";
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();
});

// Methods
const insertVariable = (variableKey: string) => {
  const syntax = `{${variableKey}}`;
  if (editor.value) {
    editor.value.commands.insertContent(syntax);
  }
};

const exportToPDF = async () => {
  alert("PDF export functionality - would integrate html2canvas + jsPDF here");
};

// Initialize
onMounted(() => {
  // Any initialization if needed
});

onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<style>
.ProseMirror {
  outline: none;
  min-height: 200px;
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
