import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from '../../store/slices/userSlice';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User,
  Mail,
  Shield,
  Clock
} from 'lucide-react';

const UserDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.users);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">User not found</h3>
        <p className="mt-1 text-sm text-gray-500">The user you're looking for doesn't exist.</p>
        <Link to="/users" className="btn-primary mt-4">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/users"
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">View user information and permissions</p>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* User Profile */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Profile</h2>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xl font-medium text-white">
                  {currentUser.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{currentUser.email}</h3>
                <p className="text-sm text-gray-500">User ID: {currentUser._id}</p>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Role</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    currentUser.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timestamps */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-sm text-gray-500">{formatDate(currentUser.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Updated</p>
                  <p className="text-sm text-gray-500">{formatDate(currentUser.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-3 ${
                  currentUser.role === 'admin' ? 'bg-green-400' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-gray-700">View tasks</span>
              </div>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-3 ${
                  currentUser.role === 'admin' ? 'bg-green-400' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-gray-700">Create tasks</span>
              </div>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-3 ${
                  currentUser.role === 'admin' ? 'bg-green-400' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-gray-700">Edit own tasks</span>
              </div>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-3 ${
                  currentUser.role === 'admin' ? 'bg-green-400' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-gray-700">Delete own tasks</span>
              </div>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-3 ${
                  currentUser.role === 'admin' ? 'bg-green-400' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-gray-700">Manage all users</span>
              </div>
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-3 ${
                  currentUser.role === 'admin' ? 'bg-green-400' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-gray-700">Manage all tasks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 