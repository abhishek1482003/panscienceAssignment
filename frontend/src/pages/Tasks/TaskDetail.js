import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaskById, deleteTask } from '../../store/slices/taskSlice';
import { openModal } from '../../store/slices/uiSlice';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  FileText, 
  Download,
  Calendar,
  User,
  Clock,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { taskAPI } from '../../services/api';

const TaskDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTask, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
  }, [dispatch, id]);

  const handleEdit = () => {
    localStorage.setItem('editTask', JSON.stringify(currentTask));
    dispatch(openModal('editTask'));
  };

  const handleDelete = () => {
    localStorage.setItem('deleteTask', JSON.stringify(currentTask));
    dispatch(openModal('deleteConfirm'));
  };

  const handleDownload = async (document) => {
    try {
      const response = await taskAPI.downloadDocument(currentTask._id, document._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const canEdit = user?.role === 'admin' || currentTask?.createdBy === user?._id;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">Task not found</h3>
        <p className="mt-1 text-sm text-gray-500">The task you're looking for doesn't exist.</p>
        <Link to="/tasks" className="btn-primary mt-4">
          Back to Tasks
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
            to="/tasks"
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentTask.title}</h1>
            <p className="text-gray-600">Task Details</p>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="btn-secondary flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Task Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{currentTask.description}</p>
          </div>

          {/* Documents */}
          {currentTask.documents && currentTask.documents.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
              <div className="space-y-3">
                {currentTask.documents.map((document, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{document.originalName}</p>
                        <p className="text-xs text-gray-500">
                          {(document.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(document)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium status-${currentTask.status}`}>
                  {currentTask.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium priority-${currentTask.priority}`}>
                  {currentTask.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Due Date</h2>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className={`text-sm font-medium ${isOverdue(currentTask.dueDate) && currentTask.status !== 'completed' ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatDate(currentTask.dueDate)}
                </p>
                {isOverdue(currentTask.dueDate) && currentTask.status !== 'completed' && (
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Overdue
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Assigned To */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned To</h2>
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm font-medium text-gray-900">
                {currentTask.assignedTo?.email || 'Unassigned'}
              </p>
            </div>
          </div>

          {/* Created By */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Created By</h2>
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm font-medium text-gray-900">
                {currentTask.createdBy?.email || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(currentTask.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(currentTask.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail; 