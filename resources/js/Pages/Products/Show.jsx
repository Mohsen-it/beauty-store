import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { t } from '@/utils/translate';
import { getCsrfHeaders, refreshCsrfToken } from '@/utils/csrf';
import '../../../css/category-circles.css';
import '../../../css/product-page.css';
import '../../../css/mobile-first.css';
import ImageLightbox from '@/Components/ImageLightbox';

import CinematicLayout from '@/Layouts/CinematicLayout';

const ProductShow = ({ product, relatedProducts }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image_url);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(product.is_liked || false);
  const [productImages, setProductImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // State to track when a product is being added to cart (for animation)
  const [addingToCart, setAddingToCart] = useState(false);
  // State to track which related product is being added to cart
  const [addingRelatedToCart, setAddingRelatedToCart] = useState(null);

  // Mobile-first states
  const [activeAccordion, setActiveAccordion] = useState('description');
  const galleryRef = useRef(null);
  const [galleryScrolling, setGalleryScrolling] = useState(false);

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

  // Refresh CSRF token on component mount
  useEffect(() => {
    // Refresh the CSRF token when the component mounts
    refreshCsrfToken().catch(error => {
      console.error('Failed to refresh CSRF token on page load:', error);
    });
  }, []);

  // Process product images on component mount
  useEffect(() => {
    // Start with main product image
    const images = [];
    if (product.image_url) {
      images.push(product.image_url);
    }

    // Add images from the relationship
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        // Try to get image_url first
        if (img.image_url) {
          images.push(img.image_url);
        }
        // If image_url is not available, try to construct URL from url property
        else if (img.url) {
          // Check if url already starts with http:// or https://
          if (img.url.startsWith('http://') || img.url.startsWith('https://')) {
            images.push(img.url);
          } else {
            // If url doesn't have storage/ prefix, add it
            const path = img.url.startsWith('storage/') ? img.url : `storage/${img.url.replace(/^\//, '')}`;
            images.push(`/${path}?v=${new Date().getTime()}`);
          }
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

    // Remove duplicates
    const uniqueImages = [...new Set(images)];

    // Set images and default active image to the first one
    setProductImages(uniqueImages);
    if (uniqueImages.length > 0) {
      setActiveImage(uniqueImages[0]); // Set the first image as active
      setActiveImageIndex(0);
    }
  }, [product]);

  // Update active image index when active image changes
  useEffect(() => {
    const index = productImages.findIndex(img => img === activeImage);
    if (index !== -1) {
      setActiveImageIndex(index);
    }
  }, [activeImage, productImages]);

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
      // Refresh CSRF token first to ensure we have the latest token
      await refreshCsrfToken();

      // Use the utility function to get CSRF headers
      const headers = getCsrfHeaders();

      const response = await fetch(route('cart.add'), {
        method: 'POST',
        headers,
        credentials: 'same-origin', // Important for cookies
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity
        })
      });

      // Check if the response is a redirect to login page (unauthenticated)
      if (response.redirected && response.url.includes('/login')) {
        // Redirect to login page
        window.location.href = response.url;
        return;
      }

      // Check for 401 Unauthorized status
      if (response.status === 401) {
        // Redirect to login page
        window.location.href = route('login');
        return;
      }

      // Check for CSRF token mismatch (419 status)
      if (response.status === 419) {
        // Try to refresh the token and retry the request once
        await refreshCsrfToken();

        // Get fresh headers after token refresh
        const freshHeaders = getCsrfHeaders();

        // Retry the request with fresh token
        const retryResponse = await fetch(route('cart.add'), {
          method: 'POST',
          headers: freshHeaders,
          credentials: 'same-origin',
          body: JSON.stringify({
            product_id: product.id,
            quantity: quantity
          })
        });

        if (retryResponse.ok) {
          const retryData = await retryResponse.json();

          if (retryData.success) {
            // Display success message
            toast.success(retryData.message || 'Product added to cart successfully');

            // Update cart count immediately
            if (retryData.count) {
              window.dispatchEvent(new CustomEvent('cart-updated', {
                detail: { count: parseInt(retryData.count) }
              }));
            }

            // Remove adding state after a short delay
            setTimeout(() => {
              setAddingToCart(false);
            }, 1000);

            return;
          }
        }

        // If retry failed, show error
        toast.error('Session expired. Please refresh the page and try again.');
        setAddingToCart(false);
        return;
      }

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
        // If the message indicates authentication is required, redirect to login
        if (data.message === 'Unauthenticated.' || data.message?.toLowerCase().includes('login')) {
          window.location.href = route('login');
          return;
        }
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
      // Refresh CSRF token first to ensure we have the latest token
      await refreshCsrfToken();

      // Use the utility function to get CSRF headers
      const headers = getCsrfHeaders();

      const response = await fetch(route('cart.add'), {
        method: 'POST',
        headers,
        credentials: 'same-origin', // Important for cookies
        body: JSON.stringify({
          product_id: productId,
          quantity: relatedProductQuantities[productId] || 1
        })
      });

      // Check if the response is a redirect to login page (unauthenticated)
      if (response.redirected && response.url.includes('/login')) {
        // Redirect to login page
        window.location.href = response.url;
        return;
      }

      // Check for 401 Unauthorized status
      if (response.status === 401) {
        // Redirect to login page
        window.location.href = route('login');
        return;
      }

      // Check for CSRF token mismatch (419 status)
      if (response.status === 419) {
        // Try to refresh the token and retry the request once
        await refreshCsrfToken();

        // Get fresh headers after token refresh
        const freshHeaders = getCsrfHeaders();

        // Retry the request with fresh token
        const retryResponse = await fetch(route('cart.add'), {
          method: 'POST',
          headers: freshHeaders,
          credentials: 'same-origin',
          body: JSON.stringify({
            product_id: productId,
            quantity: relatedProductQuantities[productId] || 1
          })
        });

        if (retryResponse.ok) {
          const retryData = await retryResponse.json();

          if (retryData.success) {
            // Display success message
            toast.success(retryData.message || 'Product added to cart successfully');

            // Update cart count immediately
            if (retryData.count) {
              window.dispatchEvent(new CustomEvent('cart-updated', {
                detail: { count: parseInt(retryData.count) }
              }));
            }

            // Remove adding state after a short delay
            setTimeout(() => {
              setAddingRelatedToCart(null);
            }, 1000);

            return;
          }
        }

        // If retry failed, show error
        toast.error('Session expired. Please refresh the page and try again.');
        setAddingRelatedToCart(null);
        return;
      }

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
        // If the message indicates authentication is required, redirect to login
        if (data.message === 'Unauthenticated.' || data.message?.toLowerCase().includes('login')) {
          window.location.href = route('login');
          return;
        }
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

  // Function to handle mobile gallery scrolling
  const handleGalleryScroll = (index) => {
    if (galleryRef.current) {
      setGalleryScrolling(true);
      setActiveImageIndex(index);

      const slideWidth = galleryRef.current.offsetWidth;
      galleryRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });

      setTimeout(() => {
        setGalleryScrolling(false);
      }, 500);
    }
  };

  // Function to toggle accordion sections
  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <CinematicLayout>
      <Head title={`${product.name} - ${t('app.title')}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb navigation - Hidden on mobile, visible on tablet and up */}
        <nav className="hidden sm:flex mb-4 sm:mb-6 lg:mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href={route('home')} className="text-gray-500 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                {t('common.home')}
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link href={route('products.index')} className="text-gray-500 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                  {t('products.title')}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="text-gray-500 dark:text-gray-300 max-w-[200px] sm:max-w-xs truncate">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Mobile Back Button - Only visible on mobile */}
        <div className="sm:hidden mb-4">
          <Link
            href={route('products.index')}
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('common.back_to_products')}
          </Link>
        </div>

        {/* Mobile-First Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Header Section - First on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <div className="product-info-section">
              <Link
                href={route('products.index', { category: product.category_id })}
                className="product-category"
              >
                {product.category.name}
              </Link>
              <h1 className="product-title">{product.name}</h1>

              {/* Product Rating */}
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {product.review_count || 42} {t('products.reviews')}
                </span>
              </div>

              {/* Price section */}
              <div className="price-section">
                {product.sale_price ? (
                  <>
                    <span className="current-price">${product.sale_price}</span>
                    <span className="original-price">${product.price}</span>
                    <span className="discount-badge">
                      {Math.round((1 - product.sale_price / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="current-price">${product.price}</span>
                )}
              </div>

              {/* Product availability - Mobile only */}
              <div className="sm:hidden mt-2">
                {product.stock > 0 ? (
                  <div className="flex items-center">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      {t('products.in_stock', { count: product.stock })}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></div>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                      {t('products.out_of_stock')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product Images - Second on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            {/* Mobile Gallery */}
            <div className="relative mb-4">
              <div className="mobile-gallery-container">
                <div
                  ref={galleryRef}
                  className="mobile-gallery"
                  onScroll={() => {
                    if (!galleryScrolling && galleryRef.current) {
                      const index = Math.round(galleryRef.current.scrollLeft / galleryRef.current.offsetWidth);
                      if (index !== activeImageIndex) {
                        setActiveImageIndex(index);
                        setActiveImage(productImages[index]);
                      }
                    }
                  }}
                >
                  {productImages.length > 0 ? (
                    productImages.map((image, index) => (
                      <div key={index} className="mobile-gallery-slide">
                        <img
                          src={image || `/assets/default-product.png`}
                          alt={`${product.name} ${index + 1}`}
                          loading={index === 0 ? "eager" : "lazy"}
                          onError={(e) => {
                            e.target.src = `/assets/default-product.png`;
                          }}
                        />

                        {/* Sale discount tag - Only show on first slide */}
                        {index === 0 && product.sale_price && (
                          <div className="category-circle">
                            <div className="category-circle-overlay"></div>
                            <div className="category-circle-content">
                              <div className="category-circle-discount">
                                {Math.round((1 - product.sale_price / product.price) * 100)}%
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="mobile-gallery-slide">
                      <img
                        src={`/assets/default-product.png`}
                        alt={product.name}
                        loading="eager"
                      />
                    </div>
                  )}
                </div>

                {/* Lightbox trigger button */}
                <div
                  className="lightbox-trigger"
                  onClick={() => setLightboxOpen(true)}
                  role="button"
                  aria-label="Open image gallery"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setLightboxOpen(true);
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>

              {/* Gallery Dots */}
              {productImages.length > 1 && (
                <div className="mobile-gallery-dots">
                  {productImages.map((_, index) => (
                    <div
                      key={index}
                      className={`mobile-gallery-dot ${index === activeImageIndex ? 'active' : ''}`}
                      onClick={() => handleGalleryScroll(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail gallery - Hidden on mobile, visible on desktop */}
            {productImages.length > 1 && (
              <div className="thumbnail-gallery">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setActiveImage(image);
                      setActiveImageIndex(index);
                    }}
                    className={`thumbnail-item ${activeImageIndex === index ? 'active' : ''}`}
                    role="button"
                    aria-label={`View image ${index + 1} of ${product.name}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setActiveImage(image);
                        setActiveImageIndex(index);
                      }
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `/assets/default-product.png`;
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Lightbox component */}
            {lightboxOpen && (
              <ImageLightbox
                images={productImages.length > 0 ? productImages : [`/assets/default-product.png`]}
                initialIndex={activeImageIndex}
                onClose={() => setLightboxOpen(false)}
              />
            )}
          </motion.div>

          {/* Product Details - Third on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-3 lg:order-3 lg:col-span-2"
          >

              {/* Product description */}
              <div className="product-info-section">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('products.description')}</h2>
                <div className="product-description">
                  {product.description ? (
                    <p>{product.description}</p>
                  ) : (
                    <p>This premium product is designed to enhance your beauty routine with high-quality ingredients and exceptional results. Experience the difference with our carefully formulated solution.</p>
                  )}
                </div>
              </div>

              {/* Product Features */}
              <div className="product-info-section">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('products.features')}</h2>
                <ul className="space-y-3 product-description">
                  {(product.features || ['Dermatologically tested', 'Cruelty-free', 'Paraben-free', 'Suitable for all skin types']).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product availability */}
              <div className="product-info-section">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('products.availability')}</h2>
                <div className="flex items-center">
                  {product.stock > 0 ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <p className="text-green-600 dark:text-green-400 font-medium">
                        {t('products.in_stock', { count: product.stock })}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <p className="text-red-600 dark:text-red-400 font-medium">
                        {t('products.out_of_stock')}
                      </p>
                    </>
                  )}
                </div>
              </div>

            <form onSubmit={handleAddToCart} className="product-info-section">
              {/* Quantity selector */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('products.quantity')}</h2>
                <div className="quantity-selector">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1 || product.stock === 0}
                    className="quantity-btn"
                    aria-label="Decrease quantity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1 && val <= product.stock) {
                        setQuantity(val);
                      }
                    }}
                    className="quantity-input"
                    readOnly
                    aria-label="Product quantity"
                  />
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock || product.stock === 0}
                    className="quantity-btn"
                    aria-label="Increase quantity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                    Only {product.stock} {product.stock === 1 ? 'item' : 'items'} left in stock!
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="action-buttons">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={addingToCart || product.stock === 0}
                  className={`add-to-cart-btn ${
                    product.stock === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  aria-label={t('cart.add_to_cart')}
                >
                  {addingToCart ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('common.adding')}
                    </span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {t('cart.add_to_cart')}
                    </>
                  )}
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
                  className={`favorite-btn ${isLiked ? 'active' : ''}`}
                  aria-label={isLiked ? t('products.remove_from_wishlist') : t('products.add_to_wishlist')}
                  aria-pressed={isLiked}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
                    fill={isLiked ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </motion.button>
              </div>
            </form>

              {/* Shipping and Returns */}
              <div className="product-info-section">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('products.shipping_returns')}</h2>
                <ul className="space-y-3 product-description">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Free shipping on orders over $50. Standard delivery 3-5 business days.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">30-day easy returns. Return for any reason within 30 days for a full refund.</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-pink-500 dark:text-pink-400 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Secure payment processing with encryption and fraud protection for your peace of mind.</span>
                  </li>
                </ul>
              </div>
          </motion.div>
        </div>

   {/* Related Products */}
{relatedProducts.length > 0 && (
  <section className="mt-16 sm:mt-20">
    <h2 className="related-products-title">{t('products.related_products')}</h2>
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="related-products-grid"
    >
      {relatedProducts.map((relatedProduct) => (
        <motion.div key={relatedProduct.id} variants={item} className="h-full">
          <Link href={route('products.show', relatedProduct.slug)} className="h-full">
            <div className="group bg-white dark:bg-cinematic-800 rounded-lg overflow-hidden shadow-md dark:shadow-soft hover:shadow-xl dark:hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-cinematic-700 h-full flex flex-col transform hover:-translate-y-1">
              <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={
                    relatedProduct.images && relatedProduct.images.length > 0 ? (
                      relatedProduct.images[0]?.image_url
                        ? relatedProduct.images[0].image_url
                        : relatedProduct.images[0]?.url
                          ? relatedProduct.images[0].url.startsWith('http://') || relatedProduct.images[0].url.startsWith('https://')
                            ? relatedProduct.images[0].url
                            : relatedProduct.images[0].url.startsWith('storage/')
                              ? `/${relatedProduct.images[0].url}?v=${new Date().getTime()}`
                              : `/storage/${relatedProduct.images[0].url.replace(/^\//, '')}?v=${new Date().getTime()}`
                          : `/assets/default-product_1.png`
                    ) : (
                      relatedProduct.image_url
                        ? relatedProduct.image_url
                        : `/assets/default-product_1.png`
                    )
                  }
                  alt={relatedProduct.name}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = `/assets/default-product_1.png`;
                  }}
                />
                {relatedProduct.sale_price && (
                  <div className="category-circle">
                    <div className="category-circle-overlay"></div>
                    <div className="category-circle-content">
                      <div className="category-circle-discount">
                        {Math.round((1 - relatedProduct.sale_price / relatedProduct.price) * 100)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="product-category text-xs">{relatedProduct.category.name}</h3>
                <p className="product-title text-sm sm:text-base line-clamp-2 mb-2">{relatedProduct.name}</p>
                <div className="price-section mt-auto mb-3 justify-between">
                  {relatedProduct.sale_price ? (
                    <>
                      <span className="current-price text-base">${relatedProduct.sale_price}</span>
                      <span className="original-price text-sm">${relatedProduct.price}</span>
                    </>
                  ) : (
                    <span className="current-price text-base">${relatedProduct.price}</span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRelatedAddToCart(relatedProduct.id);
                  }}
                  disabled={addingRelatedToCart === relatedProduct.id || relatedProduct.stock === 0}
                  className={`add-to-cart-btn py-2 text-sm w-full ${
                    addingRelatedToCart === relatedProduct.id
                      ? 'opacity-90'
                      : ''
                  } ${
                    relatedProduct.stock === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  aria-label={`Add ${relatedProduct.name} to cart`}
                >
                  {addingRelatedToCart === relatedProduct.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('common.adding')}
                    </span>
                  ) : relatedProduct.stock === 0 ? (
                    <span>{t('products.out_of_stock')}</span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {t('cart.add_to_cart')}
                    </span>
                  )}
                </motion.button>
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
