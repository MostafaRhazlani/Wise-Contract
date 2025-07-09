<template>
    <div class="bg-white shadow-lg mx-auto p-12" ref="editorPageRef" style="width: 794px; height: 1123px">
        <EditorContent :editor="editor" class="w-full h-full" />
    </div>
</template>

<script setup lang="ts">
    import { Editor, EditorContent } from '@tiptap/vue-3';

    const props = defineProps<{ editor: Editor }>();
</script>

<style></style>