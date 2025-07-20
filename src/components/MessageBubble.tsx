import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { TMessageJSON, TParticipant, TReaction } from '../../api-types';
import { formatTime, getParticipantById, isMessageEdited } from '../utils/chatUtils';

interface MessageBubbleProps {
  message: TMessageJSON;
  author: TParticipant | null;
  isGrouped: boolean;
  onReactionPress?: (reactions: TReaction[]) => void;
  onImagePress?: (imageUrl: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  author,
  isGrouped,
  onReactionPress,
  onImagePress,
}) => {
  const isOwnMessage = message.authorUuid === 'you';

  return (
    <View style={[styles.messageContainer, isOwnMessage && styles.ownMessageContainer]}>
      {!isGrouped && (
        <View style={styles.messageHeader}>
          <View style={styles.authorInfo}>
            {author?.avatarUrl ? (
              <Image source={{ uri: author.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.defaultAvatar]}>
                <Text style={styles.avatarText}>
                  {author?.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
            <Text style={styles.authorName}>{author?.name || 'Unknown'}</Text>
          </View>
          <Text style={styles.timestamp}>{formatTime(message.sentAt)}</Text>
        </View>
      )}

      <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
        {message.replyToMessage && (
          <View style={styles.replyContainer}>
            <View style={styles.replyBar} />
            <View style={styles.replyContent}>
              <Text style={styles.replyText} numberOfLines={2}>
                {message.replyToMessage.text}
              </Text>
            </View>
          </View>
        )}

        <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
          {message.text}
        </Text>

        {isMessageEdited(message) && (
          <Text style={styles.editedText}>edited</Text>
        )}

        {message.attachments.map((attachment) => (
          <TouchableOpacity
            key={attachment.uuid}
            onPress={() => onImagePress?.(attachment.url)}
            style={styles.imageContainer}
          >
            <Image
              source={{ uri: attachment.url }}
              style={[
                styles.messageImage,
                {
                  aspectRatio: attachment.width / attachment.height,
                },
              ]}
              contentFit="cover"
            />
          </TouchableOpacity>
        ))}
      </View>

      {message.reactions.length > 0 && (
        <TouchableOpacity
          style={styles.reactionsContainer}
          onPress={() => onReactionPress?.(message.reactions)}
        >
          <ReactionRow reactions={message.reactions} />
        </TouchableOpacity>
      )}
    </View>
  );
};

interface ReactionRowProps {
  reactions: TReaction[];
}

const ReactionRow: React.FC<ReactionRowProps> = ({ reactions }) => {
  // Group reactions by value
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.value]) {
      acc[reaction.value] = [];
    }
    acc[reaction.value].push(reaction);
    return acc;
  }, {} as Record<string, TReaction[]>);

  return (
    <View style={styles.reactionRow}>
      {Object.entries(groupedReactions).map(([emoji, reactionList]) => (
        <View key={emoji} style={styles.reactionBubble}>
          <Text style={styles.reactionEmoji}>{emoji}</Text>
          <Text style={styles.reactionCount}>{reactionList.length}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 2,
    paddingHorizontal: 16,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  defaultAvatar: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  messageBubble: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  ownMessageBubble: {
    backgroundColor: '#007AFF',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  editedText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  replyContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  replyBar: {
    width: 3,
    backgroundColor: '#007AFF',
    borderRadius: 1.5,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  imageContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    maxHeight: 300,
    borderRadius: 8,
  },
  reactionsContainer: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  reactionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
