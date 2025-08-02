<template>
  <div class="relative inline-block">
    <!-- Main Button -->
    <button
      class="p-2 rounded hover:bg-green-100 hover:text-green-500 transition-colors"
      :class="{ 'bg-green-100 text-green-500': isActive }"
      @click="toggleDropdown"
      title="Line Height"
    >
      <UnfoldVertical :size="18" />
    </button>

    <!-- Dropdown -->
    <transition name="fade">
      <div
        v-if="showDropdown"
        class="fixed z-50 mt-2 bg-white border border-gray-200 rounded shadow-md w-48 p-3"
        @click.stop
      >
        <div class="space-y-1">
          <button
            v-for="height in lineHeights"
            :key="height.value"
            @click="applyLineHeight(height.value)"
            class="w-full flex items-center justify-between px-3 py-2 text-xs rounded transition-colors"
            :class="{
              'bg-green-100 text-green-800': selectedLineHeight === height.value,
              'hover:bg-gray-100': selectedLineHeight !== height.value
            }"
          >
            <span>{{ height.label }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Editor } from '@tiptap/vue-3';
import { UnfoldVertical } from 'lucide-vue-next';

const props = defineProps<{ editor: Editor | undefined }>();

const showDropdown = ref(false);
const selectedLineHeight = ref('unset');
const isActive = computed(() => {
  return selectedLineHeight.value !== 'unset';
});

const lineHeights = [
  { label: 'Single', value: '1' },
  { label: '1.5 Line Spacing (Default)', value: 'unset' },
  { label: 'Double', value: '2' },
  { label: '2.5 Line Spacing', value: '2.5' },
  { label: 'Triple', value: '3' },
];

function toggleDropdown(e: MouseEvent) {
  e.stopPropagation();
  showDropdown.value = !showDropdown.value;
}

function closeDropdown() {
  showDropdown.value = false;
}

function applyLineHeight(value: string) {
  if (!props.editor) return;
  
  // Update the editor with the selected line height
  if (value === 'unset') {
    // For 'unset', remove the line height attribute
    props.editor.chain().focus().unsetLineHeight().run();
  } else {
    // For specific values, set the line height
    props.editor.chain().focus().setLineHeight(value).run();
  }
  
  // Update the UI state
  selectedLineHeight.value = value;
  showDropdown.value = false;
}

// Close dropdown on outside click
function handleClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('.relative.inline-block')) {
    closeDropdown();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClick);
  
  // Initialize with the current line height from the editor
  if (props.editor) {
    const currentLineHeight = props.editor.getAttributes('paragraph')?.lineHeight;
    selectedLineHeight.value = currentLineHeight || 'unset';
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClick);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>