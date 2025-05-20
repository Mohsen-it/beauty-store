import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { t } from '@/utils/translate';

import CinematicLayout from '@/Layouts/CinematicLayout';

const ProductShow = ({ product, relatedProducts }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  const [isLiked, setIsLiked] = useState(product.is_liked || false);
  const [productImages, setProductImages] = useState([]);
  // State to track when a product is being added to cart (for animation)
  const [addingToCart, setAddingToCart] = useState(false);
  // State to track which related product is being added to cart
  const [addingRelatedToCart, setAddingRelatedToCart] = useState(null);

  // State to track quantity for each related product
  const [relatedProductQuantities, setRelatedProductQuantities] = useState({});

  // Create a form for each related product
  const relatedProductForms = {};
  relatedProducts.forEach(relatedProduct => {
    // Initialize quantity state if not exists
    if (!relatedProductQuantities[relatedProduct.id]) {
      relatedProductQuantities[relatedProduct.id] = 1;
    }

    relatedProductForms[relatedProduct.id] = useForm({
      product_id: relatedProduct.id,
      quantity: relatedProductQuantities[relatedProduct.id] || 1
    });
  });

  // Process product images on component mount
  useEffect(() => {
    // Start with main product image
    const images = [];
    if (product.image) {
      images.push(product.image);
    }

    // Add images from the relationship
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img.url) {
          images.push(img.url);
        }
      });
    }
    // Fallback to gallery if no relationship images
    else if (product.gallery) {
      try {
        // Check if gallery is a string (JSON) and parse it
        if (typeof product.gallery === 'string') {
          const galleryArray = JSON.parse(product.gallery);
          if (Array.isArray(galleryArray)) {
            galleryArray.forEach(img => images.push(img));
          }
        }
        // If it's already an array, use it directly
        else if (Array.isArray(product.gallery)) {
          product.gallery.forEach(img => images.push(img));
        }
      } catch (error) {
        console.error("Error processing gallery:", error);
      }
    }

    // Set images and default active image to the first one
    setProductImages(images);
    if (images.length > 0) {
      setActiveImage(images[0]); // Set the first image as active
    }
  }, [product]);

  // We'll use the setData function to keep track of quantity changes,
  // but we won't use the post method since we're using fetch API directly
  const { setData } = useForm({
    product_id: product.id,
    quantity: quantity
  });
  // Add useEffect to track quantity changes
  useEffect(() => {
    // This ensures React properly tracks the quantity state changes
    console.log("Quantity updated:", quantity);
    // Update form data when quantity changes
    setData('quantity', quantity);
  }, [quantity]);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    // Set the product as being added to cart (for animation)
    setAddingToCart(true);

    try {
      // Use Fetch API instead of Inertia
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      const response = await fetch(route('cart.add'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity
        })
      });

      const data = await response.json();

      if (data.success) {
        // Display success message
        toast.success(data.message || 'Product added to cart successfully');

        // Update cart count immediately
        if (data.count) {
          // Update cart count using custom event
          window.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { count: parseInt(data.count) }
          }));
        }
      } else {
        toast.error(data.message || 'Failed to add product to cart');
      }

      // Remove adding state after a short delay
      setTimeout(() => {
        setAddingToCart(false);
      }, 1000);

    } catch (error) {
      console.error('Cart error:', error);
      toast.error('Failed to add product to cart');
      // Remove adding state in case of error
      setAddingToCart(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Functions for related products quantity control
  const incrementRelatedQuantity = (productId) => {
    const currentProduct = relatedProducts.find(p => p.id === productId);
    const currentQuantity = relatedProductQuantities[productId] || 1;

    if (currentProduct && currentQuantity < currentProduct.stock) {
      const newQuantities = { ...relatedProductQuantities };
      newQuantities[productId] = currentQuantity + 1;
      setRelatedProductQuantities(newQuantities);

      // Update form data
      relatedProductForms[productId].setData('quantity', newQuantities[productId]);
    }
  };

  const decrementRelatedQuantity = (productId) => {
    const currentQuantity = relatedProductQuantities[productId] || 1;

    if (currentQuantity > 1) {
      const newQuantities = { ...relatedProductQuantities };
      newQuantities[productId] = currentQuantity - 1;
      setRelatedProductQuantities(newQuantities);

      // Update form data
      relatedProductForms[productId].setData('quantity', newQuantities[productId]);
    }
  };

  const handleRelatedAddToCart = async (productId) => {
    // Set the product as being added to cart (for animation)
    setAddingRelatedToCart(productId);

    try {
      // Use Fetch API instead of Inertia
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      const response = await fetch(route('cart.add'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: relatedProductQuantities[productId] || 1
        })
      });

      const data = await response.json();

      if (data.success) {
        // Display success message
        toast.success(data.message || 'Product added to cart successfully');

        // Update cart count immediately
        if (data.count) {
          // Update cart count using custom event
          window.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { count: parseInt(data.count) }
          }));
        }
      } else {
        toast.error(data.message || 'Failed to add product to cart');
      }

      // Remove adding state after a short delay
      setTimeout(() => {
        setAddingRelatedToCart(null);
      }, 1000);

    } catch (error) {
      console.error('Cart error:', error);
      toast.error('Failed to add product to cart');
      // Remove adding state in case of error
      setAddingRelatedToCart(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <CinematicLayout>
      <Head title={`${product.name} - ${t('app.title')}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href={route('home')} className="text-gray-500 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400">
                {t('common.home')}
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link href={route('products.index')} className="ml-1 text-gray-500 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 md:ml-2">
                  {t('products.title')}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-gray-500 dark:text-gray-300 md:ml-2">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-white dark:bg-cinematic-800 border border-gray-200 dark:border-cinematic-700">
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={activeImage}
                  src={activeImage || `/assets/default-product.png`}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {/* Gallery */}
            {productImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveImage(image)}
                    className={`cursor-pointer rounded-md overflow-hidden bg-white dark:bg-cinematic-800 border border-gray-200 dark:border-cinematic-700 ${activeImage === image ? 'ring-2 ring-pink-500' : ''}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-20 w-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-2">
              <Link
                href={route('products.index', { category: product.category_id })}
                className="text-sm font-medium text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300"
              >
                {product.category.name}
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>

            <div className="mb-6">
              {product.sale_price ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">${product.sale_price}</span>
                  <span className="ml-3 text-lg text-gray-500 dark:text-gray-400 line-through">${product.price}</span>
                  <span className="ml-3 px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-xs font-medium rounded">
                    {Math.round((1 - product.sale_price / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price}</span>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{t('products.description')}</h2>
              <div className="prose prose-sm text-gray-600 dark:text-gray-300">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{t('products.availability')}</h2>
              <p className={`text-sm ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {product.stock > 0 ? t('products.in_stock', { count: product.stock }) : t('products.out_of_stock')}
              </p>
            </div>

            <form onSubmit={handleAddToCart}>
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{t('products.quantity')}</h2>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    className="p-2 border border-gray-300 dark:border-cinematic-600 rounded-l-md bg-gray-100 dark:bg-cinematic-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-cinematic-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="p-2 w-16 text-center border-t border-b border-gray-300 dark:border-cinematic-600 bg-white dark:bg-cinematic-700 text-gray-900 dark:text-white"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    className="p-2 border border-gray-300 dark:border-cinematic-600 rounded-r-md bg-gray-100 dark:bg-cinematic-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-cinematic-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={addingToCart || product.stock === 0}
                  className={`flex-1 py-3 px-6 rounded-md text-white font-medium ${
                    product.stock === 0
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : addingToCart
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30'
                        : 'bg-pink-600 dark:bg-pink-700 hover:bg-pink-700 dark:hover:bg-pink-600'
                  }`}
                >
                  {addingToCart ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('common.adding')}
                    </span>
                  ) : t('cart.add_to_cart')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => {
                    // Toggle liked state immediately for visual feedback
                    setIsLiked(!isLiked);

                    // Send request to server
                    axios.post(route('products.toggle-like', product.id))
                      .then(response => {
                        // Update with server response
                        setIsLiked(response.data.is_liked);
                      })
                      .catch(error => {
                        console.error('Error toggling like:', error);
                        // Revert on error
                        setIsLiked(!isLiked);

                        // If unauthorized, redirect to login
                        if (error.response && error.response.status === 401) {
                          window.location.href = route('login');
                        }
                      });
                  }}
                  className={`p-3 rounded-md border ${
                    isLiked
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
                      : 'border-gray-300 dark:border-cinematic-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-cinematic-700'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
                    fill={isLiked ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>

   {/* Related Products */}
{relatedProducts.length > 0 && (
  <section className="mt-16">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('products.related_products')}</h2>
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >

      {relatedProducts.map((relatedProduct) => (
        <motion.div key={relatedProduct.id} variants={item}>
          <Link href={route('products.show', relatedProduct.slug)}>
            <div className="group bg-white dark:bg-cinematic-800 rounded-lg overflow-hidden shadow-md dark:shadow-soft hover:shadow-xl dark:hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-cinematic-700">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <img
                  src={relatedProduct.images[0]?.url || `/assets/default-product_1.png`}
                  alt={relatedProduct.name}
                  className="h-60 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm text-gray-500 dark:text-gray-400">{relatedProduct.category.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{relatedProduct.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    {relatedProduct.sale_price ? (
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-pink-600 dark:text-pink-400">${relatedProduct.sale_price}</span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">${relatedProduct.price}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900 dark:text-white">${relatedProduct.price}</span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRelatedAddToCart(relatedProduct.id);
                    }}
                    disabled={addingRelatedToCart === relatedProduct.id}
                    className={`p-2 rounded-full ${
                      addingRelatedToCart === relatedProduct.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30'
                        : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800/40'
                    } transition-all duration-300 relative overflow-hidden`}
                  >
                    {addingRelatedToCart === relatedProduct.id ? (
                      <>
                        {/* Spinner animation */}
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>

                        {/* Success animation overlay that appears after a delay */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      </>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  </section>
)}


      </div>
    </CinematicLayout>
  );
};

export default ProductShow;
