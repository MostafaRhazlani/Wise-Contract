<template>
  <div ref="pickerRef" class="bg-white border rounded shadow-lg w-64 p-3">
    <div class="flex justify-between items-center mb-3">
        <button 
          @click="pickColor('default')" 
          :class="[
            'w-full p-2 text-xs rounded-sm border hover:border-green-500 hover:text-green-500 transition-colors duration-200',
            selectedColor[mode] === 'default' 
              ? 'bg-blue-100 text-blue-700 border-blue-300' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          ]"
        >
          Default Color
        </button>
    </div>
    <!-- Default Colors -->
    <div>
      <div class="font-semibold text-sm mb-1">Colors</div>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="color in defaultColors"
          :key="`default-${color}`"
          :style="{ backgroundColor: color }"
          class="w-6 h-6 rounded border border-gray-200 hover:opacity-80 transition-opacity"
          :class="{ 'ring-2 ring-offset-1 ring-blue-500': selectedColor[mode] === color }"
          @click="pickColor(color)"
        >
        </button>
      </div>
    </div>

    <!-- Custom Color -->
    <div class="mt-4">
      <div class="w-full border-t bg-gray-200 my-2"></div>
      <div class="flex items-center gap-2">
        <div class="relative w-full">
          <button
            @click="() => colorInputRef?.click()"
            class="flex items-center justify-between w-full px-2 py-2 rounded bg-gray-200"
          >
            <div class="flex items-center gap-1">
              <Icon icon="streamline-ultimate-color:color-palette-2" color="#fff" width="20px" height="20px" />
              <span class="text-sm">More Colors</span>
            </div>
            <ChevronRight :size="16"/>
          </button>
          <input
            ref="colorInputRef"
            type="color"
            :value="selectedColor[mode] && selectedColor[mode] !== 'default' ? selectedColor[mode] : '#000000'"
            @input="onColorInput"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { Icon } from '@iconify/vue'
import { ChevronRight } from 'lucide-vue-next'

const props = defineProps<{ 
  editor: any, 
  mode: 'color' | 'highlight' | 'background'
}>()

const emit = defineEmits(['close'])
const pickerRef = ref<HTMLElement | null>(null)
const colorInputRef = ref<HTMLInputElement | null>(null)

const selectedColor: Ref<{ color: string, highlight: string, background: string }> = ref({ color: '#000000', highlight: '#000000', background: '#000000' })

function close() {
  emit('close')
}

// Close picker when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    close()
  }
}

// Add click outside handler
onMounted(() => {
  // Use setTimeout to ensure the click event doesn't close the picker immediately when opened
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 0)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const defaultColors = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#808080',
  '#800000', '#808000', '#008000', '#800080', '#008080', '#000080',
  '#ffa500', '#ffc0cb', '#ffd700', '#90ee90', '#87cefa', '#d3d3d3',
  '#a0522d', '#f5f5dc', '#800080', '#ff7f50', '#40e0d0', '#9370db'
]

function onColorInput(e: Event) {
  const color = (e.target as HTMLInputElement).value
  if (color) { // Only update if we have a valid color
    selectedColor.value[props.mode] = color
    pickColor(color)
  }
}

function pickColor(color: string) {
  selectedColor.value[props.mode] = color;
  
  if (color !== 'default') {
    switch (props.mode) {
      case 'color':
        props.editor?.chain().focus().setColor(color).run();
        break;
      case 'highlight':
        props.editor?.chain().focus().toggleHighlight({ color }).run();
        break;
      case 'background':
        // For table cells, we need to handle the background color differently
        const attrs = props.editor?.getAttributes('tableCell') || {};
        const currentStyles = attrs.htmlAttributes?.style || '';
        
        // Parse existing styles into an object for easier manipulation
        const styleObject: Record<string, string> = {};
        currentStyles.split(';').forEach((style: string) => {
          const [key, value] = style.split(':').map((s: string) => s.trim());
          if (key && value) {
            styleObject[key] = value;
          }
        });
        
        // Update or add the background color
        styleObject['background-color'] = color;
        
        // Convert back to style string
        const newStyles = Object.entries(styleObject)
          .filter(([_, value]) => value) // Remove empty values
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ');
        
        // Update the table cell attributes
        props.editor?.chain().focus().updateAttributes('tableCell', {
          ...attrs,
          htmlAttributes: {
            ...attrs.htmlAttributes,
            style: newStyles
          }
        }).run();
        break;
    }
  } else {
    // Handle default (remove color)
    switch (props.mode) {
      case 'color':
        props.editor?.chain().focus().unsetColor().run();
        break;
      case 'highlight':
        props.editor?.chain().focus().unsetHighlight().run();
        break;
      case 'background':
        // For table cells, we need to handle the background color removal
        const attrs = props.editor?.getAttributes('tableCell') || {};
        const currentStyles = attrs.htmlAttributes?.style || '';
        
        // Parse existing styles into an object for easier manipulation
        const styleObject: Record<string, string> = {};
        currentStyles.split(';').forEach((style: string) => {
          const [key, value] = style.split(':').map((s: string) => s.trim());
          if (key && value && key !== 'background-color') {
            styleObject[key] = value;
          }
        });
        
        // Convert back to style string (or undefined if empty)
        const newStyles = Object.keys(styleObject).length > 0
          ? Object.entries(styleObject)
              .map(([key, value]) => `${key}: ${value}`)
              .join('; ')
          : undefined;
        
        // Update the table cell attributes
        props.editor?.chain().focus().updateAttributes('tableCell', {
          ...attrs,
          htmlAttributes: {
            ...attrs.htmlAttributes,
            style: newStyles
          }
        }).run();
        break;
    }
  }
  
  // Close after selection
  close();
}
</script>