"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Define the types for our socket events
export type User = {
  userId: string;
  username: string;
  avatar: string;
  status?: 'online' | 'offline' | 'away';
};

export type ChatRoom = {
  id: number;
  name: string;
  description?: string;
  category: 'academic' | 'campus' | 'interests';
  usersCount: number;
};

export type ChatMessage = {
  id: number;
  sender: string;
  userId?: string;
  avatar: string;
  content: string;
  timestamp: string;
};

export type PrivateMessage = {
  from?: string;
  to?: string;
  sender?: string;
  avatar?: string;
  content: string;
  timestamp: string;
};

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<number | null>(null);
  const [roomMessages, setRoomMessages] = useState<Record<number, ChatMessage[]>>({});
  const [privateMessages, setPrivateMessages] = useState<Record<string, PrivateMessage[]>>({});
  const [typingUsers, setTypingUsers] = useState<Record<number, { userId: string; username: string }[]>>({});
  const [privateTypingUsers, setPrivateTypingUsers] = useState<Record<string, boolean>>({});
  
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    // Clean up the socket on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Room list event handler
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleRoomsList = (roomsList: ChatRoom[]) => {
      setRooms(roomsList);
    };

    socket.on('rooms:list', handleRoomsList);

    return () => {
      socket.off('rooms:list', handleRoomsList);
    };
  }, []);

  // New room event handler
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleNewRoom = (room: ChatRoom) => {
      setRooms(prevRooms => [...prevRooms, room]);
    };

    socket.on('rooms:new', handleNewRoom);

    return () => {
      socket.off('rooms:new', handleNewRoom);
    };
  }, []);

  // Room update handler
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleRoomUpdate = ({ id, usersCount }: { id: number; usersCount: number }) => {
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === id ? { ...room, usersCount } : room
        )
      );
    };

    socket.on('rooms:update', handleRoomUpdate);

    return () => {
      socket.off('rooms:update', handleRoomUpdate);
    };
  }, []);

  // Room history handler
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleRoomHistory = ({ roomId, messages }: { roomId: number; messages: ChatMessage[] }) => {
      setRoomMessages(prev => ({
        ...prev,
        [roomId]: messages
      }));
    };

    socket.on('room:history', handleRoomHistory);

    return () => {
      socket.off('room:history', handleRoomHistory);
    };
  }, []);

  // New room message handler
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleNewMessage = ({ roomId, message }: { roomId: number; message: ChatMessage }) => {
      setRoomMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), message]
      }));
    };

    socket.on('room:message:new', handleNewMessage);

    return () => {
      socket.off('room:message:new', handleNewMessage);
    };
  }, []);

  // Private message handler
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handlePrivateMessage = (message: PrivateMessage & { from: string }) => {
      const { from } = message;
      setPrivateMessages(prev => ({
        ...prev,
        [from]: [...(prev[from] || []), message]
      }));
    };

    socket.on('message:private', handlePrivateMessage);

    return () => {
      socket.off('message:private', handlePrivateMessage);
    };
  }, []);

  // Private message sent confirmation
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handlePrivateMessageSent = (message: PrivateMessage & { to: string }) => {
      const { to } = message;
      setPrivateMessages(prev => ({
        ...prev,
        [to]: [...(prev[to] || []), message]
      }));
    };

    socket.on('message:private:sent', handlePrivateMessageSent);

    return () => {
      socket.off('message:private:sent', handlePrivateMessageSent);
    };
  }, []);

  // User typing in room handler
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleUserTyping = ({ roomId, userId, username, isTyping }: { 
      roomId: number; 
      userId: string; 
      username: string; 
      isTyping: boolean 
    }) => {
      if (isTyping) {
        setTypingUsers(prev => {
          const currentTyping = prev[roomId] || [];
          if (!currentTyping.some(user => user.userId === userId)) {
            return {
              ...prev,
              [roomId]: [...currentTyping, { userId, username }]
            };
          }
          return prev;
        });
      } else {
        setTypingUsers(prev => {
          const currentTyping = prev[roomId] || [];
          return {
            ...prev,
            [roomId]: currentTyping.filter(user => user.userId !== userId)
          };
        });
      }
    };

    socket.on('user:typing', handleUserTyping);

    return () => {
      socket.off('user:typing', handleUserTyping);
    };
  }, []);

  // User typing in private chat handler
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handlePrivateTyping = ({ from, isTyping }: { from: string; isTyping: boolean }) => {
      setPrivateTypingUsers(prev => ({
        ...prev,
        [from]: isTyping
      }));
    };

    socket.on('user:typing:private', handlePrivateTyping);

    return () => {
      socket.off('user:typing:private', handlePrivateTyping);
    };
  }, []);

  // Login user with token support
  const login = useCallback((userId: string, username: string, avatar: string, token?: string) => {
    const socket = socketRef.current;
    if (!socket) return;
    
    socket.emit('user:login', { userId, username, avatar, token });
  }, []);

  // Join a chat room
  const joinRoom = useCallback((roomId: number) => {
    const socket = socketRef.current;
    if (!socket) return;
    
    socket.emit('room:join', { roomId });
    setActiveRoom(roomId);
  }, []);

  // Leave a chat room
  const leaveRoom = useCallback((roomId: number) => {
    const socket = socketRef.current;
    if (!socket) return;
    
    socket.emit('room:leave', { roomId });
    if (activeRoom === roomId) {
      setActiveRoom(null);
    }
  }, [activeRoom]);

  // Send message to a room
  const sendRoomMessage = useCallback((roomId: number, message: string) => {
    const socket = socketRef.current;
    if (!socket || !message.trim()) return;
    
    socket.emit('room:message', { roomId, message });
  }, []);

  // Send private message
  const sendPrivateMessage = useCallback((to: string, message: string) => {
    const socket = socketRef.current;
    if (!socket || !message.trim()) return;
    
    socket.emit('message:private', { to, message });
  }, []);

  // Create a new room
  const createRoom = useCallback((name: string, description: string, category: 'academic' | 'campus' | 'interests') => {
    const socket = socketRef.current;
    if (!socket) return;
    
    socket.emit('room:create', { name, description, category });
  }, []);

  // Send typing status in a room
  const sendTypingStatus = useCallback((roomId: number, isTyping: boolean) => {
    const socket = socketRef.current;
    if (!socket) return;
    
    socket.emit('user:typing', { roomId, isTyping });
  }, []);

  // Send typing status in private chat
  const sendPrivateTypingStatus = useCallback((to: string, isTyping: boolean) => {
    const socket = socketRef.current;
    if (!socket) return;
    
    socket.emit('user:typing:private', { to, isTyping });
  }, []);

  // Set user status
  const setUserStatus = useCallback((status: 'online' | 'offline' | 'away') => {
    const socket = socketRef.current;
    if (!socket) return;
    
    socket.emit('user:status', { status });
  }, []);

  return {
    isConnected,
    rooms,
    activeRoom,
    roomMessages,
    privateMessages,
    typingUsers,
    privateTypingUsers,
    login,
    joinRoom,
    leaveRoom,
    sendRoomMessage,
    sendPrivateMessage,
    createRoom,
    sendTypingStatus,
    sendPrivateTypingStatus,
    setUserStatus,
    socket: socketRef.current
  };
} 