import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';
import chatRoutes from './routes/chatRoutes';
import chatRoomRoutes from './routes/chatRoomRoutes';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/chatrooms', chatRoomRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to College Media API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 