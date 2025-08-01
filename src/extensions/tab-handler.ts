import { Extension } from '@tiptap/core'

export const TabHandler = Extension.create({
  name: 'tabHandler',
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        const editor = this.editor
        editor.chain().insertContent('  ').run()
        return true
      }
    }
  }
})