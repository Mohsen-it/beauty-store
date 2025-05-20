import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import UserForm from '@/Components/Admin/UserForm';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-pink-600">
                  Cosmetics Store
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href={route('admin.dashboard')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href={route('admin.products.index')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Products
                </Link>
                <Link
                  href={route('admin.categories.index')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Categories
                </Link>
                <Link
                  href={route('admin.orders.index')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Orders
                </Link>
                <Link
                  href={route('admin.users.index')}
                  className="border-pink-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Users
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                href={route('home')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                View Store
              </Link>
              <div className="ml-3 relative">
                <Link
                  href={route('profile.edit')}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const UserList = ({ users, roles }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Sample users data if none provided
  const sampleUsers = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: { id: 1, name: 'Administrator' },
      status: 'active',
      created_at: '2025-01-15T10:00:00Z',
      last_login: '2025-04-13T06:30:00Z',
      phone: '(555) 123-4567',
      address: '123 Admin St, Admin City, AC 12345'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: { id: 2, name: 'Customer' },
      status: 'active',
      created_at: '2025-02-10T14:30:00Z',
      last_login: '2025-04-12T18:45:00Z',
      phone: '(555) 987-6543',
      address: '456 Customer Ave, Customer City, CC 67890'
    },
    {
      id: 3,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: { id: 2, name: 'Customer' },
      status: 'active',
      created_at: '2025-02-15T09:15:00Z',
      last_login: '2025-04-11T12:20:00Z',
      phone: '(555) 456-7890',
      address: '789 Buyer St, Buyer City, BC 54321'
    },
    {
      id: 4,
      name: 'Sarah Manager',
      email: 'sarah.manager@example.com',
      role: { id: 3, name: 'Manager' },
      status: 'active',
      created_at: '2025-01-20T11:45:00Z',
      last_login: '2025-04-13T08:10:00Z',
      phone: '(555) 234-5678',
      address: '321 Manager Rd, Manager Town, MT 13579'
    },
    {
      id: 5,
      name: 'Inactive User',
      email: 'inactive@example.com',
      role: { id: 2, name: 'Customer' },
      status: 'inactive',
      created_at: '2025-03-05T16:20:00Z',
      last_login: '2025-03-05T16:25:00Z',
      phone: '(555) 876-5432',
      address: '654 Inactive Ln, Inactive Village, IV 97531'
    },
    {
      id: 6,
      name: 'Suspended User',
      email: 'suspended@example.com',
      role: { id: 2, name: 'Customer' },
      status: 'suspended',
      created_at: '2025-02-25T13:10:00Z',
      last_login: '2025-03-01T10:05:00Z',
      phone: '(555) 345-6789',
      address: '987 Suspended Blvd, Suspended Heights, SH 24680'
    }
  ];
  
  // Sample roles data if none provided
  const sampleRoles = [
    { id: 1, name: 'Administrator' },
    { id: 2, name: 'Customer' },
    { id: 3, name: 'Manager' }
  ];
  
  const displayUsers = users || sampleUsers;
  const displayRoles = roles || sampleRoles;
  
  // Filter users based on search term, role, and status
  const filteredUsers = displayUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter ? user.role.id.toString() === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };
  
  const handleDelete = (userId) => {
    // In a real app, this would make an API call to delete the user
    if (confirm('Are you sure you want to delete this user?')) {
      console.log(`Delete user with ID: ${userId}`);
      // Inertia.delete(route('admin.users.destroy', userId));
    }
  };
  
  const handleSuspend = (userId) => {
    // In a real app, this would make an API call to suspend the user
    if (confirm('Are you sure you want to suspend this user?')) {
      console.log(`Suspend user with ID: ${userId}`);
      // Inertia.put(route('admin.users.suspend', userId));
    }
  };
  
  const handleActivate = (userId) => {
    // In a real app, this would make an API call to activate the user
    if (confirm('Are you sure you want to activate this user?')) {
      console.log(`Activate user with ID: ${userId}`);
      // Inertia.put(route('admin.users.activate', userId));
    }
  };
  
  const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <Head title="Users - Admin Dashboard" />
      
      <div className="px-4 sm:px-0 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          Add New User
        </button>
      </div>
      
      {showForm ? (
        <div className="mb-6">
          <UserForm 
            user={editingUser} 
            roles={displayRoles} 
            isEditing={!!editingUser} 
          />
          <div className="mt-4 text-center">
            <button
              onClick={closeForm}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel and return to user list
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label htmlFor="search" className="sr-only">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      id="search"
                      type="search"
                      className="form-input pl-10"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="role" className="sr-only">Role</label>
                  <select
                    id="role"
                    className="form-input"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    {displayRoles.map((role) => (
                      <option key={role.id} value={role.id.toString()}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="sr-only">Status</label>
                  <select
                    id="status"
                    className="form-input"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* User List */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                              <span className="text-pink-600 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.role.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.last_login).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleSuspend(user.id)}
                              className="text-yellow-600 hover:text-yellow-900 mr-3"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(user.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Activate
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination - simplified for demo */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                    <span className="font-medium">{filteredUsers.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      aria-current="page"
                      className="z-10 bg-pink-50 border-pink-500 text-pink-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default UserList;
