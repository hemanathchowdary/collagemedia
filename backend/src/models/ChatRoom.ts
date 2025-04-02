import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
}

export interface IChatRoom extends Document {
  name: string;
  description?: string;
  courseId?: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatRoomSchema = new Schema<IChatRoom>(
  {
    name: {
      type: String,
      required: [true, 'Please add a chat room name'],
      trim: true,
    },
    description: {
      type: String,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

const ChatRoom = mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);
export default ChatRoom; 