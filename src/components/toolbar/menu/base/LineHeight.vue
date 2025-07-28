<template>
  <div class="relative inline-block">
    <!-- Main Button -->
    <button
      class="p-2 rounded hover:bg-green-100 hover:text-green-500 transition-colors"
      @click="toggleDropdown"
      title="Line Height"
    >
      <UnfoldVertical :size="18"/>
    </button>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute z-50 mt-2 left-0 bg-white border border-gray-200 rounded shadow-md w-48 p-2"
      @click.stop
    >
      <button
        v-for="height in lineHeights"
        :key="height.value"
        @click="applyLineHeight(height.value)"
        :class="[
          'block w-full text-left px-3 py-2 text-sm rounded mb-1',
          selectedLineHeight === height.value ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'
        ]"
      >
        {{ height.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Editor } from '@tiptap/vue-3';
import { UnfoldVertical } from 'lucide-vue-next';

const props = defineProps<{ editor: Editor | undefined }>();

const showDropdown = ref(false);
const selectedLineHeight = ref('');

const lineHeights = [
  { label: 'Default', value: 'unset' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2.0' },
  { label: '4.0', value: '4.0' },
];

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function applyLineHeight(value: string) {
  selectedLineHeight.value = value;
  
  if (!props.editor) return;
  
  if (value === 'unset') {
    // Remove line height styling
    props.editor.chain().focus().unsetLineHeight().run();
  } else {
    // Set line height
    props.editor.chain().focus().setLineHeight(value).run();
  }
  
  showDropdown.value = false;
}

// Close dropdown on outside click
function handleClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.relative')) {
    showDropdown.value = false;
  }
}

onMounted(() => document.addEventListener('click', handleClick));
onUnmounted(() => document.removeEventListener('click', handleClick));
</script>