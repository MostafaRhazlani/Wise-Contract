import { defineStore } from "pinia";
import axios from "@/plugins/axios";

interface Type {
  id: number;
  title: string;
  logo: string;
  color: string;
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
  actions: {
    async getTypes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("/types");
        this.types = response.data.types;
      } catch (error: any) {
        this.error = "Failed to fetch types.";
        console.error("Error fetching types:", error);
      } finally {
        this.loading = false;
      }
    },
  },
}); 