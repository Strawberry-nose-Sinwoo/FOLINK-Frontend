export type CommonQuestionType = {
  id: number;
  title: string; 
  question: string;
  purpose: string;
  conversationId: number;
  projectName?: string; 
  stackName?: string; 
};

export type ProjectQuestionType = {
  id: number;
  projectName: string;
  question: string;
  purpose: string;
};

export type TechStackQuestionType = {
  id: number;
  stack: string;
  question: string;
  purpose: string;
};