<template>
    <div class="relative inline-block">
        <el-tooltip content="Page Background" placement="bottom">
            <!-- Main Button -->
            <button @click="toggleDropdown"
                class="flex flex-col items-center text-sm p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                <Icon icon="mdi:format-color-fill" width="36" height="36" />
                <span>Background</span>
            </button>
        </el-tooltip>

        <!-- Dropdown -->
        <transition name="fade">
            <div v-if="showDropdown" class="fixed z-50 mt-2 bg-white border border-gray-200 rounded shadow-md w-64 p-3"
                @click.stop>
                <div class="grid grid-cols-3 gap-2">
                    <button v-for="color in colorOptions" :key="color.value" @click="setBackgroundColor(color.value)"
                        class="flex flex-col items-center rounded transition-colors">
                        <div :class="['flex items-center justify-center w-[70px] h-24 rounded mb-1 border border-gray-200', isSelectedColor(color.value) ? 'border-green-400 text-green-500' : 'text-gray-500']"
                            :style="{ backgroundColor: color.value }">
                            <span class="text-xs">{{ color.label }}</span>
                        </div>
                    </button>
                </div>

                <div class="mt-3 pt-3 border-t border-gray-100">
                    <div class="flex items-center px-2 py-1">
                        <div class="relative w-full">
                            <button @click="() => colorInputRef?.click()"
                                class="flex items-center justify-between w-full px-2 py-2 rounded bg-gray-200">
                                <div class="flex items-center gap-1">
                                    <Icon icon="streamline-ultimate-color:color-palette-2" color="#fff" width="20px"
                                        height="20px" />
                                    <span class="text-sm">More Colors</span>
                                </div>
                                <ChevronRight :size="16" />
                            </button>
                            <input type="color" :value="customColor" 
                                ref="colorInputRef" 
                                @input="onColorInput"
                                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ChevronRight } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { Ref } from 'vue';
import { usePageSizeStore } from '@/store/pageSizeStore';

const pageStore = usePageSizeStore();
const showDropdown: Ref<boolean> = ref(false);
const customColor: Ref<string> = ref('');
const colorInputRef: Ref<HTMLInputElement | null> = ref(null);

// Initialize custom color with current background color
watch(() => pageStore.backgroundColor, (newColor) => {
    customColor.value = newColor;
}, { immediate: true });

const colorOptions = [
    { label: 'Default', value: '#ffffff' },
    { label: 'Eye-friendly', value: '#f0f7f0' },
    { label: 'Elegant', value: '#fff8e1' },
    { label: 'Cloudy', value: '#e3f2fd' },
    { label: 'Sky Blue', value: '#e1f5fe' },
    { label: 'Dark Night', value: '#263238' }
];

const isSelectedColor = (color: string) => {
    return pageStore.backgroundColor.toLowerCase() === color.toLowerCase();
};

const toggleDropdown = (e: MouseEvent) => {
    e.stopPropagation();
    showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
    showDropdown.value = false;
};

const setBackgroundColor = (color: string) => {
    pageStore.setBackgroundColor(color);
};

const onColorInput = (event: Event) => {
    const newColor = (event.target as HTMLInputElement)?.value;
    if (newColor) {
        pageStore.setBackgroundColor(newColor);
    }
};

const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && !target.closest('.relative')) {
        closeDropdown();
    }
};

onMounted(() => {
    document.addEventListener('click', handleClick);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClick);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
