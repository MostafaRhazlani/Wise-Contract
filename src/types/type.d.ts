export interface Type {
    id: number;
    title: string;
    logo: string;
    color: string;
  }
  
export interface TypeState {
    types: Type[];
    loading: boolean;
    error: string | null;
  }