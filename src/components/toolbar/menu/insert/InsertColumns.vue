<template>
    <div class="flex items-center relative">
        <button @click="showColumnDialog = !showColumnDialog"
            class="flex flex-col items-center text-sm p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors">
            <Columns2 :size="36" :stroke-width="1.5"/>
            <span>Columns</span>
        </button>
        <div v-if="showColumnDialog" class="absolute z-50 bg-white border p-4 rounded shadow top-20 left-24 -translate-x-1/2">
            <label class="block mb-2">How many columns?</label>
            <select v-model="columnCount" class="border rounded p-1 mb-2 w-full">
                <option v-for="n in [2, 3, 4, 5, 6]" :key="n" :value="n">{{ n }}</option>
            </select>
            <div class="flex space-x-2">
                <button @click="addColumns" class="px-3 py-1 bg-green-500 text-white rounded">Insert</button>
                <button @click="showColumnDialog = false" class="px-3 py-1 bg-gray-200 rounded">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Columns2 } from 'lucide-vue-next';
import { Editor } from '@tiptap/core';
import { onMounted, onUnmounted, ref } from 'vue';
import type { Ref } from 'vue';

const props = defineProps<{ editor: Editor }>();
const emit = defineEmits(['insert-columns']);

const showColumnDialog: Ref<boolean> = ref(false)
const columnCount: Ref<number> = ref(2)

function addColumns() {
    // Emit event to check if page is full before inserting
    if (props.editor) {
        emit('insert-columns', { columnCount: columnCount.value });
    }
    showColumnDialog.value = false
}

function handleClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.relative')) {
    showColumnDialog.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClick))
onUnmounted(() => document.removeEventListener('click', handleClick))
</script>

<style scoped></style>