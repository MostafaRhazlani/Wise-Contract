import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export type PanelType = 'variables' | 'templates';

export const useEditorStore = defineStore('editor', () => {
  const activePanel = ref<PanelType | null>(null);
  const storedPanel = localStorage.getItem('activePanel');

  if (storedPanel) {
    try {
      activePanel.value = JSON.parse(storedPanel);
    } catch {
      localStorage.removeItem('activePanel');
    }
  }

  const isLeftSidebarOpen = computed(() => activePanel.value !== null);

  watch(activePanel, (newPanel) => {
    if (newPanel) {
      localStorage.setItem('activePanel', JSON.stringify(newPanel));
    } else {
      localStorage.removeItem('activePanel');
    }
  });

  function togglePanel(panel: PanelType) {
    if (activePanel.value === panel) {
      activePanel.value = null;
    } else {
      activePanel.value = panel;
    }
  }

  function closeSidebar() {
    activePanel.value = null;
  }

  return {
    activePanel,
    isLeftSidebarOpen,
    togglePanel,
    closeSidebar,
  };
}); 