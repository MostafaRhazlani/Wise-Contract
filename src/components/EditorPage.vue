<template>
    <div class="bg-white shadow-lg min-h-[1122px] max-w-[793px] min-w-[793px] mx-auto p-16 overflow-hidden" ref="editorPageRef">
        <EditorContent :editor="editor" class="prose max-w-none" />
    </div>
</template>

<script setup lang="ts">
    import { Editor, EditorContent } from '@tiptap/vue-3';

    const props = defineProps<{ editor: Editor }>();
</script>

<style></style>