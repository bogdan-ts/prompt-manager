export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  tags: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromptData {
  title: string;
  content: string;
  description?: string;
  tags: string[];
  category?: string;
}

export interface UpdatePromptData extends CreatePromptData {
  id: string;
}
