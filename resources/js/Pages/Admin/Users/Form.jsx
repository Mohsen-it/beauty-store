import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const UserForm = ({ user = null, roles }) => {
  const isEditing = !!user;

  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
    is_admin: user?.is_admin || false,
    active: user?.active ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      put(route('admin.users.update', user.id), {
        onSuccess: () => {
          toast.success('User updated successfully');
        },
        onError: (errors) => {
          toast.error('Failed to update user');
          console.error('User update errors:', errors);
        }
      });
    } else {
      post(route('admin.users.store'), {
        onSuccess: () => {
          toast.success('User created successfully');
        },
        onError: (errors) => {
          toast.error('Failed to create user');
          console.error('User creation errors:', errors);
        }
      });
    }
  };

  return (
    <AdminLayout title={isEditing ? 'Edit User' : 'Create New User'}>
      <Head title={isEditing ? 'Edit User' : 'Create New User'} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isEditing ? 'Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input
                  type="password"
                  id="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required={!isEditing}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required={!isEditing || data.password} // Require confirmation if creating or if password is changed
                />
                 {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="is_admin"
                  type="checkbox"
                  checked={data.is_admin}
                  onChange={(e) => setData('is_admin', e.target.checked)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:focus:ring-offset-gray-800"
                />
                <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Admin User
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="active"
                  type="checkbox"
                  checked={data.active}
                  onChange={(e) => setData('active', e.target.checked)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:focus:ring-offset-gray-800"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Active Account
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
              >
                {processing ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default UserForm;
