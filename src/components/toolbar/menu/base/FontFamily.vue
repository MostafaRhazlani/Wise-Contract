<template>
  <select
    class="border rounded-sm px-2 py-1 text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-400"
    v-model="selectedFamily"
    @change="setFontFamily"
    :disabled="!editor"
  >
    <option v-for="family in fontFamilies" :key="family.value" :value="family.value">
      {{ family.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Editor } from '@tiptap/vue-3';

const props = defineProps<{ editor: Editor | undefined }>();

const fontFamilies = [
  { label: 'Default', value: '' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: 'Times New Roman, Times, serif' },
  { label: 'Courier New', value: 'Courier New, Courier, monospace' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS, Helvetica, sans-serif' },
  { label: 'Impact', value: 'Impact, Charcoal, sans-serif' },
];

const selectedFamily = ref('');

function setFontFamily() {
  if (props.editor) {
    props.editor.chain().focus().setMark('textStyle', { fontFamily: selectedFamily.value }).run();
  }
}
</script>
