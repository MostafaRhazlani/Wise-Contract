<template>
    <div class="bg-slate-100 border-b border-gray-200">
        <div class="bg-white">
            <div class="flex items-center space-x-1 p-2 overflow-x-auto whitespace-nowrap">
                <!-- Basic Formatting -->
                <div class="flex space-x-1">
                    <button @click="editor?.chain().focus().toggleBold().run()"
                        :class="{ 'bg-gray-100 text-gray-900': editor?.isActive('bold') }"
                        class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <Bold :size="18" />
                    </button>
                    <button @click="editor?.chain().focus().toggleItalic().run()"
                        :class="{ 'bg-gray-100 text-gray-900': editor?.isActive('italic') }"
                        class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <Italic :size="18" />
                    </button>
                    <button @click="editor?.chain().focus().toggleUnderline().run()"
                        :class="{ 'bg-gray-100 text-gray-900': editor?.isActive('underline') }"
                        class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <Underline :size="18" />
                    </button>
                    <button @click="editor?.chain().focus().toggleStrike().run()"
                        :class="{ 'bg-gray-100 text-gray-900': editor?.isActive('strike') }"
                        class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <Strikethrough :size="18" />
                    </button>
                </div>

                <div class="w-px h-6 bg-gray-200 mx-1"></div>

                <!-- Alignment -->
                <div class="flex space-x-1 flex-shrink-0">
                    <button @click="editor?.chain().focus().setTextAlign('left').run()" :class="{
                        'bg-gray-100 text-gray-900': editor?.isActive({ textAlign: 'left' }),
                    }" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <AlignLeft :size="18" />
                    </button>
                    <button @click="editor?.chain().focus().setTextAlign('center').run()" :class="{
                        'bg-gray-100 text-gray-900': editor?.isActive({ textAlign: 'center' }),
                    }" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <AlignCenter :size="18" />
                    </button>
                    <button @click="editor?.chain().focus().setTextAlign('right').run()" :class="{
                        'bg-gray-100 text-gray-900': editor?.isActive({ textAlign: 'right' }),
                    }" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <AlignRight :size="18" />
                    </button>
                </div>

                <div class="w-px h-6 bg-gray-200 mx-1"></div>

                <!-- Headings -->
                <div class="flex space-x-1 flex-shrink-0">
                    <button @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()" :class="{
                        'bg-gray-100 text-gray-900': editor?.isActive('heading', { level: 1 }),
                    }" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <span class="text-sm font-bold">H1</span>
                    </button>
                    <button @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" :class="{
                        'bg-gray-100 text-gray-900': editor?.isActive('heading', { level: 2 }),
                    }" class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                        <span class="text-sm font-bold">H2</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/vue-3";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from "lucide-vue-next";

defineProps<{
    editor: Editor | undefined;
}>();
</script>
