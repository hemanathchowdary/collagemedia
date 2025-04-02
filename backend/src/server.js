const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');

// Import middleware
const { protect } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Import database connection
const connectDB = require('./db/connect');

// Load environment variables if dotenv is available
try {
  require('dotenv').config();
} catch (err) {
  console.log('dotenv not installed, using default env variables');
}

// Connect to database
connectDB();

// Express app setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Store connected users and their socket IDs
const users = new Map();

// Store active chat rooms
const chatRooms = new Map();

// Initialize default chat rooms
const initDefaultRooms = () => {
  const defaultRooms = [
    { id: 1, name: "CS Study Group", category: "academic" },
    { id: 2, name: "Math Help", category: "academic" },
    { id: 3, name: "Campus Events", category: "campus" },
    { id: 4, name: "Gaming Club", category: "interests" },
    { id: 5, name: "Photography", category: "interests" }
  ];

  defaultRooms.forEach(room => {
    chatRooms.set(room.id, {
      ...room,
      users: new Set(),
      messages: []
    });
  });
};

initDefaultRooms();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user login with token authentication
  socket.on('user:login', async ({ userId, username, avatar, token }) => {
    try {
      // Verify the token and get user from database
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
          const user = await User.findById(decoded.id);
          
          if (user) {
            // Update the user status to online
            user.status = 'online';
            user.lastSeen = new Date();
            await user.save();
            
            // Store user in socket map
            users.set(socket.id, { 
              userId: user._id.toString(), 
              username: user.name, 
              avatar: user.avatar 
            });
            
            // Send rooms list
            socket.emit('rooms:list', Array.from(chatRooms.values()).map(room => ({
              id: room.id,
              name: room.name,
              category: room.category,
              usersCount: room.users.size
            })));
            
            console.log(`User logged in: ${user.name} (${user._id})`);
            return;
          }
        } catch (err) {
          console.error('Token verification failed:', err);
        }
      }
      
      // Fallback for non-authenticated users (for testing)
      users.set(socket.id, { userId, username, avatar });
      socket.emit('rooms:list', Array.from(chatRooms.values()).map(room => ({
        id: room.id,
        name: room.name,
        category: room.category,
        usersCount: room.users.size
      })));
      
      console.log(`User logged in (no auth): ${username} (${userId})`);
    } catch (error) {
      console.error('Authentication error:', error);
      socket.emit('auth:error', { message: 'Authentication failed' });
    }
  });

  // Handle private message
  socket.on('message:private', ({ to, message }) => {
    const sender = users.get(socket.id);
    if (!sender) return;

    const recipientSocket = Array.from(users.entries())
      .find(([_, user]) => user.userId === to);
    
    if (recipientSocket) {
      const [recipientSocketId] = recipientSocket;
      io.to(recipientSocketId).emit('message:private', {
        from: sender.userId,
        sender: sender.username,
        avatar: sender.avatar,
        content: message,
        timestamp: new Date().toISOString()
      });
    }
    
    // Also send back to sender for message confirmation
    socket.emit('message:private:sent', {
      to,
      content: message,
      timestamp: new Date().toISOString()
    });
  });

  // Handle joining a room
  socket.on('room:join', ({ roomId }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const room = chatRooms.get(roomId);
    if (!room) return;

    // Join the room
    socket.join(`room:${roomId}`);
    room.users.add(user.userId);

    // Send room history
    socket.emit('room:history', {
      roomId,
      messages: room.messages
    });

    // Notify room about new user
    io.to(`room:${roomId}`).emit('room:user:joined', {
      roomId,
      user: { userId: user.userId, username: user.username, avatar: user.avatar },
      timestamp: new Date().toISOString()
    });

    // Update room counts for everyone
    io.emit('rooms:update', {
      id: roomId,
      usersCount: room.users.size
    });
    
    console.log(`User ${user.username} joined room ${room.name}`);
  });

  // Handle leaving a room
  socket.on('room:leave', ({ roomId }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const room = chatRooms.get(roomId);
    if (!room) return;

    // Leave the room
    socket.leave(`room:${roomId}`);
    room.users.delete(user.userId);

    // Notify room about user leaving
    io.to(`room:${roomId}`).emit('room:user:left', {
      roomId,
      userId: user.userId,
      timestamp: new Date().toISOString()
    });

    // Update room counts for everyone
    io.emit('rooms:update', {
      id: roomId,
      usersCount: room.users.size
    });
    
    console.log(`User ${user.username} left room ${room.name}`);
  });

  // Handle room message
  socket.on('room:message', ({ roomId, message }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const room = chatRooms.get(roomId);
    if (!room) return;

    const messageObject = {
      id: Date.now(),
      sender: user.username,
      userId: user.userId,
      avatar: user.avatar,
      content: message,
      timestamp: new Date().toISOString()
    };

    // Store message in room history
    room.messages.push(messageObject);
    if (room.messages.length > 100) {
      // Limit history to 100 messages
      room.messages.shift();
    }

    // Broadcast to all users in the room
    io.to(`room:${roomId}`).emit('room:message:new', {
      roomId,
      message: messageObject
    });
    
    console.log(`New message in ${room.name} from ${user.username}`);
  });

  // Handle creating a new room
  socket.on('room:create', ({ name, description, category }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const roomId = Date.now();
    chatRooms.set(roomId, {
      id: roomId,
      name,
      description,
      category,
      users: new Set([user.userId]),
      messages: []
    });

    // Notify all users about new room
    io.emit('rooms:new', {
      id: roomId,
      name,
      description,
      category,
      usersCount: 1
    });
    
    console.log(`New room created: ${name} by ${user.username}`);
    
    // Auto-join creator to the room
    socket.join(`room:${roomId}`);
    socket.emit('room:joined', { roomId });
  });

  // Handle user typing status
  socket.on('user:typing', ({ roomId, isTyping }) => {
    const user = users.get(socket.id);
    if (!user) return;

    socket.to(`room:${roomId}`).emit('user:typing', {
      roomId,
      userId: user.userId,
      username: user.username,
      isTyping
    });
  });

  // Handle user typing status in private chat
  socket.on('user:typing:private', ({ to, isTyping }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const recipientSocket = Array.from(users.entries())
      .find(([_, user]) => user.userId === to);
    
    if (recipientSocket) {
      const [recipientSocketId] = recipientSocket;
      io.to(recipientSocketId).emit('user:typing:private', {
        from: user.userId,
        isTyping
      });
    }
  });

  // Handle user status updates
  socket.on('user:status', ({ status }) => {
    const user = users.get(socket.id);
    if (!user) return;

    // Broadcast to all users
    socket.broadcast.emit('user:status:update', {
      userId: user.userId,
      status
    });
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    const user = users.get(socket.id);
    if (user) {
      try {
        // Update user status in database if this is an authenticated user
        const dbUser = await User.findOne({ _id: user.userId });
        if (dbUser) {
          dbUser.status = 'offline';
          dbUser.lastSeen = new Date();
          await dbUser.save();
        }
        
        // Remove user from all rooms they were in
        chatRooms.forEach((room, roomId) => {
          if (room.users.has(user.userId)) {
            room.users.delete(user.userId);
            
            // Notify room about user leaving
            io.to(`room:${roomId}`).emit('room:user:left', {
              roomId,
              userId: user.userId,
              timestamp: new Date().toISOString()
            });
            
            // Update room counts
            io.emit('rooms:update', {
              id: roomId,
              usersCount: room.users.size
            });
          }
        });
        
        // Notify all users about disconnection
        socket.broadcast.emit('user:offline', {
          userId: user.userId
        });
        
        // Remove user from users map
        users.delete(socket.id);
        console.log(`User disconnected: ${user.username} (${user.userId})`);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    } else {
      console.log(`User disconnected: ${socket.id}`);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 