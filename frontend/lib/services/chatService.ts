import api from '../api';
import { User } from './authService';

export interface Message {
  _id: string;
  sender: User | string;
  content: string;
  timestamp: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  participants: User[] | string[];
  messages: Message[] | string[];
  lastMessage?: Message | string;
  createdAt: string;
  updatedAt: string;
}

interface ChatResponse {
  success: boolean;
  data: Chat;
}

interface ChatsResponse {
  success: boolean;
  data: Chat[];
}

interface MessageResponse {
  success: boolean;
  data: Message;
}

/**
 * Chat service for managing chats and messages
 */
class ChatService {
  /**
   * Get all chats for the current user
   */
  async getChats(): Promise<Chat[]> {
    const response = await api.get<ChatsResponse>('/chats');
    
    if (response.success) {
      return response.data;
    }
    
    return [];
  }

  /**
   * Get a specific chat by ID with messages
   */
  async getChat(chatId: string): Promise<Chat> {
    const response = await api.get<ChatResponse>(`/chats/${chatId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to get chat');
  }

  /**
   * Create a new chat or get an existing one with a user
   */
  async createOrGetChat(userId: string): Promise<Chat> {
    const response = await api.post<ChatResponse>('/chats', { userId });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to create chat');
  }

  /**
   * Send a message in a chat
   */
  async sendMessage(chatId: string, content: string): Promise<Message> {
    const response = await api.post<MessageResponse>(`/chats/${chatId}/messages`, { content });
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to send message');
  }

  /**
   * Mark all messages in a chat as read
   */
  async markChatAsRead(chatId: string): Promise<void> {
    await api.put<{ success: boolean }>(`/chats/${chatId}/read`, {});
  }
}

// Export a singleton instance
const chatService = new ChatService();
export default chatService; 