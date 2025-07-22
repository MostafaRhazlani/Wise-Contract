import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { TypeState, Type } from '@/types/type';


export const useTypeStore = defineStore("type", {
  state: (): TypeState => ({
    types: [] as Type[],
    type: null,
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

    async getType(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/type/${id}`);
        this.type = response.data.type;
      } catch (error: any) {
        this.error = "Failed to fetch type.";
        console.error("Error fetching type:", error);
      } finally {
        this.loading = false;
      }
    }
  },
}); 