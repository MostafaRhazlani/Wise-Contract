export interface Template {
    id: number;
    title: string;
    company_id: number;
    type_id: number;
    created_at: string;
    updated_at: string;
    pages: {
      content_json: any;
      image_path: string;
      template_id: number
    }[];
    type: {
      id: number,
      title: string,
      logo: string,
      color: string
    }
  }
  
export  interface TemplateStoreState {
    templates: Template[];
    loading: boolean;
    error: string | null;
  }