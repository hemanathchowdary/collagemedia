import express from 'express';
import { protect, instructor } from '../middleware/authMiddleware';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';

const router = express.Router();

router.get('/', protect, getCourses);
router.get('/:id', protect, getCourse);
router.post('/', protect, instructor, createCourse);
router.put('/:id', protect, instructor, updateCourse);
router.delete('/:id', protect, instructor, deleteCourse);

export default router; 