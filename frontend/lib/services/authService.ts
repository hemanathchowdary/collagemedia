import api from '../api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'instructor' | 'admin';
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  token: string;
}

interface AuthResponse {
  success: boolean;
  data: User;
}

/**
 * Authentication service for login, signup, and profile management
 */
class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post<AuthResponse>('/users/login', credentials, false);
    
    if (response.success && response.data) {
      // Store token for future authenticated requests
      api.setToken(response.data.token);
      return response.data;
    }
    
    throw new Error('Login failed');
  }

  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<User> {
    const response = await api.post<AuthResponse>('/users', credentials, false);
    
    if (response.success && response.data) {
      // Store token for future authenticated requests
      api.setToken(response.data.token);
      return response.data;
    }
    
    throw new Error('Registration failed');
  }

  /**
   * Logout the current user
   */
  logout(): void {
    api.clearToken();
  }

  /**
   * Get the current user's profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<AuthResponse>('/users/profile');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to get user profile');
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put<AuthResponse>('/users/profile', userData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to update profile');
  }
}

// Export a singleton instance
const authService = new AuthService();
export default authService; 