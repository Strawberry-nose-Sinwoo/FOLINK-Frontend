export type MessageType = {
  id: number;
  userResponse: string;
  isUser: boolean;
  isTyping?: boolean;
  evaluatorFeedback?: string | null;
  createdAt?: string; 
};