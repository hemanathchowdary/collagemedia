// User types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  major?: string
  year?: string
  bio?: string
  courses?: string[]
  interests?: string[]
}

// Chat types
export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  updatedAt: Date
}

// Course types
export interface Course {
  id: string
  title: string
  code: string
  instructor: string
  schedule: string
  description?: string
  materials: CourseMaterial[]
  students: string[]
}

export interface CourseMaterial {
  id: string
  title: string
  type: "document" | "video" | "assignment"
  url: string
  uploadedAt: Date
}

// Chatroom types
export interface Chatroom {
  id: string
  name: string
  description: string
  category: "academic" | "campus" | "interests"
  members: string[]
  messages: ChatroomMessage[]
}

export interface ChatroomMessage {
  id: string
  senderId: string
  content: string
  timestamp: Date
}

