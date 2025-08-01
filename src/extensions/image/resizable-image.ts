import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageNode from './Image-node.vue'

export default Node.create({
    name: 'resizableImage',
    group: 'block', // changed from 'inline'
    inline: false,  // changed from true
    atom: true,

    addAttributes() {
        return {
            src: { default: null },
            alt: { default: null },
            width: { default: 150 },
            height: { default: 'auto' },
            align: { default: 'left' }, // NEW
        }
    },

    parseHTML() {
        return [{ tag: 'img[src]' }]
    },

    renderHTML({ HTMLAttributes }) {
        let justify = 'flex-start';
        if (HTMLAttributes.align === 'center') {
            justify = 'center';
        } else if (HTMLAttributes.align === 'right') {
            justify = 'flex-end';
        }
        return [
            'div',
            {
                style: `display: flex; justify-content: ${justify}; width: 100%;`
            },
            [
                'img',
                mergeAttributes(HTMLAttributes, {
                    style: `width:${HTMLAttributes.width || 150}px;height:auto;display:block;`
                })
            ]
        ];
    },

    addNodeView() {
        return VueNodeViewRenderer(ImageNode)
    },
})