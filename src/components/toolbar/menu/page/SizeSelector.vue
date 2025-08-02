<template>
  <div class="relative">
    <el-tooltip content="Page Size" placement="bottom">
      <button @click="toggleDropdown"
        class="flex flex-col items-center text-sm p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
        <Icon icon="radix-icons:dimensions" width="36" height="36" />
        <span>Page Size</span>
      </button>
    </el-tooltip>
    <!-- Dropdown menu -->
    <transition name="fade">
      <div v-if="showDropdown" class="fixed mt-2 z-40 bg-white border rounded shadow-lg w-48">
        <div class="p-2">
          <div class="text-sm font-medium text-gray-700 mb-2">Page Size</div>
          <div class="space-y-1">
            <button v-for="option in sizeOptions" :key="option.label" @click="selectSize(option)" :class="[
              'w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors',
              selected.label === option.label ? 'bg-green-100 text-green-700' : 'text-gray-700'
            ]">
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { Icon } from '@iconify/vue';
import { ElTooltip } from 'element-plus';

import { usePageSizeStore } from '@/store/pageSizeStore';

const pageSizeStore = usePageSizeStore();

type SizeOption = { label: string; widthCm: number; heightCm: number };

const sizeOptions: SizeOption[] = [
  { label: 'A2 (42 x 59.4)', widthCm: 42, heightCm: 59.4 },
  { label: 'A3 (29.7 x 42)', widthCm: 29.7, heightCm: 42 },
  { label: 'A4 (21 x 29.7)', widthCm: 21, heightCm: 29.7 },
  { label: 'A5 (14.8 x 21)', widthCm: 14.8, heightCm: 21 },
];

const selected: Ref<SizeOption> = ref(sizeOptions[0]);
const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  console.log(showDropdown.value);
  
}

const selectSize = (option: SizeOption) => {
  selected.value = option;
  showDropdown.value = false;
  pageSizeStore.setPageSize(cmToPx(option.widthCm), cmToPx(option.heightCm));
};

// convert width & height size from cm to px
const cmToPx = (cm: number) => {
  return Math.round(cm * 37.8);
};

watch(() => [pageSizeStore.pageWidth, pageSizeStore.pageHeight], ([width, height]) => {
  const found = sizeOptions.find(
    opt => cmToPx(opt.widthCm) === width && cmToPx(opt.heightCm) === height
  );
  if (found) selected.value = found;
},
  { immediate: true }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
