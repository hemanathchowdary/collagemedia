import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ChatRoom from '../models/ChatRoom';
import Course from '../models/Course';

// Extended Request interface to include the user object
interface AuthRequest extends Request {
  user?: any;
}

/**
 * @desc    Get all chat rooms
 * @route   GET /api/chatrooms
 * @access  Private
 */
export const getChatRooms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
      return;
    }

    const chatRooms = await ChatRoom.find({
      members: { $in: [req.user._id] },
    })
      .populate('members', 'name email')
      .populate('courseId', 'title code')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: chatRooms.length,
      data: chatRooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error',
    });
  }
};

/**
 * @desc    Get single chat room
 * @route   GET /api/chatrooms/:id
 * @access  Private
 */
export const getChatRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
      return;
    }

    const chatRoom = await ChatRoom.findById(req.params.id)
      .populate('members', 'name email')
      .populate('courseId', 'title code')
      .populate('messages.sender', 'name email');

    if (!chatRoom) {
      res.status(404).json({
        success: false,
        error: 'Chat room not found',
      });
      return;
    }

    // Check if user is a member of the chat room
    if (!chatRoom.members.some(member => member._id.toString() === req.user._id.toString())) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to access this chat room',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: chatRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error',
    });
  }
};

/**
 * @desc    Create chat room
 * @route   POST /api/chatrooms
 * @access  Private
 */
export const createChatRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
      return;
    }

    const { name, description, courseId } = req.body;

    // If courseId is provided, verify the course exists
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({
          success: false,
          error: 'Course not found',
        });
        return;
      }
    }

    const chatRoom = await ChatRoom.create({
      name,
      description,
      courseId,
      members: [req.user._id],
    });

    const populatedChatRoom = await ChatRoom.findById(chatRoom._id)
      .populate('members', 'name email')
      .populate('courseId', 'title code');

    res.status(201).json({
      success: true,
      data: populatedChatRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error',
    });
  }
};

/**
 * @desc    Send message in chat room
 * @route   POST /api/chatrooms/:id/messages
 * @access  Private
 */
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
      return;
    }

    const { content } = req.body;

    if (!content) {
      res.status(400).json({
        success: false,
        error: 'Please provide message content',
      });
      return;
    }

    const chatRoom = await ChatRoom.findById(req.params.id);

    if (!chatRoom) {
      res.status(404).json({
        success: false,
        error: 'Chat room not found',
      });
      return;
    }

    // Check if user is a member of the chat room
    if (!chatRoom.members.some(member => member.toString() === req.user._id.toString())) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to send messages in this chat room',
      });
      return;
    }

    const message = {
      sender: new mongoose.Types.ObjectId(req.user._id),
      content,
      timestamp: new Date(),
    };

    chatRoom.messages.push(message);
    await chatRoom.save();

    const populatedMessage = {
      ...message,
      sender: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    };

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error',
    });
  }
};

/**
 * @desc    Add member to chat room
 * @route   POST /api/chatrooms/:id/members
 * @access  Private
 */
export const addMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
      return;
    }

    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'Please provide user ID',
      });
      return;
    }

    const chatRoom = await ChatRoom.findById(req.params.id);

    if (!chatRoom) {
      res.status(404).json({
        success: false,
        error: 'Chat room not found',
      });
      return;
    }

    // Check if user is already a member
    if (chatRoom.members.some(member => member.toString() === userId)) {
      res.status(400).json({
        success: false,
        error: 'User is already a member of this chat room',
      });
      return;
    }

    chatRoom.members.push(new mongoose.Types.ObjectId(userId));
    await chatRoom.save();

    const populatedChatRoom = await ChatRoom.findById(chatRoom._id)
      .populate('members', 'name email')
      .populate('courseId', 'title code');

    res.status(200).json({
      success: true,
      data: populatedChatRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error',
    });
  }
}; 