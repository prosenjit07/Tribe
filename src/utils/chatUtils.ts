import { TMessageJSON, TParticipant } from '../../api-types';

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

export const shouldShowDateSeparator = (
  currentMessage: TMessageJSON,
  previousMessage: TMessageJSON | null
): boolean => {
  if (!previousMessage) return true;
  
  const currentDate = new Date(currentMessage.sentAt).toDateString();
  const previousDate = new Date(previousMessage.sentAt).toDateString();
  
  return currentDate !== previousDate;
};

export const shouldGroupMessage = (
  currentMessage: TMessageJSON,
  previousMessage: TMessageJSON | null
): boolean => {
  if (!previousMessage) return false;
  
  // Don't group if different authors
  if (currentMessage.authorUuid !== previousMessage.authorUuid) return false;
  
  // Don't group if more than 5 minutes apart
  const timeDiff = currentMessage.sentAt - previousMessage.sentAt;
  if (timeDiff > 5 * 60 * 1000) return false;
  
  // Don't group if different days
  const currentDate = new Date(currentMessage.sentAt).toDateString();
  const previousDate = new Date(previousMessage.sentAt).toDateString();
  if (currentDate !== previousDate) return false;
  
  return true;
};

export const getParticipantById = (
  participants: TParticipant[],
  uuid: string
): TParticipant | null => {
  return participants.find(p => p.uuid === uuid) || null;
};

export const isMessageEdited = (message: TMessageJSON): boolean => {
  return message.updatedAt > message.sentAt;
};
