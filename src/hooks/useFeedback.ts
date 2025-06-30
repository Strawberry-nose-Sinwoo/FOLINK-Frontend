import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postWithToken, getWithToken } from '@/api';

interface FeedbackData {
  content: string;
  strengths: string;
  overallImpression: string;
  improvementPoints: string;
  additionalAdvice: string;
}

export const useFeedback = () => {
  const [feedbackContent, setFeedbackContent] = useState<string>('');
  const [feedbackStrengths, setFeedbackStrengths] = useState<string>('');
  const [feedbackOverallImpression, setFeedbackOverallImpression] = useState<string>('');
  const [feedbackImprovementPoints, setFeedbackImprovementPoints] = useState<string>('');
  const [feedbackAdditionalAdvice, setFeedbackAdditionalAdvice] = useState<string>('');
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isFeedback, setIsFeedback] = useState<boolean>(false);

  const feedbackMutation = useMutation({
    mutationFn: async (conversationId: number | null) => {
      if (!conversationId) {
        setIsModal(false);
        return;
      }

      try {
        let response;
        try {
          response = await getWithToken(
            null, 
            `/conversations/${conversationId}/feedback`
          );
        } catch (error: any) {
          if (error.response?.status === 404 || error.response?.status === 400) {
            await postWithToken(
              null, 
              `/conversations/${conversationId}/feedback`,
            );
            response = await getWithToken(
              null,
              `/conversations/${conversationId}/feedback`
            );
          } else {
            console.error('예기치 않은 피드백 요청 에러:', error);
            setIsModal(false);
            throw error;
          }
        }

        const data: FeedbackData = response.data;
        setFeedbackContent(data.content);
        setFeedbackStrengths(data.strengths);
        setFeedbackOverallImpression(data.overallImpression);
        setFeedbackImprovementPoints(data.improvementPoints);
        setFeedbackAdditionalAdvice(data.additionalAdvice);
        setIsModal(true);
        setIsFeedback(true);
      } catch (error) {
        console.error('최종 피드백 처리 실패:', error);
        setIsModal(false);
        throw error;
      }
    },
  });

  return {
    feedbackContent, 
    feedbackStrengths, 
    feedbackOverallImpression,
    feedbackImprovementPoints, 
    feedbackAdditionalAdvice,
    isModal, 
    isLoadingFeedback: feedbackMutation.isPending,
    isFeedback, 
    setIsFeedback,
    setIsModal,
    handleFeedback: feedbackMutation.mutate,
  };
};