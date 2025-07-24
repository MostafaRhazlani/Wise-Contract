import { defineStore } from "pinia";
import axios from "@/plugins/axios";

interface Type {
  id: number;
  title: string;
  logo: string;
  color: string;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
}

interface TypeState {
  types: Type[];
  loading: boolean;
  error: string | null;
}

export const useTypeStore = defineStore("type", {
  state: (): TypeState => ({
    types: [],
    loading: false,
    error: null,
  }),

  getters: {
    getTypeById: (state) => (id: number) => {
      return state.types.find((type) => type.id === id);
    },
  },

  actions: {
    async getTypes() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get("/types");
        this.types = response.data.types || response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to fetch types";
        console.error("Error fetching types:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});