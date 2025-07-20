import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useChatStore } from '../store/chatStore';
import { chatAPI } from '../services/chatAPI';
import { MessageBubble } from '../components/MessageBubble';
import { MessageInput } from '../components/MessageInput';
import { DateSeparator } from '../components/DateSeparator';
import {
  shouldShowDateSeparator,
  shouldGroupMessage,
  getParticipantById,
} from '../utils/chatUtils';
import { TMessageJSON, TReaction } from '../../api-types';

interface ChatItem {
  type: 'message' | 'date';
  id: string;
  message?: TMessageJSON;
  timestamp?: number;
}

export const ChatScreen: React.FC = () => {
  const {
    messages,
    participants,
    sessionUuid,
    isLoadingMessages,
    isSendingMessage,
    setMessages,
    setParticipants,
    setSessionUuid,
    setLastMessageUpdateTime,
    setLastParticipantUpdateTime,
    addMessage,
    setLoadingMessages,
    setSendingMessage,
    clearData,
  } = useChatStore();

  const flatListRef = useRef<FlatList>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize chat data
  const initializeChat = useCallback(async () => {
    try {
      setLoadingMessages(true);
      
      // Get server info first
      const serverInfo = await chatAPI.getServerInfo();
      
      // Clear data if session changed
      if (sessionUuid && sessionUuid !== serverInfo.sessionUuid) {
        clearData();
      }
      
      setSessionUuid(serverInfo.sessionUuid);
      
      // Load initial data
      const [messagesData, participantsData] = await Promise.all([
        chatAPI.getLatestMessages(),
        chatAPI.getAllParticipants(),
      ]);
      
      setMessages(messagesData);
      setParticipants(participantsData);
      setLastMessageUpdateTime(Date.now());
      setLastParticipantUpdateTime(Date.now());
      
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      Alert.alert('Error', 'Failed to load chat data');
    } finally {
      setLoadingMessages(false);
    }
  }, [sessionUuid]);

  // Poll for updates
  const pollForUpdates = useCallback(async () => {
    try {
      const store = useChatStore.getState();
      const now = Date.now();
      
      const [messageUpdates, participantUpdates] = await Promise.all([
        chatAPI.getMessageUpdates(store.lastMessageUpdateTime),
        chatAPI.getParticipantUpdates(store.lastParticipantUpdateTime),
      ]);
      
      // Update messages
      messageUpdates.forEach(message => {
        const existingIndex = store.messages.findIndex(m => m.uuid === message.uuid);
        if (existingIndex >= 0) {
          store.updateMessage(message);
        } else {
          store.addMessage(message);
        }
      });
      
      // Update participants
      participantUpdates.forEach(participant => {
        const existingIndex = store.participants.findIndex(p => p.uuid === participant.uuid);
        if (existingIndex >= 0) {
          store.updateParticipant(participant);
        } else {
          store.setParticipants([...store.participants, participant]);
        }
      });
      
      if (messageUpdates.length > 0) {
        setLastMessageUpdateTime(now);
      }
      if (participantUpdates.length > 0) {
        setLastParticipantUpdateTime(now);
      }
      
    } catch (error) {
      console.error('Failed to poll for updates:', error);
    }
  }, []);

  // Send message
  const handleSendMessage = useCallback(async (text: string) => {
    try {
      setSendingMessage(true);
      const newMessage = await chatAPI.sendMessage(text);
      addMessage(newMessage);
      
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  }, []);

  // Handle reaction press (placeholder for future implementation)
  const handleReactionPress = useCallback((reactions: TReaction[]) => {
    // TODO: Show bottom sheet with reaction details
    console.log('Reactions pressed:', reactions);
  }, []);

  // Handle image press (placeholder for future implementation)
  const handleImagePress = useCallback((imageUrl: string) => {
    // TODO: Show image preview modal
    console.log('Image pressed:', imageUrl);
  }, []);

  // Prepare chat items with date separators
  const chatItems: ChatItem[] = React.useMemo(() => {
    const items: ChatItem[] = [];
    
    messages.forEach((message, index) => {
      const previousMessage = index > 0 ? messages[index - 1] : null;
      
      // Add date separator if needed
      if (shouldShowDateSeparator(message, previousMessage)) {
        items.push({
          type: 'date',
          id: `date-${message.sentAt}`,
          timestamp: message.sentAt,
        });
      }
      
      // Add message
      items.push({
        type: 'message',
        id: message.uuid,
        message,
      });
    });
    
    return items;
  }, [messages]);

  // Render chat item
  const renderChatItem: ListRenderItem<ChatItem> = useCallback(({ item, index }) => {
    if (item.type === 'date') {
      return <DateSeparator timestamp={item.timestamp!} />;
    }
    
    const message = item.message!;
    const author = getParticipantById(participants, message.authorUuid);
    const previousItem = index > 0 ? chatItems[index - 1] : null;
    const previousMessage = previousItem?.type === 'message' ? previousItem.message : null;
    const isGrouped = shouldGroupMessage(message, previousMessage ?? null);
    
    return (
      <MessageBubble
        message={message}
        author={author}
        isGrouped={isGrouped}
        onReactionPress={handleReactionPress}
        onImagePress={handleImagePress}
      />
    );
  }, [participants, chatItems, handleReactionPress, handleImagePress]);

  // Initialize on mount
  useEffect(() => {
    initializeChat();
    
    // Set up polling interval
    updateIntervalRef.current = setInterval(pollForUpdates, 5000);
    
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [initializeChat, pollForUpdates]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        <FlatList
          ref={flatListRef}
          data={chatItems}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingMessages}
              onRefresh={initializeChat}
            />
          }
          onContentSizeChange={() => {
            // Auto-scroll to bottom when new messages arrive
            if (chatItems.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
        />
        
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isSendingMessage}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
  },
});
