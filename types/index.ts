// /types/index.ts
export interface Prompt {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Result {
  id: string;
  prompt_id: string;
  type: 'image' | 'text';
  content: string;
  created_at: string;
}
