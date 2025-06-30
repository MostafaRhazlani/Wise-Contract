import { defineStore } from 'pinia';
import axios from 'axios';
import { useCompanyStore } from './companyStore';
import { TemplateStoreState, Template } from '@/types/template';
import { useTypeStore } from "@/store/typeStore";
import { useRoute } from "vue-router";

export const useTemplateStore = defineStore('template', {
  state: (): TemplateStoreState => ({
    templates: [],
    loading: false,
    error: null,
  }),
  actions: {
    async getTemplatesCompanyWithType(type_id: number) {
      const companyStore = useCompanyStore();
      const companyId = companyStore.company?.id;
    
      if (!companyId) {
        this.error = "Company ID not found.";
        return;
      }

      this.loading = true;
      this.error = null;
      try {

        let url = `/company/templates/${companyId}/${type_id}`;
        const response = await axios.get(url);
        
        this.templates = response.data.templates;
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || "Failed to fetch templates.";
      } finally {
        this.loading = false;
      }
    },

    async getTemplatesCompany() {
      const companyStore = useCompanyStore();
      const companyId = companyStore.company?.id;
    
      if (!companyId) {
        this.error = "Company ID not found.";
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        let url = `/company/templates/${companyId}`;
        const response = await axios.get(url);
        
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