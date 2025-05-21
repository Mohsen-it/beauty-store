import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageLightbox = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        navigatePrev();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex, images.length]);

  const navigateNext = () => {
    setIsZoomed(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const navigatePrev = () => {
    setIsZoomed(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    // Calculate relative position for zoom effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        onClick={onClose}
      >
        <div className="relative w-full h-full flex flex-col justify-center items-center" onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-50 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Main image */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onClick={handleImageClick}
            onMouseMove={handleMouseMove}
          >
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={images[currentIndex]}
              alt={`Product image ${currentIndex + 1}`}
              className={`max-h-[80vh] max-w-[90vw] object-contain transition-transform duration-300 ${
                isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : {}
              }
            />
          </div>

          {/* Navigation buttons */}
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4">
            <button
              className="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                navigatePrev();
              }}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                navigateNext();
              }}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 inset-x-0 flex justify-center">
              <div className="flex space-x-2 p-2 bg-black bg-opacity-50 rounded-lg">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentIndex ? 'border-pink-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                      setIsZoomed(false);
                    }}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image counter */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageLightbox;
