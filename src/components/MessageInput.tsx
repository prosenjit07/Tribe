import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading = false,
}) => {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!text.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!text.trim() || isLoading}
          >
            <Ionicons
              name="send"
              size={20}
              color={text.trim() && !isLoading ? 'white' : '#999'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});
