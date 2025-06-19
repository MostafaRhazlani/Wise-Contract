import { Node, mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export interface VariableOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      setVariable: (variable: string) => ReturnType
    }
  }
}

export const VariableNode = Node.create<VariableOptions>({
  name: 'variable',

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      variable: {
        default: null,
        parseHTML: element => element.getAttribute('data-variable'),
        renderHTML: attributes => {
          return {
            'data-variable': attributes.variable,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-variable]',
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), `{{${node.attrs.variable}}}`]
  },

  addCommands() {
    return {
      setVariable:
        variable =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { variable },
          })
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('variable'),
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === 'Backspace' || event.key === 'Delete') {
              const { state, dispatch } = view
              const { selection } = state
              const { $from, $to } = selection

              // Check if we're deleting a variable
              const text = $from.parent.textContent
              const variableRegex = /\{\{[^}]+\}\}/g
              let match
              let found = false

              while ((match = variableRegex.exec(text)) !== null) {
                const start = match.index
                const end = start + match[0].length

                if (
                  ($from.pos - $from.start() >= start && $from.pos - $from.start() <= end) ||
                  ($to.pos - $to.start() >= start && $to.pos - $to.start() <= end)
                ) {
                  // Delete the entire variable
                  const tr = state.tr
                  tr.delete($from.start() + start, $from.start() + end)
                  dispatch(tr)
                  found = true
                  break
                }
              }

              return found
            }
            return false
          },
        },
      }),
    ]
  },
}) 