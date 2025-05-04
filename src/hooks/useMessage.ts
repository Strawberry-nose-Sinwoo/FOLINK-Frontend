import { useEffect, useState } from 'react';
import { MessageType } from '@/types';

export const useMessage = () => {
    const [message, setMessages] = useState<MessageType[]>([]); // 메시지 상태
    const [currentTypingId, setCurrentTypingId] = useState<null | number>(null); // 현재 타이핑 중인 메시지의 id

    useEffect(() => {
        if (currentTypingId === null) {
            const nextTypingMessage = message.find(
                (msg) => !msg.isUser && msg.isTyping
            );
            if (nextTypingMessage) {
                setCurrentTypingId(nextTypingMessage.id);
            }
        }
    }, [message, currentTypingId]);

    const handleSendMessage = (message: string) => {
        const MessageId = Date.now(); // 메시지의 고유한 id 생성
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: message, isUser: true, isTyping: false, id: MessageId },
            {
                text: `현재 당신이 보낸 메시지는 "${message}"입니다.`,
                isUser: false,
                isTyping: true, 
                id: MessageId + 1,
            },
        ]);
    };

    const handleEndTyping = (id: number) => {
        setMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === id ? { ...msg, isTyping: false } : msg
            )
        );
        setCurrentTypingId(null); // 타이핑 종료 후 id 초기화
    }
    
    return {
        message,
        currentTypingId,
        handleSendMessage,
        handleEndTyping,
    };
};