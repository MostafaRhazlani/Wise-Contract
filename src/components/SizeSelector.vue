<template>
    <div>
        <select v-model="selected" @change="selectedSize" class="border rounded px-2">
            <option v-for="option in sizeOptions" :key="option.label" :value="option">
                {{ option.label }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref } from 'vue';

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

const selectedSize = async () => {
  pageSizeStore.setPageSize(cmToPx(selected.value.widthCm), cmToPx(selected.value.heightCm));
}

// convert width & height size from cm to px
const cmToPx = (cm: number) => {
  return Math.round(cm * 37.8);
};

watch(() => [pageSizeStore.pageWidth, pageSizeStore.pageHeight],([width, height]) => {
    const found = sizeOptions.find(
      opt => cmToPx(opt.widthCm) === width && cmToPx(opt.heightCm) === height
    );
    if (found) selected.value = found;
  },
  { immediate: true }
);
</script>