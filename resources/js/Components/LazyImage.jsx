import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyImage component for optimized image loading
 * 
 * Features:
 * - Lazy loading with IntersectionObserver
 * - WebP support with fallback
 * - Blur-up loading effect
 * - Responsive image sizes
 * 
 * @param {Object} props
 * @param {string} props.src - Main image source
 * @param {string} props.webpSrc - WebP version of the image (optional)
 * @param {string} props.placeholderSrc - Low-quality placeholder image (optional)
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.sizes - Responsive sizes configuration (optional)
 */
const LazyImage = ({
  src,
  webpSrc,
  placeholderSrc,
  alt,
  className = '',
  sizes = null,
  width,
  height,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading when image is 200px from viewport
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // Handle image load event
  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  // Determine image source based on loading state
  const imageSrc = isInView ? src : placeholderSrc || src;

  // Prepare responsive sizes attribute
  const sizesAttr = sizes ? sizes : undefined;

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: width, height: height }}
    >
      {/* Main image with WebP support */}
      {webpSrc && isInView ? (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <source srcSet={src} type={`image/${src.split('.').pop()}`} />
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={handleImageLoaded}
            sizes={sizesAttr}
            width={width}
            height={height}
            {...props}
          />
        </picture>
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={handleImageLoaded}
          sizes={sizesAttr}
          width={width}
          height={height}
          {...props}
        />
      )}

      {/* Placeholder with blur effect */}
      {placeholderSrc && !isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
          aria-hidden="true"
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-30 dark:bg-opacity-30">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
