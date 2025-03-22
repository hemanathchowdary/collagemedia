# CollageMedia Chat Application

A real-time chat application built with Next.js and Socket.io.

## Features

- Real-time one-on-one private messaging
- Group chat rooms
- Typing indicators
- User online/offline status
- Message history
- Create custom chat rooms

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Socket.io Client
- **Backend**: Express, Socket.io
- **Styling**: Tailwind CSS with Shadcn UI components

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- pnpm (or npm/yarn)

### Environment Setup

Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### Installation

1. Install frontend dependencies:

```bash
pnpm install
```

2. Install backend dependencies:

```bash
cd backend
pnpm install
```

### Running the Application

1. Start the backend server:

```bash
cd backend
pnpm dev
```

The server will run on http://localhost:4000.

2. In a new terminal, start the Next.js frontend:

```bash
pnpm dev
```

The application will be available at http://localhost:3000.

## Project Structure

- `/app` - Next.js application pages and routes
- `/components` - Reusable React components
- `/hooks` - Custom React hooks including Socket.io integration
- `/backend` - Express and Socket.io server
  - `/src` - Backend source code

## Communication Flow

1. Frontend connects to the Socket.io server using the `useSocket` hook
2. Users can send private messages or join chat rooms
3. The backend handles message routing and storage
4. Real-time updates are pushed to connected clients

## Socket.io Events

See the backend README for a complete list of Socket.io events. 