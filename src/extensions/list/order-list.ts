import { Node, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    OrderedList: {
      setOrderedList: (attributes: { type: string }) => ReturnType,
      unsetOrderedList: () => ReturnType,
    }
  }
}

export const OrderedList = Node.create({
  name: 'orderedList',
  group: 'block',
  content: 'listItem+',
  defining: true,
  addAttributes() {
    return {
      type: {
        default: 'decimal',
        parseHTML: element => element.getAttribute('type') || 'decimal',
        renderHTML: attributes => {
          return attributes.type ? { type: attributes.type } : {}
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'ol',
      },
    ]
  },
  renderHTML({ node, HTMLAttributes }) {
    return ['ol', mergeAttributes(HTMLAttributes), 0]
  },
  addCommands() {
    return {
      setOrderedList:
        attributes =>
        ({ commands }) => {
          return commands.wrapInList(this.name, attributes)
        },
      unsetOrderedList:
        () =>
        ({ commands }) => {
          return commands.lift(this.name)
        },
    }
  },
})