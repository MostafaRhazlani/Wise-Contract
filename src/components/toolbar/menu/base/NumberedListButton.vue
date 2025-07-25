<template>
  <div class="num-bered-root">
    <button class="p-2 rounded hover:bg-green-100 hover:text-green-500 transition-colors"
      :class="{ 'bg-green-100 text-green-500': editor?.isActive('orderedList') }" @click="toggleDropdown" title="Numbered List">
      <ListOrdered :size="18" />
    </button>
    <div v-if="showDropdown"
      class="absolute z-50 mt-2 left-0 bg-white border border-gray-200 rounded shadow-md w-60 p-3" @click.stop>
      <div class="grid grid-cols-3 gap-2 mb-3">
        <button v-for="style in listStyles" :key="style.value"
          :class="[
            'border rounded p-2 flex flex-col items-center',
            editor?.isActive('orderedList') && editor.getAttributes('orderedList').type === style.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
          ]"
          @click="applyList(style.value)">
          <span v-html="style.preview" class="text-xs font-mono"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ListOrdered } from 'lucide-vue-next'
import { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | undefined }>()

const showDropdown = ref(false)

const listStyles = [
  { value: 'decimal', preview: '1.<br>2.<br>3.' },
  { value: 'decimal-leading-zero', preview: '01.<br>02.<br>03.' },
  { value: 'lower-roman', preview: 'i.<br>ii.<br>iii.' },
  { value: 'upper-roman', preview: 'I.<br>II.<br>III.' },
  { value: 'lower-alpha', preview: 'a.<br>b.<br>c.' },
  { value: 'upper-alpha', preview: 'A.<br>B.<br>C.' },
  // Add more styles as needed
]

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function applyList(style: string) {
  const editor = props.editor
  if (!editor) return

  const currentType = editor.getAttributes('orderedList').type
  const isActive = editor.isActive('orderedList')

  if (isActive && currentType === style) {

    editor.chain().focus().unsetOrderedList().run();
  } else if (isActive && currentType !== style) {
    editor.chain().focus().updateAttributes('orderedList', {
      type: style,
    }).run()
  } else {
    editor.chain().focus().setOrderedList({ type: style }).run()
  }

  showDropdown.value = false
}

// Close dropdown on outside click
function handleClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.num-bered-root')) {
    showDropdown.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClick))
onUnmounted(() => document.removeEventListener('click', handleClick))
</script>

<style scoped>
.num-bered-root {
  position: relative;
}
</style>