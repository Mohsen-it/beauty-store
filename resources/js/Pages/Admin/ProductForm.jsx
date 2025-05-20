import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";

const ProductForm = ({ categories, product = null, isEditing = false }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState(
    product && product.images ? product.images : []
  );

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: product ? product.name : "",
    description: product ? product.description : "",
    price: product ? product.price : "",
    sale_price: product ? product.sale_price : "",
    category_id: product ? product.category_id : "",
    stock_quantity: product ? product.stock_quantity : "",
    is_featured: product ? product.is_featured : false,
    status: product ? product.status : "active",
    images: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      put(route("admin.products.update", product.id));
    } else {
      post(route("admin.products.store"));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages(filesArray);

      // Create preview URLs
      const imagePreviewUrls = filesArray.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages([...previewImages, ...imagePreviewUrls]);

      // Update form data
      setData("images", [...data.images, ...e.target.files]);
    }
  };

  const removeImage = (index) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    if (index < selectedImages.length) {
      const updatedSelected = [...selectedImages];
      updatedSelected.splice(index, 1);
      setSelectedImages(updatedSelected);

      // Update form data
      const updatedImages = [...data.images];
      updatedImages.splice(index, 1);
      setData("images", updatedImages);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="form-label">
                Product Name
              </label>
              <input
                id="name"
                type="text"
                className={`form-input ${errors.name ? "border-red-500" : ""}`}
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category_id" className="form-label">
                Category
              </label>
              <select
                id="category_id"
                className={`form-input ${errors.category_id ? "border-red-500" : ""}`}
                value={data.category_id}
                onChange={(e) => setData("category_id", e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category_id}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="form-label">
                Regular Price ($)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className={`form-input ${errors.price ? "border-red-500" : ""}`}
                value={data.price}
                onChange={(e) => setData("price", e.target.value)}
                required
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            {/* Sale Price */}
            <div>
              <label htmlFor="sale_price" className="form-label">
                Sale Price ($)
              </label>
              <input
                id="sale_price"
                type="number"
                step="0.01"
                min="0"
                className={`form-input ${errors.sale_price ? "border-red-500" : ""}`}
                value={data.sale_price}
                onChange={(e) => setData("sale_price", e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty if not on sale
              </p>
              {errors.sale_price && (
                <p className="mt-1 text-sm text-red-500">{errors.sale_price}</p>
              )}
            </div>

            {/* Stock Quantity */}
            <div>
              <label htmlFor="stock_quantity" className="form-label">
                Stock Quantity
              </label>
              <input
                id="stock_quantity"
                type="number"
                min="0"
                className={`form-input ${errors.stock_quantity ? "border-red-500" : ""}`}
                value={data.stock_quantity}
                onChange={(e) => setData("stock_quantity", e.target.value)}
                required
              />
              {errors.stock_quantity && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stock_quantity}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                className={`form-input ${errors.status ? "border-red-500" : ""}`}
                value={data.status}
                onChange={(e) => setData("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-500">{errors.status}</p>
              )}
            </div>
          </div>

          {/* Featured Product */}
          <div className="flex items-center">
            <input
              id="is_featured"
              type="checkbox"
              className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              checked={data.is_featured}
              onChange={(e) => setData("is_featured", e.target.checked)}
            />
            <label
              htmlFor="is_featured"
              className="ml-2 block text-sm text-gray-700"
            >
              Featured Product
            </label>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              className={`form-input ${errors.description ? "border-red-500" : ""}`}
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              required
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Product Images */}
          <div>
            <label className="form-label">Product Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                  >
                    <span>Upload images</span>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            {errors.images && (
              <p className="mt-1 text-sm text-red-500">{errors.images}</p>
            )}

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 -mt-2 -mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 hover:text-red-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove image</span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 text-right">
          <Link
            href={route("admin.products.index")}
            className="btn btn-secondary mr-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={processing}
          >
            {processing
              ? "Saving..."
              : isEditing
                ? "Update Product"
                : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
