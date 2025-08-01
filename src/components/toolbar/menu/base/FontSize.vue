<template>
    <select
        class="border rounded-sm px-2 py-1 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400"
        v-model="selectedSize" @change="setFontSize" :disabled="!editor">
        <option v-for="size in fontSizes" :key="size.value" :value="size.value">
            {{ size.label }}
        </option>
    </select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { Editor } from '@tiptap/vue-3';

const props = defineProps<{ editor: Editor | undefined }>();

const fontSizes = [
    { label: '10', value: '10px' },
    { label: '11', value: '11px' },
    { label: '12', value: '12px' },
    { label: '16', value: '16px' },
    { label: '18', value: '18px' },
    { label: '20', value: '20px' },
    { label: '24', value: '24px' },
    { label: '26', value: '26px' },
    { label: '28', value: '28px' },
    { label: '32', value: '32px' },
    { label: '36', value: '36px' },
    { label: '42', value: '42px' },
    { label: '48', value: '48px' },
    { label: '72', value: '72px' },
    { label: '96', value: '96px' },
];

const selectedSize: Ref<string> = ref('16px');

const setFontSize = () => {
    props.editor?.chain().focus().setMark('textStyle', { fontSize: selectedSize.value }).run();
}

// Optionally, update select if editor selection changes font size
watch(() => props.editor?.state, () => {
    // You can add logic here to sync selectedSize with the editor's current font size if needed
});
</script>
