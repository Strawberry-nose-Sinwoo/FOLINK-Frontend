import { create } from 'zustand';

interface MessageStore {
  evaluatorFeedbackStates: Map<number, boolean>;
  toggleEvaluatorFeedback: (messageId: number) => void;
}

export const useMessageStore = create<MessageStore>(set => ({
  evaluatorFeedbackStates: new Map(),
  toggleEvaluatorFeedback: messageId =>
    set(state => {
      const newMap = new Map(state.evaluatorFeedbackStates);
      if (!newMap.has(messageId)) {
        newMap.set(messageId, true);
      } else {
        newMap.set(messageId, !newMap.get(messageId)!);
      }
      return { evaluatorFeedbackStates: newMap };
    }),
}));
