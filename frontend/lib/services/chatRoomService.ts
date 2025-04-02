import api from '../api';
import { User } from './authService';
import { Message } from './chatService';

export interface ChatRoom {
  _id: string;
  name: string;
  description: string;
  courseId?: string;
  members: User[] | string[];
  messages: Message[] | string[];
  createdAt: string;
  updatedAt: string;
}

interface ChatRoomResponse {
  success: boolean;
  data: ChatRoom;
}

interface ChatRoomsResponse {
  success: boolean;
  data: ChatRoom[];
}

interface MessageResponse {
  success: boolean;
  data: Message;
}

/**
 * ChatRoom service for managing chat rooms
 */
class ChatRoomService {
  /**
   * Get all chat rooms
   */
  async getChatRooms(): Promise<ChatRoom[]> {
    const response = await api.get<ChatRoomsResponse>('/chatrooms');
    
    if (response.success) {
      return response.data;
    }
    
    return [];
  }

  /**
   * Get a specific chat room by ID
   */
  async getChatRoom(chatRoomId: string): Promise<ChatRoom> {
    const response = await api.get<ChatRoomResponse>(`/chatrooms/${chatRoomId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to get chat room');
  }

  /**
   * Create a new chat room
   */
  async createChatRoom(chatRoomData: { name: string; description: string; courseId?: string }): Promise<ChatRoom> {
    const response = await api.post<ChatRoomResponse>('/chatrooms', chatRoomData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to create chat room');
  }

  /**
   * Join a chat room
   */
  async joinChatRoom(chatRoomId: string): Promise<ChatRoom> {
    const response = await api.post<ChatRoomResponse>(`/chatrooms/${chatRoomId}/join`, {});
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to join chat room');
  }

  /**
   * Leave a chat room
   */
  async leaveChatRoom(chatRoomId: string): Promise<ChatRoom> {
    const response = await api.post<ChatRoomResponse>(`/chatrooms/${chatRoomId}/leave`, {});
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to leave chat room');
  }

  /**
   * Send a message in a chat room
   */
  async sendMessage(chatRoomId: string, content: string): Promise<Message> {
    const response = await api.post<MessageResponse>(`/chatrooms/${chatRoomId}/messages`, { content });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to send message');
  }

  /**
   * Delete a chat room (admin only)
   */
  async deleteChatRoom(chatRoomId: string): Promise<void> {
    await api.delete<{ success: boolean }>(`/chatrooms/${chatRoomId}`);
  }
}

// Export a singleton instance
const chatRoomService = new ChatRoomService();
export default chatRoomService; 