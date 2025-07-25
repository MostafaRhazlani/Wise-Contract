<template>
  <div class="relative">
    <button
      class="flex flex-col items-center text-sm p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors"
      @click="showPopup = !showPopup"
    >
      <Sheet :size="36"/>
      <span>Insert Table</span>
    </button>
    <div
      v-if="showPopup"
      class="absolute top-18 z-50"
      @click.self="showPopup = false"
    >
      <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
        <div class="flex flex-col gap-1 mb-4">
          <div
            v-for="row in maxRows"
            :key="row"
            class="flex gap-1"
          >
            <span
              v-for="col in maxCols"
              :key="col"
              class="w-4 h-4 rounded cursor-pointer transition-colors"
              :class="row <= selectedRows && col <= selectedCols ? 'border-2 border-green-500' : 'border-2 border-gray-500'"
              @mouseover="setSelection(row, col)"
              @click="confirmSelection(row, col)"
            ></span>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between items-center border-2 border-gray-500 rounded-md px-2 font-semibold">
            <label class="text-sm">Number of Rows:</label>
              <input type="number" v-model.number="selectedRows" min="1" :max="maxRows" class="ml-2 w-10 rounded p-1 focus:outline-none" />
          </div>
          <div class="flex justify-between items-center border-2 border-gray-500 rounded-md px-2 font-semibold">
            <label class="text-sm">Number of Cols:</label>
            <input type="number" v-model.number="selectedCols" min="1" :max="maxCols" class="ml-2 w-10 rounded p-1 focus:outline-none" />
          </div>
          <label class="inline-flex items-center text-sm">
            <input type="checkbox" v-model="includeHeader" class="mr-2 accent-green-500" /> Include Header
          </label>
          <button class="w-full bg-green-500 hover:bg-green-700 text-white rounded font-bold py-1 mt-2 transition-colors" @click="confirmSelection(selectedRows, selectedCols)">Create Table</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { Sheet } from 'lucide-vue-next';

const maxRows = 8;
const maxCols = 10;
const selectedRows = ref(0);
const selectedCols = ref(0);
const includeHeader = ref(true);
const showPopup = ref(false);

const emit = defineEmits(['insert-table']);

function setSelection(row: number, col: number) {
  selectedRows.value = row;
  selectedCols.value = col;
}

function confirmSelection(row: number, col: number) {
  if (row > 0 && col > 0) {
    emit('insert-table', { rows: row, cols: col, includeHeader: includeHeader.value });
    showPopup.value = false;
  }
}
</script>


