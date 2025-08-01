import { width, height } from './../../node_modules/happy-dom/src/PropertySymbol';
export interface Type {
    id: number;
    title: string;
    logo: string;
    color: string;
    width: number;
    height: number;
  }
  
export interface TypeState {
    types: Type[];
    type: Type | null;
    loading: boolean;
    error: string | null;
  }