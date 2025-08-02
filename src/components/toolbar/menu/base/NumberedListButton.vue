<template>
  <div class="relative inline-block">
    <!-- Main Button -->
    <button class="p-2 rounded hover:bg-green-100 hover:text-green-500 transition-colors"
      :class="{ 'bg-green-100 text-green-500': editor?.isActive('orderedList') }" @click="toggleDropdown"
      title="Numbered List">
      <ListOrdered :size="18" />
    </button>

    <!-- Dropdown -->
    <transition name="fade">
      <div v-if="showDropdown"
        class="fixed z-50 mt-2 bg-white border border-gray-200 rounded shadow-md w-60 p-3">
        <div class="grid grid-cols-3 gap-1">
          <button v-for="style in listStyles" :key="style.value" @click="applyStyle(style.value)" :class="[
            'border rounded p-2 flex items-center justify-center',
            editor?.isActive('orderedList') && editor.getAttributes('orderedList').type === style.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
          ]">
            <span v-html="style.preview" class="text-xs font-mono"></span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ListOrdered } from 'lucide-vue-next'
import { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | undefined }>()

const showDropdown = ref(false)

const listStyles = [
  { value: 'decimal', preview: '1<br>2<br>3' },
  { value: 'decimal-leading-zero', preview: '01<br>02<br>03' },
  { value: 'lower-roman', preview: 'i<br>ii<br>iii' },
  { value: 'upper-roman', preview: 'I<br>II<br>III' },
  { value: 'lower-alpha', preview: 'a<br>b<br>c' },
  { value: 'upper-alpha', preview: 'A<br>B<br>C' },
]

function toggleDropdown(e: MouseEvent) {
  e.stopPropagation()
  showDropdown.value = !showDropdown.value
}

function closeDropdown() {
  showDropdown.value = false
}

function applyStyle(style: string) {
  const editor = props.editor
  if (!editor) return

  const currentType = editor.getAttributes('orderedList').type
  const isActive = editor.isActive('orderedList')

  if (isActive && currentType === style) {
    editor.chain().focus().unsetOrderedList().run()
  } else if (isActive && currentType !== style) {
    editor.chain().focus().updateAttributes('orderedList', {
      type: style,
    }).run()
  } else {
    editor.chain().focus().setOrderedList({ type: style }).run()
  }

  closeDropdown()
}

// Close dropdown on outside click
function handleClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.relative.inline-block')) {
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('click', handleClick))
onUnmounted(() => document.removeEventListener('click', handleClick))
</script>

<style scoped>
.relative.inline-block {
  position: relative;
  display: inline-block;
}
</style>

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
