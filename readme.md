# Tribe Chat App

A cross-platform React Native chat application built with Expo, featuring real-time messaging, persistent storage, and a modern UI.

## Features

### Core Features 
- **Message List**: Display all chat messages in chronological order
- **Message Grouping**: Consecutive messages from the same participant are grouped together
- **Participant Info**: Each message shows avatar, name, and timestamp
- **Edited Messages**: Clear indication when messages have been edited
- **Reactions**: Display emoji reactions below messages
- **Image Attachments**: Support for image messages with preview
- **Message Input**: Bottom input bar for sending new messages
- **Date Separators**: Visual separators between messages from different days
- **Persistent Storage**: Messages and participants stored locally using Zustand + AsyncStorage
- **Real-time Updates**: Automatic polling for new messages and updates every 5 seconds
- **Pull to Refresh**: Refresh chat data by pulling down on the message list

### Technical Stack
- **React Native** with **Expo** for cross-platform development
- **TypeScript** for type safety
- **Zustand** for state management
- **AsyncStorage** for persistent local storage
- **Expo Image** for optimized image handling
- **React Native Safe Area Context** for proper screen handling

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   # or
   yarn start
   ```

3. **Run on Device/Simulator**
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## API Integration

The app connects to the mock chat server at:
```
https://dummy-chat-server.tribechat.com/api
```

### Available Endpoints:
- `GET /info` - Server session and API version
- `GET /messages/all` - All messages
- `GET /messages/latest` - Latest 25 messages
- `GET /messages/older/<uuid>` - 25 messages before reference message
- `GET /messages/updates/<time>` - Messages updated after timestamp
- `POST /messages/new` - Send new message
- `GET /participants/all` - All participants
- `GET /participants/updates/<time>` - Participants updated after timestamp

## Project Structure

```
src/
├── components/
│   ├── MessageBubble.tsx    # Message display component
│   ├── MessageInput.tsx     # Input bar for sending messages
│   └── DateSeparator.tsx    # Date separator component
├── screens/
│   └── ChatScreen.tsx       # Main chat screen
├── services/
│   └── chatAPI.ts          # API service layer
├── store/
│   └── chatStore.ts        # Zustand store with persistence
└── utils/
    └── chatUtils.ts        # Utility functions
```

## Key Features Explained

### Message Grouping
Messages from the same participant within 5 minutes are grouped together to reduce visual clutter.

### Persistent Storage
All messages and participants are stored locally using AsyncStorage, allowing the app to work offline and maintain state between sessions.

### Session Management
The app automatically detects server session changes and clears local data when needed to stay synchronized.

### Real-time Updates
The app polls for updates every 5 seconds to fetch new messages and participant changes without requiring manual refresh.

## Future Enhancements (Good to Have)

- **Infinite Scroll**: Load older messages as user scrolls up
- **Reaction Details**: Bottom sheet showing who reacted with what emoji
- **Participant Profiles**: Bottom sheet with participant details
- **Image Preview**: Full-screen image viewer modal
- **@Mentions**: Support for mentioning participants in messages
- **Optimized Re-rendering**: Further performance optimizations
- **Offline Support**: Enhanced offline functionality

## Development Notes

- The app uses your participant UUID as "you" for identifying own messages
- Message timestamps are handled in local timezone
- Images are displayed with proper aspect ratios
- The UI follows iOS design patterns but works on both platforms

## Troubleshooting

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **AsyncStorage issues**: Reset app data in device settings
3. **API connection issues**: Check network connectivity and API status

## Contributing

1. Follow TypeScript best practices
2. Use the existing component patterns
3. Test on both iOS and Android
4. Ensure proper error handling for API calls