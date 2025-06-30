import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { Variable } from '@/types/variable';

export const useVariablesStore = defineStore('variables', () => {
  const variables = ref<Variable[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchVariables = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('/variables');
      // If API returns display, use it; otherwise, fallback to label
      variables.value = response.data.data;
    } catch (err: any) {
      error.value = err?.response?.data?.message || 'Failed to load variables.';
    } finally {
      loading.value = false;
    }
  };

  return {
    variables,
    loading,
    error,
    fetchVariables,
  };
}); 