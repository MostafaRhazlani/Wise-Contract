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
import { ElMessage } from 'element-plus';
import { getContent } from "@/plugins/indexedDb";
import axios from "axios";
import html2canvas from "html2canvas";

const userModalOpen = ref(false);
const authStore = useAuthStore();
const companyStore = useCompanyStore();
const templateStore = useTemplateStore();
const route = useRoute();
const props = defineProps<{
    editorPageRefs: (HTMLElement | null)[]
}>();

const userInitials = computed(() => {
  const name = authStore.user?.name || "";
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase();
});

const isSaving = ref(false);

const saveEditorContent = async () => {
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
        content: jsonContent.allContent[i]
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