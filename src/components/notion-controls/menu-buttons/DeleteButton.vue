<template>
    <div class="flex items-center space-x-2 px-2 py-1 rounded hover:bg-red-100/50 hover:text-red-500 cursor-pointer transition-colors"
        @click="deleteBlock">
        <Trash2 :size="16" />
        <span>Delete Block</span>
    </div>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next';
import { Editor } from '@tiptap/core';

const props = defineProps<{
    editor?: Editor,
    pos: number,
    pageIndex: number
}>();

// Emit events to parent
const emit = defineEmits<{
    'block-deleted': [];
}>();

function deleteBlock() {
    if (!props.editor) {
        console.warn('Editor not provided to DeleteButton');
        return;
    }

    props.editor.commands.command(({ tr, state }) => {
        const $pos = state.doc.resolve(props.pos);
        
        let targetDepth = 1;
        let targetNode = null;
        let targetStart = 0;
        
        // Traverse up the tree to find the appropriate block to delete
        for (let depth = $pos.depth; depth >= 1; depth--) {
            const node = $pos.node(depth);
            const nodeStart = $pos.start(depth);
            
            // If we find a columns node, delete the entire columns structure
            if (node.type.name === 'columns') {
                targetNode = node;
                targetStart = $pos.before(depth);
                targetDepth = depth;
                break;
            }
            
            // For other block-level nodes, delete them if they're not just containers
            if (node.isBlock && node.type.name !== 'doc' && node.type.name !== 'column') {
                targetNode = node;
                targetStart = $pos.before(depth);
                targetDepth = depth;
            }
        }
        
        if (targetNode) {
            const targetEnd = targetStart + targetNode.nodeSize;
            tr.delete(targetStart, targetEnd);
            emit('block-deleted');
            return true;
        } else {
            console.warn('No suitable block found to delete');
            return false;
        }
    });
}
</script>