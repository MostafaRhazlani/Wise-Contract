<template>
  <div>
    <h4 class="font-semibold text-gray-800 mb-3">Available Variables</h4>
    <div v-if="variablesStore.loading" class="text-gray-500 text-sm">Loading...</div>
    <div v-else-if="variablesStore.error" class="text-red-500 text-sm">{{ variablesStore.error }}</div>
    <div v-else class="grid grid-cols-2 gap-2">
        <div
            v-for="variable in variablesStore.variables"
            :key="variable.key"
            @click="$emit('select', variable.label)"
            class="px-2 py-1 text-center bg-green-100 rounded-md cursor-pointer hover:bg-green-200 text-sm transition-colors border border-transparent hover:border-green-300">
            <div class="">
                <div>
                    <span class="text-green-500 font-semibold text-xs">{{ variable.key }}</span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useVariablesStore } from '@/store/variablesStore';

const variablesStore = useVariablesStore();

onMounted(() => {
  if (variablesStore.variables.length === 0) {
    variablesStore.fetchVariables();
  }
});
</script>
