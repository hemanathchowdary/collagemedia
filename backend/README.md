# CollageMedia Chat Backend

This is the backend server for the CollageMedia chat application, built with Express and Socket.io.

## Features

- Real-time messaging using Socket.io
- Support for private messaging between users
- Chat rooms with multiple participants
- Typing indicators
- User online/offline status
- Message history for both private chats and rooms

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or pnpm

### Installation

1. Install dependencies:

```bash
pnpm install
```

### Running the Server

Start the development server:

```bash
pnpm dev
```

The server will run on http://localhost:4000 by default.

For production:

```bash
pnpm start
```

## Socket.io Events

### Server Events (Emitted by the server)

- `connect` - Socket connection established
- `disconnect` - Socket disconnected
- `rooms:list` - List of available chat rooms
- `rooms:new` - New room created
- `rooms:update` - Room information updated
- `room:history` - Chat history for a specific room
- `room:message:new` - New message in a room
- `room:user:joined` - User joined a room
- `room:user:left` - User left a room
- `message:private` - Receive a private message
- `message:private:sent` - Private message sent confirmation
- `user:typing` - User is typing in a room
- `user:typing:private` - User is typing in private chat
- `user:status:update` - User status changed
- `user:offline` - User went offline

### Client Events (Emitted by the client)

- `user:login` - User logs in
- `message:private` - Send a private message
- `room:join` - Join a chat room
- `room:leave` - Leave a chat room
- `room:message` - Send a message to a room
- `room:create` - Create a new chat room
- `user:typing` - Send typing status in a room
- `user:typing:private` - Send typing status in private chat
- `user:status` - Set user status

## Environment Variables

- `PORT` - Server port (default: 4000)
- `CLIENT_URL` - Client URL for CORS (default: http://localhost:3000)

## Integration with Frontend

The frontend can connect to this server using the Socket.io client:

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');
``` 