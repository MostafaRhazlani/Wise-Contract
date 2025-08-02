import { defineStore } from 'pinia';
import { setContent, getContent } from '@/plugins/indexedDb';
import { PageSizeState } from '@/types/pageSize';

export const usePageSizeStore = defineStore('pageSize', {
  state: (): PageSizeState => ({
    pageWidth: 0,
    pageHeight: 0,
    allContent: [],
    backgroundColor: '#ffffff',
  }),
  actions: {
    setPageSize(width: number, height: number) {
      this.pageWidth = width;
      this.pageHeight = height;
      this.saveToIndexedDB();
    },
    
    toggleOrientation() {
      // Simply swap width and height
      [this.pageWidth, this.pageHeight] = [this.pageHeight, this.pageWidth];
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
        this.backgroundColor = data.backgroundColor || '#ffffff';
      }
    },
    setBackgroundColor(color: string) {
      this.backgroundColor = color;
      this.saveToIndexedDB();
    },
    
    saveToIndexedDB() {
      setContent('editorContent', {
        width: this.pageWidth,
        height: this.pageHeight,
        allContent: this.allContent,
        backgroundColor: this.backgroundColor
      });
    },
    clearStatePageSize() {
      this.pageWidth = 0;
      this.pageHeight = 0;
      this.allContent = [];
      this.backgroundColor = '#ffffff';
    }
  }
});