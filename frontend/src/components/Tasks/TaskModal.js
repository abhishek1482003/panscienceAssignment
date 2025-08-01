import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../../store/slices/taskSlice';
import { fetchUsers } from '../../store/slices/userSlice';
import { closeModal } from '../../store/slices/uiSlice';
import { X, Upload, File, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object({
  title: yup.string().required('Title is required').max(200, 'Title must be less than 200 characters'),
  description: yup.string().required('Description is required').max(1000, 'Description must be less than 1000 characters'),
  status: yup.string().required('Status is required'),
  priority: yup.string().required('Priority is required'),
  dueDate: yup.date().required('Due date is required').min(new Date(), 'Due date cannot be in the past'),
  assignedTo: yup.string().required('Assigned user is required'),
}).required();

const TaskModal = ({ mode = 'create' }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Fetch users for assignment dropdown
    dispatch(fetchUsers({ limit: 100 }));
    
    if (mode === 'edit') {
      const editTask = JSON.parse(localStorage.getItem('editTask') || '{}');
      if (editTask._id) {
        setValue('title', editTask.title);
        setValue('description', editTask.description);
        setValue('status', editTask.status);
        setValue('priority', editTask.priority);
        setValue('dueDate', new Date(editTask.dueDate).toISOString().split('T')[0]);
        setValue('assignedTo', editTask.assignedTo?._id || editTask.assignedTo);
        setExistingFiles(editTask.documents || []);
      }
    }
  }, [dispatch, mode, setValue]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.type !== 'application/pdf') {
        toast.error(`${file.name} is not a PDF file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    if (selectedFiles.length + validFiles.length + existingFiles.length > 3) {
      toast.error('Maximum 3 documents allowed per task');
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index, type = 'selected') => {
    if (type === 'selected') {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setExistingFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const onSubmit = (data) => {
    const formData = {
      ...data,
      documents: selectedFiles,
    };

    if (mode === 'create') {
      dispatch(createTask(formData))
        .unwrap()
        .then(() => {
          toast.success('Task created successfully');
          handleClose();
        })
        .catch((error) => {
          toast.error(error || 'Failed to create task');
        });
    } else {
      const editTask = JSON.parse(localStorage.getItem('editTask') || '{}');
      dispatch(updateTask({ id: editTask._id, taskData: formData }))
        .unwrap()
        .then(() => {
          toast.success('Task updated successfully');
          handleClose();
        })
        .catch((error) => {
          toast.error(error || 'Failed to update task');
        });
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setExistingFiles([]);
    reset();
    localStorage.removeItem('editTask');
    dispatch(closeModal(mode === 'create' ? 'createTask' : 'editTask'));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {mode === 'create' ? 'Create New Task' : 'Edit Task'}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  {...register('title')}
                  type="text"
                  className="input-field mt-1"
                  placeholder="Enter task title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="input-field mt-1"
                  placeholder="Enter task description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select {...register('status')} className="input-field mt-1">
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select {...register('priority')} className="input-field mt-1">
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  {errors.priority && (
                    <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                  )}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  {...register('dueDate')}
                  type="date"
                  className="input-field mt-1"
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
                )}
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Assign To</label>
                <select {...register('assignedTo')} className="input-field mt-1">
                  <option value="">Select user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.email}
                    </option>
                  ))}
                </select>
                {errors.assignedTo && (
                  <p className="mt-1 text-sm text-red-600">{errors.assignedTo.message}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Documents (PDF only, max 3 files)</label>
                <div className="mt-1">
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </label>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <File className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Existing Files */}
                {existingFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-600">Existing files:</p>
                    {existingFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <div className="flex items-center">
                          <File className="h-4 w-4 text-blue-400 mr-2" />
                          <span className="text-sm text-blue-700">{file.originalName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index, 'existing')}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="btn-primary w-full sm:w-auto sm:ml-3"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                mode === 'create' ? 'Create Task' : 'Update Task'
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

export default TaskModal; 