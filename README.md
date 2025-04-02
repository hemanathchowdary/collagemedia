# College Media Platform

A comprehensive platform for college students and instructors to interact, access courses, and communicate through chat rooms.

## Features

- User authentication (login, registration)
- Course management
- Chat rooms
- User profiles

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/college-media.git
cd college-media
```

2. Install dependencies
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. Environment Setup

Create a `.env` file in the backend directory with the following:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_media
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Running the Application

For development:
```bash
# Run both frontend and backend
npm run dev

# Run just the frontend
npm run frontend

# Run just the backend
npm run backend
```

For production:
```bash
npm run build
npm start
```

## Project Structure

```
college-media/
├── frontend/             # Next.js frontend
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility functions
│   ├── styles/           # CSS styles
│   └── public/           # Static assets
│
├── backend/              # Express backend
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # API controllers
│   │   ├── middleware/   # Middleware functions
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utility functions
│   └── dist/             # Compiled TypeScript
└── package.json          # Root package.json
```

## API Documentation

The backend provides RESTful APIs for:

- User authentication
- Course management
- Chat room functionality

For detailed API documentation, see [API.md](API.md)

## License

This project is licensed under the MIT License. 