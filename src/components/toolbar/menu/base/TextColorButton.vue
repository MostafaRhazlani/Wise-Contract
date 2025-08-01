<template>
    <div class="relative inline-block">
        <button @click="togglePalette" :class="{
            'bg-green-100 text-green-500': showPalette,
            'p-2 hover:text-green-500 hover:bg-green-100 rounded-md transition-colors': true
        }" title="Text Color">
            <Pipette :size="18" />
        </button>
        <transition name="fade">
            <div v-if="showPalette" class="fixed mt-2 z-40">
                <ColorPicker :editor="editor" mode="color" @close="closePalette" />
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { Pipette } from 'lucide-vue-next';
import { ref } from 'vue';
import ColorPicker from './ColorPicker.vue';

defineProps<{
    editor: any;
}>();

const showPalette = ref(false);

function togglePalette() {
    showPalette.value = !showPalette.value;
}

function closePalette() {
    showPalette.value = false;
}
</script>

<style scoped>
.color-picker-root {
    position: relative;
    display: inline-block;
    isolation: isolate;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>