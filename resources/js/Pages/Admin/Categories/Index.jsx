import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const CategoriesIndex = ({ categories, parentCategories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);

  // Filter categories based on search term
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  // Get parent category name
  const getParentName = (parentId) => {
    if (!parentId) return 'None';
    const parent = parentCategories.find(cat => cat.id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  // Handle delete category
  const handleDelete = (categoryId) => {
    if (confirm('Are you sure you want to delete this category? This will only work if the category has no products or subcategories.')) {
      router.delete(route('admin.categories.destroy', categoryId), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Category deleted successfully');
        },
        onError: (errors) => {
          toast.error('Failed to delete category');

          if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach(error => {
              toast.error(error);
            });
          }

          console.error('Error deleting category:', errors);
        }
      });
    }
  };

  // Handle toggle active
  const handleToggleActive = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    const newStatus = category ? !category.is_active : true;

    router.post(route('admin.categories.toggle-active', categoryId), {}, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(`Category ${newStatus ? 'activated' : 'deactivated'} successfully`);
      },
      onError: (errors) => {
        toast.error('Failed to update category status');

        if (Object.keys(errors).length > 0) {
          Object.values(errors).forEach(error => {
            toast.error(error);
          });
        }

        console.error('Error toggling category status:', errors);
      }
    });
  };

  // Helper function for status badge colors with dark mode
  const getStatusColor = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
  };

  return (
    <AdminLayout title="Categories Management">
      <Head title="Categories Management" />

      {/* Header with Add Category Button */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-cinematic-200">Manage Categories</h2> {/* Dark text */}
        <Link
          href={route('admin.categories.create')}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:bg-pink-700 dark:hover:bg-pink-600 dark:ring-offset-cinematic-800" // Dark button
        >
          Add New Category
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <div className="max-w-md">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300">Search Categories</label> {/* Dark text */}
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name..."
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500" // Dark input
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-cinematic-800 shadow dark:shadow-soft overflow-hidden sm:rounded-md border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-cinematic-700">{/* Dark divider */}
          <thead className="bg-gray-50 dark:bg-cinematic-700">{/* Dark thead */}
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                Slug
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                Parent Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                Order
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-cinematic-800 divide-y divide-gray-200 dark:divide-cinematic-700">{/* Dark tbody, divider */}
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 dark:hover:bg-cinematic-700/50" // Dark hover
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-cinematic-200">{category.name}</div> {/* Dark text */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-cinematic-400">{category.slug}</div> {/* Dark text */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-cinematic-300">{getParentName(category.parent_id)}</div> {/* Dark text */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-cinematic-300">{category.order}</div> {/* Dark text */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(category.is_active)}`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={route('admin.categories.show', category.id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" // Dark link
                      >
                        View
                      </Link>
                      <Link
                        href={route('admin.categories.edit', category.id)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" // Dark link
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(category.id)}
                        className={`${category.is_active ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'}`} // Dark toggle button
                      >
                        {category.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" // Dark delete button
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-cinematic-400"> {/* Dark text */}
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Category Reordering */}
      <div className="mt-8 bg-white dark:bg-cinematic-800 p-6 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200 mb-4">Category Order</h3> {/* Dark text */}
        <p className="text-sm text-gray-600 dark:text-cinematic-300 mb-4"> {/* Dark text */}
          Drag and drop categories to change their display order. Changes will be saved automatically.
        </p>

        {/* This would be implemented with a drag-and-drop library like react-beautiful-dnd */}
        <div className="bg-gray-100 dark:bg-cinematic-700 p-4 rounded-md"> {/* Dark bg */}
          <p className="text-center text-gray-500 dark:text-cinematic-400 italic"> {/* Dark text */}
            Drag and drop functionality would be implemented here with react-beautiful-dnd
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoriesIndex;
