<template>
  <div class="relative inline-block">
    <!-- Main Button -->
    <button class="p-2 rounded hover:bg-green-100 hover:text-green-500 transition-colors"
      :class="{ 'bg-green-100 text-green-500': editor?.isActive('bulletList') }" @click="toggleDropdown"
      title="Bullet List">
      <List :size="18" />
    </button>

    <!-- Dropdown -->
    <transition name="fade">
      <div v-if="showDropdown"
        class="fixed z-50 mt-2 bg-white border border-gray-200 rounded shadow-md w-60 p-3">
        <div class="grid grid-cols-3 gap-1">
          <button v-for="style in listStyles" :key="style.value" @click="applyStyle(style.value)" :class="[
            'border rounded p-2 flex items-center justify-center',
            editor?.isActive('bulletList') && editor.getAttributes('bulletList').type === style.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
          ]">
            <Icon :icon="style.icon" width="38" height="38" class="text-gray-600" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { List } from 'lucide-vue-next'
import { Editor } from '@tiptap/vue-3'
import { Icon } from '@iconify/vue';

const props = defineProps<{ editor: Editor | undefined }>()

const showDropdown = ref(false)

const listStyles = [
  { value: 'disc', icon: 'fluent:apps-list-20-filled' },
  { value: 'circle', icon: 'fluent:apps-list-20-regular' },
  { value: 'square', icon: 'fluent:apps-list-24-regular' },
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

  const currentType = editor.getAttributes('bulletList').type
  const isActive = editor.isActive('bulletList')

  if (isActive && currentType === style) {

    editor.chain().focus().unsetBulletList().run();
  } else if (isActive && currentType !== style) {
    editor.chain().focus().updateAttributes('bulletList', {
      type: style,
    }).run()
  } else {
    editor.chain().focus().setBulletList({ type: style }).run()
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
