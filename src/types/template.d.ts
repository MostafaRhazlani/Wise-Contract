export interface Template {
    id: number;
    content_json: any;
    image: string;
    company_id: number;
    created_at: string;
    updated_at: string;
  }
  
export  interface TemplateStoreState {
    templates: Template[];
    loading: boolean;
    error: string | null;
  }