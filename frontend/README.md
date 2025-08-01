# Task Manager Frontend

A modern React-based frontend for the Task Manager application with full CRUD operations, authentication, and file management capabilities.

## Features

### Authentication & Authorization
- User registration and login with JWT
- Protected routes based on authentication status
- Role-based access control (Admin/User)
- Secure password handling

### Task Management
- Create, read, update, and delete tasks
- Assign tasks to different users
- Filter and sort tasks by status, priority, and due date
- Search functionality
- Pagination support
- File upload (PDF documents, max 3 per task)
- Document viewing and downloading

### User Management (Admin Only)
- Create, read, update, and delete users
- Role management (Admin/User)
- User search and pagination

### Dashboard
- Task statistics and overview
- Recent tasks display
- Quick access to create new tasks

### Profile Management
- View and edit user profile
- Change password
- View account information and permissions

## Technology Stack

- **React 19** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling with validation
- **Yup** - Schema validation
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Auth/           # Authentication components
│   ├── Common/         # Common UI components
│   ├── Layout/         # Layout components
│   ├── Tasks/          # Task-related components
│   └── Users/          # User-related components
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Dashboard page
│   ├── Tasks/          # Task pages
│   ├── Users/          # User pages
│   └── Profile/        # Profile page
├── services/           # API services
├── store/              # Redux store
│   └── slices/         # Redux slices
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## API Integration

The frontend communicates with the backend through RESTful APIs:

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

## State Management

The application uses Redux Toolkit for state management with the following slices:

- **authSlice** - Authentication state
- **taskSlice** - Task management state
- **userSlice** - User management state
- **uiSlice** - UI state (modals, notifications, etc.)

## Routing

The application uses React Router with the following routes:

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard (protected)
- `/tasks` - Task list (protected)
- `/tasks/:id` - Task detail (protected)
- `/users` - User management (admin only)
- `/users/:id` - User detail (admin only)
- `/profile` - User profile (protected)

## File Upload

The application supports PDF file uploads for tasks:

- Maximum 3 files per task
- File size limit: 5MB per file
- Only PDF files are accepted
- Files are stored on the server and can be downloaded

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Security Features

- JWT token-based authentication
- Protected routes
- Role-based access control
- Secure file upload validation
- CSRF protection through proper API calls

## Error Handling

- Global error handling with toast notifications
- Form validation with detailed error messages
- Network error handling
- Loading states for better UX

## Performance Optimizations

- Lazy loading of components
- Optimized re-renders with React.memo
- Efficient state management with Redux Toolkit
- Image optimization
- Code splitting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
