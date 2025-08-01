import { Extension } from '@tiptap/core'

export interface LineHeightOptions {
  types: string[],
  heights: string[],
  defaultHeight: string,
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
      heights: ['1', '1.5', '2', '2.5', '3'],
      defaultHeight: '1.5',
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => {
              const height = element.style.lineHeight;
              return height ? height.replace(';', '') : null;
            },
            renderHTML: attributes => {
              if (!attributes.lineHeight) {
                return {};
              }

              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight: (height: string | number) => ({ commands }) => {
        // Convert to string and normalize the value
        const heightStr = height.toString();

        // If unset, use default height
        if (height === 'unset') {
          return this.options.types.every(type =>
            commands.updateAttributes(type, { lineHeight: null })
          );
        }

        // Only validate against allowed heights if we have specific heights defined
        let validHeight = heightStr;
        if (!this.options.heights.includes(heightStr)) {
          validHeight = this.options.defaultHeight;
        }

        return this.options.types.every(type =>
          commands.updateAttributes(type, { lineHeight: validHeight })
        );
      },

      unsetLineHeight: () => ({ commands }) => {
        return this.options.types.every(type =>
          commands.resetAttributes(type, 'lineHeight'),
        )
      },
    }
  },
})