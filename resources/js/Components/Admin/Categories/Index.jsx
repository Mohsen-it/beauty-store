import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import CategoryForm from '@/Components/Admin/CategoryForm';

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
                  className="border-pink-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Categories
                </Link>
                <Link
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Orders
                </Link>
                <Link
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
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

const CategoryList = ({ categories }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Sample categories data if none provided
  const sampleCategories = [
    {
      id: 1,
      name: 'Skincare',
      description: 'Products for facial and skin care',
      parent_id: null,
      status: 'active',
      order: 1,
      children: [
        {
          id: 7,
          name: 'Cleansers',
          description: 'Face wash and cleansing products',
          parent_id: 1,
          status: 'active',
          order: 1,
          children: []
        },
        {
          id: 8,
          name: 'Moisturizers',
          description: 'Hydrating creams and lotions',
          parent_id: 1,
          status: 'active',
          order: 2,
          children: []
        }
      ]
    },
    {
      id: 2,
      name: 'Makeup',
      description: 'Cosmetic products for face, eyes, and lips',
      parent_id: null,
      status: 'active',
      order: 2,
      children: [
        {
          id: 9,
          name: 'Face',
          description: 'Foundation, concealer, and powder',
          parent_id: 2,
          status: 'active',
          order: 1,
          children: []
        },
        {
          id: 10,
          name: 'Eyes',
          description: 'Mascara, eyeliner, and eyeshadow',
          parent_id: 2,
          status: 'active',
          order: 2,
          children: []
        },
        {
          id: 11,
          name: 'Lips',
          description: 'Lipstick, lip gloss, and lip liner',
          parent_id: 2,
          status: 'active',
          order: 3,
          children: []
        }
      ]
    },
    {
      id: 3,
      name: 'Haircare',
      description: 'Products for hair maintenance and styling',
      parent_id: null,
      status: 'active',
      order: 3,
      children: []
    },
    {
      id: 4,
      name: 'Fragrance',
      description: 'Perfumes and body sprays',
      parent_id: null,
      status: 'active',
      order: 4,
      children: []
    },
    {
      id: 5,
      name: 'Bath & Body',
      description: 'Products for body care and bathing',
      parent_id: null,
      status: 'active',
      order: 5,
      children: []
    },
    {
      id: 6,
      name: 'Tools',
      description: 'Beauty tools and accessories',
      parent_id: null,
      status: 'active',
      order: 6,
      children: []
    }
  ];
  
  const displayCategories = categories || sampleCategories;
  
  // Flatten categories for form parent selection (exclude current category if editing)
  const getFlattenedCategories = (cats, excludeId = null) => {
    let flattened = [];
    
    const flatten = (items, depth = 0) => {
      items.forEach(item => {
        if (excludeId === null || item.id !== excludeId) {
          flattened.push({
            ...item,
            name: '  '.repeat(depth) + item.name
          });
        }
        
        if (item.children && item.children.length > 0) {
          flatten(item.children, depth + 1);
        }
      });
    };
    
    flatten(cats);
    return flattened;
  };
  
  // Filter categories based on search term and status
  const filterCategories = (cats) => {
    return cats.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? category.status === statusFilter : true;
      
      let filteredChildren = [];
      if (category.children && category.children.length > 0) {
        filteredChildren = filterCategories(category.children);
      }
      
      return (matchesSearch && matchesStatus) || filteredChildren.length > 0;
    }).map(category => {
      if (category.children && category.children.length > 0) {
        return {
          ...category,
          children: filterCategories(category.children)
        };
      }
      return category;
    });
  };
  
  const filteredCategories = filterCategories(displayCategories);
  
  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };
  
  const handleDelete = (categoryId) => {
    // In a real app, this would make an API call to delete the category
    if (confirm('Are you sure you want to delete this category?')) {
      console.log(`Delete category with ID: ${categoryId}`);
      // Inertia.delete(route('admin.categories.destroy', categoryId));
    }
  };
  
  const closeForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };
  
  // Recursive component to render category tree
  const CategoryTreeItem = ({ category, depth = 0 }) => {
    return (
      <>
        <tr className={depth > 0 ? 'bg-gray-50' : 'bg-white'}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="ml-4" style={{ marginLeft: `${depth * 2}rem` }}>
                <div className="text-sm font-medium text-gray-900">
                  {category.name}
                </div>
                {category.description && (
                  <div className="text-sm text-gray-500">
                    {category.description}
                  </div>
                )}
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
              {category.parent_id ? 'Subcategory' : 'Main Category'}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {category.order}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              onClick={() => handleEdit(category)}
              className="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </td>
        </tr>
        {category.children && category.children.length > 0 && (
          category.children.map(child => (
            <CategoryTreeItem key={child.id} category={child} depth={depth + 1} />
          ))
        )}
      </>
    );
  };

  return (
    <AdminLayout>
      <Head title="Categories - Admin Dashboard" />
      
      <div className="px-4 sm:px-0 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your product categories and subcategories.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          Add New Category
        </button>
      </div>
      
      {showForm ? (
        <div className="mb-6">
          <CategoryForm 
            category={editingCategory} 
            parentCategories={getFlattenedCategories(displayCategories, editingCategory?.id)} 
            isEditing={!!editingCategory} 
          />
          <div className="mt-4 text-center">
            <button
              onClick={closeForm}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel and return to category list
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
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
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Category List */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <CategoryTreeItem key={category.id} category={category} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No categories found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default CategoryList;
