import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat';
import Message from '../models/Message';
import User, { IUser } from '../models/User';

// Extended Request interface to include the user object
interface AuthRequest extends Request {
  user?: IUser;
}

/**
 * @desc    Get all chats for a user
 * @route   GET /api/chats
 * @access  Private
 */
export const getUserChats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
      return;
    }

    const chats = await Chat.find({
      participants: { $in: [req.user._id] },
    })
      .populate('participants', 'name email profilePicture')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error',
    });
  }
};

/**
 * @desc    Get chat by ID
 * @route   GET /api/chats/:id
 * @access  Private
 */
export const getChatById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
      return;
    }

    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name email profilePicture')
      .populate({
        path: 'messages',
        options: { sort: { createdAt: 1 } },
      });

    if (!chat) {
      res.status(404).json({
        success: false,
        error: 'Chat not found',
      });
      return;
    }

    // Check if user is a participant in the chat
    if (!chat.participants.some((participant) => participant._id.toString() === req.user?._id.toString())) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to access this chat',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error',
    });
  }
};

/**
 * @desc    Create a new chat or get existing chat between users
 * @route   POST /api/chats
 * @access  Private
 */
export const createOrGetChat = async (req: AuthRequest, res: Response): Promise<void> => {
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
        error: 'Please provide the userId of the other participant',
      });
      return;
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Check if chat already exists between these users
    const existingChat = await Chat.findOne({
      participants: {
        $all: [
          new mongoose.Types.ObjectId(req.user._id),
          new mongoose.Types.ObjectId(userId),
        ],
      },
    }).populate('participants', 'name email profilePicture');

    if (existingChat) {
      res.status(200).json({
        success: true,
        data: existingChat,
      });
      return;
    }

    // Create new chat
    const newChat = await Chat.create({
      participants: [req.user._id, userId],
    });

    const populatedChat = await Chat.findById(newChat._id).populate(
      'participants',
      'name email profilePicture'
    );

    res.status(201).json({
      success: true,
      data: populatedChat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error',
    });
  }
};

/**
 * @desc    Send a message in a chat
 * @route   POST /api/chats/:id/messages
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
    const chatId = req.params.id;

    if (!content) {
      res.status(400).json({
        success: false,
        error: 'Please provide a message content',
      });
      return;
    }

    // Check if chat exists and user is a participant
    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404).json({
        success: false,
        error: 'Chat not found',
      });
      return;
    }

    // Check if user is a participant in the chat
    if (!chat.participants.some(participant => participant.toString() === req.user?._id.toString())) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to send messages in this chat',
      });
      return;
    }

    // Create the message
    const message = await Message.create({
      sender: new mongoose.Types.ObjectId(req.user._id),
      content,
      timestamp: new Date(),
    });

    // Add message to the chat
    chat.messages.push(new mongoose.Types.ObjectId(message._id));
    chat.lastMessage = new mongoose.Types.ObjectId(message._id);
    await chat.save();

    const populatedMessage = await Message.findById(message._id).populate(
      'sender',
      'name email profilePicture'
    );

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
 * @desc    Mark all messages in a chat as read
 * @route   PUT /api/chats/:id/read
 * @access  Private
 */
export const markChatAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
      return;
    }

    const chatId = req.params.id;

    // Check if chat exists and user is a participant
    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404).json({
        success: false,
        error: 'Chat not found',
      });
      return;
    }

    // Check if user is a participant in the chat
    if (!chat.participants.includes(req.user._id)) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to access this chat',
      });
      return;
    }

    // Mark all unread messages from other users as read
    await Message.updateMany(
      {
        _id: { $in: chat.messages },
        sender: { $ne: req.user._id },
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error',
    });
  }
}; 