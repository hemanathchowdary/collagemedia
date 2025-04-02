import express from 'express';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// TODO: Add chat room controller functions
router.get('/', protect, (req, res) => {
  res.json({ message: 'Get all chat rooms' });
});

router.get('/:id', protect, (req, res) => {
  res.json({ message: 'Get chat room by ID' });
});

router.post('/', protect, (req, res) => {
  res.json({ message: 'Create chat room' });
});

router.put('/:id', protect, (req, res) => {
  res.json({ message: 'Update chat room' });
});

router.delete('/:id', protect, (req, res) => {
  res.json({ message: 'Delete chat room' });
});

export default router; 