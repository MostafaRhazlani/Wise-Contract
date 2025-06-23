// extensions/Variable.ts
import { Node, mergeAttributes } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'

// Add this block for TypeScript augmentation
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (variable: { key: string; label: string }) => ReturnType
    }
  }
}

// Types
interface VariableList {
  key: string;
  label: string;
}

export const Variable = Node.create({
  name: 'variable',
  inline: true,
  group: 'inline',
  marks: '_',

  addOptions() {
    return {
      getVariables: () => [] as VariableList[],
    }
  },

  addAttributes() {
    return {
      key: { default: null },
      label: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-variable]',
        getAttrs: dom => {
          const el = dom as HTMLElement
          return {
            key: el.getAttribute('data-variable'),
            label: el.getAttribute('data-label'),
          }
        }
      }
    ]
  },


  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class: 'variable-node',
      }),
      `{{${node.attrs.key}}}`,
    ]
  },

  addCommands() {
    return {
      insertVariable:
        (variable: { key: string, label: string }) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: {
                key: variable.key,   
                label: variable.label,
              },
            });
          },

    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '{{',
        startOfLine: false,
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).insertVariable(props).run()
        },
        items: ({ query }) => {
          return this.options.getVariables()
            .filter((item: any) => item.label.toLowerCase().includes(query.toLowerCase()) || item.key.toLowerCase().includes(query.toLowerCase()))
        },
        render: () => {
          let popup: any
          return {
            onStart: props => {
              const el = document.createElement('div')
              el.className = 'bg-white border border-gray-200 text-sm rounded shadow p-2 w-44'
              el.innerHTML = props.items
                .map((item: any) => `<div class=\"p-1 hover:bg-gray-100 cursor-pointer font-semibold \">${item.key}</div>`)
                .join('')
              el.querySelectorAll('div').forEach((div: any, index: number) => {
                div.onclick = () => props.command(props.items[index])
              })
              import('tippy.js').then(({ default: tippy }) => {
                if (props.clientRect) {
                  const safeClientRect = () => props.clientRect && props.clientRect() ? props.clientRect()! : new DOMRect();
                  popup = tippy(document.body, {
                    content: el,
                    trigger: 'manual',
                    placement: 'bottom-start',
                    getReferenceClientRect: safeClientRect,
                    showOnCreate: true,
                    interactive: true,
                    appendTo: () => document.body
                  })
                }
              })
            },
            onExit() {
              if (popup) {
                popup.destroy();
                popup = null;
              }
            },
          }
        },
      }),
    ]
  },
})
