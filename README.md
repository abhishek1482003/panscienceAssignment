# Task Manager Application [🔗 Live Demo](https://panscience-assignment.vercel.app)


A full-stack web application for task management with user authentication, role-based access control, and file management capabilities.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- User registration and login
- Role-based access control (Admin/User)
- Protected routes and API endpoints
- Secure password hashing

### 📋 Task Management
- Create, read, update, and delete tasks
- Assign tasks to different users
- Filter and sort tasks by status, priority, and due date
- Search functionality with pagination
- File upload support (PDF documents, max 3 per task)
- Document viewing and downloading

### 👥 User Management (Admin Only)
- Create, read, update, and delete users
- Role management (Admin/User)
- User search and pagination
- Profile management

### 📊 Dashboard
- Task statistics and overview
- Recent tasks display
- Quick access to create new tasks
- Visual status indicators

### 🎨 Modern UI/UX
- Responsive design for all devices
- Modern UI with Tailwind CSS
- Real-time notifications
- Loading states and error handling
- Intuitive navigation

## Technology Stack

### Frontend
- **React 19** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling with validation
- **Yup** - Schema validation
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving

## Project Structure

```
task-manager-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store and slices
│   │   └── utils/          # Utility functions
│   ├── public/             # Static files
│   ├── Dockerfile          # Frontend Docker configuration
│   └── nginx.conf          # Nginx configuration
├── backend/                 # Node.js backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── uploads/            # File upload directory
│   ├── utils/              # Utility functions
│   ├── tests/              # Test files
│   └── Dockerfile          # Backend Docker configuration
├── docker-compose.yml      # Docker Compose configuration
└── README.md              # Project documentation
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- Git

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager-app
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager-app
```

2. Start MongoDB (using Docker):
```bash
docker run -d --name mongodb -p 27017:27017 mongo:6.0
```

3. Set up the backend:
```bash
cd backend
npm install
npm run dev
```

4. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Task Endpoints
- `GET /api/tasks` - Get tasks with filtering/pagination
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/:id/documents/:docId` - Download document

### User Endpoints (Admin Only)
- `GET /api/users` - Get users with pagination
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Database Schema

### User Model
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required, max 200 chars),
  description: String (required, max 1000 chars),
  status: String (enum: ['pending', 'in-progress', 'completed', 'cancelled']),
  priority: String (enum: ['low', 'medium', 'high', 'urgent']),
  dueDate: Date (required),
  assignedTo: ObjectId (ref: 'User', required),
  createdBy: ObjectId (ref: 'User', required),
  documents: [DocumentSchema] (max 3),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API endpoints
- Secure file upload validation
- CORS configuration
- Input validation and sanitization

## File Upload

The application supports PDF file uploads for tasks:
- Maximum 3 files per task
- File size limit: 5MB per file
- Only PDF files are accepted
- Files are stored on the server
- Secure download endpoints

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd backend
npm start
```

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request





