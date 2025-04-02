import api from '../api';
import { User } from './authService';

export interface Course {
  _id: string;
  title: string;
  code: string;
  instructor: User | string;
  schedule: string;
  description?: string;
  materials: number;
  students: User[] | string[];
  semester: 'current' | 'past' | 'upcoming';
  createdAt: string;
  updatedAt: string;
}

interface CourseResponse {
  success: boolean;
  data: Course;
}

interface CoursesResponse {
  success: boolean;
  data: Course[];
}

/**
 * Course service for course management
 */
class CourseService {
  /**
   * Get all courses (filtered by semester if provided)
   */
  async getCourses(semester?: 'current' | 'past' | 'upcoming'): Promise<Course[]> {
    const endpoint = semester ? `/courses?semester=${semester}` : '/courses';
    const response = await api.get<CoursesResponse>(endpoint);
    
    if (response.success) {
      return response.data;
    }
    
    return [];
  }

  /**
   * Get a specific course by ID
   */
  async getCourse(courseId: string): Promise<Course> {
    const response = await api.get<CourseResponse>(`/courses/${courseId}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to get course');
  }

  /**
   * Create a new course (instructor/admin only)
   */
  async createCourse(courseData: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const response = await api.post<CourseResponse>('/courses', courseData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to create course');
  }

  /**
   * Update a course (instructor/admin only)
   */
  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course> {
    const response = await api.put<CourseResponse>(`/courses/${courseId}`, courseData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to update course');
  }

  /**
   * Delete a course (instructor/admin only)
   */
  async deleteCourse(courseId: string): Promise<void> {
    await api.delete<{ success: boolean }>(`/courses/${courseId}`);
  }
}

// Export a singleton instance
const courseService = new CourseService();
export default courseService; 