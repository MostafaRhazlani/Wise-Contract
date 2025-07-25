<template>
    <div class="color-picker-root">
        <button :class="{
            'bg-green-100 text-green-500': props.selectedColor.color,
            'p-2 text-gray-500 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors': true
        }">
            <Pipette :size="18" :style="{
                color: props.selectedColor.color
            }" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { Pipette } from 'lucide-vue-next'

const props = defineProps<{
    editor: any,
    selectedColor: {
        color: string,
        highlight: string
    },
}>()
</script>

<style scoped>
.color-picker-root {
    position: relative;
    display: inline-block;
}
</style>