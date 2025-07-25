<template>
  <div class="color-picker-root">
    <!-- Trigger Buttons -->
    <div class="flex gap-1">
      <TextColorButton :selectedColor="selectedColor" :editor="props.editor" @click="openModal('color')"/>
      <HighlightButton :selectedColor="selectedColor" :editor="props.editor" @click="openModal('highlight')"/>
    </div>

    <!-- Palette Modal -->
    <div v-if="showPalette" class="absolute z-50 mt-2 left-0 bg-white border rounded shadow-lg w-64 p-3" @click.stop>
      <!-- Default Colors -->
      <div>
        <div class="font-semibold text-sm mb-1">Default Color</div>
        <div class="grid grid-cols-8 gap-1 mb-2">
          <button
            v-for="color in defaultColors"
            :key="color"
            :style="{ backgroundColor: color }"
            class="w-6 h-6 rounded border border-gray-200 hover:ring-2 hover:ring-green-400"
            @click="pickColor(color)"
          />
        </div>
      </div>
      <!-- Standard Colors -->
      <div>
        <div class="font-semibold text-sm mb-1">Standard Colors</div>
        <div class="flex gap-1 mb-2">
          <button
            v-for="color in standardColors"
            :key="color"
            :style="{ backgroundColor: color }"
            class="w-6 h-6 rounded border border-gray-200 hover:ring-2 hover:ring-green-400"
            @click="pickColor(color)"
          />
        </div>
      </div>
      <!-- Recently Used -->
      <div v-if="recentColors[mode].length">
        <div class="font-semibold text-sm mb-1">Recently Used</div>
        <div class="flex gap-1 mb-2">
          <button
            v-for="color in recentColors[mode]"
            :key="color"
            :style="{ backgroundColor: color }"
            class="w-6 h-6 rounded border border-gray-200 hover:ring-2 hover:ring-green-400"
            @click="pickColor(color)"
          />
        </div>
      </div>
      <!-- More Colors -->
      <div class="mt-2">
        <label class="block text-sm font-medium mb-1">More Colors</label>
        <div class="flex items-center gap-2">
          <input type="color" :value="validHex(selectedColor[mode])" @input="onColorInput" />
          <input type="text" v-model="selectedColor[mode]" @change="onTextInput"
            class="border rounded px-2 py-1 text-sm w-24" placeholder="#000000" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import TextColorButton from './TextColorButton.vue';
import HighlightButton from './HighlightButton.vue';

const props = defineProps<{ editor: any }>()

const showPalette = ref(false)
const mode: Ref<'color' | 'highlight'> = ref('color');
const selectedColor: Ref<{ color: string; highlight: string }> = ref({ color: '', highlight: '' })
const recentColors: Ref<{ color: string[]; highlight: string[] }> = ref({ color: [], highlight: [] })

const defaultColors = [
  'defualt', '#000000', '#e7e6e6', '#44546a', '#4472c4', '#ed7d31', '#a5a5a5', '#ffc000',
  '#5b9bd5', '#70ad47', '#f2f2f2', '#7f7f7f', '#ddd9c3', '#c6e0b4', '#ddebf7', '#fce4d6',
  '#e2efda', '#fff2cc', '#d9e1f2', '#e4dfec', '#dbe5ef', '#f8cbad', '#b4c6e7', '#ffe699',
  '#c9daf8', '#b7dde8', '#f4cccc', '#d9ead3', '#fff2cc', '#d9d2e9', '#ead1dc', '#d0e0e3'
]
const standardColors = [
  '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff'
]

function validHex(val: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(val)) return val
  return '#000000'
}

function openModal(newMode: 'color' | 'highlight') {
  mode.value = newMode
  showPalette.value = !showPalette.value
}

function onColorInput(e: Event) {
  const color = (e.target as HTMLInputElement).value
  selectedColor.value[mode.value] = color
  pickColor(color, false)
}

function pickColor(color: string, closePalette = true) {
  selectedColor.value[mode.value] = color
  if(color !== 'defualt') {
    if (mode.value === 'color') {
      props.editor?.chain().focus().setColor(color).run()
    } else {
      console.log(color);
      props.editor?.chain().focus().toggleHighlight({ color }).run()
    }
  } else {
    if (mode.value === 'color') {
      props.editor?.chain().focus().unsetColor().run()
    } else {
      console.log(color);
      props.editor?.chain().focus().unsetHighlight().run()
    }
  }
  // Add to recent colors, keep max 8
  if (!recentColors.value[mode.value].includes(color)) {
    recentColors.value[mode.value].unshift(color)
    if (recentColors.value[mode.value].length > 8) recentColors.value[mode.value].pop()
  }
  if (closePalette) {
    showPalette.value = false
  }
}

function onTextInput() {
  if (/^#[0-9a-fA-F]{6}$/.test(selectedColor.value[mode.value])) {
    pickColor(selectedColor.value[mode.value])
  }
}

// Close palette on outside click
function handleClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.color-picker-root')) {
    showPalette.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClick))
onUnmounted(() => document.removeEventListener('click', handleClick))
</script>

<style scoped>
.color-picker-root {
  position: relative;
  display: inline-block;
}
</style>