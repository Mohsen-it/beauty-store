import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react'; // Added router for potential redirect on success
import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

// Register FilePond plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

const ProductForm = ({ product = null, categories, errors: pageErrors }) => {
  const isEditing = !!product;

  const { data, setData, post, processing, errors, clearErrors, transform } = useForm({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    sale_price: product?.sale_price || '',
    category_id: product?.category_id || '',
    stock: product?.stock || 0,
    featured: product?.featured || false, // Changed from is_featured to match controller
    is_active: product?.is_active ?? true, // Changed from active to match controller
    // 'images' for new uploads will be handled by FilePond state and FormData directly
    // 'existing_images' for update will be constructed from FilePond state
  });

  // files state for FilePond
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (pageErrors) {
        // You might want to merge pageErrors into the form's errors state if needed
        // For now, assuming errors from useForm are automatically populated by Inertia
    }
  }, [pageErrors]);

  // Load existing images if editing
  useEffect(() => {
    if (isEditing && product && product.image_data && Array.isArray(product.image_data) && product.image_data.length > 0) {
      // Use the new image_data array that includes IDs
      const initialFilePondObjects = product.image_data.map((imageData) => {
        if (!imageData || !imageData.url) {
            return null; // Skip invalid data
        }

        const relativePath = imageData.url;
        const cleanRelativePath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        // Use image_url if available, otherwise construct it
        const posterUrl = imageData.image_url || `${import.meta.env.BASE_URL}storage/${cleanRelativePath}`;

        const fileName = relativePath.split('/').pop();
        const fileExtension = fileName.split('.').pop().toLowerCase();
        let fileType = 'application/octet-stream'; // Default type

        if (['jpg', 'jpeg'].includes(fileExtension)) {
          fileType = 'image/jpeg';
        } else if (fileExtension === 'png') {
          fileType = 'image/png';
        } else if (fileExtension === 'gif') {
          fileType = 'image/gif';
        }

        return {
          source: relativePath, // Identifier for FilePond
          options: {
            type: 'local', // Indicates it's an existing file/resource
            file: {
              name: fileName,
              type: fileType, // Provide the inferred file type
              // 'size' would ideally come from backend if available to fix "NaN GB"
            },
            metadata: {
              poster: posterUrl, // Full URL for preview
              relativePath: relativePath, // Store for submission if this image is kept
              imageId: imageData.id // Store the image ID
            }
          }
        };
      }).filter(item => item !== null); // Filter out any nulls from invalid data

      if (initialFilePondObjects.length > 0) {
        setFiles(initialFilePondObjects);
      } else {
        setFiles([]); // No valid images
      }
    } else if (isEditing && product && product.images && Array.isArray(product.images) && product.images.length > 0) {
      // Fallback to the old method if image_data is not available
      const initialFilePondObjects = product.images.map((relativePath) => {
        if (typeof relativePath !== 'string' || relativePath.trim() === '') {
            return null; // Skip invalid paths
        }
        const cleanRelativePath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        const posterUrl = `${import.meta.env.BASE_URL}storage/${cleanRelativePath}`;

        const fileName = relativePath.split('/').pop();
        const fileExtension = fileName.split('.').pop().toLowerCase();
        let fileType = 'application/octet-stream'; // Default type

        if (['jpg', 'jpeg'].includes(fileExtension)) {
          fileType = 'image/jpeg';
        } else if (fileExtension === 'png') {
          fileType = 'image/png';
        } else if (fileExtension === 'gif') {
          fileType = 'image/gif';
        }

        return {
          source: relativePath, // Identifier for FilePond
          options: {
            type: 'local', // Indicates it's an existing file/resource
            file: {
              name: fileName,
              type: fileType, // Provide the inferred file type
            },
            metadata: {
              poster: posterUrl, // Full URL for preview
              relativePath: relativePath // Store for submission if this image is kept
            }
          }
        };
      }).filter(item => item !== null);

      if (initialFilePondObjects.length > 0) {
        setFiles(initialFilePondObjects);
      } else {
        setFiles([]);
      }
    } else if (!isEditing) {
      setFiles([]); // Clear files when creating a new product
    } else {
      setFiles([]); // No images available
    }
  }, [isEditing, product]); // Dependency array

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors(); // Clear previous errors

    const formData = new FormData();

    // Append other form data fields from 'data' state
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Handle boolean values correctly for FormData
        if (typeof data[key] === 'boolean') {
          formData.append(key, data[key] ? '1' : '0');
        } else {
          formData.append(key, data[key]);
        }
      }
    }

    // Handle files from FilePond 'files' state
    let newFilesAdded = false;
    files.forEach(filePondItem => {
      if (filePondItem.file instanceof File) { // New file added by user
        formData.append('images[]', filePondItem.file, filePondItem.file.name);
        newFilesAdded = true;
      }
    });

    const submissionOptions = {
        forceFormData: true,
        onSuccess: () => {
            // Show success message
            toast.success(isEditing ? 'Product updated successfully' : 'Product created successfully');
            // router.visit(route('admin.products.index')); // Or rely on controller redirect
        },
        onError: (formErrors) => {
            // Show error message
            toast.error(isEditing ? 'Failed to update product' : 'Failed to create product');

            // Show specific error messages if available
            if (Object.keys(formErrors).length > 0) {
                Object.values(formErrors).forEach(error => {
                    toast.error(error);
                });
            }

            // Errors are automatically handled by useForm
            console.error("Submission errors:", formErrors);
        },
        // Preserve scroll and state if needed, though form submission usually resets
        preserveScroll: true,
        preserveState: true,
    };

    if (isEditing) {
      // Send IDs of existing images that should be kept
      const existingImagesToKeep = files
        .filter(fpItem => !(fpItem.file instanceof File))
        .map(fpItem => {
          // First try to get the image ID (new method)
          const imageId = fpItem.getMetadata('imageId');
          if (imageId) {
            return { id: imageId, path: fpItem.getMetadata('relativePath') };
          }
          // Fallback to just the path (old method)
          return { path: fpItem.getMetadata('relativePath') };
        })
        .filter(item => item.id || item.path); // Filter out any items without id or path

      // Add existing image IDs to the form data
      existingImagesToKeep.forEach(item => {
        if (item.id) {
          formData.append('existing_image_ids[]', item.id);
        }
        // Also include paths for backward compatibility
        if (item.path) {
          formData.append('existing_images[]', item.path);
        }
      });

      formData.append('_method', 'PUT');
      // Inertia.post is used for PUT with FormData
      router.post(route('admin.products.update', product.id), formData, submissionOptions);
    } else {
      router.post(route('admin.products.store'), formData, submissionOptions);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setData(prevData => ({
      ...prevData,
      name,
      slug: generateSlug(name),
    }));
  };

  return (
    <AdminLayout title={isEditing ? 'Edit Product' : 'Create New Product'}>
      <Head title={isEditing ? 'Edit Product' : 'Create New Product'} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-cinematic-800 shadow-md dark:shadow-soft rounded-lg overflow-hidden border border-cinematic-200 dark:border-cinematic-700"
      >
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={handleNameChange}
                    className="mt-1 block w-full rounded-md border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300">
                    Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    className="mt-1 block w-full rounded-md border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300">
                    Category *
                  </label>
                  <select
                    id="category_id"
                    value={data.category_id}
                    onChange={(e) => setData('category_id', e.target.value)}
                    className="mt-1 block w-full rounded-md border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  >
                    <option value="" className="text-cinematic-500">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category_id}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300">
                      Regular Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-cinematic-500 dark:text-cinematic-400 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                        className="pl-7 block w-full rounded-md border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="sale_price" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300">
                      Sale Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-cinematic-500 dark:text-cinematic-400 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="sale_price"
                        value={data.sale_price}
                        onChange={(e) => setData('sale_price', e.target.value)}
                        className="pl-7 block w-full rounded-md border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    {errors.sale_price && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sale_price}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    value={data.stock}
                    onChange={(e) => setData('stock', e.target.value)}
                    className="mt-1 block w-full rounded-md border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    min="0"
                    required
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock}</p>
                  )}
                </div>
              </div>

              {/* Description, Images, and Status */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300">
                    Product Images (Max 5, 2MB each, JPG/PNG/GIF)
                  </label>
                  <div className="mt-1 filepond-dark">
                    <FilePond
                      files={files}
                      onupdatefiles={setFiles} // Manages the 'files' state
                      allowMultiple={true}
                      maxFiles={5}
                      maxFileSize="2MB"
                      // server prop is removed as per requirements (UI only)
                      name="images" // This is more of a hint, actual field name is 'images[]' in FormData
                      labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
                      acceptedFileTypes={['image/png', 'image/jpeg', 'image/gif']}
                      fileValidateTypeLabelExpectedTypes="Expects PNG, JPG, or GIF"
                      labelMaxFileSizeExceeded="File is too large"
                      labelMaxFileSize="Maximum file size is {filesize}"
                      credits={false}
                    />
                  </div>
                  {errors.images && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.images}</p>
                  )}
                  {/* For individual file errors (e.g. images.0) */}
                  {Object.keys(errors).map(key => {
                    if (key.startsWith('images.')) {
                        return <p key={key} className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[key]}</p>;
                    }
                    return null;
                  })}
                </div>

                <div className="flex items-start space-x-6">
                  <div className="flex items-center">
                    <input
                      id="featured"
                      type="checkbox"
                      checked={data.featured}
                      onChange={(e) => setData('featured', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-700 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-cinematic-700 dark:text-cinematic-300">
                      Featured Product
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="is_active"
                      type="checkbox"
                      checked={data.is_active}
                      onChange={(e) => setData('is_active', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-700 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-cinematic-700 dark:text-cinematic-300">
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-cinematic-200 dark:border-cinematic-700">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={processing}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  {processing ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
      <style jsx="true" global="true">{`
        .filepond--panel-root {
            background-color: #374151; // Corresponds to dark:bg-cinematic-700 or similar
            border: 1px dashed #4B5563; // Corresponds to dark:border-cinematic-600 or similar
        }
        .filepond--drop-label label {
            color: #D1D5DB; // Corresponds to dark:text-cinematic-300 or similar
        }
        .filepond--label-action {
            text-decoration-color: #9CA3AF;
        }
        .filepond--file-action-button {
            color: #D1D5DB;
        }
        .filepond--file-info-main, .filepond--file-info-sub {
            color: #D1D5DB;
        }
        .filepond--item-panel {
            background-color: #4B5563;
        }
        /* Add more specific FilePond dark theme overrides if needed */
      `}</style>
    </AdminLayout>
  );
};

export default ProductForm;

