import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
// Removed unused motion import
// import { motion } from 'framer-motion';

const CategoryShow = ({ category }) => {
  // Helper function for status badge colors with dark mode
  const getStatusColor = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
  };

  return (
    <AdminLayout title={`Category: ${category.name}`}>
      <Head title={`Category: ${category.name}`} />

      {/* Category Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4"> {/* Adjusted layout */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-cinematic-200">{category.name}</h2> {/* Dark text */}
          <p className="text-sm text-gray-500 dark:text-cinematic-400">Slug: {category.slug}</p> {/* Dark text */}
        </div>
        <div className="flex space-x-2 flex-shrink-0"> {/* Prevent button wrap */}
          <Link
            href={route('admin.categories.edit', category.id)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:ring-offset-cinematic-800" // Dark button
          >
            Edit Category
          </Link>
          <Link
            href={route('admin.categories.index')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-cinematic-600 dark:hover:bg-cinematic-500 dark:ring-offset-cinematic-800" // Dark button
          >
            Back to Categories
          </Link>
        </div>
      </div>

      {/* Category Details */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Image (if available) */}
        {category.image && (
          <div className="md:col-span-1 bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-cinematic-700"> {/* Dark image bg */}
              <img
                src={category.image_url || `/assets/default-category.png`}
                alt={category.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        )}

        {/* Category Info */}
        <div className={`${category.image ? 'md:col-span-2' : 'md:col-span-3'} bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700`}> {/* Dark bg, shadow, border */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200">Category Details</h3> {/* Dark text */}
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Adjusted grid for smaller screens */}
                {category.parent && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-cinematic-400">Parent Category</p> {/* Dark text */}
                    <p className="text-sm font-medium text-gray-900 dark:text-cinematic-300">{category.parent.name}</p> {/* Dark text */}
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-cinematic-400">Status</p> {/* Dark text */}
                  <p className="text-sm font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(category.is_active)}`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-cinematic-400">Order</p> {/* Dark text */}
                  <p className="text-sm font-medium text-gray-900 dark:text-cinematic-300">{category.order}</p> {/* Dark text */}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-cinematic-400">Created At</p> {/* Dark text */}
                  <p className="text-sm font-medium text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {new Date(category.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-cinematic-700 pt-4"> {/* Dark border */}
              <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200">Description</h3> {/* Dark text */}
              <div className="mt-2 prose prose-sm text-gray-700 dark:text-cinematic-300 dark:prose-invert max-w-none"> {/* Dark text, prose invert */}
                <p>{category.description || 'No description available.'}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-cinematic-700 pt-4"> {/* Dark border */}
              <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200">Actions</h3> {/* Dark text */}
              <div className="mt-2 flex flex-wrap gap-2"> {/* Flex wrap for smaller screens */}
                <Link
                  href={route('admin.categories.toggle-active', category.id)}
                  method="post"
                  as="button"
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    category.is_active
                      ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/60' // Dark toggle button
                      : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-800/60' // Dark toggle button
                  }`}
                >
                  {category.is_active ? 'Deactivate' : 'Activate'}
                </Link>
                <Link
                  href={route('admin.categories.destroy', category.id)}
                  method="delete"
                  as="button"
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/60" // Dark delete button
                  onClick={(e) => {
                    if (!confirm('Are you sure you want to delete this category? This will only work if the category has no products or subcategories.')) {
                      e.preventDefault();
                    }
                  }}
                >
                  Delete Category
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories (if available) */}
      {category.children && category.children.length > 0 && (
        <div className="mb-6 bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200 mb-4">Subcategories</h3> {/* Dark text */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-cinematic-700"> {/* Dark divider */}
              <thead className="bg-gray-50 dark:bg-cinematic-700"> {/* Dark thead */}
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                    Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-cinematic-800 divide-y divide-gray-200 dark:divide-cinematic-700"> {/* Dark tbody, divider */}
                {category.children.map((child) => (
                  <tr key={child.id} className="hover:bg-gray-50 dark:hover:bg-cinematic-700/50"> {/* Dark hover */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-cinematic-200">{child.name}</div> {/* Dark text */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-cinematic-400">{child.slug}</div> {/* Dark text */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(child.is_active)}`}>
                        {child.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-cinematic-400">{child.order}</div> {/* Dark text */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={route('admin.categories.show', child.id)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" // Dark link
                        >
                          View
                        </Link>
                        <Link
                          href={route('admin.categories.edit', child.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" // Dark link
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products in this Category (if available) */}
      {category.products && category.products.length > 0 && (
        <div className="bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200 mb-4">Products in this Category</h3> {/* Dark text */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-cinematic-700"> {/* Dark divider */}
              <thead className="bg-gray-50 dark:bg-cinematic-700"> {/* Dark thead */}
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-cinematic-800 divide-y divide-gray-200 dark:divide-cinematic-700"> {/* Dark tbody, divider */}
                {category.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-cinematic-700/50"> {/* Dark hover */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-md object-cover bg-gray-200 dark:bg-cinematic-700" // Dark image bg
                            src={
                              product.image
                                ? `/storage/${product.image}?v=${new Date().getTime()}`
                                : product.images && product.images.length > 0
                                  ? `/storage/${product.images[0].url}?v=${new Date().getTime()}`
                                  : `/assets/default-product.png?v=${new Date().getTime()}`
                            }
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-cinematic-200">{product.name}</div> {/* Dark text */}
                          <div className="text-sm text-gray-500 dark:text-cinematic-400">{product.slug}</div> {/* Dark text */}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-cinematic-300">${parseFloat(product.price).toFixed(2)}</div> {/* Dark text */}
                      {product.sale_price && (
                        <div className="text-sm text-pink-600 dark:text-pink-400">${parseFloat(product.sale_price).toFixed(2)}</div> /* Dark sale price */
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-cinematic-300">{product.stock}</div> {/* Dark text */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.is_active)}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={route('admin.products.show', product.id)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" // Dark link
                        >
                          View
                        </Link>
                        <Link
                          href={route('admin.products.edit', product.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" // Dark link
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CategoryShow;
