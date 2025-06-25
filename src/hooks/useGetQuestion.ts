import { useQuery } from '@tanstack/react-query';
import { getWithToken } from '@/api';

interface QuestionSetResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    originalText: string;
    projectQuestions: {
      id: number;
      projectName: string;
      question: string;
      purpose: string;
      conversationId: number;
    }[];
    techStackQuestions: {
      id: number;
      stackName: string;
      question: string;
      purpose: string;
      conversationId: number;
    }[];
  };
}

export const useGetQuestion = (questionSetId: string | undefined) => {
  return useQuery<QuestionSetResponse>({
    queryKey: ['questionSet', questionSetId], 
    queryFn: async () => {
      if (!questionSetId) {
        throw new Error('질문 세트 ID가 없습니다.');
      }
      const response = await getWithToken(
        null,
        `/question-sets/${questionSetId}`
      );
      return response;
    },
    enabled: !!questionSetId, 
  });
};
