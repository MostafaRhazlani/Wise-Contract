import { defineStore } from 'pinia';
import axios from 'axios';
import { useCompanyStore } from './companyStore';

export interface Template {
  id: number;
  content_json: any;
  image: string;
  company_id: number;
  created_at: string;
  updated_at: string;
}

interface TemplateStoreState {
  templates: Template[];
  loading: boolean;
  error: string | null;
}

export const useTemplateStore = defineStore('template', {
  state: (): TemplateStoreState => ({
    templates: [],
    loading: false,
    error: null,
  }),
  actions: {
    async getTemplates() {
      const companyStore = useCompanyStore();
      const companyId = companyStore.company?.id;
    
      if (!companyId) {
        this.error = "Company ID not found.";
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/company/templates/${companyId}`);
        this.templates = response.data.templates;
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || "Failed to fetch templates.";
      } finally {
        this.loading = false;
      }
    },

    async getTemplate(id: number): Promise<Template | null> {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/template/${id}`);
        return response.data.template;
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to fetch template ${id}.`;
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
}); 