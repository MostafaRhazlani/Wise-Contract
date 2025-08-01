import { Node, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bulletedList: {
      setBulletList: (attributes: { type: string }) => ReturnType,
      unsetBulletList: () => ReturnType,
    }
  }
}

export const BulletedList = Node.create({
  name: 'bulletList',
  group: 'block',
  content: 'listItem+',
  defining: true,
  addAttributes() {
    return {
      type: {
        default: 'disc',
        parseHTML: element => element.getAttribute('data-type') || 'disc',
        renderHTML: attributes => {
          return attributes.type ? { 'data-type': attributes.type, class: `bullet-list-${attributes.type}` } : {}
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'ul',
      },
    ]
  },
  renderHTML({ node, HTMLAttributes }) {
    return ['ul', mergeAttributes(HTMLAttributes), 0]
  },
  addCommands() {
    return {
      setBulletList:
        attributes =>
        ({ commands }) => {
          return commands.wrapInList(this.name, attributes)
        },
      unsetBulletList:
        () =>
        ({ commands }) => {
          return commands.lift(this.name)
        },
    }
  },
})