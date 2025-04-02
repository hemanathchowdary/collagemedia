import express from 'express';
import { protect, instructor } from '../middleware/authMiddleware';

const router = express.Router();

// TODO: Add course controller functions
router.get('/', protect, (req, res) => {
  res.json({ message: 'Get all courses' });
});

router.get('/:id', protect, (req, res) => {
  res.json({ message: 'Get course by ID' });
});

router.post('/', protect, instructor, (req, res) => {
  res.json({ message: 'Create course' });
});

router.put('/:id', protect, instructor, (req, res) => {
  res.json({ message: 'Update course' });
});

router.delete('/:id', protect, instructor, (req, res) => {
  res.json({ message: 'Delete course' });
});

export default router; 