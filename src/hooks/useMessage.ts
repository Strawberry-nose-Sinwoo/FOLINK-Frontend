import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getWithToken, postWithToken } from '@/api';
import { MessageType, PostType } from '@/types';

const sendMessage = async (conversationId: string, message: string) => {
  const data: PostType = { userResponse: message };
  const response = await postWithToken(
    null,
    `/conversations/${conversationId}/messages`,
    data
  );
  return response.data;
};

const fetchMessages = async (conversationId: string) => {
  const response = await getWithToken(
    null,
    `/conversations/${conversationId}/messages`
  );
  return response.data.messages;
};

export const useMessage = (conversationId: string) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentTypingId, setCurrentTypingId] = useState<null | number>(null);

  console.log(messages)

  const {
    data: serverMessages,
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: conversationId !== 'default',
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (serverMessages && Array.isArray(serverMessages)) {
      setMessages(
        serverMessages.map((msg: any) => ({
          id: msg.id,
          userResponse: msg.content,
          isUser: msg.type === 'user',
          isTyping: false,
          evaluatorFeedback: msg.evaluatorFeedback || null,
          createdAt: msg.created_at,
        }))
      );
    }
  }, [serverMessages]);

  useEffect(() => {
    if (currentTypingId === null) {
      const nextTypingMessage = messages.find(
        msg => !msg.isUser && msg.isTyping
      );
      if (nextTypingMessage) {
        setCurrentTypingId(nextTypingMessage.id);
        setTimeout(() => {
          handleEndTyping(nextTypingMessage.id);
        }, 2000);
      }
    }
  }, [messages, currentTypingId]);

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => sendMessage(conversationId, message),
    onMutate: message => {
      const messageId = Date.now();
      setMessages(prev => [
        ...prev,
        {
          id: messageId,
          userResponse: message,
          isUser: true,
          isTyping: false,
          evaluatorFeedback: null,
          createdAt: new Date().toISOString(),
        },
        {
          id: messageId + 1,
          userResponse: '답변을 준비 중입니다..',
          isUser: false,
          isTyping: true,
          evaluatorFeedback: null,
          createdAt: new Date().toISOString(),
        },
      ]);
      setCurrentTypingId(messageId + 1);
      return { messageId };
    },
    onSuccess: response => {
      const aiMessage = response.messages.find((msg: any) => msg.type === 'ai');
      if (aiMessage) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === currentTypingId
              ? {
                  id: aiMessage.id,
                  userResponse: aiMessage.content,
                  isUser: false,
                  isTyping: true,
                  evaluatorFeedback: aiMessage.evaluatorFeedback || null,
                  createdAt: aiMessage.created_at,
                }
              : msg
          )
        );
      }
    },
    onError: error => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === currentTypingId
            ? { ...msg, userResponse: `${error}`, isTyping: false }
            : msg
        )
      );
      setCurrentTypingId(null);
    },
  });

  const handleSendMessage = (message: string) => {
    if (message.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleEndTyping = (id: number) => {
    setMessages(prev =>
      prev.map(msg => (msg.id === id ? { ...msg, isTyping: false } : msg))
    );
    setCurrentTypingId(null);
  };

  return {
    messages,
    currentTypingId,
    handleSendMessage,
    handleEndTyping,
    messagesLoading,
    messagesError,
    isSubmitting: sendMessageMutation.isPending,
  };
};
