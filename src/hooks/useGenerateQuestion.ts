import { postWithToken } from '@/api';
import { PostType } from '@/types';
import { useMutation } from '@tanstack/react-query';

export const useGenerateQuestion = () => {
  return useMutation({
    mutationFn: async (data: PostType) => {
      const response = await postWithToken(
        null,
        '/question-sets/generate-by-text',
        data
      );
      return response;
    },
  });
}