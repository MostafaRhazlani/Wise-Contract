<template>
    <div class="absolute bottom-0 w-[calc(100%-5.4rem)] justify-center gap-4 p-2 border-t border-gray-200 bg-slate-100">
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
            <button @click="$emit('add-page')" class="p-2 rounded hover:bg-slate-200" title="Add New Page">
                <Layers2 :size="18"/>
            </button>

            <div class="w-[2px] h-5 bg-gray-200 mx-1"></div>

            <button @click="$emit('fullscreen')" class="p-2 rounded hover:bg-slate-200" title="Fullscreen">
                <Maximize2 :size="18"/>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Layers2, Maximize2, Minus, Plus } from 'lucide-vue-next';

defineProps<{ zoom: number }>();
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