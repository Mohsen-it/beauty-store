import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';

const ProductShow = ({ product }) => {
  // Format price for display
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  return (
    <AdminLayout title={`Product: ${product.name}`}>
      <Head title={`Product: ${product.name}`} />

      {/* Product Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4"> {/* Adjusted layout for responsiveness */}
        <div>
          <h2 className="text-2xl font-semibold text-cinematic-800 dark:text-cinematic-200">{product.name}</h2>
          <p className="text-sm text-cinematic-500 dark:text-cinematic-400">SKU: {product.sku || 'N/A'}</p>
        </div>
        <div className="flex space-x-2 flex-shrink-0"> {/* Prevent buttons wrapping */}
          <Link
            href={route('admin.products.edit', product.id)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 dark:ring-offset-cinematic-800" // Adjusted colors
          >
            Edit Product
          </Link>
          <Link
            href={route('admin.products.index')}
            className="px-4 py-2 bg-cinematic-600 text-white rounded-md hover:bg-cinematic-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinematic-500 dark:bg-cinematic-700 dark:hover:bg-cinematic-600 dark:ring-offset-cinematic-800" // Adjusted colors
          >
            Back to Products
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Image & Gallery */}
        <div className="md:col-span-1 bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Added dark mode classes and border */}
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-cinematic-200 dark:bg-cinematic-700"> {/* Adjusted bg color */}
            <img
              src={
                product.image
                  ? `/storage/${product.image}?v=${new Date().getTime()}`
                  : product.images && product.images[0]?.url
                    ? `/storage/${product.images[0].url}?v=${new Date().getTime()}`
                    : `/assets/default-product.png?v=${new Date().getTime()}`
              }
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-cinematic-900 dark:text-cinematic-200 mb-2">Gallery</h3> {/* Adjusted text color */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div key={index} className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-cinematic-200 dark:bg-cinematic-700"> {/* Adjusted bg color */}
                    <img
                      src={image.url}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:col-span-2 bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Added dark mode classes and border */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-cinematic-900 dark:text-cinematic-200">Product Details</h3> {/* Adjusted text color */}
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Adjusted grid for smaller screens */}
                <div>
                  <p className="text-sm text-cinematic-500 dark:text-cinematic-400">Category</p>
                  <p className="text-sm font-medium text-cinematic-900 dark:text-cinematic-300">{product.category.name}</p> {/* Adjusted text color */}
                </div>
                <div>
                  <p className="text-sm text-cinematic-500 dark:text-cinematic-400">Status</p>
                  <p className="text-sm font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.is_active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' // Adjusted dark mode badge colors
                        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' // Adjusted dark mode badge colors
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-cinematic-500 dark:text-cinematic-400">Price</p>
                  <p className="text-sm font-medium text-cinematic-900 dark:text-cinematic-300">${formatPrice(product.price)}</p> {/* Adjusted text color */}
                </div>
                <div>
                  <p className="text-sm text-cinematic-500 dark:text-cinematic-400">Sale Price</p>
                  <p className="text-sm font-medium text-cinematic-900 dark:text-cinematic-300"> {/* Adjusted text color */}
                    {product.sale_price ? `$${formatPrice(product.sale_price)}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-cinematic-500 dark:text-cinematic-400">Stock</p>
                  <p className="text-sm font-medium text-cinematic-900 dark:text-cinematic-300">{product.stock}</p> {/* Adjusted text color */}
                </div>
                <div>
                  <p className="text-sm text-cinematic-500 dark:text-cinematic-400">Featured</p>
                  <p className="text-sm font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.featured
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' // Adjusted dark mode badge colors
                        : 'bg-cinematic-100 text-cinematic-800 dark:bg-cinematic-700 dark:text-cinematic-300' // Adjusted dark mode badge colors
                    }`}>
                      {product.featured ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-cinematic-500 dark:text-cinematic-400">Slug</p>
                  <p className="text-sm font-medium text-cinematic-900 dark:text-cinematic-300">{product.slug}</p> {/* Adjusted text color */}
                </div>
                <div>
                  <p className="text-sm text-cinematic-500 dark:text-cinematic-400">Created At</p>
                  <p className="text-sm font-medium text-cinematic-900 dark:text-cinematic-300"> {/* Adjusted text color */}
                    {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-cinematic-200 dark:border-cinematic-700 pt-4"> {/* Adjusted border color */}
              <h3 className="text-lg font-medium text-cinematic-900 dark:text-cinematic-200">Description</h3> {/* Adjusted text color */}
              <div className="mt-2 prose prose-sm text-cinematic-700 dark:text-cinematic-300 dark:prose-invert max-w-none"> {/* Adjusted text color and added dark:prose-invert */}
                <p>{product.description || 'No description provided.'}</p> {/* Added fallback text */}
              </div>
            </div>

            <div className="border-t border-cinematic-200 dark:border-cinematic-700 pt-4"> {/* Adjusted border color */}
              <h3 className="text-lg font-medium text-cinematic-900 dark:text-cinematic-200">Actions</h3> {/* Adjusted text color */}
              <div className="mt-2 flex flex-wrap gap-2"> {/* Use flex-wrap and gap */}
                <Link
                  href={route('admin.products.toggle-featured', product.id)}
                  method="post"
                  as="button"
                  preserveScroll // Keep scroll position after action
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    product.featured
                      ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-800/50' // Adjusted dark mode button colors
                      : 'bg-cinematic-100 text-cinematic-800 hover:bg-cinematic-200 dark:bg-cinematic-700 dark:text-cinematic-300 dark:hover:bg-cinematic-600' // Adjusted dark mode button colors
                  }`}
                >
                  {product.featured ? 'Remove from Featured' : 'Mark as Featured'}
                </Link>
                <Link
                  href={route('admin.products.destroy', product.id)}
                  method="delete"
                  as="button"
                  preserveScroll // Keep scroll position after action
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-800/50" // Adjusted dark mode button colors
                  onClick={(e) => {
                    if (!confirm('Are you sure you want to delete this product?')) {
                      e.preventDefault();
                    }
                  }}
                >
                  Delete Product
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products (if available) */}
      {product.related_products && product.related_products.length > 0 && (
        <div className="bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Added dark mode classes and border */}
          <h3 className="text-lg font-medium text-cinematic-900 dark:text-cinematic-200 mb-4">Related Products</h3> {/* Adjusted text color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> {/* Adjusted grid columns */}
            {product.related_products.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-cinematic-900 border border-cinematic-200 dark:border-cinematic-700 rounded-lg overflow-hidden shadow-sm dark:shadow-soft" // Adjusted dark mode colors and border
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-cinematic-200 dark:bg-cinematic-700"> {/* Adjusted bg color */}
                  <img
                    src={
                      relatedProduct.image
                        ? `/storage/${relatedProduct.image}?v=${new Date().getTime()}`
                        : relatedProduct.images && relatedProduct.images[0]?.url
                          ? `/storage/${relatedProduct.images[0].url}?v=${new Date().getTime()}`
                          : `/assets/default-product.png?v=${new Date().getTime()}`
                    }
                    alt={relatedProduct.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-cinematic-900 dark:text-cinematic-200">{relatedProduct.name}</h4> {/* Adjusted text color */}
                  <p className="mt-1 text-sm text-cinematic-500 dark:text-cinematic-400">${formatPrice(relatedProduct.price)}</p> {/* Adjusted text color */}
                  <div className="mt-2">
                    <Link
                      href={route('admin.products.show', relatedProduct.id)}
                      className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300" // Adjusted colors
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductShow;
