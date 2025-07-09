<template>
    <div class="p-2 border-t border-gray-200 bg-slate-100">
        <div class="flex items-center justify-end">
            <button @click="$emit('zoom-out')" class="p-2 rounded hover:bg-gray-200" title="Zoom Out">
                <Minus :size="18"/>
            </button>
            <!-- Zoom Range Slider -->
            <input
                type="range"
                min="0.5"
                max="2"
                step="0.02"
                :value="zoom"
                @input="$emit('set-zoom', parseFloat(($event.target as HTMLInputElement).value))"
                class="mx-2 w-32 zoom-slider"
                title="Zoom Level"
            />
            <button @click="$emit('zoom-in')" class="p-2 rounded hover:bg-gray-200" title="Zoom In">
                <Plus :size="18"/>
            </button>
            <div class="w-[2px] h-5 bg-gray-200 mx-1"></div>
            <div class="relative">
                <button @click="toggleShowModal" class="flex items-center gap-1 p-2 rounded hover:bg-slate-200" title="Show Pages">
                    <Layers :size="18"/> <span class="text-xs font-medium">Pages</span>
                </button>
                <!-- Modal for layers/pages -->
                <div v-if="showLayersModal" class="absolute bottom-12 right-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div class="bg-white rounded shadow-lg p-6">
                        <ul class="flex items-center gap-3">
                            <li v-for="index in pageCount" :key="index">
                                <button
                                class="w-full px-2 py-1 rounded hover:bg-gray-100"
                                :class="{ 'bg-gray-200': index - 1 === currentPage }"
                                @click="selectPage(index - 1)"
                                >
                                Page {{ index }}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <button @click="$emit('add-page')" class="p-2 rounded hover:bg-slate-200" title="Add New Page">
                <CopyPlus :size="18"/>
            </button>

            <div class="w-[2px] h-5 bg-gray-200 mx-1"></div>

            <button @click="$emit('fullscreen')" class="p-2 rounded hover:bg-slate-200" title="Fullscreen">
                <Maximize2 :size="18"/>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CopyPlus, Maximize2, Minus, Plus, Layers } from 'lucide-vue-next';
import { ref } from 'vue';

defineProps<{ 
    zoom: number,
    pageCount: number,
    currentPage: number,
}>();

const emit = defineEmits<{
    (e: 'select-page', index: number): void,
    (e: 'add-page'): void,
    (e: 'zoom-in'): void,
    (e: 'zoom-out'): void,
    (e: 'set-zoom', value: number): void,
    (e: 'fullscreen'): void,
}>();

const showLayersModal = ref<boolean>(false);

const toggleShowModal = () => {
    showLayersModal.value = !showLayersModal.value
}

const selectPage = (index: number) => {
    emit('select-page', index);
    showLayersModal.value = false;
};
</script>

<style scoped>
.zoom-slider {
  -webkit-appearance: none;
  width: 9rem;
  border-radius: 9999px;
  background: #90a1b9;
  outline: none;
  transition: background 0.3s;
}

.zoom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  margin-top: -7px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 0 2px #999;
  border: 2px solid #fff;
  transition: background 0.3s;
}

.zoom-slider::-webkit-slider-runnable-track {
  height: 3px;
  border-radius: 9999px;
  background: #99a1af;
}

.zoom-slider:focus {
  outline: none;
}

.zoom-slider:hover::-webkit-slider-thumb {
    transition: 0.3s ease-in-out;
    box-shadow: 0 0 2px 6px rgba(144, 161, 185, 0.4);
}

.zoom-slider:focus::-webkit-slider-thumb {
    box-shadow: 0 0 2px 6px rgba(144, 161, 185, 0.4);
}
</style> 