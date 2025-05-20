import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { t } from '@/utils/translate';

const UserForm = ({ user = null, roles = [], isEditing = false }) => {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: user ? user.name : '',
    email: user ? user.email : '',
    password: '',
    password_confirmation: '',
    role_id: user ? user.role_id : '',
    status: user ? user.status : 'active',
    phone: user ? user.phone : '',
    address: user ? user.address : '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      put(route('admin.users.update', user.id));
    } else {
      post(route('admin.users.store'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {isEditing ? t('admin.edit_user') : t('admin.add_new_user')}
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Name */}
            <div>
              <label htmlFor="name" className="form-label">{t('auth.name')}</label>
              <input
                id="name"
                type="text"
                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">{t('auth.email')}</label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">
                {isEditing ? t('admin.new_password_leave_blank') : t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                className={`form-input ${errors.password ? 'border-red-500' : ''}`}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                required={!isEditing}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Password Confirmation */}
            <div>
              <label htmlFor="password_confirmation" className="form-label">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                className={`form-input ${errors.password_confirmation ? 'border-red-500' : ''}`}
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                required={!isEditing}
              />
              {errors.password_confirmation && <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role_id" className="form-label">Role</label>
              <select
                id="role_id"
                className={`form-input ${errors.role_id ? 'border-red-500' : ''}`}
                value={data.role_id}
                onChange={(e) => setData('role_id', e.target.value)}
                required
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.role_id && <p className="mt-1 text-sm text-red-500">{errors.role_id}</p>}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                className={`form-input ${errors.status ? 'border-red-500' : ''}`}
                value={data.status}
                onChange={(e) => setData('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                id="phone"
                type="text"
                className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              id="address"
              rows="3"
              className={`form-input ${errors.address ? 'border-red-500' : ''}`}
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
            ></textarea>
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 text-right">
          <Link
            href={route('admin.users.index')}
            className="btn btn-secondary mr-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={processing}
          >
            {processing ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
