import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react'; // Added router
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

const CategoryForm = ({ category = null, categories: parentCategoriesList, errors: pageErrors }) => {
  const isEditing = !!category;

  const { data, setData, post, processing, errors, clearErrors } = useForm({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    parent_id: category?.parent_id || '',
    order: category?.order || 0,
    active: category?.is_active ?? true,
    // image_file will be handled by FilePond state and FormData directly
    // remove_image flag for explicitly removing the image on update
  });

  const [filePondFile, setFilePondFile] = useState([]); // For FilePond (expects an array)
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  useEffect(() => {
    if (pageErrors) {
        // Errors from useForm are automatically populated by Inertia
    }
  }, [pageErrors]);

  useEffect(() => {
    if (isEditing && category && category.image_url) {
      setFilePondFile([{
        source: category.image_url, // Identifier for FilePond
        options: {
          type: 'local', // Indicates it's a reference to an existing file/resource
          file: {
            name: category.image_url.split('/').pop(),
          },
          metadata: {
            poster: `${import.meta.env.BASE_URL}storage/${category.image_url}`, // Full URL for preview
            relativePath: category.image_url
          }
        }
      }]);
      setRemoveCurrentImage(false); // Reset remove flag when loading an existing image
    } else if (!isEditing) {
      setFilePondFile([]);
      setRemoveCurrentImage(false);
    }
  }, [isEditing, category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearErrors();

    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === 'boolean') {
          formData.append(key, data[key] ? '1' : '0');
        } else {
          formData.append(key, data[key]);
        }
      }
    }

    if (filePondFile.length > 0 && filePondFile[0].file instanceof File) {
      formData.append('image_file', filePondFile[0].file, filePondFile[0].file.name);
    } else if (isEditing && removeCurrentImage) {
        formData.append('remove_image', '1');
    }

    const submissionOptions = {
        forceFormData: true,
        onSuccess: () => {
            // Show success message
            toast.success(isEditing ? 'Category updated successfully' : 'Category created successfully');
            // Controller will redirect
        },
        onError: (formErrors) => {
            console.error("Submission errors:", formErrors);
            toast.error(isEditing ? 'Failed to update category' : 'Failed to create category');

            // Show specific error messages if available
            if (Object.keys(formErrors).length > 0) {
                Object.values(formErrors).forEach(error => {
                    toast.error(error);
                });
            }
        },
        preserveScroll: true,
        preserveState: true,
    };

    if (isEditing) {
      formData.append('_method', 'PUT');
      router.post(route('admin.categories.update', category.id), formData, submissionOptions);
    } else {
      router.post(route('admin.categories.store'), formData, submissionOptions);
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

  const getAvailableParents = () => {
    if (!parentCategoriesList) return [];
    if (!isEditing) return parentCategoriesList;

    const getChildIds = (parentId, allCategories) => {
      const children = allCategories.filter(cat => cat.parent_id === parentId);
      let ids = [parentId];
      children.forEach(child => {
        ids = [...ids, ...getChildIds(child.id, allCategories)];
      });
      return ids;
    };

    const excludeIds = getChildIds(category.id, parentCategoriesList);
    return parentCategoriesList.filter(cat => !excludeIds.includes(cat.id));
  };

  const availableParents = getAvailableParents();

  return (
    <AdminLayout title={isEditing ? 'Edit Category' : 'Create New Category'}>
      <Head title={isEditing ? 'Edit Category' : 'Create New Category'} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-cinematic-800 shadow-md dark:shadow-soft rounded-lg overflow-hidden border border-cinematic-200 dark:border-cinematic-700"
      >
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300">
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={handleNameChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300">
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  value={data.slug}
                  onChange={(e) => setData('slug', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300">
                  Description
                </label>
                <textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-cinematic-300 mb-2">
                  Category Image (Max 2MB, JPG/PNG/GIF)
                </label>
                <div className="filepond-dark-theme">
                  <FilePond
                    files={filePondFile}
                    onupdatefiles={setFilePondFile} // Manages the 'filePondFile' state
                    allowMultiple={false} // Single file for category image
                    maxFiles={1}
                    maxFileSize="2MB"
                    // server prop is removed as per requirements (UI only)
                    name="image_file" // This will be the key in FormData if a new file is added
                    labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                    acceptedFileTypes={['image/png', 'image/jpeg', 'image/gif']}
                    fileValidateTypeLabelExpectedTypes="Expects PNG, JPG, or GIF"
                    labelMaxFileSizeExceeded="File is too large"
                    labelMaxFileSize="Maximum file size is {filesize}"
                    credits={false}
                    imagePreviewHeight={170}
                    stylePanelLayout="compact"
                  />
                </div>
                {isEditing && category?.image_url && filePondFile.length > 0 && ! (filePondFile[0].file instanceof File) && (
                    <div className="mt-2">
                        <label htmlFor="remove_image_checkbox" className="flex items-center text-sm text-gray-700 dark:text-cinematic-300">
                            <input
                                type="checkbox"
                                id="remove_image_checkbox"
                                checked={removeCurrentImage}
                                onChange={(e) => {
                                    setRemoveCurrentImage(e.target.checked);
                                    if (e.target.checked) {
                                        setFilePondFile([]); // Clear FilePond if removing
                                    }
                                }}
                                className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 dark:border-cinematic-600 rounded dark:bg-cinematic-700"
                            />
                            Remove current image
                        </label>
                    </div>
                )}
                {errors.image_file && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image_file}</p>
                )}
              </div>

              <div>
                <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300">
                  Parent Category
                </label>
                <select
                  id="parent_id"
                  value={data.parent_id}
                  onChange={(e) => setData('parent_id', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="">None (Top Level)</option>
                  {availableParents.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.parent_id && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.parent_id}</p>
                )}
              </div>

              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300">
                  Display Order
                </label>
                <input
                  type="number"
                  id="order"
                  value={data.order}
                  onChange={(e) => setData('order', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  min="0"
                />
                {errors.order && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.order}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-cinematic-400">
                  Categories are displayed in ascending order (lower numbers first).
                </p>
              </div>

              <div className="flex items-center">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={data.is_active}
                  onChange={(e) => setData('is_active', e.target.checked)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 dark:border-cinematic-600 rounded dark:bg-cinematic-700 dark:focus:ring-offset-cinematic-800"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700 dark:text-cinematic-300">
                  Active
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => router.get(route('admin.categories.index'))} // Use router for navigation
                className="mr-3 px-4 py-2 border border-gray-300 dark:border-cinematic-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-cinematic-300 bg-white dark:bg-cinematic-700 hover:bg-gray-50 dark:hover:bg-cinematic-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-cinematic-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:bg-pink-700 dark:hover:bg-pink-600 dark:focus:ring-offset-cinematic-800 disabled:opacity-50"
              >
                {processing ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
      <style jsx global>{`
        .filepond--panel-root {
            background-color: #374151;
            border: 1px dashed #4B5563;
        }
        .filepond--drop-label label {
            color: #D1D5DB;
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
      `}</style>
    </AdminLayout>
  );
};

export default CategoryForm;

