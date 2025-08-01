<template>
    <NodeViewWrapper ref="wrapperRef" :style="{
        width: '100%',
        height: 'auto',
        boxSizing: 'border-box',
        cursor: 'default',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px',
        borderRadius: '5px',
    }">
        <div :style="{
            border: selected ? '2px solid #4ade80' : '2px solid transparent',
            transition: 'border 0.2s, box-shadow 0.2s',
            position: 'relative',
            height: '100%'
        }">
            <img :src="node.attrs.src" :alt="node.attrs.alt" :style="{
                width: node.attrs.width + 'px',
                height: 'auto',
                display: 'block',
            }" ref="img" draggable="false" />
            <span v-if="selected" class="resize-handle" @mousedown.prevent="startResize" :style="{
                border: '2px solid #4ade80',
                position: 'absolute',
                right: '-5px',
                bottom: '-5px',
                width: '12px',
                height: '12px',
                background: '#fff',
                cursor: 'nwse-resize',
                zIndex: 20,
            }"></span>
        </div>
    </NodeViewWrapper>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, computed, nextTick } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/vue-3'

const props = defineProps<NodeViewProps>()
const img = ref<HTMLImageElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const imgHeight = ref(0)
let startX = 0
let startWidth = 0

const selected = computed(() => props.selected)

function updateImgHeight() {
    if (img.value) {
        imgHeight.value = img.value.naturalHeight * (props.node.attrs.width / img.value.naturalWidth)
    }
}

function startResize(e: MouseEvent) {
    startX = e.clientX
    startWidth = img.value ? img.value.width : 150
    document.addEventListener('mousemove', onResize)
    document.addEventListener('mouseup', stopResize)
}

function onResize(e: MouseEvent) {
    const diff = e.clientX - startX
    const newWidth = Math.max(50, startWidth + diff)
    props.updateAttributes({ width: newWidth })
    nextTick(updateImgHeight)
}

function stopResize() {
    document.removeEventListener('mousemove', onResize)
    document.removeEventListener('mouseup', stopResize)
}

onBeforeUnmount(() => {
    stopResize()
})
</script>