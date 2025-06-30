import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { Company } from '@/types/company';

export const useCompanyStore = defineStore('company', () => {

  const company = ref<Company | null>(JSON.parse(localStorage.getItem('company') || 'null'));
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const setCompany = (companyData: Company) => {
    company.value = companyData
    localStorage.setItem('company', JSON.stringify(companyData))
  }

  const getCompany = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('/company/show');
      setCompany(response.data.company);
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch company info';
    } finally {
      loading.value = false;
    }
  };

  return { company, loading, error, getCompany };
}); 