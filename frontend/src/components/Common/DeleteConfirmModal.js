import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask } from '../../store/slices/taskSlice';
import { deleteUser } from '../../store/slices/userSlice';
import { closeModal } from '../../store/slices/uiSlice';
import { X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const DeleteConfirmModal = ({ type = 'task' }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tasks);

  const handleDelete = () => {
    const item = JSON.parse(localStorage.getItem(`delete${type.charAt(0).toUpperCase() + type.slice(1)}`) || '{}');
    
    if (type === 'task') {
      dispatch(deleteTask(item._id))
        .unwrap()
        .then(() => {
          toast.success('Task deleted successfully');
          handleClose();
        })
        .catch((error) => {
          toast.error(error || 'Failed to delete task');
        });
    } else if (type === 'user') {
      dispatch(deleteUser(item._id))
        .unwrap()
        .then(() => {
          toast.success('User deleted successfully');
          handleClose();
        })
        .catch((error) => {
          toast.error(error || 'Failed to delete user');
        });
    }
  };

  const handleClose = () => {
    localStorage.removeItem(`delete${type.charAt(0).toUpperCase() + type.slice(1)}`);
    dispatch(closeModal('deleteConfirm'));
  };

  const item = JSON.parse(localStorage.getItem(`delete${type.charAt(0).toUpperCase() + type.slice(1)}`) || '{}');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete {type.charAt(0).toUpperCase() + type.slice(1)}
                  </h3>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this {type}? This action cannot be undone.
              </p>
              {type === 'task' && item.title && (
                <p className="mt-2 text-sm font-medium text-gray-900">
                  Task: {item.title}
                </p>
              )}
              {type === 'user' && item.email && (
                <p className="mt-2 text-sm font-medium text-gray-900">
                  User: {item.email}
                </p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="btn-danger w-full sm:w-auto sm:ml-3"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Delete'
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 