import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ColumnsNodeView from './columns-node.vue'
import ColumnNodeView from './column-node.vue'

export const Column = Node.create({
  name: 'column',
  content: 'block+',
  isolating: true,
  group: 'block',
  parseHTML() {
    return [{ tag: 'div.column' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'column' }), 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(ColumnNodeView)
  },
})

export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column{2,}',
  isolating: true,
  parseHTML() {
    return [{ tag: 'div.columns' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'columns' }), 0]
  },
  addNodeView() {
    return VueNodeViewRenderer(ColumnsNodeView)
  },
  addCommands() {
    return {
      insertColumns:
        (count: number) =>
        ({ commands }: { commands: any }) => {
          const columns = Array(count)
            .fill(0)
            .map(() => ({
              type: 'column',
              content: [{ type: 'paragraph' }],
            }))
          return commands.insertContent({
            type: 'columns',
            content: columns,
          })
        },
    }
  },
}) 