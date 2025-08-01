<template>
    <div class="bg-white shadow-lg p-12 w-full h-full" ref="editorPageRef">
        <EditorContent :editor="editor" />
    </div>
</template>

<script setup lang="ts">
    import { Editor, EditorContent } from '@tiptap/vue-3';

    const props = defineProps<{ 
        editor: Editor
    }>();
</script>

<style></style>