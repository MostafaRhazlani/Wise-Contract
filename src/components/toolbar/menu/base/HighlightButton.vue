<template>
  <div class="relative inline-block">
    <button
      @click="togglePalette"
      :class="{
        'bg-green-100 text-green-500': showPalette,
        'p-2 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors': true
      }"
      :disabled="!editor"
      title="Highlight"
    >
      <Highlighter :size="18" />
    </button>
    <transition name="fade">
      <div v-if="showPalette" class="fixed mt-2 z-40" @click.self="closePalette">
        <ColorPicker :editor="editor" mode="highlight" @close="closePalette" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { Highlighter } from 'lucide-vue-next';
import { Editor } from '@tiptap/vue-3';
import { ref } from 'vue';
import ColorPicker from './ColorPicker.vue';

defineProps<{
  editor: Editor | undefined;
}>();

const showPalette = ref(false);

function togglePalette() {
  showPalette.value = !showPalette.value;
  
}

function closePalette() {
  showPalette.value = false;
}
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