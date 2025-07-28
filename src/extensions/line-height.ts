import { Extension } from '@tiptap/core'

export interface LineHeightOptions {
  types: string[],
  heights: string[],
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (height: string) => ReturnType,
      unsetLineHeight: () => ReturnType,
    }
  }
}

export const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['heading', 'paragraph'],
      heights: ['1.5', '2.0', '4.0'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight || null,
            renderHTML: attributes => {
              if (!attributes.lineHeight) {
                return {}
              }

              return {
                style: `line-height: ${attributes.lineHeight}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight: (height: string) => ({ commands }) => {
        if (!this.options.heights.includes(height) && height !== 'unset') {
          return false
        }

        return this.options.types.every(type =>
          commands.updateAttributes(type, { lineHeight: height }),
        )
      },

      unsetLineHeight: () => ({ commands }) => {
        return this.options.types.every(type =>
          commands.resetAttributes(type, 'lineHeight'),
        )
      },
    }
  },
})