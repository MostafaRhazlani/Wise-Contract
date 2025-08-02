<template>
    <div 
        class="shadow-lg p-12 w-full h-full transition-colors duration-200" 
        :style="{ backgroundColor: pageStore.backgroundColor }"
        ref="editorPageRef"
    >
        <EditorContent :editor="editor" />
    </div>
</template>

<script setup lang="ts">
    import { Editor, EditorContent } from '@tiptap/vue-3';
    import { usePageSizeStore } from '@/store/pageSizeStore';
    import { onMounted, watch } from 'vue';

    const props = defineProps<{ 
        editor: Editor
    }>();

    const pageStore = usePageSizeStore();

    // Apply background color on mount and when it changes
    onMounted(() => {
        document.documentElement.style.setProperty('--page-bg-color', pageStore.backgroundColor);
    });

    watch(() => pageStore.backgroundColor, (newColor) => {
        document.documentElement.style.setProperty('--page-bg-color', newColor);
    });
</script>

<style></style>