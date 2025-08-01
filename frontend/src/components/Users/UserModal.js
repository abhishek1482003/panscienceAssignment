import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../store/slices/userSlice';
import { closeModal } from '../../store/slices/uiSlice';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').optional(),
  role: yup.string().required('Role is required'),
}).required();

const UserModal = ({ mode = 'edit' }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.users);

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
    const editUser = JSON.parse(localStorage.getItem('editUser') || '{}');
    if (editUser._id) {
      setValue('email', editUser.email);
      setValue('role', editUser.role);
    }
  }, [setValue]);

  const onSubmit = (data) => {
    // Remove password if it's empty
    if (!data.password) {
      delete data.password;
    }

    const editUser = JSON.parse(localStorage.getItem('editUser') || '{}');
    dispatch(updateUser({ id: editUser._id, userData: data }))
      .unwrap()
      .then(() => {
        toast.success('User updated successfully');
        handleClose();
      })
      .catch((error) => {
        toast.error(error || 'Failed to update user');
      });
  };

  const handleClose = () => {
    reset();
    localStorage.removeItem('editUser');
    dispatch(closeModal('editUser'));
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
                Edit User
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-field mt-1"
                  placeholder="Enter user email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password (leave blank to keep current)
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="input-field mt-1"
                  placeholder="Enter new password (optional)"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select {...register('role')} className="input-field mt-1">
                  <option value="">Select role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
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
                'Update User'
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

export default UserModal; 