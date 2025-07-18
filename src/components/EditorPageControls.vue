<template>
    <div class="p-2 border-t border-gray-200 bg-slate-100">
        <div class="flex items-center justify-end">
            <button @click="$emit('zoom-out')" class="p-2 rounded hover:bg-gray-200" title="Zoom Out">
                <Minus :size="18" />
            </button>
            <!-- Zoom Range Slider -->
            <input type="range" min="0.5" max="2" step="0.02" :value="zoom"
                @input="$emit('set-zoom', parseFloat(($event.target as HTMLInputElement).value))"
                class="mx-2 w-32 zoom-slider" title="Zoom Level" />
            <button @click="$emit('zoom-in')" class="p-2 rounded hover:bg-gray-200" title="Zoom In">
                <Plus :size="18" />
            </button>
            <div class="w-[2px] h-5 bg-gray-200 mx-1"></div>
            <div class="relative">
                <div @click="toggleShowModal" class="flex items-center gap-1 p-2 rounded hover:bg-slate-200 cursor-pointer" title="Show Pages">
                    <Layers :size="18" /> <span class="text-xs font-medium">Pages</span>
                </div>
                <div v-if="showLayersModal"
                    class="absolute bottom-12 right-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center z-50">
                    <div class="rounded shadow-lg p-2 flex items-center" style="width:360px;">
                        <button class="absolute -left-4 p-1 rounded-full hover:bg-gray-200 bg-gray-500 disabled:opacity-70 disabled:cursor-no-drop"
                            :disabled="!canScrollLeft" @click="scrollLeft" v-if="pages.length > VISIBLE_COUNT">
                            <ChevronLeft :size="24" class="text-white hover:text-gray-700" />
                        </button>
                        <ul class="flex items-center gap-3 overflow-hidden">
                            <li class="w-20 h-20" v-for="(page, idx) in visiblePages" :key="scrollIndex + idx">
                                <div class="w-full h-full px-2 py-1 rounded hover:bg-gray-100"
                                    :class="{ 'bg-gray-200': (scrollIndex + idx) === currentPage }"
                                    @click="selectPage(scrollIndex + idx)">
                                    <EditorPageThumbnail
                                        v-if="props.editors[scrollIndex + idx]"
                                        :html="props.editors[scrollIndex + idx].getHTML()"
                                        class="w-full h-full editor-thumbnail break-words"
                                    />
                                </div>
                            </li>
                        </ul>
                        <button class="absolute -right-4 p-1 rounded-full hover:bg-gray-200 bg-gray-500 disabled:opacity-70 disabled:cursor-no-drop"
                            :disabled="!canScrollRight" @click="scrollRight"
                            v-if="pages.length > VISIBLE_COUNT">
                            <ChevronRight :size="24" class="text-white hover:text-gray-700" />
                        </button>
                    </div>
                </div>

            </div>
            <button @click="$emit('add-page')" class="p-2 rounded hover:bg-slate-200" title="Add New Page">
                <CopyPlus :size="18" />
            </button>

            <div class="w-[2px] h-5 bg-gray-200 mx-1"></div>

            <button @click="$emit('fullscreen')" class="p-2 rounded hover:bg-slate-200" title="Fullscreen">
                <Maximize2 :size="18" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CopyPlus, Maximize2, Minus, Plus, Layers, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, computed, nextTick } from 'vue';
import EditorPageThumbnail from '@/components/EditorPageThumbnail.vue';

const showLayersModal = ref<boolean>(false);

const scrollIndex = ref(0);
const VISIBLE_COUNT = 4;

const props = defineProps<{
    zoom: number,
    pages: any[],
    currentPage: number,
    editors: any[], // Accept editors as a prop
}>();

const visiblePages = computed(() => {
    return props.pages.slice(scrollIndex.value, scrollIndex.value + VISIBLE_COUNT);
});

const canScrollLeft = computed(() => scrollIndex.value > 0);
const canScrollRight = computed(() => scrollIndex.value + VISIBLE_COUNT < props.pages.length);

const scrollLeft = () => {
    scrollIndex.value = Math.max(0, scrollIndex.value - VISIBLE_COUNT);
};
const scrollRight = () => {
    scrollIndex.value = Math.min(props.pages.length - VISIBLE_COUNT, scrollIndex.value + VISIBLE_COUNT);
};

const emit = defineEmits<{
    (e: 'select-page', index: number): void,
    (e: 'add-page'): void,
    (e: 'zoom-in'): void,
    (e: 'zoom-out'): void,
    (e: 'set-zoom', value: number): void,
    (e: 'fullscreen'): void,
}>();

const toggleShowModal = () => {
    showLayersModal.value = !showLayersModal.value
    if (showLayersModal.value) scrollIndex.value = 0;
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

.editor-thumbnail {
    width: 540px;
    height: 605px;
    overflow: hidden;
    border-radius: 6px;
    background: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    transform: scale(0.12);
    transform-origin: top left;
    pointer-events: none;
}
</style>