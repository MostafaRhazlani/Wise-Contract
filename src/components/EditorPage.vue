<template>
    <!-- filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\components\EditorPage.vue -->
    <div 
        class="bg-white shadow-lg mx-auto p-12" 
        ref="editorPageRef" 
        :style="pageStyle"
    >
        <EditorContent :editor="editor" class="w-full h-full" />
    </div>
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTypeStore } from '@/store/typeStore';

const props = defineProps<{ editor: Editor }>();
const route = useRoute();
const typeStore = useTypeStore();

const pageStyle = computed(() => {
    const typeId = Number(route.params.type_id);
    const currentType = typeStore.types.find(type => type.id === typeId);
    
    // Try to get dimensions from store first
    if (currentType && currentType.width && currentType.height) {
        return {
            width: `${currentType.width}px`,
            height: `${currentType.height}px`
        };
    }
    
    // Fallback to hardcoded dimensions based on type_id
    let width = 794;
    let height = 1123;
    
    switch (typeId) {
        case 1: // Contract A4
        case 2: // CV A4
            width = 794;
            height = 1123;
            break;
        case 3: // Contract A5
        case 4: // CV A5
            width = 559;
            height = 794;
            break;
        case 5: // Contract A2
        case 6: // CV A2
            width = 1587;
            height = 2244;
            break;
        default:
            width = 794;
            height = 1123;
    }
    
    return {
        width: `${width}px`,
        height: `${height}px`
    };
});
</script>

<style scoped>
/* filepath: c:\Users\zougu\OneDrive\Desktop\Wise-Contract\src\components\EditorPageControls.vue */
.zoom-slider {
    -webkit-appearance: none;
    appearance: none; /* Added standard property */
    width: 9rem;
    border-radius: 9999px;
    background: #90a1b9;
    outline: none;
    transition: background 0.3s;
}

.zoom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    margin-top: -7px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 0 2px #999;
    border: 2px solid #fff;
    transition: background 0.3s;
}

.zoom-slider::-webkit-slider-runnable-track {
    height: 3px;
    border-radius: 9999px;
    background: #99a1af;
}

.zoom-slider:focus {
    outline: none;
}

.zoom-slider:hover::-webkit-slider-thumb {
    transition: 0.3s ease-in-out;
    box-shadow: 0 0 2px 6px rgba(144, 161, 185, 0.4);
}

.zoom-slider:focus::-webkit-slider-thumb {
    box-shadow: 0 0 2px 6px rgba(144, 161, 185, 0.4);
}
</style>