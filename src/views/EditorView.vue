<template>
  <div class="bg-slate-100">
    <!-- Header with navigation -->
    <div class="bg-green-400 p-2 flex justify-between items-center" @click="templateStore.getTemplatesCompany">
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
        <button title="donwload template" @click="saveEditorContent" class="ml-4 p-2 text-white rounded hover:bg-green-500 transition">
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

    <!-- Main Content Area -->
    <div class="flex">
      <!-- Center area -->
      <div class="flex-1 flex flex-col transition-all duration-300">
        <!-- Toolbar -->
        <EditorToolbar :editor="editor" />

        <div class="flex h-[calc(100vh-7.5rem)]">
          <!-- Floating Control Sidebar -->
          <EditorControlSidebar @toggle-panel="togglePanel" />
          <!-- Right Sidebar Panel -->
          <transition name="fade">
            <div v-if="activePanel" class="mt-2 rounded-lg w-80 bg-white shadow-lg flex flex-col">
              <div class="p-4 overflow-y-auto flex-1">
                <VariablesList v-if="activePanel === 'variables'" @select="insertVariable" />
                <div v-if="activePanel === 'templates'">
                  <h3 class="font-semibold text-gray-800 mb-4">Templates</h3>
                  <TemplatesList @select-template="handleSelectTemplate" />
                </div>
              </div>
            </div>
          </transition>

          <!-- Editor Area -->
          <div class="flex-1 overflow-y-auto pt-20">
            <div class="w-full">
              <div class="max-w-4xl mx-auto">
                <!-- A4 Paper -->
                <div
                  ref="editorPageRef"
                  class="bg-white shadow-lg min-h-[297mm] max-w-[210mm] mx-auto p-16"
                >
                  <EditorContent :editor="editor" class="prose max-w-none" />
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
import UserProfileModal from "@/components/UserProfileModal.vue";
import { useAuthStore } from "../store/authStore";
import { storeToRefs } from "pinia";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import EditorToolbar from "@/components/EditorToolbar.vue";
import { Variable } from "@/extensions/VariableNode";
import VariablesList from "@/components/VariablesList.vue";
import TemplatesList from "@/components/TemplatesList.vue";
import EditorControlSidebar from "@/components/EditorControlSidebar.vue";
import { useVariablesStore } from "@/store/variablesStore";
import { useCompanyStore } from "@/store/companyStore";
import { useTemplateStore } from "@/store/templateStore";
import { useEditorStore } from "@/store/editorStore";
import { Download } from "lucide-vue-next";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import axios from "axios";
import html2canvas from "html2canvas";
import { useTypeStore } from "@/store/typeStore";
import { useRoute } from "vue-router";

const editorPageRef = ref<HTMLElement | null>(null);
const userModalOpen = ref<boolean>(false);

const authStore = useAuthStore();
const variablesStore = useVariablesStore();
const companyStore = useCompanyStore();
const templateStore = useTemplateStore();
const editorStore = useEditorStore();
const typeStore = useTypeStore();
const route = useRoute();

const { activePanel } = storeToRefs(editorStore);
const { togglePanel } = editorStore;

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
  content: "",
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Variable.configure({
      HTMLAttributes: {
        class: "variable-node",
      },
      getVariables: () => variablesStore.variables,
    }),
  ],
  onUpdate: ({ editor }) => {
    // Save content to localStorage whenever it changes
    localStorage.setItem("editorContent", JSON.stringify(editor.getJSON()));
  },
});

const handleSelectTemplate = (templateId: number) => {
  const template = templateStore.templates.find(el => el.id === templateId);
  const content_json = JSON.parse(template?.content_json);
  
  
  if(editor.value) {
    editor.value.commands.setContent(content_json);
  }
};


const insertVariable = (variable: { key: string; label: string }) => {
  if (editor.value) {
    editor.value.commands.insertVariable({
      key: variable.key,
      label: variable.label,
    });
  }
};

const saveEditorContent = async () => {
  if (!editorPageRef.value || !editor.value || !companyStore.company?.id) {
    alert("Some required information is missing to save the content.");
    return;
  }

  try {
    const jsonContent = editor.value.getJSON();
    const canvas = await html2canvas(editorPageRef.value, { scale: 0.5 });
    const imageDataUrl = canvas.toDataURL("image/png");

    const fetchResponse = await fetch(imageDataUrl);
    const imageBlob = await fetchResponse.blob();
    const imageFile = new File([imageBlob], "template_thumbnail.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("content_json", JSON.stringify(jsonContent));
    formData.append("company_id", String(companyStore.company.id));
    formData.append("type_id", String(route.params.type_id));
    formData.append("image", imageFile);

    const response = await axios.post("/template/save", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if(response.status === 200) {
      templateStore.getTemplatesCompany();
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    console.log(errorMessage);
  }
};

onMounted(async () => {
  if (variablesStore.variables.length === 0) {
    variablesStore.fetchVariables();
  }
  await companyStore.getCompany();

  // If templateId is present in route, load that template
  const templateId = route.params.templateId;
  if (templateId && editor.value) {
    const template = templateStore.templates.find(el => el.id === Number(templateId));
    if (template && template.content_json) {
      try {
        const json = JSON.parse(template.content_json);
        editor.value.commands.setContent(json);
      } catch (error) {
        editor.value.commands.setContent(template.content_json);
      }
    }
  } else {
    // Fallback to localStorage
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent && editor.value) {
      try {
        const json = JSON.parse(savedContent);
        editor.value.commands.setContent(json);
      } catch (error) {
        editor.value.commands.setContent(savedContent);
      }
    }
  }
});

onUnmounted(() => {
  editor.value?.destroy();
});
</script>

<style>
.ProseMirror {
  outline: none;
  min-height: 200px;
}

.variable-node {
  background-color: #dcfce7;
  padding: 2px 4px;
  border-radius: 4px;
  color: #00c951;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

