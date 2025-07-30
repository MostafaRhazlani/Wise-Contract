<template>
    <div class="bg-white border-b border-gray-200">
        <div class="relative">
            <div class="flex items-center space-x-1 p-2 overflow-x-auto whitespace-nowrap">
                <!-- Navigation -->
                <div class="flex space-x-1">
                    <button @click="editor?.chain().focus().undo().run()" :disabled="!editor?.can().undo()"
                        :class="{ 'hover:text-green-500 hover:bg-green-100': editor?.can().undo() }"
                        class="p-2 text-gray-500 rounded-md transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Undo2 :size="20" />
                    </button>
                    <button @click="editor?.chain().focus().redo().run()" :disabled="!editor?.can().redo()"
                        :class="{ 'hover:text-green-500 hover:bg-green-100': editor?.can().redo() }"
                        class="p-2 text-gray-500 rounded-md transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Redo2 :size="20" />
                    </button>
                </div>

                <div class="w-px h-6 bg-gray-200 mx-1"></div>

                <!-- Basic Formatting -->
                <div class="flex space-x-1">
                    <button @click="editor?.chain().focus().toggleBold().run()"
                        :class="{ 'bg-green-100 text-green-500': editor?.isActive('bold') }"
                        class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                        <Bold stroke-width="3" :size="18" />
                    </button>
                    <button @click="editor?.chain().focus().toggleItalic().run()"
                        :class="{ 'bg-green-100 text-green-500': editor?.isActive('italic') }"
                        class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                        <Italic :size="18" />
                    </button>
                    <button @click="editor?.chain().focus().toggleUnderline().run()"
                        :class="{ 'bg-green-100 text-green-500': editor?.isActive('underline') }"
                        class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                        <Underline :size="18" />
                    </button>
                    <button @click="editor?.chain().focus().toggleStrike().run()"
                        :class="{ 'bg-green-100 text-green-500': editor?.isActive('strike') }"
                        class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                        <Strikethrough :size="18" />
                    </button>
                </div>

                <div class="w-px h-6 bg-gray-200 mx-1"></div>

                <!-- Color Picker -->
                <div ref="colorPickerRef">
                    <button @click.stop="showColorPicker = !showColorPicker"
                        :class="{ 'bg-green-100 text-green-500': editor?.isActive('textStyle') }"
                        class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                        <Palette :size="20" />
                    </button>
                </div>

                <div class="w-px h-6 bg-gray-200 mx-1"></div>

                <!-- Alignment -->
                <div class="flex space-x-1">
                    <button @click="editor?.chain().focus().setTextAlign('left').run()" :class="{
                        'bg-green-100 text-green-500': editor?.isActive({ textAlign: 'left' }),
                    }" class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                        <AlignLeft :size="18" />
                    </button>
                    <button @click="editor?.chain().focus().setTextAlign('center').run()" :class="{
                        'bg-green-100 text-green-500': editor?.isActive({ textAlign: 'center' }),
                    }" class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                        <AlignCenter :size="18" />
                    </button>
                    <button @click="editor?.chain().focus().setTextAlign('right').run()" :class="{
                        'bg-green-100 text-green-500': editor?.isActive({ textAlign: 'right' }),
                    }" class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                        <AlignRight :size="18" />
                    </button>
                </div>

                <div class="w-px h-6 bg-gray-200 mx-1"></div>

                <!-- Headings -->
                <div class="flex space-x-1">
                    <button @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()" :class="{
                        'bg-green-100 text-green-500': editor?.isActive('heading', { level: 1 }),
                    }" class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                        <Heading1 :size="20" />
                    </button>
                    <button @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" :class="{
                        'bg-green-100 text-green-500': editor?.isActive('heading', { level: 2 }),
                    }" class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                        <Heading2 :size="20" />
                    </button>
                </div>

                <div class="w-px h-6 bg-gray-200 mx-1"></div>

                <!-- Columns Insert -->
                <div class="flex items-center">
                    <button @click="showColumnDialog = true"
                        class="p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="9" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="15" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>
                    </button>
                    <div v-if="showColumnDialog" class="absolute z-50 bg-white border p-4 rounded shadow top-12 -translate-x-1/2">
                        <label class="block mb-2">How many columns?</label>
                        <select v-model="columnCount" class="border rounded p-1 mb-2 w-full">
                            <option v-for="n in [2,3,4,5,6]" :key="n" :value="n">{{ n }}</option>
                        </select>
                        <div class="flex space-x-2">
                            <button @click="addColumns" class="px-3 py-1 bg-green-500 text-white rounded">Insert</button>
                            <button @click="showColumnDialog = false" class="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                        </div>
                    </div>
                </div>

                <div class="w-px h-6 bg-gray-200 mx-1"></div>

                
            </div>
            <!-- Color Dropdown -->
            <div v-if="showColorPicker"
                class="absolute top-full left-60 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-2 z-20">
                <div class="grid grid-cols-4 gap-2">
                    <button v-for="color in colors" :key="color.value" @click.stop="setColor(color.value)"
                        class="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                        :style="{ backgroundColor: color.value || '#ffffff' }" :title="color.name">
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import SizeSelector from '@/components/SizeSelector.vue';

import { Editor } from "@tiptap/vue-3";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Undo2,
    Redo2,
    Palette
} from "lucide-vue-next";
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
    editor: Editor | undefined;
}>();

const emit = defineEmits<{
    (e: 'navigate', direction: 'next' | 'previous'): void
}>();

const goToPrevious = () => {
    emit('navigate', 'previous');
};

const goToNext = () => {
    emit('navigate', 'next');
};

// Add color picker state
const showColorPicker = ref(false);
const colors = [
    { name: 'Default', value: '' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Gray', value: '#6b7280' },
];

// Add color methods
const setColor = (color: string) => {
    if (props.editor) {
        props.editor.chain().focus().setColor(color).run();
        showColorPicker.value = false;
    }
};

// Add click outside handler
const colorPickerRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
    if (colorPickerRef.value && !colorPickerRef.value.contains(event.target as Node)) {
        showColorPicker.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>
