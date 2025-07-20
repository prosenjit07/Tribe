import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatDate } from '../utils/chatUtils';

interface DateSeparatorProps {
  timestamp: number;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ timestamp }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.dateText}>{formatDate(timestamp)}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    fontWeight: '500',
  },
});
