<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="w-full">
      <input type="file" accept="image/*" ref="fileInput" @change="onFileUpload" class="hidden"/>
      <button type="button" class="px-4 py-2 w-full bg-green-500 text-white rounded-lg hover:bg-green-700 transition" @click="triggerFileInput">
        Upload Images
      </button>
    </div>
    <div v-if="isUploading" class="w-full flex flex-col items-center gap-2">
      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div class="bg-green-500 h-3 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <span class="text-sm text-gray-700">Uploading... {{ uploadProgress }}%</span>
    </div>
    <template v-else>
    <div v-for="(img, idx) in uploadedImages" :key="idx" class="w-full">
        <hr class="my-4 border-t border-gray-300" />
        <img :src="storageBaseUrl + img.image" alt="Uploaded Image" class="max-w-full max-h-72 block mx-auto" />
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import axios from '@/plugins/axios';

import { useCompanyStore } from '@/store/companyStore';

const uploadedImages: Ref<any[]> = ref([]);
const fileInput: Ref<HTMLInputElement | null> = ref(null);
const uploadProgress: Ref<number> = ref(0);
const isUploading: Ref<boolean> = ref(false);
const companyStore: ReturnType<typeof useCompanyStore> = useCompanyStore();
const storageBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL;

function triggerFileInput() {
  fileInput.value && fileInput.value.click();
}

const onFileUpload = async (event: Event) => {
  try {
  const target = event.target as HTMLInputElement | null;
  if (target && target.files && target.files[0]) {
    isUploading.value = true;
    uploadProgress.value = 0;

    const file = target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('company_id', String(companyStore?.company?.id));
      
    const response = await axios.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        }
      }
    })

    if(response.status === 200) {
      uploadedImages.value = response.data.gallery
    }
  }

  } catch (error) {
      console.log(error);
      
  } finally {
      isUploading.value = false;
  };
}

const getAllCompanyGallory = async () => {
  const company_id: number | undefined = companyStore.company?.id;
  
  const response = await axios.get(`company/${company_id}/gallery`);

  if(response.status === 200) {
    uploadedImages.value = response.data.company_gallery
    
  }
}

onMounted(() => {
  getAllCompanyGallory();
})
</script>