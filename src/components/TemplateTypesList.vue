<template>
  <div>
    <!-- Loading state -->
    <div v-if="typeStore.loading" class="flex justify-center space-x-6 mb-12">
      <div
        v-for="n in 2"
        :key="n"
        class="flex flex-col items-center"
      >
        <div class="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="typeStore.error" class="text-center p-4 bg-red-50 rounded-lg mb-12">
      <p class="text-red-600 font-medium">Could not load template types.</p>
      <p class="text-gray-500 text-sm mt-1">{{ typeStore.error }}</p>
    </div>

    <!-- Design Type Icons -->
    <div v-else class="flex justify-center space-x-6 mb-12">
      <div
        v-for="type in types"
        :key="type.id"
        class="flex flex-col items-center cursor-pointer group"
        @click="chooseType(type)"
      >
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-lg transition-transform group-hover:scale-105 relative"
          :style="{ backgroundColor: type.color }"
        >
          <component :is="getIconComponent(type.logo)" class="w-8 h-8 text-white" />
        </div>
        <span class="text-sm text-gray-700 font-medium">{{ type.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useTypeStore } from "@/store/typeStore";
import * as icons from "lucide-vue-next";

const router = useRouter();
const typeStore = useTypeStore();
const types = computed(() => typeStore.types);

const getIconComponent = (iconName: string) => {
  const iconComponent = (icons as any)[iconName];
  return iconComponent;
};

const chooseType = (type: any) => {
  router.push({
    name: "Editor",
    params: { type_id: type.id },
  });
  localStorage.removeItem('editorContent')
};

onMounted(() => {
  typeStore.getTypes();
});
</script> 