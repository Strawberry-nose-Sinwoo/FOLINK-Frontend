export type MessageType = {
    id: number;
    text: string;
    isUser: boolean;
    isTyping?: boolean;
};