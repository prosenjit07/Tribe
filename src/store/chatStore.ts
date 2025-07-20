import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TMessageJSON, TParticipant } from '../../api-types';

interface ChatState {
  // Data
  messages: TMessageJSON[];
  participants: TParticipant[];
  sessionUuid: string | null;
  lastMessageUpdateTime: number;
  lastParticipantUpdateTime: number;
  
  // Loading states
  isLoadingMessages: boolean;
  isLoadingParticipants: boolean;
  isSendingMessage: boolean;
  
  // Actions
  setMessages: (messages: TMessageJSON[]) => void;
  addMessage: (message: TMessageJSON) => void;
  updateMessage: (message: TMessageJSON) => void;
  setParticipants: (participants: TParticipant[]) => void;
  updateParticipant: (participant: TParticipant) => void;
  setSessionUuid: (uuid: string) => void;
  setLastMessageUpdateTime: (time: number) => void;
  setLastParticipantUpdateTime: (time: number) => void;
  setLoadingMessages: (loading: boolean) => void;
  setLoadingParticipants: (loading: boolean) => void;
  setSendingMessage: (sending: boolean) => void;
  clearData: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [],
      participants: [],
      sessionUuid: null,
      lastMessageUpdateTime: 0,
      lastParticipantUpdateTime: 0,
      isLoadingMessages: false,
      isLoadingParticipants: false,
      isSendingMessage: false,

      // Actions
      setMessages: (messages) => set({ messages }),
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message].sort((a, b) => a.sentAt - b.sentAt)
      })),
      
      updateMessage: (updatedMessage) => set((state) => ({
        messages: state.messages.map(msg => 
          msg.uuid === updatedMessage.uuid ? updatedMessage : msg
        )
      })),
      
      setParticipants: (participants) => set({ participants }),
      
      updateParticipant: (updatedParticipant) => set((state) => ({
        participants: state.participants.map(p => 
          p.uuid === updatedParticipant.uuid ? updatedParticipant : p
        )
      })),
      
      setSessionUuid: (uuid) => set({ sessionUuid: uuid }),
      setLastMessageUpdateTime: (time) => set({ lastMessageUpdateTime: time }),
      setLastParticipantUpdateTime: (time) => set({ lastParticipantUpdateTime: time }),
      setLoadingMessages: (loading) => set({ isLoadingMessages: loading }),
      setLoadingParticipants: (loading) => set({ isLoadingParticipants: loading }),
      setSendingMessage: (sending) => set({ isSendingMessage: sending }),
      
      clearData: () => set({
        messages: [],
        participants: [],
        sessionUuid: null,
        lastMessageUpdateTime: 0,
        lastParticipantUpdateTime: 0,
      }),
    }),
    {
      name: 'tribe-chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        messages: state.messages,
        participants: state.participants,
        sessionUuid: state.sessionUuid,
        lastMessageUpdateTime: state.lastMessageUpdateTime,
        lastParticipantUpdateTime: state.lastParticipantUpdateTime,
      }),
    }
  )
);
