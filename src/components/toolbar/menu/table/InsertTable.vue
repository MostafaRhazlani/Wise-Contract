<template>
  <div class="relative">
    <el-tooltip content="Insert a new table" placement="bottom">
      <button
        class="flex flex-col items-center text-sm p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors"
        @click="togglePopup">
        <Sheet :size="36" :stroke-width="1.5" />
        <span>Insert Table</span>
      </button>
    </el-tooltip>
    <transition name="fade">
      <div v-if="showPopup" ref="popupRef" class="fixed mt-2 z-40 flex items-start justify-center">
        <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
          <div class="flex flex-col gap-1 mb-4">
            <div v-for="row in maxRows" :key="row" class="flex gap-1">
              <span v-for="col in maxCols" :key="col" class="w-4 h-4 rounded cursor-pointer transition-colors"
                :class="row <= selectedRows && col <= selectedCols ? 'border-2 border-green-500' : 'border-2 border-gray-500'"
                @mouseover="setSelection(row, col)" @click="confirmSelection(row, col)"></span>
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center border-2 border-gray-500 rounded-md px-2 font-semibold">
              <label class="text-sm">Number of Rows:</label>
              <input type="number" v-model.number="selectedRows" min="1" :max="maxRows"
                class="ml-2 w-10 rounded p-1 focus:outline-none" />
            </div>
            <div class="flex justify-between items-center border-2 border-gray-500 rounded-md px-2 font-semibold">
              <label class="text-sm">Number of Cols:</label>
              <input type="number" v-model.number="selectedCols" min="1" :max="maxCols"
                class="ml-2 w-10 rounded p-1 focus:outline-none" />
            </div>
            <label class="inline-flex items-center text-sm">
              <input type="checkbox" v-model="isHeaderInclude" class="mr-2 accent-green-500" /> Include Header
            </label>
            <button
              class="w-full bg-green-500 hover:bg-green-700 text-white rounded font-bold py-1 mt-2 transition-colors"
              @click="confirmSelection(selectedRows, selectedCols)">Create Table</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { Sheet } from 'lucide-vue-next';
import { Editor } from '@tiptap/core';
import { ElMessage } from 'element-plus';

const maxRows: number = 8;
const maxCols: number = 10;
const selectedRows: Ref<number> = ref(0);
const selectedCols: Ref<number> = ref(0);
const isHeaderInclude: Ref<boolean> = ref(true);
const showPopup = ref(false);
const popupRef = ref<HTMLElement | null>(null);
const props = defineProps<{ editor: Editor }>();

const togglePopup = (e: Event) => {
  e.stopPropagation();
  showPopup.value = !showPopup.value;
}

function closePopup() {
  showPopup.value = false;
}

// Close popup when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (popupRef.value && !popupRef.value.contains(target) && !target.closest('button[title*="Table"]')) {
    closePopup();
  }
}

// Add/remove click outside listener
onMounted(() => {
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Calculate maximum rows that can fit in available space
function calculateMaxTableRows(cols: number): number {
  // This is a simplified calculation - adjust based on your needs
  // You might want to calculate based on available space in the editor
  const maxPossibleRows = 10; // Default maximum
  return Math.min(maxPossibleRows, maxRows);
}

// Handle table insertion with validation
function insertTable(tableData: { rows: number; cols: number; withHeaderRow?: boolean }) {
  if (!props.editor) return;

  // Calculate maximum rows that can fit in available space
  const maxRows = calculateMaxTableRows(tableData.cols);
  const requestedRows = tableData.rows;

  // Use the smaller of requested rows or maximum fitting rows
  const actualRows = Math.min(requestedRows, maxRows);

  // Need at least 1 row (header row is optional)
  if (actualRows < 1) {
    ElMessage({
      message: 'Cannot insert table: Not enough space on current page',
      type: 'warning',
      duration: 3000
    });
    return false;
  }

  // Show message if we had to reduce the number of rows
  if (actualRows < requestedRows) {
    ElMessage({
      message: `Table size adjusted: Inserting ${actualRows} rows to fit available space`,
      type: 'info',
      duration: 4000
    });
  }

  // Use TipTap's built-in table insertion
  props.editor.chain()
    .focus()
    .insertTable({
      rows: actualRows,
      cols: tableData.cols,
      withHeaderRow: tableData.withHeaderRow !== false // Default to true if not specified
    })
    .run();

  return true;
}

function setSelection(row: number, col: number) {
  selectedRows.value = row;
  selectedCols.value = col;
}

function confirmSelection(row: number, col: number) {
  if (row > 0 && col > 0) {
    insertTable({
      rows: row,
      cols: col,
      withHeaderRow: isHeaderInclude.value
    });
    showPopup.value = false;
  }
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