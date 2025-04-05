import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getChatRooms,
  getChatRoom,
  createChatRoom,
  sendMessage,
  addMember,
} from '../controllers/chatRoomController';

const router = express.Router();

// TODO: Add chat room controller functions
router.get('/', protect, getChatRooms);
router.get('/:id', protect, getChatRoom);
router.post('/', protect, createChatRoom);
router.post('/:id/messages', protect, sendMessage);
router.post('/:id/members', protect, addMember);

router.put('/:id', protect, (req, res) => {
  res.json({ message: 'Update chat room' });
});

router.delete('/:id', protect, (req, res) => {
  res.json({ message: 'Delete chat room' });
});

export default router; 