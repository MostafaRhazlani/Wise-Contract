import { defineStore } from 'pinia';
import { setContent, getContent } from '@/plugins/indexedDb';
import { PageSizeState } from '@/types/pageSize';

export const usePageSizeStore = defineStore('pageSize', {
  state: (): PageSizeState => ({
    pageWidth: 0,
    pageHeight: 0,
    allContent: [],
  }),
  actions: {
    setPageSize(width: number, height: number) {
      this.pageWidth = width;
      this.pageHeight = height;
      this.saveToIndexedDB();
    },
    setAllContent(content: any[]) {
      this.allContent = content;
      this.saveToIndexedDB();
    },
    async loadFromIndexedDB() {
      const data = await getContent('editorContent');
      if (data) {
        this.pageWidth = data.width || 0;
        this.pageHeight = data.height || 0;
        this.allContent = data.allContent || [];
      }
    },
    saveToIndexedDB() {
      setContent('editorContent', {
        width: this.pageWidth,
        height: this.pageHeight,
        allContent: this.allContent, 
      });
    },
    clearStatePageSize() {
      this.pageWidth = 0;
      this.pageHeight = 0;
      this.allContent = [];
    }
  }
});