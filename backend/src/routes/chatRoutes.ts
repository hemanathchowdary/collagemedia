import express from 'express';
import {
  getUserChats,
  getChatById,
  createOrGetChat,
  sendMessage,
  markChatAsRead,
} from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Get all chats for the logged-in user
router.get('/', getUserChats);

// Get a specific chat by ID
router.get('/:id', getChatById);

// Create a new chat or get existing one
router.post('/', createOrGetChat);

// Send a message in a chat
router.post('/:id/messages', sendMessage);

// Mark all messages in a chat as read
router.put('/:id/read', markChatAsRead);

export default router; 