// extensions/Variable.ts
import { Node, mergeAttributes } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'

// Add this block for TypeScript augmentation
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (variable: string) => ReturnType
    }
  }
}

// Types
interface VariableList {
  key: string;
  label: string;
  display: string;
}

const variableList: VariableList[] = [
  { key: "sender", label: "sender.name", display: "Sender name" },
  { key: "receiver", label: "receiver.name", display: "Receiver name" },
  { key: "sender_email", label: "sender.email", display: "Sender email"},
  { key: "receiver_email", label: "receiver.email", display: "Receiver email"},
  { key: "phone", label: "phone", display: "Phone"},
  { key: "department", label: "department.department_name", display: "Department"},
  { key: "company_name", label: "company_name", display: "Company Name" },
  { key: "current_date", label: "current_date", display: "Current date" },
];

export const Variable = Node.create({
  name: 'variable',
  inline: true,
  group: 'inline',
  marks: '_',

  addAttributes() {
    return {
      variable: { default: null },
      label: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-variable]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-variable': node.attrs.variable,
        class: 'variable-node',
      }),
      `{{${node.attrs.label || node.attrs.variable}}}`
    ]
  },

  addCommands() {
    return {
      insertVariable:
        (variableKey) =>
        ({ commands }) => {
          const variable = variableList.find(v => v.key === variableKey)
          return commands.insertContent({
            type: this.name,
            attrs: { variable: variable?.key || variableKey, label: variable?.label || variableKey },
          })
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
          editor.chain().focus().deleteRange(range).insertVariable(props.label).run()
        },
        items: ({ query }) => {
          return variableList
            .filter(item => item.label.toLowerCase().includes(query.toLowerCase()) || item.key.toLowerCase().includes(query.toLowerCase()))
        },
        render: () => {
          let popup: any
          return {
            onStart: props => {
              const el = document.createElement('div')
              el.className = 'bg-white border border-gray-200 text-sm rounded shadow p-2'
              el.innerHTML = props.items
                .map(item => `<div class=\"p-1 hover:bg-gray-100 cursor-pointer\">${item.display}</div>`)
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
