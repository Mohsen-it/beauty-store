import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

const CategoryForm = ({ category = null, parentCategories = [], isEditing = false }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    category && category.image ? category.image : null
  );

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: category ? category.name : '',
    description: category ? category.description : '',
    parent_id: category ? category.parent_id : '',
    status: category ? category.status : 'active',
    order: category ? category.order : 0,
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      put(route('admin.categories.update', category.id));
    } else {
      post(route('admin.categories.store'));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setData('image', file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Category Name */}
            <div>
              <label htmlFor="name" className="form-label">Category Name</label>
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
            
            {/* Parent Category */}
            <div>
              <label htmlFor="parent_id" className="form-label">Parent Category</label>
              <select
                id="parent_id"
                className={`form-input ${errors.parent_id ? 'border-red-500' : ''}`}
                value={data.parent_id}
                onChange={(e) => setData('parent_id', e.target.value)}
              >
                <option value="">None (Top Level)</option>
                {parentCategories.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </select>
              {errors.parent_id && <p className="mt-1 text-sm text-red-500">{errors.parent_id}</p>}
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
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
            </div>
            
            {/* Display Order */}
            <div>
              <label htmlFor="order" className="form-label">Display Order</label>
              <input
                id="order"
                type="number"
                min="0"
                className={`form-input ${errors.order ? 'border-red-500' : ''}`}
                value={data.order}
                onChange={(e) => setData('order', e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
              {errors.order && <p className="mt-1 text-sm text-red-500">{errors.order}</p>}
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              rows="3"
              className={`form-input ${errors.description ? 'border-red-500' : ''}`}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
          
          {/* Category Image */}
          <div>
            <label className="form-label">Category Image</label>
            <div className="mt-1 flex items-center space-x-6">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <div className="relative h-24 w-24 rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="h-24 w-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedImage(null);
                        setData('image', null);
                      }}
                      className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-sm"
                    >
                      <svg className="h-4 w-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="image"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                >
                  <span>Upload an image</span>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 2MB</p>
                {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 text-right">
          <Link
            href={route('admin.categories.index')}
            className="btn btn-secondary mr-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={processing}
          >
            {processing ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
